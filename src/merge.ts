import * as vscode from 'vscode';
import {ValidaAdvpl} from './ValidaAdvpl';

export class MergeAdvpl {
    public branchTeste: string;
    public branchHomol: string;
    public branchProdu: string;
    public branchesControladas: string[];
    public repository: any;
    constructor() {
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
        this.repository = this.getRepository();
    }

    public merge(repository: any, branchAtual: any, branchdestino: any, enviaHomolog: boolean, enviaMaster: boolean) {
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
            repository.push().then((value: any) => {
                repository.checkout(branchdestino).then((value: any) => {
                    repository.pull().then((value: any) => {
                        let branchOriginal : any = undefined;
                        //se for merge para produção usa no merge a branch de homologação
                        if (branchdestino === objeto.branchProdu){
                            branchOriginal = branchAtual;
                            branchAtual = objeto.branchHomol;
                        }
                        repository.merge(branchAtual, "").then((value: any) => {
                            let oComando;
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
                                    oComando = repository.tag(String(aUltimaTag[0]) + "." + String(aUltimaTag[1]) + "." + String(aUltimaTag[2]), '');
                                } else {
                                    oComando = repository.push();
                                }
                            } else {
                                oComando = repository.push();
                            }
                            oComando.then((value: any) => {
                                repository.push().then((value: any) => {
                                    //se for usou a branche de homologação volta o conteúdo original
                                    if(branchOriginal){
                                        branchAtual = branchOriginal;
                                    }
                                    repository.checkout(branchAtual).then((value: any) => {
                                        if (enviaHomolog) {
                                            objeto.merge(repository, branchAtual, objeto.branchHomol, false, enviaMaster);
                                        } else {
                                            if (enviaMaster) {
                                                objeto.merge(repository, branchAtual, objeto.branchProdu, false, false);
                                            } else {
                                                repository.pushTags();
                                                objeto.sucesso("", "Merge de finalizado " + repository.headLabel + " -> " + branchdestino + ".");
                                            }
                                        }
                                        return;
                                    });
                                }).catch(function () {
                                    objeto.falha(repository.headLabel + " " + arguments[0]);
                                    repository.checkout(branchAtual);
                                    return;
                                });
                            }).catch(function () {
                                objeto.falha(repository.headLabel + " " + arguments[0]);
                                repository.checkout(branchAtual);
                                return;
                            });
                        }).catch(function () {
                            objeto.falha(repository.headLabel + " " + arguments[0]);
                            repository.checkout(branchAtual);
                            return;
                        });
                    }).catch(function () {
                        objeto.falha(repository.headLabel + " " + arguments[0]);
                        repository.checkout(branchAtual);
                        return;
                    });
                }).catch(function () {
                    objeto.falha(repository.headLabel + " " + arguments[0]);
                    repository.checkout(branchAtual);
                    return;
                });
            }).catch(function () {
                objeto.falha(repository.headLabel + " " + arguments[0]);
                repository.checkout(branchAtual);
                return;
            });
        }
    }
    protected getRepository() {
        if (vscode) {
            let git = vscode.extensions.getExtension('vscode.git');
            if (git) {
                if (git.isActive) {
                    if (vscode.window.activeTextEditor) {
                        let repository = git.exports._model.getRepository(vscode.window.activeTextEditor.document.uri);
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
        validaAdvpl.validaProjeto();

    }
    protected falha(rotina: String) {
        let validaAdvpl = new ValidaAdvpl();
        vscode.window.showErrorMessage('ERRO ' + rotina + "!");
        validaAdvpl.validaProjeto();
    }
}