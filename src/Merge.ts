import * as vscode from "vscode";

//Criação sincrona de funções do git
async function gitCheckoutSync(objeto: MergeAdvpl, destino: string) {
  return objeto.repository.checkout(destino);
}
async function gitMergeSync(repository: any, branchOrigem: string) {
  return repository.merge(branchOrigem, "");
}
async function gitTagSync(repository: any, tag: string) {
  return repository.tag(tag, "");
}
async function gitPushSync(repository: any) {
  repository.pushTags();
  return repository.push();
}
async function gitPullSync(repository: any) {
  return repository.pull();
}

export class MergeAdvpl {
  public branchTeste: string;
  public branchHomol: string;
  public branchProdu: string;
  public branchesControladas: string[];
  public repository: any;
  private fnValidacao: Function;
  constructor(forca: boolean, fnValidacao: Function) {
    this.fnValidacao = fnValidacao;
    //Busca Configurações do Settings
    this.branchTeste = vscode.workspace
      .getConfiguration("advpl-sintaxe")
      .get("branchTeste") as string;
    if (!this.branchTeste) {
      this.falha(traduz("merge.noBranch"));
      return;
    }
    this.branchHomol = vscode.workspace
      .getConfiguration("advpl-sintaxe")
      .get("branchHomologacao") as string;
    if (!this.branchHomol) {
      this.falha(traduz("merge.noBranch"));
      return;
    }
    this.branchProdu = vscode.workspace
      .getConfiguration("advpl-sintaxe")
      .get("branchProducao") as string;
    if (!this.branchProdu) {
      this.falha(traduz("merge.noBranch"));
      return;
    }
    this.branchesControladas = Array();
    this.branchesControladas.push(
      this.branchHomol.toLocaleUpperCase.toString()
    );
    this.branchesControladas.push(
      this.branchTeste.toLocaleUpperCase.toString()
    );
    this.branchesControladas.push(
      this.branchProdu.toLocaleUpperCase.toString()
    );
    this.repository = this.getRepository(forca);
  }

  public async merge(
    repository: any,
    branchAtual: any,
    branchdestino: any,
    enviaHomolog: boolean,
    enviaMaster: boolean
  ) {
    //guarda objeto this
    let objeto = this;
    let tagName: string = "";
    //verifica se não está numa branch controlada
    if (objeto.branchesControladas.indexOf(branchAtual.toUpperCase()) !== -1) {
      vscode.window.showErrorMessage(traduz("merge.noBranchMerge"));
      return;
    } else {
      //Trata quando a branche ainda não subiu para o GIT
      if (!repository.HEAD.upstream) {
        vscode.window.showErrorMessage(traduz("merge.noPush"));
        return;
      }
      // se estiver na branche inicial efetua a atualização antes de iniciar o merge
      if (objeto.getRepository(true).headLabel === branchAtual){
        try {
          await objeto.atualiza(objeto.repository, branchAtual);
        } catch (e) {
          return;
        }
      }
      try {
        await gitPushSync(repository);
      } catch (e) {
        vscode.window.showErrorMessage(
          traduz("merge.pushError") + "\n" + e.stdout
        );
        return;
      }
      try {
        await gitCheckoutSync(objeto, branchdestino);
      } catch (e) {
        vscode.window.showErrorMessage(
          traduz("merge.checkoutError") + "\n" + e.stdout
        );
        return;
      }
      try {
        await gitPullSync(repository);
      } catch (e) {
        vscode.window.showErrorMessage(
          traduz("merge.pullError") + "\n" + e.stdout
        );
        return;
      }

      let branchOriginal: any = undefined;
      //se for merge para produção usa no merge a branch de homologação
      if (branchdestino === objeto.branchProdu) {
        branchOriginal = branchAtual;
        branchAtual = objeto.branchHomol;
      }
      try {
        await gitMergeSync(repository, branchAtual);
      } catch (e) {
        vscode.window.showErrorMessage(
          traduz("merge.mergeError") + "\n" + e.stdout
        );
        return;
      }
      //Se a branch destino for a master precisa criar tag
      if (branchdestino === objeto.branchProdu) {
        let aUltimaTag = [0, 0, 0];
        let commit;
        //Verifica ultima tag
        repository.refs.forEach((item: any) => {
          //verifica se é TAG
          if (item.type === 2) {
            //Verifica se é padrão de numeração
            let aNiveis = item.name.split(".");
            if (aNiveis.length === 3) {
              let aTag = [
                Number(aNiveis[0]),
                Number(aNiveis[1]),
                Number(aNiveis[2])
              ];
              if (aTag[0] >= aUltimaTag[0]) {
                if (aTag[1] >= aUltimaTag[1]) {
                  if (aTag[2] >= aUltimaTag[2]) {
                    aUltimaTag = aTag;
                    commit = item.commit;
                  }
                }
              }
            }
          }
        });
        if (aUltimaTag[2] === 9) {
          aUltimaTag[2] = 0;
          aUltimaTag[1]++;
        } else {
          aUltimaTag[2]++;
        }
        if (commit !== repository.HEAD.commit) {
          try {
            tagName =
              String(aUltimaTag[0]) +
              "." +
              String(aUltimaTag[1]) +
              "." +
              String(aUltimaTag[2]);
            await gitTagSync(repository, tagName);
          } catch (e) {
            vscode.window.showErrorMessage(
              traduz("merge.tagError") + "\n" + e.stdout
            );
            return;
          }
        }
      }
      try {
        await gitPushSync(repository);
      } catch (e) {
        vscode.window.showErrorMessage(
          traduz("merge.pushError") + "\n" + e.stdout
        );
        return;
      }
      //se for usou a branche de homologação volta o conteúdo original
      if (branchOriginal) {
        branchAtual = branchOriginal;
      }
      if (enviaHomolog) {
        objeto.merge(
          repository,
          branchAtual,
          objeto.branchHomol,
          false,
          enviaMaster
        );
      } else if (enviaMaster) {
        objeto.merge(repository, branchAtual, objeto.branchProdu, false, false);
      } else {
        try {
          await gitCheckoutSync(repository, branchAtual);
        } catch (e) {
          vscode.window.showErrorMessage(
            traduz("merge.checkoutError") + "\n" + e.stdout
          );
          return;
        }
        objeto.sucesso(
          tagName,
          traduz("merge.mergeFinish") +
            branchAtual +
            " -> " +
            branchdestino +
            "."
        );
      }
    }
  }

  public async atualiza(repository: any, branchAtual: any) {
    //guarda objeto this
    let objeto = this;
    //verifica se não está numa branch controlada
    if (objeto.branchesControladas.indexOf(branchAtual.toUpperCase()) !== -1) {
      vscode.window.showErrorMessage(traduz("merge.noBranchMerge"));
      return;
    } else {
      try {
        await gitCheckoutSync(objeto, objeto.branchHomol);
      } catch (e) {
        vscode.window.showErrorMessage(
          traduz("merge.checkoutError") + "\n" + e.stdout
        );
        return;
      }
      try {
        await gitPullSync(repository);
      } catch (e) {
        vscode.window.showErrorMessage(
          traduz("merge.pullError") + "\n" + e.stdout
        );
        return;
      }
      try {
        await gitCheckoutSync(objeto, branchAtual);
      } catch (e) {
        vscode.window.showErrorMessage(
          traduz("merge.checkoutError") + "\n" + e.stdout
        );
        return;
      }
      try {
        await gitMergeSync(repository, objeto.branchHomol);
      } catch (e) {
        vscode.window.showErrorMessage(
          traduz("merge.mergeError") + "\n" + e.stdout
        );
        return;
      }

      objeto.sucesso("", traduz("merge.atualizacaoFinish"));
    }
  }
  public analisaTags() {
    let fileContent =
      "TAG\tError\tWarning\tInformation\tHint\tExtension Version\n";
    let branchAtual = this.repository.headLabel;
    let objeto = this;
    let tags: string[] = [];
    let nGeradas = 0;

    //Verifica ultima tag
    objeto.repository.refs.forEach((item: any) => {
      //verifica se é TAG
      if (item.type === 2) {
        //Verifica se é padrão de numeração
        let aNiveis = item.name.split(".");
        if (aNiveis.length === 3) {
          fileContent += item.name + "\t\t\t\t\n";
          tags.push(item.name);
        }
      }
    });

    objeto.geraRelatorio(nGeradas, tags, fileContent, branchAtual);
  }

  public async geraRelatorio(
    nGeradas: number,
    tags: string[],
    fileContent: string,
    branchAtual: string
  ) {
    let tag = tags[nGeradas];
    let objeto = this;

    console.log("TROCANDO PARA TAG " + tag);
    await gitCheckoutSync(objeto, tag);

    this.fnValidacao(nGeradas, tags, fileContent, branchAtual, objeto);
    console.log("VALIDANDO TAG " + tag);
  }

  protected getRepository(forca: boolean) {
    if (vscode) {
      let git = vscode.extensions.getExtension("vscode.git");
      if (git) {
        if (git.isActive) {
          if (vscode.window.activeTextEditor) {
            let repository = git.exports._model.getRepository(
              vscode.window.activeTextEditor.document.uri
            );
            // set resource groups
            if (
              (repository.mergeGroup.resourceStates.length !== 0 ||
                repository.indexGroup.resourceStates.length !== 0 ||
                repository.workingTreeGroup.resourceStates.length !== 0) &&
              !forca
            ) {
              vscode.window.showErrorMessage(traduz("merge.noCommited"));
              return;
            }
            return repository;
          } else {
            let repository = git.exports._model.getRepository(
              vscode.workspace.rootPath
            );
            // set resource groups
            if (
              repository.mergeGroup.resourceStates.length !== 0 ||
              repository.indexGroup.resourceStates.length !== 0 ||
              repository.workingTreeGroup.resourceStates.length !== 0
            ) {
              vscode.window.showErrorMessage(traduz("merge.noCommited"));
              return;
            }
            return repository;
          }
        }
      }
    }
  }
  protected sucesso(value: any, rotina: String) {
    vscode.window.showInformationMessage(
      traduz("merge.success") + rotina + " [" + value + "]"
    );
    this.fnValidacao(undefined, undefined, undefined, undefined, undefined);
  }
  public falha(rotina: String) {
    vscode.window.showErrorMessage("ERRO " + rotina + "!");
    this.fnValidacao(undefined, undefined, undefined, undefined, undefined);
  }
}

function traduz(key) {
  const vscodeOptions = JSON.parse(
    process.env.VSCODE_NLS_CONFIG
  ).locale.toLowerCase();
  let i18n = require("i18n");
  let locales = ["en", "pt-br"];
  i18n.configure({
    locales: locales,
    directory: __dirname + "/locales"
  });
  i18n.setLocale(locales.indexOf(vscodeOptions) + 1 ? vscodeOptions : "en");
  return i18n.__(key);
}
