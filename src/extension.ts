'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
//import * as spawnCommand from 'spawn-command';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Validação ADVPL Ativa!');
    vscode.workspace.onDidChangeTextDocument(validaADVPL);

    //Cria um colection para os erros ADVPL
    const collection = vscode.languages.createDiagnosticCollection('advpl');

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
                        'Uso INDEVIDO de Query sem o Embedded SQL.! => Utilizar: BeginSQL … EndSQL.'));
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
                /*
                spawnCommand.child = spawnCommand('cd ' + vscode.workspace.rootPath);
                spawnCommand.child = spawnCommand('git pull');

                spawnCommand.child.stdout.on('data', function (data: any) {
                    console.log('data', data);
                });

                spawnCommand.child.on('exit', function (exitCode: any) {
                    console.log('exit', exitCode);
                });*/
            }
        }

    }
}
// this method is called when your extension is deactivated
export function deactivate() {
}