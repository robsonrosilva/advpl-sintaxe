'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fileSystem from 'fs';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

//Cria um colection para os erros ADVPL
const collection = vscode.languages.createDiagnosticCollection('advpl');
const branchTeste = 'V11_Validacao';
const branchHomol = 'V11_Release';
const branchProdu = 'master';
export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Validação ADVPL Ativa!');
    vscode.workspace.onDidChangeTextDocument(validaADVPL);

    //Adiciona comando de envia para Validação
    let disposableVal = vscode.commands.registerCommand('advpl-sintax.gitValidacao', () => {
        let repository = getRepository();
        if (!repository) {
            return;
        }

        let branchAtual = repository.headLabel;
        merge(repository, branchAtual, branchTeste, false, false);
    });
    context.subscriptions.push(disposableVal);
    //Adiciona comando de envia para Release
    let disposableRel = vscode.commands.registerCommand('advpl-sintax.gitRelease', () => {
        let repository = getRepository();
        if (!repository) {
            return;
        }

        let branchAtual = repository.headLabel;
        merge(repository, branchAtual, branchTeste, true, false);
    });
    context.subscriptions.push(disposableRel);
    //Adiciona comando de envia para master
    let disposable = vscode.commands.registerCommand('advpl-sintax.gitMaster', () => {
        //Faz o merge para master
        let repository = getRepository();
        if (!repository) {
            return;
        }

        let branchAtual = repository.headLabel;
        merge(repository, branchAtual, branchTeste, true, true);
    });
    context.subscriptions.push(disposable);
    //percorre todos os fontes do Workspace e valida se for ADVPL
    let advplExtensions = ['**/*.prw','**/*.prx','**/*.prg','**/*.apw','**/*.aph','**/*.apl','**/*.tlpp'];
    advplExtensions.forEach(extension => {
        let busca = vscode.workspace.findFiles(extension);
        busca.then((files : vscode.Uri[]) =>{
            files.forEach(file => {
                fileSystem.readFile(file.fsPath,"windows1252",(err, data) => {
                    vscode.window.showErrorMessage('Problema na validação de arquivos!');
                });
            });
        });
    });
}

function validaADVPL(e: any) {
    if (e) {
        //verifica se a linguagem é ADVPL
        if (e.document.languageId === "advpl") {
            let aErros = Array();
            //Pega as linhas do documento ativo e separa o array por linha
            let linhas = e.document.getText().split("\n");
            //Limpa as mensagens do colection
            collection.delete(e.document.uri);
            collection.clear();

            //let comentariosFonte = false;
            //let comentariosFuncao = false;
            //let selectTcQuery = false;
            //let comentAlteracao = false;
            let includeTotvs = false;
            let cBeginSql = false;
            let FromQuery = false;
            //Percorre todas as linhas
            for (var key in linhas) {
                let linha = linhas[key];
                //Verifica se adicionou o include TOTVS.CH
                if (linha.toUpperCase().search("#INCLUDE") !== -1 && linha.toUpperCase().search("TOTVS.CH") !== -1) {
                    includeTotvs = true;
                }
                if (linha.toUpperCase().search("BEGINSQL") !== -1) {
                    cBeginSql = true;
                }
                if (!cBeginSql && linha.toUpperCase().search("SELECT") !== -1) {
                    aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                        'Uso INDEVIDO de Query sem o Embedded SQL.! => Utilizar: BeginSQL … EndSQL.', vscode.DiagnosticSeverity.Error));
                }
                if (linha.toUpperCase().search("SELECT") !== -1 && linha.toUpperCase().search(" \\* ") !== -1) {
                    aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                        'Uso NÃO PERMITIDO de SELECT com asterisco "*".! ', vscode.DiagnosticSeverity.Error));
                }
                if (linha.toUpperCase().search("CHR\\(13\\)") !== -1 && linha.toUpperCase().search("CHR\\(10\\)") !== -1) {
                    aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                        'É recomendado o uso da expressão CRLF.', vscode.DiagnosticSeverity.Warning));
                }
                if (linha.toUpperCase().search("FROM") !== -1) {
                    FromQuery = true;
                }
                if (linha.toUpperCase().search("ENDSQL") !== -1) {
                    FromQuery = false;
                }
                if (FromQuery && linha.toUpperCase().search("PROTHEUS") !== -1) {
                    aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                        'Uso NÃO PERMITIDO do SHEMA PROTHEUS em Query. ', vscode.DiagnosticSeverity.Error));
                }
                if (linha.toUpperCase().search("CONOUT") !== -1) {
                    aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                        'Uso NÃO PERMITIDO do Conout. => Utilizar a API de Log padrão (FWLogMsg).', vscode.DiagnosticSeverity.Error));
                }
            }
            if (!includeTotvs) {
                aErros.push(new vscode.Diagnostic(new vscode.Range(0, 0, 0, 0), 'Falta o include TOTVS.CH !', vscode.DiagnosticSeverity.Error));
            }

            collection.set(e.document.uri, aErros);
        }
    }

}
function merge(repository: any, branchAtual: any, branchdestino: any, enviaHomolog: boolean, enviaMaster: boolean) {
    let branchesControladas = [branchHomol.toLocaleUpperCase, branchTeste.toLocaleUpperCase, branchProdu.toLocaleUpperCase];

    //verifica se não está numa branch controlada
    if (branchesControladas.indexOf(branchAtual.toUpperCase()) === 0) {
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
                    repository.merge(branchAtual, "").then((value: any) => {
                        let oComando;
                        //Se a branch destino for a master precisa criar tag
                        if (branchdestino === branchProdu) {
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
                                repository.checkout(branchAtual).then((value: any) => {
                                    if (enviaHomolog) {
                                        merge(repository, branchAtual, branchHomol, false, enviaMaster);
                                    } else {
                                        if (enviaMaster) {
                                            merge(repository, branchAtual, branchProdu, false, false);
                                        } else {
                                            repository.pushTags();
                                            sucesso("", "Merge de finalizado " + repository.headLabel + " -> " + branchdestino + ".");
                                        }
                                    }
                                    return;
                                });
                            }).catch(function () {
                                falha(repository.headLabel + " " + arguments[0]);
                                repository.checkout(branchAtual);
                                return;
                            });
                        }).catch(function () {
                            falha(repository.headLabel + " " + arguments[0]);
                            repository.checkout(branchAtual);
                            return;
                        });
                    }).catch(function () {
                        falha(repository.headLabel + " " + arguments[0]);
                        repository.checkout(branchAtual);
                        return;
                    });
                }).catch(function () {
                    falha(repository.headLabel + " " + arguments[0]);
                    repository.checkout(branchAtual);
                    return;
                });
            }).catch(function () {
                falha(repository.headLabel + " " + arguments[0]);
                repository.checkout(branchAtual);
                return;
            });
        }).catch(function () {
            falha(repository.headLabel + " " + arguments[0]);
            repository.checkout(branchAtual);
            return;
        });
    }
}
function getRepository() {
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

function sucesso(value: any, rotina: String) {
    vscode.window.showInformationMessage('FUNCIONOU ' + rotina + " [" + value + "]");
}
function falha(rotina: String) {
    vscode.window.showErrorMessage('ERRO ' + rotina + "!");
}
// this method is called when your extension is deactivated
export function deactivate() {
}