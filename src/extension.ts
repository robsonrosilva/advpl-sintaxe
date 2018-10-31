'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ValidaAdvpl } from './ValidaAdvpl';
import { MergeAdvpl } from './Merge';
import * as nls from 'vscode-nls';

const localize = nls.loadMessageBundle();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let validaAdvpl = new ValidaAdvpl();

    vscode.window.showInformationMessage(localize('src.extension.activeMessage','Active ADVPL Validation!'));
    vscode.workspace.onDidChangeTextDocument(validaFonte);

    //Adiciona comando de envia para Validação
    context.subscriptions.push(
        vscode.commands.registerCommand('advpl-sintaxe.gitValidacao', () => {
            let mergeAdvpl = new MergeAdvpl(false);
            let branchAtual = mergeAdvpl.repository.headLabel;
            try {
                mergeAdvpl.merge(mergeAdvpl.repository, branchAtual, mergeAdvpl.branchTeste, false, false);
            } catch (e) {
                mergeAdvpl.falha(e.stdout);
            }
            mergeAdvpl.repository.checkout(branchAtual);
            validaAdvpl.validaProjeto(undefined, undefined, undefined, undefined, undefined);
        })
    );
    //Adiciona comando de envia para Release
    context.subscriptions.push(
        vscode.commands.registerCommand('advpl-sintaxe.gitRelease', () => {
            let mergeAdvpl = new MergeAdvpl(false);
            let branchAtual = mergeAdvpl.repository.headLabel;
            try {
                mergeAdvpl.merge(mergeAdvpl.repository, branchAtual, mergeAdvpl.branchTeste, true, false);
            } catch (e) {
                mergeAdvpl.falha(e.stdout);
            }
            mergeAdvpl.repository.checkout(branchAtual);
            validaAdvpl.validaProjeto(undefined, undefined, undefined, undefined, undefined);
        })
    );
    //Adiciona comando de envia para master
    context.subscriptions.push(
        vscode.commands.registerCommand('advpl-sintaxe.gitMaster', () => {
            let mergeAdvpl = new MergeAdvpl(false);
            let branchAtual = mergeAdvpl.repository.headLabel;
            try {
                mergeAdvpl.merge(mergeAdvpl.repository, branchAtual, mergeAdvpl.branchTeste, true, true);
            } catch (e) {
                mergeAdvpl.falha(e.stdout);
            }
            mergeAdvpl.repository.checkout(branchAtual);
            validaAdvpl.validaProjeto(undefined, undefined, undefined, undefined, undefined);
        })
    );
    //Adiciona comando de envia para master
    context.subscriptions.push(
        vscode.commands.registerCommand('advpl-sintaxe.validaProjeto', () => {
            let mergeAdvpl = new MergeAdvpl(true);
            try {
                validaAdvpl.validaProjeto(undefined, undefined, undefined, undefined, undefined);
            } catch (e) {
                mergeAdvpl.falha(e.stdout);
            }
        })
    );
    //Adiciona comando de envia para master
    context.subscriptions.push(
        vscode.commands.registerCommand('advpl-sintaxe.analisaTags', () => {
            let mergeAdvpl = new MergeAdvpl(true);
            let branchAtual = mergeAdvpl.repository.headLabel;
            try {
                mergeAdvpl.analisaTags();
            } catch (e) {
                mergeAdvpl.falha(e.stdout);
            }
            mergeAdvpl.repository.checkout(branchAtual);
            validaAdvpl.validaProjeto(undefined, undefined, undefined, undefined, undefined);
        })
    );
    validaAdvpl.validaProjeto(undefined, undefined, undefined, undefined, undefined);
}
async function validaFonte(editor: any) {
    let validaAdvpl = new ValidaAdvpl();
    validaAdvpl.validaFonte(editor);
}

// this method is called when your extension is deactivated
export function deactivate() {
}