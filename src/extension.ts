'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {ValidaAdvpl} from './ValidaAdvpl';
import {MergeAdvpl} from './merge';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
let validaAdvpl = new ValidaAdvpl();
export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Validação ADVPL Ativa!');
    vscode.workspace.onDidChangeTextDocument(validaFonte);

    //Adiciona comando de envia para Validação
    context.subscriptions.push(
        vscode.commands.registerCommand('advpl-sintax.gitValidacao', () => {
            let mergeAdvpl = new MergeAdvpl();
            let branchAtual = mergeAdvpl.repository.headLabel;
            mergeAdvpl.merge(mergeAdvpl.repository, branchAtual, mergeAdvpl.branchTeste, false, false);
        })
    );
    //Adiciona comando de envia para Release
    context.subscriptions.push(
        vscode.commands.registerCommand('advpl-sintax.gitRelease', () => {
            let mergeAdvpl = new MergeAdvpl();
            let branchAtual = mergeAdvpl.repository.headLabel;
            mergeAdvpl.merge(mergeAdvpl.repository, branchAtual, mergeAdvpl.branchTeste, true, false);
        })
    );
    //Adiciona comando de envia para master
    context.subscriptions.push(
        vscode.commands.registerCommand('advpl-sintax.gitMaster', () => {
            let mergeAdvpl = new MergeAdvpl();
            let branchAtual = mergeAdvpl.repository.headLabel;
            mergeAdvpl.merge(mergeAdvpl.repository, branchAtual, mergeAdvpl.branchTeste, true, true);
        })
    );
    //Adiciona comando de envia para master
    context.subscriptions.push(
        vscode.commands.registerCommand('advpl-sintax.validaProjeto', () => {
            validaAdvpl.validaProjeto();
        })
    );
    validaAdvpl.validaProjeto();
}
function validaFonte(editor: any){
    validaAdvpl.validaFonte(editor);
}

// this method is called when your extension is deactivated
export function deactivate() {
}