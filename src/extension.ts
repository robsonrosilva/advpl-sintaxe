'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fileSystem from 'fs';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

//Cria um colection para os erros ADVPL
const collection = vscode.languages.createDiagnosticCollection('advpl');
let branchTeste = vscode.workspace.getConfiguration("advpl-sintax").get("branchTeste") as string;
if (!branchTeste) {
    branchTeste = 'V11_Validacao';
}
let branchHomol = vscode.workspace.getConfiguration("advpl-sintax").get("branchHomologacao") as string;
if (!branchHomol) {
    branchHomol = 'V11_Release';
}
let branchProdu = vscode.workspace.getConfiguration("advpl-sintax").get("branchProducao") as string;
if (!branchProdu) {
    branchProdu = 'master';
}
let ownerDb = vscode.workspace.getConfiguration("advpl-sintax").get("ownerDb") as string;
if (!ownerDb) {
    ownerDb = 'PROTHEUS';
}
export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Validação ADVPL Ativa!');
    vscode.workspace.onDidChangeTextDocument(validaADVPL);

    //Adiciona comando de envia para Validação
    context.subscriptions.push(
        vscode.commands.registerCommand('advpl-sintax.gitValidacao', () => {
            let repository = getRepository();
            if (!repository) {
                return;
            }

            let branchAtual = repository.headLabel;
            merge(repository, branchAtual, branchTeste, false, false);
        })
    );
    //Adiciona comando de envia para Release
    context.subscriptions.push(
        vscode.commands.registerCommand('advpl-sintax.gitRelease', () => {
            let repository = getRepository();
            if (!repository) {
                return;
            }

            let branchAtual = repository.headLabel;
            merge(repository, branchAtual, branchTeste, true, false);
        })
    );
    //Adiciona comando de envia para master
    context.subscriptions.push(
        vscode.commands.registerCommand('advpl-sintax.gitMaster', () => {
            //Faz o merge para master
            let repository = getRepository();
            if (!repository) {
                return;
            }

            let branchAtual = repository.headLabel;
            merge(repository, branchAtual, branchTeste, true, true);
        })
    );
    //Adiciona comando de envia para master
    context.subscriptions.push(
        vscode.commands.registerCommand('advpl-sintax.validaProjeto', () => {
            validaProjeto();
        })
    );
    validaProjeto();
}

function validaProjeto() {
    //percorre todos os fontes do Workspace e valida se for ADVPL
    let advplExtensions = ['prw', 'prx', 'prg', 'apw', 'apl', 'tlpp'];
    vscode.workspace.findFiles('**/*.*', '**/*.json').then((files: vscode.Uri[]) => {
        files.forEach(file => {
            let re = /(?:\.([^.]+))?$/;
            let extensao = re.exec(file.fsPath);
            if (extensao && advplExtensions.indexOf(extensao[1].toLowerCase()) !== -1) {
                fileSystem.readFile(file.fsPath, "latin1", (err, data) => {
                    if (err) {
                        vscode.window.showErrorMessage('Problema na validação de arquivos!');
                    } else {
                        validacao(data, file);
                    }
                });

            }
        });
    });
}

function validaADVPL(e: any) {
    if (e) {
        //verifica se a linguagem é ADVPL
        if (e.document.languageId === "advpl") {
            validacao(e.document.getText(), e.document.uri);
        }
    }

}

function validacao(texto: String, uri: vscode.Uri) {
    let linhas = texto.split("\n");
    let aErros = Array();
    //Pega as linhas do documento ativo e separa o array por linha
    //Limpa as mensagens do colection
    collection.delete(uri);

    let comentFuncoes = new Array();
    let funcoes = new Array();
    let includeTotvs = false;
    let cBeginSql = false;
    let FromQuery = false;
    let JoinQuery = false;
    let cSelect = false;
    let ProtheusDoc = false;
    //Percorre todas as linhas
    for (var key in linhas) {
        //seta linha atual em caixa alta e ignorando comentários e linha
        let linha = linhas[key].toLocaleUpperCase().split("//")[0];
        //se estiver no PotheusDoc vê se está fechando
        if (ProtheusDoc && linha.search("\\/\\*\\/") !== -1) {
            ProtheusDoc = false;
        }
        //verifica se é protheusDoc
        if (linha.search("\\/\\*\\/\\{PROTHEUS\\.DOC\\}") !== -1) {
            ProtheusDoc = true;
            //reseta todas as ariáveis de controle pois se entrou em ProtheusDoc está fora de qualquer função
            cBeginSql = false;
            FromQuery = false;
            JoinQuery = false;
            cSelect = false;
            //verifica se é um comentário de função e adiciona no array
            comentFuncoes.push(
                [linha.trim().replace("/*/{PROTHEUS.DOC}", "").trim().toLocaleUpperCase(), key]
            );
        }
        //se não estiver dentro do Protheus DOC valida linha
        if (!ProtheusDoc) {
            //verifica se é função e adiciona no array
            if (linha.search("STATIC\\ FUNCTION\\ ") !== -1 ||
                linha.search("USER\\ FUNCTION\\ ") !== -1) {
                //reseta todas as ariáveis de controle pois está fora de qualquer função
                cBeginSql = false;
                FromQuery = false;
                JoinQuery = false;
                cSelect = false;
                //verifica se é um função e adiciona no array
                funcoes.push(
                    [linha.trim().split(" ")[2].split("(")[0].toLocaleUpperCase(), key]
                );
            }


            //Verifica se adicionou o include TOTVS.CH
            if (linha.search("#INCLUDE") !== -1 && linha.search("TOTVS.CH") !== -1) {
                includeTotvs = true;
            }
            if (linha.search("BEGINSQL\\ ") !== -1) {
                cBeginSql = true;
            }
            if (linha.match("SELECT\\ ") ||
                linha.match("DELETE\\ ") ||
                linha.match("UPDATE\\ ")) {
                cSelect = true;
            }
            if (!cBeginSql && linha.search("SELECT\\ ") !== -1) {
                aErros.push(
                    new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                        'Uso INDEVIDO de Query sem o Embedded SQL.! => Utilizar: BeginSQL … EndSQL.',
                        vscode.DiagnosticSeverity.Warning)
                );
            }
            if (linha.search("SELECT\\ ") !== -1 && linha.search("\\ \\*\\ ") !== -1) {
                aErros.push(
                    new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                        'Uso NÃO PERMITIDO de SELECT com asterisco "*".! ',
                        vscode.DiagnosticSeverity.Warning)
                );
            }
            if (linha.search("CHR\\(13\\)") !== -1 && linha.search("CHR\\(10\\)") !== -1) {
                aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                    'É recomendado o uso da expressão CRLF.',
                    vscode.DiagnosticSeverity.Warning)
                );
            }
            if (cSelect && linha.search("FROM") !== -1) {
                FromQuery = true;
            }
            if (cSelect && FromQuery && linha.search("JOIN") !== -1) {
                JoinQuery = true;
            }
            if (linha.search("ENDSQL") !== -1 ||
                linha.search("WHERE") !== -1 ||
                linha.search("TCQUERY") !== -1) {
                FromQuery = false;
                cSelect = false;
            }
            if (cSelect && FromQuery && linha.search(ownerDb) !== -1) {
                aErros.push(
                    new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                        'Uso NÃO PERMITIDO do SHEMA ' + ownerDb + ' em Query. ',
                        vscode.DiagnosticSeverity.Error)
                );
            }
            if (cSelect && (FromQuery || JoinQuery || linha.search("SET") !== -1) &&
                linha.search("exp:cTable") === -1 &&
                (linha.search("010\\ ") !== -1 || linha.search("020\\ ") !== -1)) {
                aErros.push(
                    new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                        'PROIBIDO Fixar tabela na  Query. ',
                        vscode.DiagnosticSeverity.Error)
                );
            }
            if (cSelect && JoinQuery && linha.search("ON") !== -1) {
                FromQuery = false;
                JoinQuery = false;
            }
            if (linha.search("CONOUT") !== -1) {
                aErros.push(
                    new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                        'Uso NÃO PERMITIDO do Conout. => Utilizar a API de Log padrão (FWLogMsg).',
                        vscode.DiagnosticSeverity.Warning)
                );
            }
        }
    }

    //Validação de padrão de comentáris de fontes
    let comentariosFonte = linhas[0] === '/*//' + '#'.repeat(89) + "\r";
    comentariosFonte = comentariosFonte && linhas[1].search('Projeto\\ \\:') !== -1;
    comentariosFonte = comentariosFonte && linhas[2].search('Modulo\\ \\ \\:') !== -1;
    comentariosFonte = comentariosFonte && linhas[3].search('Fonte\\ \\ \\ \\:') !== -1;
    comentariosFonte = comentariosFonte && linhas[4].search('Objetivo\\:') !== -1;
    comentariosFonte = comentariosFonte && linhas[5] === '*///' + '#'.repeat(89) + "\r";

    if (!comentariosFonte) {
        aErros.push(new vscode.Diagnostic(new vscode.Range(0, 0, 0, 0),
            'Verifique os padrões de comentários de fontes! => Use o autocomplete docFuncaoPoupex.',
            vscode.DiagnosticSeverity.Information)
        );
    }

    //Validação funções sem comentários
    funcoes.forEach(funcao => {
        let achou = false;
        comentFuncoes.forEach(comentario => {
            achou = achou || comentario[0] === funcao[0];
        });

        if (!achou) {
            aErros.push(new vscode.Diagnostic(
                new vscode.Range(parseInt(funcao[1]), 0, parseInt(funcao[1]), 0),
                'Função não comentada!',
                vscode.DiagnosticSeverity.Warning)
            );
        }
    });
    //Validação comentários sem funções
    comentFuncoes.forEach(comentario => {
        let achou = false;
        funcoes.forEach(funcao => {
            achou = achou || comentario[0] === funcao[0];
        });

        if (!achou) {
            aErros.push(new vscode.Diagnostic(
                new vscode.Range(parseInt(comentario[1]), 0, parseInt(comentario[1]), 0),
                'Comentário de função sem função!',
                vscode.DiagnosticSeverity.Warning)
            );
        }
    });

    if (!includeTotvs) {
        aErros.push(new vscode.Diagnostic(new vscode.Range(0, 0, 0, 0),
            'Falta o include TOTVS.CH !',
            vscode.DiagnosticSeverity.Warning)
        );
    }

    collection.set(uri, aErros);
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