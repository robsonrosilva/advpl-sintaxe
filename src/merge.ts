import * as vscode from 'vscode';
import { ValidaAdvpl } from './ValidaAdvpl';

//Criação sincrona de funções do git
async function gitCheckoutSync(objeto: MergeAdvpl, destino: string) {
    return objeto.repository.checkout(destino);
}
async function gitMergeSync(repository: any, branchOrigem: string) {
    return repository.merge(branchOrigem, "");
}
async function gitTagSync(repository: any, tag: string) {
    return repository.tag(tag, '');
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
    constructor(forca: boolean) {
        //Busca Configurações do Settings
        this.branchTeste = vscode.workspace.getConfiguration("advpl-sintax").get("branchTeste") as string;
        if (!this.branchTeste) {
            this.branchTeste = 'V11_Validacao';
        }
        this.branchHomol = vscode.workspace.getConfiguration("advpl-sintax").get("branchHomologacao") as string;
        if (!this.branchHomol) {
            this.branchHomol = 'V11_Release';
        }
        this.branchProdu = vscode.workspace.getConfiguration("advpl-sintax").get("branchProducao") as string;
        if (!this.branchProdu) {
            this.branchProdu = 'master';
        }
        this.branchesControladas = Array();
        this.branchesControladas.push(this.branchHomol.toLocaleUpperCase.toString());
        this.branchesControladas.push(this.branchTeste.toLocaleUpperCase.toString());
        this.branchesControladas.push(this.branchProdu.toLocaleUpperCase.toString());
        this.repository = this.getRepository(forca);
    }

    public async merge(repository: any, branchAtual: any, branchdestino: any, enviaHomolog: boolean, enviaMaster: boolean) {
        //guarda objeto this
        let objeto = this;
        //verifica se não está numa branch controlada
        if (objeto.branchesControladas.indexOf(branchAtual.toUpperCase()) === 0) {
            vscode.window.showErrorMessage(
                'Essa branch não pode ser utilizada para para Merge!'
            );
            return;
        } else {
            //Trata quando a branche ainda não subiu para o GIT
            if (!repository.HEAD.upstream) {
                vscode.window.showErrorMessage(
                    'Publique sua branche antes de mergeá-la!'
                );
                return;
            }
            await gitPushSync(repository);
            await gitCheckoutSync(objeto, branchdestino);
            await gitPullSync(repository);

            let branchOriginal: any = undefined;
            //se for merge para produção usa no merge a branch de homologação
            if (branchdestino === objeto.branchProdu) {
                branchOriginal = branchAtual;
                branchAtual = objeto.branchHomol;
            }

            await gitMergeSync(repository, branchAtual);
            //Se a branch destino for a master precisa criar tag
            if (branchdestino === objeto.branchProdu) {
                let aUltimaTag = [0, 0, 0];
                let commit;
                //Verifica ultima tag
                repository.refs.forEach((item: any) => {
                    //verifica se é TAG
                    if (item.type === 2) {
                        //Verifica se é padrão de numeração
                        let aNiveis = item.name.split('.');
                        if (aNiveis.length === 3) {
                            let aTag = [Number(aNiveis[0]), Number(aNiveis[1]), Number(aNiveis[2])];
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
                    await gitTagSync(repository, String(aUltimaTag[0]) + "." + String(aUltimaTag[1]) + "." + String(aUltimaTag[2]));
                }
            }

            await gitPushSync(repository);
            //se for usou a branche de homologação volta o conteúdo original
            if (branchOriginal) {
                branchAtual = branchOriginal;
            }
            await gitCheckoutSync(repository, branchAtual);
            if (enviaHomolog) {
                objeto.merge(repository, branchAtual, objeto.branchHomol, false, enviaMaster);
            } else if (enviaMaster) {
                objeto.merge(repository, branchAtual, objeto.branchProdu, false, false);
            } else {
                objeto.sucesso("", "Merge de finalizado " + branchAtual + " -> " + branchdestino + ".");
            }

        }
    }

    public analisaTags() {
        let fileContent = "TAG\tError\tWarning\tInformation\tHint\tVersao Extensao\n";
        let branchAtual = this.repository.headLabel;
        let objeto = this;
        let tags: string[] = [];
        let nGeradas = 0;

        //Verifica ultima tag
        objeto.repository.refs.forEach((item: any) => {
            //verifica se é TAG
            if (item.type === 2) {
                //Verifica se é padrão de numeração
                let aNiveis = item.name.split('.');
                if (aNiveis.length === 3) {
                    fileContent += item.name + "\t\t\t\t\n";
                    tags.push(item.name);
                }
            }
        });

        objeto.geraRelatorio(nGeradas, tags, fileContent, branchAtual);
    }

    public async geraRelatorio(nGeradas: number, tags: string[], fileContent: string, branchAtual: string) {
        let tag = tags[nGeradas];
        let objeto = this;

        console.log("TROCANDO PARA TAG " + tag);
        await gitCheckoutSync(objeto, tag);
        let validaAdvpl = new ValidaAdvpl();
        validaAdvpl.validaProjeto(nGeradas, tags, fileContent, branchAtual, objeto);
        console.log("VALIDANDO TAG " + tag);
    }

    protected getRepository(forca: boolean) {
        if (vscode) {
            let git = vscode.extensions.getExtension('vscode.git');
            if (git) {
                if (git.isActive) {
                    if (vscode.window.activeTextEditor) {
                        let repository = git.exports._model.getRepository(vscode.window.activeTextEditor.document.uri);
                        // set resource groups
                        if ((repository.mergeGroup.resourceStates.length !== 0 ||
                            repository.indexGroup.resourceStates.length !== 0 ||
                            repository.workingTreeGroup.resourceStates.length !== 0) &&
                            !forca
                        ) {
                            vscode.window.showErrorMessage("Merge não realizado, existem arquivos não commitados!");
                            return;
                        }
                        return repository;
                    } else {
                        let repository = git.exports._model.getRepository(vscode.workspace.rootPath);
                        // set resource groups
                        if (repository.mergeGroup.resourceStates.length !== 0 ||
                            repository.indexGroup.resourceStates.length !== 0 ||
                            repository.workingTreeGroup.resourceStates.length !== 0) {
                            vscode.window.showErrorMessage("Merge não realizado, existem arquivos não commitados!");
                            return;
                        }
                        return repository;
                    }
                }
            }
        }
    }
    protected sucesso(value: any, rotina: String) {
        let validaAdvpl = new ValidaAdvpl();
        vscode.window.showInformationMessage('FUNCIONOU ' + rotina + " [" + value + "]");
        validaAdvpl.validaProjeto(undefined, undefined, undefined, undefined, undefined);

    }
    public falha(rotina: String) {
        let validaAdvpl = new ValidaAdvpl();
        vscode.window.showErrorMessage('ERRO ' + rotina + "!");
        validaAdvpl.validaProjeto(undefined, undefined, undefined, undefined, undefined);
    }
}