/* eslint-disable @typescript-eslint/no-unused-vars */
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
  ProgressLocation,
  CodeActionContext,
  CancellationToken,
  CodeActionProvider,
  CodeActionKind,
  CodeAction,
  WorkspaceEdit,
  Selection,
} from "vscode";
import { MergeAdvpl } from "./merge";
import {
  ValidaAdvpl,
  Fonte,
  ValidaProjeto,
  ProjectStatus,
} from "advpl-lint/lib/src";
import { ItemModel } from "advpl-lint/lib/src/models/ItemProject";
import {
  formattingEditProvider,
  rangeFormattingEditProvider,
} from "./formatting";
import * as i18n from "i18n";
import { Cache } from "advpl-lint/lib/src/cache";

const vscodeOptions = JSON.parse(
  process.env.VSCODE_NLS_CONFIG
).locale.toLowerCase();
const locales = ["en", "pt-br"];
const i18nConfig = {
  locales: locales,
  directory: __dirname + "\\locales",
};

//Cria um colection para os erros ADVPL
const collection = languages.createDiagnosticCollection("advpl");

let runningFiles: string[] = [];

let projeto: ValidaProjeto;
let listaURI: Uri[] = [];
let comentFontPad: string[] = workspace
  .getConfiguration("advpl-sintaxe")
  .get("comentFontPad") as string[];
if (!comentFontPad) {
  comentFontPad = [""];
  window.showInformationMessage(
    localize("extension.noCritizeComment", "Do not critize coments!")
  );
}

const validaAdvpl = new ValidaAdvpl(
  comentFontPad,
  vscodeOptions,
  undefined,
  false
);
validaAdvpl.ownerDb = workspace
  .getConfiguration("advpl-sintaxe")
  .get("ownerDb");
validaAdvpl.empresas = workspace
  .getConfiguration("advpl-sintaxe")
  .get("empresas");

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
    localize("extension.activeMessage", "Active ADVPL Validation!")
  );
  workspace.onDidChangeTextDocument(validaFonte);
  workspace.onDidOpenTextDocument(validaFonte);
  workspace.onDidSaveTextDocument(validaFonte);
  window.onDidChangeTextEditorSelection(validaAdvpl as any);

  //Adiciona comando de envia para Validação
  context.subscriptions.push(
    commands.registerCommand("advpl-sintaxe.gitValidacao", () => {
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
    commands.registerCommand("advpl-sintaxe.gitRelease", () => {
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
    commands.registerCommand("advpl-sintaxe.gitMaster", () => {
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
    commands.registerCommand("advpl-sintaxe.validaProjeto", () => {
      try {
        validaProjeto();
      } catch (e) {
        window.showInformationMessage(e.stdout);
      }
    })
  );

  //Adiciona comando de Atualiza Branch
  context.subscriptions.push(
    commands.registerCommand("advpl-sintaxe.atualizaBranch", () => {
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
    "advpl",
    formattingEditProvider()
  );

  languages.registerDocumentRangeFormattingEditProvider(
    "advpl",
    rangeFormattingEditProvider()
  );

  //Adiciona comando de limeza de branches
  context.subscriptions.push(
    commands.registerCommand("advpl-sintaxe.cleanBranches", () => {
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

  /*
  context.subscriptions.push(
    languages.registerCodeActionsProvider("advpl", new ErrorFix(), {
      providedCodeActionKinds: ErrorFix.providedCodeActionKinds,
    })
  );
  */

  if (
    workspace.getConfiguration("advpl-sintaxe").get("validaProjeto") !== false
  ) {
    validaProjeto();
  } else {
    validaFonte(window.activeTextEditor);
  }
}
function validaFonte(editor: any) {
  return new Promise(() => {
    let document: TextDocument;

    //trata quando recebe o documento
    if (editor.languageId) {
      document = editor;
    } else if (editor && editor.document) {
      document = editor.document;
    }

    //verifica se a linguagem é ADVPL
    if (document && document.languageId === "advpl" && document.getText()) {
      let time: number = workspace
        .getConfiguration("advpl-sintaxe")
        .get("tempoValidacao") as number;
      if (!time || time === 0) {
        time = 5000;
      }

      // verifica se já está analisando esse fonte
      if (
        runningFiles.find((x) => {
          return document.uri.fsPath === x;
        })
      ) {
        return console.log("Validação desse arquivo está em execução");
      } else {
        runningFiles.push(document.uri.fsPath);
      }

      // verifica se tem algum cache
      const pastas: string[] = [];
      const workspaceFolders = workspace["workspaceFolders"];
      workspaceFolders.forEach((path) => {
        pastas.push(path.uri.fsPath);
      });

      const pathProjectFile = pastas.find((x) => {
        return document.uri.fsPath.indexOf(x) >= 0;
      });

      if (
        pathProjectFile &&
        workspace.getConfiguration("advpl-sintaxe").get("cache") === true
      ) {
        validaAdvpl.cache = new Cache(pathProjectFile);
      } else {
        validaAdvpl.cache = undefined;
      }

      validaAdvpl
        .validacao(document.getText(), document.uri.fsPath)
        .finally(() => {
          // remove o arquivo
          runningFiles = runningFiles.filter((x) => {
            return document.uri.fsPath !== x;
          });

          // se valida projeto faz a validação se não somente atualiza o fonte atual
          if (
            workspace.getConfiguration("advpl-sintaxe").get("validaProjeto") !==
              false &&
            projeto
          ) {
            //verifica se o fonte já existe no projeto se não adiciona
            const pos = projeto.projeto.map(function (e) {
              return getUri(e.fonte.fonte).fsPath;
            });
            const posicao = pos.indexOf(document.uri.fsPath);
            const itemProjeto = new ItemModel();
            itemProjeto.hash = validaAdvpl.hash;
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
        })
        .catch(() => {
          // remove o arquivo
          runningFiles = runningFiles.filter((x) => {
            return document.uri.fsPath !== x;
          });
        })
        .then(() => {
          // remove o arquivo
          runningFiles = runningFiles.filter((x) => {
            return document.uri.fsPath !== x;
          });
        });
    }
  });
}

function errorVsCode(aErros: any) {
  const vsErros: any = [];
  aErros.forEach((erro) => {
    vsErros.push(
      new Diagnostic(
        new Range(
          erro.startLine,
          erro.columnStart ? erro.columnStart : 0,
          erro.endLine,
          erro.columnEnd ? erro.columnEnd : 0
        ),
        erro.message,
        erro.severity
      )
    );
  });
  return vsErros;
}

function getUri(file: string): Uri {
  let uri: Uri;
  const fileName: string = file.replace(/\\/g, "/").toUpperCase();
  let listName: string;

  // busca o arquivo
  uri = Uri.file(file);

  // busca na lista de uri
  if (!uri) {
    listaURI.forEach((item: Uri) => {
      listName = item.path.replace(/\\/g, "/").toUpperCase();
      if (listName === fileName) {
        uri = item;
      }
    });
  }

  return uri;
}

function validaProjeto() {
  const _status = new ProjectStatus();

  window.withProgress(
    {
      location: ProgressLocation.Notification,
      title: "Validando Projeto!",
      cancellable: true,
    },
    (progress, token) => {
      token.onCancellationRequested(() => {
        console.log("Validação Cancelada!");
      });
      let increment = 0;

      _status._changeEmmit = () => {
        if (_status._atual) {
          let _increment = Math.round((_status._atual / _status._total) * 10);
          _increment = _increment * 10;
          if (_increment !== increment) {
            progress.report({
              increment: _increment - increment,
            });

            increment = _increment;
          }
        }
      };
      return _validaProjeto(_status);
    }
  );
}

function _validaProjeto(_status: ProjectStatus): Promise<any> {
  return new Promise((resolve) => {
    // prepara o objeto de validação
    const projeto: ValidaProjeto = new ValidaProjeto(
      validaAdvpl.comentFontPad,
      vscodeOptions,
      undefined,
      workspace.getConfiguration("advpl-sintaxe").get("cache") === true
    );

    projeto.empresas = validaAdvpl.empresas;
    projeto.ownerDb = validaAdvpl.ownerDb;
    projeto.local = vscodeOptions;

    const pastas: string[] = [];
    const workspaceFolders = workspace["workspaceFolders"];
    workspaceFolders.forEach((path) => {
      pastas.push(path.uri.fsPath);
    });
    projeto
      .validaProjeto(pastas, _status)
      .finally(() => {
        try {
          // console.log('foi');
          // se for validar o projeto limpa todas as críticas dos arquivos
          listaURI.forEach((uri: Uri) => {
            collection.delete(uri);
          });
        } catch (e) {
          window.showErrorMessage(
            "Ocorreu um erro na limpeza de críticas!\n" + JSON.stringify(e)
          );
        }
        listaURI = [];
        projeto.projeto.forEach((item: ItemModel) => {
          try {
            const fonte: Fonte = item.fonte;
            const file = getUri(fonte.fonte);

            listaURI.push(file);

            //Atualiza as mensagens do colection
            collection.set(file, errorVsCode(item.errors));
          } catch (e) {
            window.showErrorMessage(
              `Ocorreu um erro na adição de erros do fonte ${item.fonte.fonte} !\n` +
                JSON.stringify(e)
            );
          }
        });
        resolve(undefined);
      })
      .catch((erro) => {
        window.showErrorMessage(
          "Ocorreu um erro na validação " + JSON.stringify(erro)
        );
        resolve(undefined);
      })
      .then(() => {
        resolve(undefined);
      });
  });
}

/**
 * Provides code actions for converting :) to a smiley emoji.
 */
export class ErrorFix implements CodeActionProvider {
  public static readonly providedCodeActionKinds = [CodeActionKind.QuickFix];
  document: TextDocument;
  range: Range | Selection;
  context: CodeActionContext;
  token: CancellationToken;

  public provideCodeActions(
    document: TextDocument,
    range: Range | Selection,
    context: CodeActionContext,
    token: CancellationToken
  ): CodeAction[] | undefined {
    this.document = document;
    this.range = range;
    this.context = context;
    this.token = token;

    const opcoes = [];
    // trata cado tipo de erro
    //validaAdvpl.deprecated
    if (
      context.diagnostics.find((x) => {
        return x.message === "validaAdvpl.deprecated";
      })
    ) {
      opcoes.push(this.createFix("Trocar por nova função", "TESTE"));
    }

    //validaAdvpl.conout
    if (
      context.diagnostics.find((x) => {
        return x.message === "validaAdvpl.conout";
      })
    ) {
      opcoes.push(this.createFix("Trocar por nova função", "TESTE"));
    }

    return opcoes;
  }

  private createFix(message, newValue: string): CodeAction {
    // trata cada forma de correção
    const fix = new CodeAction(message, CodeActionKind.QuickFix);
    fix.edit = new WorkspaceEdit();
    fix.edit.replace(
      this.document.uri,
      new Range(this.range.start, this.range.end),
      newValue
    );
    return fix;
  }
}

export function localize(key: string, text?: string): string {
  i18n.configure(i18nConfig);
  i18n.setLocale(locales.indexOf(vscodeOptions) + 1 ? vscodeOptions : "en");
  //console.log(vscodeOptions);
  //console.log(text);
  //console.log(key);
  //console.log(i18n.__(key));
  return i18n.__(key) ? i18n.__(key) : text;
}
