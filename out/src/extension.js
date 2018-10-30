'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const ValidaAdvpl_1 = require("./ValidaAdvpl");
const Merge_1 = require("./Merge");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let validaAdvpl = new ValidaAdvpl_1.ValidaAdvpl();
    vscode.window.showInformationMessage(localize(0, null));
    vscode.workspace.onDidChangeTextDocument(validaFonte);
    //Adiciona comando de envia para Validação
    context.subscriptions.push(vscode.commands.registerCommand('advpl-sintax.gitValidacao', () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl(false);
        let branchAtual = mergeAdvpl.repository.headLabel;
        try {
            mergeAdvpl.merge(mergeAdvpl.repository, branchAtual, mergeAdvpl.branchTeste, false, false);
        }
        catch (e) {
            mergeAdvpl.falha(e.stdout);
        }
        mergeAdvpl.repository.checkout(branchAtual);
        validaAdvpl.validaProjeto(undefined, undefined, undefined, undefined, undefined);
    }));
    //Adiciona comando de envia para Release
    context.subscriptions.push(vscode.commands.registerCommand('advpl-sintax.gitRelease', () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl(false);
        let branchAtual = mergeAdvpl.repository.headLabel;
        try {
            mergeAdvpl.merge(mergeAdvpl.repository, branchAtual, mergeAdvpl.branchTeste, true, false);
        }
        catch (e) {
            mergeAdvpl.falha(e.stdout);
        }
        mergeAdvpl.repository.checkout(branchAtual);
        validaAdvpl.validaProjeto(undefined, undefined, undefined, undefined, undefined);
    }));
    //Adiciona comando de envia para master
    context.subscriptions.push(vscode.commands.registerCommand('advpl-sintax.gitMaster', () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl(false);
        let branchAtual = mergeAdvpl.repository.headLabel;
        try {
            mergeAdvpl.merge(mergeAdvpl.repository, branchAtual, mergeAdvpl.branchTeste, true, true);
        }
        catch (e) {
            mergeAdvpl.falha(e.stdout);
        }
        mergeAdvpl.repository.checkout(branchAtual);
        validaAdvpl.validaProjeto(undefined, undefined, undefined, undefined, undefined);
    }));
    //Adiciona comando de envia para master
    context.subscriptions.push(vscode.commands.registerCommand('advpl-sintax.validaProjeto', () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl(true);
        try {
            validaAdvpl.validaProjeto(undefined, undefined, undefined, undefined, undefined);
        }
        catch (e) {
            mergeAdvpl.falha(e.stdout);
        }
    }));
    //Adiciona comando de envia para master
    context.subscriptions.push(vscode.commands.registerCommand('advpl-sintax.analisaTags', () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl(true);
        let branchAtual = mergeAdvpl.repository.headLabel;
        try {
            mergeAdvpl.analisaTags();
        }
        catch (e) {
            mergeAdvpl.falha(e.stdout);
        }
        mergeAdvpl.repository.checkout(branchAtual);
        validaAdvpl.validaProjeto(undefined, undefined, undefined, undefined, undefined);
    }));
    validaAdvpl.validaProjeto(undefined, undefined, undefined, undefined, undefined);
}
exports.activate = activate;
function validaFonte(editor) {
    return __awaiter(this, void 0, void 0, function* () {
        let validaAdvpl = new ValidaAdvpl_1.ValidaAdvpl();
        validaAdvpl.validaFonte(editor);
    });
}
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

//# sourceMappingURL=extension.js.map
