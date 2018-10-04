'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

//Cria um colection para os erros ADVPL
const collection = vscode.languages.createDiagnosticCollection('advpl');
export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Validação ADVPL Ativa!');
    vscode.workspace.onDidChangeTextDocument(validaADVPL);

    //Adiciona comando de envia para Validação
    let disposableVal = vscode.commands.registerCommand('advpl-sintax.gitValidacao', () => {
        gitValidacao();
    });
    context.subscriptions.push(disposableVal);
    //Adiciona comando de envia para Validação
    let disposableRel = vscode.commands.registerCommand('advpl-sintax.gitRelease', () => {
        gitRelease();
    });
    context.subscriptions.push(disposableRel);
    //Adiciona comando de envia para Validação
    let disposable = vscode.commands.registerCommand('advpl-sintax.gitMaster', () => {
        gitMaster();
    });
    context.subscriptions.push(disposable);
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
                        'Uso INDEVIDO de Query sem o Embedded SQL.! => Utilizar: BeginSQL … EndSQL.',vscode.DiagnosticSeverity.Warning));
                if (linha.toUpperCase().search("SELECT") !== -1 && linha.toUpperCase().search(" * ") !== -1) {
                    aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                        'Uso NÃO PERMITIDO de SELECT com asterisco "*".! '));
                }
                if (linha.toUpperCase().search("FROM") !== -1) {
                    FromQuery = true;
                }
                if (linha.toUpperCase().search("ENDSQL") !== -1) {
                    FromQuery = false;
                }
                if (FromQuery && linha.toUpperCase().search("PROTHEUS") !== -1) {
                    aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                        'Uso NÃO PERMITIDO do SHEMA PROTHEUS em Query. '));
                }
                if (linha.toUpperCase().search("CONOUT") !== -1) {
                    aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                        'Uso NÃO PERMITIDO do Conout. => Utilizar a API de Log padrão (FWLogMsg).'));
                }
            }
            if (!includeTotvs) {
                aErros.push(new vscode.Diagnostic(new vscode.Range(0, 0, 0, 0), 'Falta o include TOTVS.CH !'));
            }

            collection.set(e.document.uri, aErros);
        }
    }

}
function gitValidacao() {
    let repository = getRepository();
    if (!repository) {
        return;
    }

    let branchAtual = repository.headLabel;
    merge(repository, branchAtual, 'V11_Validacao', false);
}
function gitRelease() {
    let repository = getRepository();
    if (!repository) {
        return;
    }

    let branchAtual = repository.headLabel;
    merge(repository, branchAtual, 'V11_Validacao', true);
}
function merge(repository: any, branchAtual: any, branchdestino: any, enviaRelease: boolean) {
    let branchesControladas = ['V11_RELEASE', 'V11_VALIDACAO', 'MASTER'];

    //verifica se não está numa branch controlada
    if (branchesControladas.indexOf(branchAtual.toUpperCase) === 0) {
        vscode.window.showErrorMessage(
            'Essa branch não pode ser utilizada para para Merge!'
        );
        return;
    }

    repository.checkout(branchdestino).then((value: any) => {
        repository.pull().then((value: any) => {
            repository.merge(branchAtual, "").then((value: any) => {
                repository.push().then((value: any) => {
                    if (enviaRelease) {
                        repository.checkout(branchAtual);
                        merge(repository, branchAtual, 'V11_Release', false);
                    } else {
                        repository.checkout(branchAtual);
                        sucesso("", "Merge de finalizado " + repository.headLabel);
                    }
                    return;
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

function gitMaster() {
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