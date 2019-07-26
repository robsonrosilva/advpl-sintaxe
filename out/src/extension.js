"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const Merge_1 = require("./Merge");
const analise_advpl_1 = require("analise-advpl");
const util_1 = require("util");
const ItemProject_1 = require("analise-advpl/lib/models/ItemProject");
//Cria um colection para os erros ADVPL
const collection = vscode_1.languages.createDiagnosticCollection('advpl');
let pendingValidation = false;
let projeto;
let listaURI = [];
let comentFontPad = vscode_1.workspace
    .getConfiguration('advpl-sintaxe')
    .get('comentFontPad');
if (!comentFontPad) {
    comentFontPad = [''];
    vscode_1.window.showInformationMessage(localize('extension.noCritizeComment', 'Do not critize coments!'));
}
const vscodeOptions = JSON.parse(process.env.VSCODE_NLS_CONFIG).locale.toLowerCase();
let validaAdvpl = new analise_advpl_1.ValidaAdvpl(comentFontPad, vscodeOptions, false);
validaAdvpl.ownerDb = vscode_1.workspace
    .getConfiguration('advpl-sintaxe')
    .get('ownerDb');
validaAdvpl.empresas = vscode_1.workspace
    .getConfiguration('advpl-sintaxe')
    .get('empresas');
if (!validaAdvpl.ownerDb) {
    validaAdvpl.ownerDb = [];
}
if (!validaAdvpl.empresas) {
    validaAdvpl.empresas = [];
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    //debuglog(localize('extension.activeMessage', 'não funcionou'));
    vscode_1.window.showInformationMessage(localize('extension.activeMessage', 'Active ADVPL Validation!'));
    vscode_1.workspace.onDidChangeTextDocument(validaFonte);
    vscode_1.workspace.onDidOpenTextDocument(validaFonte);
    vscode_1.workspace.onDidSaveTextDocument(validaFonte);
    vscode_1.window.onDidChangeTextEditorSelection(validaAdvpl);
    //Adiciona comando de envia para Validação
    context.subscriptions.push(vscode_1.commands.registerCommand('advpl-sintaxe.gitValidacao', () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl();
        let branchAtual = mergeAdvpl.repository.headLabel;
        mergeAdvpl.merge(mergeAdvpl.branchTeste).then(() => {
            mergeAdvpl.repository.checkout(branchAtual);
            validaProjeto();
        }).catch((erro) => {
            vscode_1.window.showErrorMessage(erro);
            mergeAdvpl.repository.checkout(branchAtual);
            validaProjeto();
        });
    }));
    //Adiciona comando de envia para Release
    context.subscriptions.push(vscode_1.commands.registerCommand('advpl-sintaxe.gitRelease', () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl();
        let branchAtual = mergeAdvpl.repository.headLabel;
        mergeAdvpl.merge(mergeAdvpl.branchHomol).then(() => {
            mergeAdvpl.repository.checkout(branchAtual);
            validaProjeto();
        }).catch((erro) => {
            vscode_1.window.showErrorMessage(erro);
            mergeAdvpl.repository.checkout(branchAtual);
            validaProjeto();
        });
    }));
    //Adiciona comando de envia para master
    context.subscriptions.push(vscode_1.commands.registerCommand('advpl-sintaxe.gitMaster', () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl();
        let branchAtual = mergeAdvpl.repository.headLabel;
        mergeAdvpl.merge(mergeAdvpl.branchProdu).then(() => {
            mergeAdvpl.repository.checkout(branchAtual);
            validaProjeto();
        }).catch((erro) => {
            vscode_1.window.showErrorMessage(erro);
            mergeAdvpl.repository.checkout(branchAtual);
            validaProjeto();
        });
    }));
    //Adiciona comando de envia para master
    context.subscriptions.push(vscode_1.commands.registerCommand('advpl-sintaxe.validaProjeto', () => {
        try {
            validaProjeto();
        }
        catch (e) {
            vscode_1.window.showInformationMessage(e.stdout);
        }
    }));
    //Adiciona comando de Atualiza Branch
    context.subscriptions.push(vscode_1.commands.registerCommand('advpl-sintaxe.atualizaBranch', () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl();
        let branchAtual = mergeAdvpl.repository.headLabel;
        mergeAdvpl.atualiza().then((message) => {
            vscode_1.window.showInformationMessage(message);
            mergeAdvpl.repository.checkout(branchAtual);
            validaProjeto();
        }).catch((erro) => {
            vscode_1.window.showErrorMessage(erro);
            mergeAdvpl.repository.checkout(branchAtual);
            validaProjeto();
        });
    }));
    //Adiciona comando de limeza de branches
    context.subscriptions.push(vscode_1.commands.registerCommand('advpl-sintaxe.cleanBranches', () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl();
        let branchAtual = mergeAdvpl.repository.headLabel;
        mergeAdvpl.limpaBranches().then((message) => {
            vscode_1.window.showInformationMessage(message);
        }).catch((erro) => {
            vscode_1.window.showErrorMessage(erro);
        });
    }));
    if (vscode_1.workspace.getConfiguration('advpl-sintaxe').get('validaProjeto') !== false) {
        let startTime = new Date();
        validaProjeto();
        let endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        // strip the ms
        timeDiff /= 1000;
        // get seconds
        var seconds = Math.round(timeDiff);
        util_1.debuglog('Tempo gasto validacao ' + seconds + ' seconds');
    }
    else {
        validaFonte(vscode_1.window.activeTextEditor);
    }
}
exports.activate = activate;
function validaFonte(editor) {
    return __awaiter(this, void 0, void 0, function* () {
        let time = vscode_1.workspace.getConfiguration('advpl-sintaxe').get('tempoValidacao');
        let document;
        if (!time || time == 0) {
            time = 5000;
        }
        //trata quando recebe o documento
        if (editor.languageId) {
            document = editor;
        }
        else if (editor && editor.document) {
            document = editor.document;
        }
        //verifica se a linguagem é ADVPL
        if (document && document.languageId === 'advpl' && document.getText()) {
            // Se estiver pendente de processamento não faz a validação
            if (pendingValidation) {
                //console.log('pulou')
                return;
            }
            else {
                //console.log('agendou')
                pendingValidation = true;
                setTimeout(() => {
                    //console.log('comecou')
                    pendingValidation = false;
                    validaAdvpl.validacao(document.getText(), document.uri.fsPath);
                    // se valida projeto faz a validação se não somente atualiza o fonte atual
                    if (vscode_1.workspace.getConfiguration('advpl-sintaxe').get('validaProjeto') !== false) {
                        //verifica se o fonte já existe no projeto se não adiciona
                        let pos = projeto.projeto.map(function (e) {
                            return document.uri.fsPath;
                        });
                        let posicao = pos.indexOf(document.uri.fsPath);
                        let itemProjeto = new ItemProject_1.ItemModel();
                        itemProjeto.content = validaAdvpl.conteudoFonte;
                        itemProjeto.errors = validaAdvpl.aErros;
                        itemProjeto.fonte = validaAdvpl.fonte;
                        let projetoOld;
                        if (posicao === -1) {
                            projeto.projeto.push(itemProjeto);
                        }
                        else {
                            projeto.projeto[posicao] = itemProjeto;
                        }
                        projeto.verificaDuplicados().then(() => {
                            // atualiza os erros
                            projeto.projeto.forEach((item) => {
                                let fonte = item.fonte;
                                let file = getUri(fonte.fonte);
                                //Atualiza as mensagens do colection
                                collection.delete(file);
                                collection.set(file, errorVsCode(item.errors));
                            });
                            //console.log('terminou')
                        });
                    }
                    else {
                        let file = getUri(validaAdvpl.fonte.fonte);
                        //Atualiza as mensagens do colection
                        collection.delete(file);
                        collection.set(file, errorVsCode(validaAdvpl.aErros));
                    }
                }, time);
            }
        }
    });
}
function errorVsCode(aErros) {
    let vsErros = [];
    aErros.forEach(erro => {
        vsErros.push(new vscode_1.Diagnostic(new vscode_1.Range(erro.startLine, 0, erro.endLine, 0), erro.message, erro.severity));
    });
    return vsErros;
}
function getUri(file) {
    let uri;
    let fileName = file
        .replace(/\\/g, '/')
        .toUpperCase();
    let listName;
    // busca o arquivo
    uri = vscode_1.Uri.file(file);
    // busca na lista de uri
    if (!uri) {
        listaURI.forEach((item) => {
            listName = item.path
                .replace(/\\/g, '/')
                .toUpperCase();
            if (listName === fileName) {
                uri = item;
            }
        });
    }
    return uri;
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function validaProjeto() {
    return __awaiter(this, void 0, void 0, function* () {
        // prepara o objeto de validação
        let validaPrj = new analise_advpl_1.ValidaProjeto(validaAdvpl.comentFontPad, vscodeOptions);
        validaPrj.empresas = validaAdvpl.empresas;
        validaPrj.ownerDb = validaAdvpl.ownerDb;
        validaPrj.local = vscodeOptions;
        validaPrj.validaProjeto(vscode_1.workspace.rootPath).then((objProjeto) => {
            // se for validar o projeto limpa todas as críticas dos arquivos
            listaURI.forEach((uri) => {
                collection.delete(uri);
            });
            listaURI = [];
            objProjeto.projeto.forEach((item) => {
                let fonte = item.fonte;
                let file = getUri(fonte.fonte);
                listaURI.push(file);
                //Atualiza as mensagens do colection
                collection.set(file, errorVsCode(item.errors));
            });
            projeto = validaPrj;
            //fileSystem.writeFileSync('d:\\extensao.json', JSON.stringify(validaPrj), {
            //  mode: 0o755
            //});
        });
    });
}
function localize(key, text) {
    const vscodeOptions = JSON.parse(process.env.VSCODE_NLS_CONFIG).locale.toLowerCase();
    let i18n = require('i18n');
    let locales = ['en', 'pt-br'];
    i18n.configure({
        locales: locales,
        directory: __dirname + '\\locales'
    });
    i18n.setLocale(locales.indexOf(vscodeOptions) + 1 ? vscodeOptions : 'en');
    return i18n.__(key);
}

//# sourceMappingURL=Extension.js.map
