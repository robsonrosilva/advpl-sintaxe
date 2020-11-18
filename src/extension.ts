import {
  Uri,
  languages,
  workspace,
  window,
  ExtensionContext,
  commands,
  Diagnostic,
  Range,
  TextDocument,
  ProgressLocation
} from 'vscode';
import { MergeAdvpl } from './merge';
import { ValidaAdvpl, Fonte, ValidaProjeto } from 'analise-advpl/lib/src';
import { ItemModel } from 'analise-advpl/lib/src/models/ItemProject';
import {
  formattingEditProvider,
  rangeFormattingEditProvider
} from './formatting';
import * as i18n from 'i18n';

//Cria um colection para os erros ADVPL
const collection = languages.createDiagnosticCollection('advpl');

let projeto: ValidaProjeto;
let listaURI: Uri[] = [];
let comentFontPad: string[] = workspace
  .getConfiguration('advpl-sintaxe')
  .get('comentFontPad') as string[];
if (!comentFontPad) {
  comentFontPad = [''];
  window.showInformationMessage(
    localize('extension.noCritizeComment', 'Do not critize coments!')
  );
}
const vscodeOptions = JSON.parse(
  process.env.VSCODE_NLS_CONFIG
).locale.toLowerCase();

const validaAdvpl = new ValidaAdvpl(comentFontPad, vscodeOptions, false);
validaAdvpl.ownerDb = workspace
  .getConfiguration('advpl-sintaxe')
  .get('ownerDb');
validaAdvpl.empresas = workspace
  .getConfiguration('advpl-sintaxe')
  .get('empresas');

if (!validaAdvpl.ownerDb) {
  validaAdvpl.ownerDb = [];
}
if (!validaAdvpl.empresas) {
  validaAdvpl.empresas = [];
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext): any {
  window.showInformationMessage(
    localize('extension.activeMessage', 'Active ADVPL Validation!')
  );
  workspace.onDidChangeTextDocument(validaFonte);
  workspace.onDidOpenTextDocument(validaFonte);
  workspace.onDidSaveTextDocument(validaFonte);
  window.onDidChangeTextEditorSelection(validaAdvpl as any);

  //Adiciona comando de envia para Validação
  context.subscriptions.push(
    commands.registerCommand('advpl-sintaxe.gitValidacao', () => {
      const mergeAdvpl = new MergeAdvpl();
      const branchAtual = mergeAdvpl.repository.headLabel;

      mergeAdvpl
        .merge(mergeAdvpl.branchTeste)
        .then(() => {
          mergeAdvpl.repository.checkout(branchAtual);
          validaProjeto();
        })
        .catch((erro: string) => {
          window.showErrorMessage(erro);
          mergeAdvpl.repository.checkout(branchAtual);
          // validaProjeto();
        });
    })
  );
  //Adiciona comando de envia para Release
  context.subscriptions.push(
    commands.registerCommand('advpl-sintaxe.gitRelease', () => {
      const mergeAdvpl = new MergeAdvpl();
      const branchAtual = mergeAdvpl.repository.headLabel;

      mergeAdvpl
        .merge(mergeAdvpl.branchHomol)
        .then(() => {
          mergeAdvpl.repository.checkout(branchAtual);
          validaProjeto();
        })
        .catch((erro: string) => {
          window.showErrorMessage(erro);
          mergeAdvpl.repository.checkout(branchAtual);
          // validaProjeto();
        });
    })
  );
  //Adiciona comando de envia para master
  context.subscriptions.push(
    commands.registerCommand('advpl-sintaxe.gitMaster', () => {
      const mergeAdvpl = new MergeAdvpl();
      const branchAtual = mergeAdvpl.repository.headLabel;

      mergeAdvpl
        .merge(mergeAdvpl.branchProdu)
        .then(() => {
          mergeAdvpl.repository.checkout(branchAtual);
          validaProjeto();
        })
        .catch((erro: string) => {
          window.showErrorMessage(erro);
          mergeAdvpl.repository.checkout(branchAtual);
          // validaProjeto();
        });
    })
  );
  //Adiciona comando de análise de projeto
  context.subscriptions.push(
    commands.registerCommand('advpl-sintaxe.validaProjeto', () => {
      try {
        validaProjeto();
      } catch (e) {
        window.showInformationMessage(e.stdout);
      }
    })
  );

  //Adiciona comando de Atualiza Branch
  context.subscriptions.push(
    commands.registerCommand('advpl-sintaxe.atualizaBranch', () => {
      const mergeAdvpl = new MergeAdvpl();
      const branchAtual = mergeAdvpl.repository.headLabel;
      mergeAdvpl
        .atualiza()
        .then((message: string) => {
          window.showInformationMessage(message);
          mergeAdvpl.repository.checkout(branchAtual);
          validaProjeto();
        })
        .catch((erro: string) => {
          window.showErrorMessage(erro);
          mergeAdvpl.repository.checkout(branchAtual);
          // validaProjeto();
        });
    })
  );

  languages.registerDocumentFormattingEditProvider(
    'advpl',
    formattingEditProvider()
  );

  languages.registerDocumentRangeFormattingEditProvider(
    'advpl',
    rangeFormattingEditProvider()
  );

  //Adiciona comando de limeza de branches
  context.subscriptions.push(
    commands.registerCommand('advpl-sintaxe.cleanBranches', () => {
      const mergeAdvpl = new MergeAdvpl();
      mergeAdvpl
        .limpaBranches()
        .then((message: string) => {
          window.showInformationMessage(message);
        })
        .catch((erro: string) => {
          window.showErrorMessage(erro);
        });
    })
  );

  if (
    workspace.getConfiguration('advpl-sintaxe').get('validaProjeto') !== false
  ) {
    validaProjeto();
  } else {
    validaFonte(window.activeTextEditor);
  }
}
function validaFonte(editor: any) {
  return new Promise(() => {
    let time: number = workspace
      .getConfiguration('advpl-sintaxe')
      .get('tempoValidacao') as number;
    let document: TextDocument;
    if (!time || time === 0) {
      time = 5000;
    }

    //trata quando recebe o documento
    if (editor.languageId) {
      document = editor;
    } else if (editor && editor.document) {
      document = editor.document;
    }

    //verifica se a linguagem é ADVPL
    if (document && document.languageId === 'advpl' && document.getText()) {
      validaAdvpl
        .validacao(document.getText(), document.uri.fsPath)
        .finally(() => {
          // se valida projeto faz a validação se não somente atualiza o fonte atual
          if (
            workspace.getConfiguration('advpl-sintaxe').get('validaProjeto') !==
            false &&
            projeto
          ) {
            //verifica se o fonte já existe no projeto se não adiciona
            const pos = projeto.projeto.map(function (e) {
              return getUri(e.fonte.fonte).fsPath;
            });
            const posicao = pos.indexOf(document.uri.fsPath);
            const itemProjeto = new ItemModel();
            itemProjeto.content = validaAdvpl.conteudoFonte;
            itemProjeto.errors = validaAdvpl.aErros;
            itemProjeto.fonte = validaAdvpl.fonte;

            if (posicao === -1) {
              projeto.projeto.push(itemProjeto);
            } else {
              projeto.projeto[posicao] = itemProjeto;
            }

            projeto.verificaDuplicados().then(() => {
              // atualiza os erros
              projeto.projeto.forEach((item: ItemModel) => {
                const fonte: Fonte = item.fonte;
                const file = getUri(fonte.fonte);

                //Atualiza as mensagens do colection
                collection.delete(file);
                collection.set(file, errorVsCode(item.errors));
              });
            });
          } else {
            const file = getUri(validaAdvpl.fonte.fonte);

            //Atualiza as mensagens do colection
            collection.delete(file);
            collection.set(file, errorVsCode(validaAdvpl.aErros));
          }
        });
    }
  });
}

function errorVsCode(aErros: any) {
  const vsErros: any = [];
  aErros.forEach(erro => {
    vsErros.push(
      new Diagnostic(
        new Range(erro.startLine, 0, erro.endLine, 0),
        erro.message,
        erro.severity
      )
    );
  });
  return vsErros;
}

function getUri(file: string): Uri {
  let uri: Uri;
  const fileName: string = file.replace(/\\/g, '/').toUpperCase();
  let listName: string;

  // busca o arquivo
  uri = Uri.file(file);

  // busca na lista de uri
  if (!uri) {
    listaURI.forEach((item: Uri) => {
      listName = item.path.replace(/\\/g, '/').toUpperCase();
      if (listName === fileName) {
        uri = item;
      }
    });
  }

  return uri;
}

function validaProjeto() {
  const promise = new Promise((resolve) => {
    // prepara o objeto de validação
    const projeto: ValidaProjeto = new ValidaProjeto(
      validaAdvpl.comentFontPad,
      vscodeOptions
    );

    projeto.empresas = validaAdvpl.empresas;
    projeto.ownerDb = validaAdvpl.ownerDb;
    projeto.local = vscodeOptions;

    const pastas: string[] = [];
    const workspaceFolders = workspace['workspaceFolders'];
    workspaceFolders.forEach(path => {
      pastas.push(path.uri.fsPath);
    });
    projeto.validaProjeto(pastas).finally(() => {
      // console.log('foi');
      // se for validar o projeto limpa todas as críticas dos arquivos
      listaURI.forEach((uri: Uri) => {
        collection.delete(uri);
      });

      listaURI = [];
      projeto.projeto.forEach((item: ItemModel) => {
        const fonte: Fonte = item.fonte;
        const file = getUri(fonte.fonte);

        listaURI.push(file);

        //Atualiza as mensagens do colection
        collection.set(file, errorVsCode(item.errors));
      });
      resolve();
    });
  });

  window.withProgress({
    location: ProgressLocation.Notification,
    title: "Validando Projeto!",
    cancellable: false
  }, (progress, token) => {
    token.onCancellationRequested(() => {
      console.log("Validação Cancelada!");
    });
    return promise;
  });
}

function verifyEncoding() {
  const workspaceFolders = workspace['workspaceFolders'];
  // check if there is an open folder
  if (workspaceFolders === undefined) {
    window.showErrorMessage("No folder opened.");
    return;
  }
  const textNoAsk = localize('tds.vscode.noAskAgain', "Don't ask again");
  const textNo = localize('tds.vscode.no', 'No');
  const textYes = localize('tds.vscode.yes', 'Yes');
  const textQuestion = localize('tds.vscode.question.change.encoding', 'Do you want to change the encoding to default TOTVS (Windows-1252)?'); // Deseja alterar o encoding para o padrão TOTVS (CP1252)?
  let questionAgain = true;
  const configADVPL = workspace.getConfiguration('totvsLanguageServer');
  const questionEncodingConfig = configADVPL.get("askEncodingChange");
  const defaultConfig = workspace.getConfiguration();
  const defaultEncoding = defaultConfig.get("files.encoding");
  if (defaultEncoding !== "windows1252" && questionEncodingConfig !== false) {
    window.showWarningMessage(textQuestion, textYes, textNo, textNoAsk).then(clicked => {
      if (clicked === textYes) {
        const jsonEncoding = {
          "files.encoding": "windows1252"
        };
        defaultConfig.update("[advpl]", jsonEncoding);
        defaultConfig.update("[4gl]", jsonEncoding);
        questionAgain = false;
      } else if (clicked === textNo) {
        questionAgain = true;
      } else if (clicked === textNoAsk) {
        questionAgain = false;
      }
      configADVPL.update("askEncodingChange", questionAgain);
    });
  }
}

function localize(key: string, text?: string) {
  const vscodeOptions = JSON.parse(
    process.env.VSCODE_NLS_CONFIG
  ).locale.toLowerCase();
  const locales = ['en', 'pt-br'];
  i18n.configure({
    locales: locales,
    directory: __dirname + '\\locales'
  });
  i18n.setLocale(locales.indexOf(vscodeOptions) + 1 ? vscodeOptions : 'en');
  return i18n.__(key) ? i18n.__(key) : text;
}
