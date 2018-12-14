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
const vscode = require("vscode");
const Merge_1 = require("./Merge");
const fileSystem = require("fs");
const analise_advpl_1 = require("analise-advpl");
//Cria um colection para os erros ADVPL
const collection = vscode.languages.createDiagnosticCollection("advpl");
let listaDuplicados = [];
let projeto = [];
let comentFontPad = vscode.workspace
    .getConfiguration("advpl-sintaxe")
    .get("comentFontPad");
if (!comentFontPad) {
    comentFontPad = [""];
    vscode.window.showInformationMessage(traduz("extension.noCritizeComment"));
}
const vscodeOptions = JSON.parse(process.env.VSCODE_NLS_CONFIG).locale.toLowerCase();
let validaAdvpl = new analise_advpl_1.ValidaAdvpl(comentFontPad, vscodeOptions);
validaAdvpl.ownerDb = vscode.workspace
    .getConfiguration("advpl-sintaxe")
    .get("ownerDb");
validaAdvpl.empresas = vscode.workspace
    .getConfiguration("advpl-sintaxe")
    .get("empresas");
if (!validaAdvpl.ownerDb) {
    validaAdvpl.ownerDb = [];
}
if (!validaAdvpl.empresas) {
    validaAdvpl.empresas = [];
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    vscode.window.showInformationMessage(traduz("extension.activeMessage"));
    vscode.workspace.onDidChangeTextDocument(validaFonte);
    //Adiciona comando de envia para Validação
    context.subscriptions.push(vscode.commands.registerCommand("advpl-sintaxe.gitValidacao", () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl(false, validaProjeto);
        let branchAtual = mergeAdvpl.repository.headLabel;
        try {
            mergeAdvpl.merge(mergeAdvpl.repository, branchAtual, mergeAdvpl.branchTeste, false, false);
        }
        catch (e) {
            mergeAdvpl.falha(e.stdout);
        }
        mergeAdvpl.repository.checkout(branchAtual);
    }));
    //Adiciona comando de envia para Release
    context.subscriptions.push(vscode.commands.registerCommand("advpl-sintaxe.gitRelease", () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl(false, validaProjeto);
        let branchAtual = mergeAdvpl.repository.headLabel;
        try {
            mergeAdvpl.merge(mergeAdvpl.repository, branchAtual, mergeAdvpl.branchTeste, true, false);
        }
        catch (e) {
            mergeAdvpl.falha(e.stdout);
        }
        mergeAdvpl.repository.checkout(branchAtual);
    }));
    //Adiciona comando de envia para master
    context.subscriptions.push(vscode.commands.registerCommand("advpl-sintaxe.gitMaster", () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl(false, validaProjeto);
        let branchAtual = mergeAdvpl.repository.headLabel;
        try {
            mergeAdvpl.merge(mergeAdvpl.repository, branchAtual, mergeAdvpl.branchTeste, true, true);
        }
        catch (e) {
            mergeAdvpl.falha(e.stdout);
        }
        mergeAdvpl.repository.checkout(branchAtual);
    }));
    //Adiciona comando de envia para master
    context.subscriptions.push(vscode.commands.registerCommand("advpl-sintaxe.validaProjeto", () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl(true, validaProjeto);
        try {
            validaProjeto(undefined, undefined, undefined, undefined, undefined);
        }
        catch (e) {
            mergeAdvpl.falha(e.stdout);
        }
    }));
    //Adiciona comando de envia para master
    context.subscriptions.push(vscode.commands.registerCommand("advpl-sintaxe.analisaTags", () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl(true, validaProjeto);
        let branchAtual = mergeAdvpl.repository.headLabel;
        try {
            mergeAdvpl.analisaTags();
        }
        catch (e) {
            mergeAdvpl.falha(e.stdout);
        }
        mergeAdvpl.repository.checkout(branchAtual);
    }));
    if (vscode.workspace.getConfiguration("advpl-sintaxe").get("validaProjeto") !==
        false) {
        validaProjeto(undefined, undefined, undefined, undefined, undefined);
    }
}
exports.activate = activate;
function validaFonte(editor) {
    return __awaiter(this, void 0, void 0, function* () {
        if (editor) {
            //verifica se a linguagem é ADVPL
            if (editor.document.languageId === "advpl") {
                if (editor.document.getText()) {
                    validaAdvpl.validacao(editor.document.getText(), editor.document.uri);
                    //verifica se o fonte já existe no projeto se não adiciona
                    let pos = projeto.map(function (e) { return e.fonte.fsPath; });
                    let posicao = pos.indexOf(editor.document.uri.fsPath);
                    if (posicao === -1) {
                        projeto.push(validaAdvpl.fonte);
                    }
                    else {
                        projeto[posicao] = validaAdvpl.fonte;
                    }
                    let errosOld = Object.assign([], collection.get(validaAdvpl.fonte.fonte));
                    //recupera os erros de duplicidade eles não são criticados no validaAdvpl
                    let errosNew = errorVsCode(validaAdvpl.aErros);
                    errosOld.forEach(erro => {
                        if (erro.message === traduz("extension.functionDuplicate")) {
                            errosNew.push(erro);
                        }
                    });
                    //Limpa as mensagens do colection
                    collection.delete(editor.document.uri);
                    collection.set(editor.document.uri, errosNew);
                    verificaDuplicados();
                }
            }
        }
    });
}
function errorVsCode(aErros) {
    let vsErros = [];
    aErros.forEach(erro => {
        vsErros.push(new vscode.Diagnostic(new vscode.Range(erro.startLine, 0, erro.endLine, 0), erro.message, erro.severity));
    });
    return vsErros;
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function vscodeFindFilesSync() {
    return __awaiter(this, void 0, void 0, function* () {
        return vscode.workspace.findFiles("**/*.*", "**/*.json");
    });
}
function validaProjeto(nGeradas = 0, tags = [], fileContent = "", branchAtual = "", objetoMerge) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = tags[nGeradas];
        let fileLog = vscode.workspace.rootPath + "/AnaliseProjeto.csv";
        //percorre todos os fontes do Workspace e valida se for ADVPL
        let advplExtensions = ["prw", "prx", "prg", "apw", "apl", "tlpp"];
        let files = yield vscodeFindFilesSync();
        projeto = [];
        listaDuplicados = [];
        files.forEach((file) => {
            let re = /(?:\.([^.]+))?$/;
            let extensao = re.exec(file.fsPath);
            if (extensao && advplExtensions.indexOf(extensao[1].toLowerCase()) !== -1) {
                console.log("Validando  " + file.fsPath);
                let conteudo = fileSystem.readFileSync(file.fsPath, "latin1");
                if (conteudo) {
                    validaAdvpl.validacao(conteudo, file);
                    projeto.push(validaAdvpl.fonte);
                    //Limpa as mensagens do colection
                    collection.delete(file);
                    collection.set(file, errorVsCode(validaAdvpl.aErros));
                }
            }
            //Se for o último arquivo verifica se deve gravar no arquivo LOG
            if (!fileContent && file === files[files.length - 1]) {
                verificaDuplicados();
                vscode.window.showInformationMessage(traduz("extension.finish"));
            }
            else if (fileContent && file === files[files.length - 1]) {
                fileContent = fileContent.replace(tag + "\t\t\t\t\n", validaAdvpl.padTag(tag, tags) +
                    "\t" +
                    validaAdvpl.error +
                    "\t" +
                    validaAdvpl.warning +
                    "\t" +
                    validaAdvpl.information +
                    "\t" +
                    "\t" +
                    validaAdvpl.versao +
                    "\n");
                fileSystem.writeFileSync(fileLog, fileContent);
                console.log("Gerou TAG " + tag);
                nGeradas++;
                if (tags[nGeradas]) {
                    objetoMerge.geraRelatorio(nGeradas, tags, fileContent, branchAtual);
                }
            }
        });
    });
}
function verificaDuplicados() {
    let listaFuncoes = [];
    let startTime = new Date();
    let duplicadosAtual = [];
    //faz a análise de funções ou classes duplicadas em fontes diferentes
    let duplicados = [];
    projeto.forEach((fonte) => {
        fonte.funcoes.forEach((funcao) => {
            if (listaFuncoes.indexOf((funcao.nome + funcao.tipo).toUpperCase()) === -1) {
                listaFuncoes.push((funcao.nome + funcao.tipo).toUpperCase());
            }
            else {
                duplicados.push((funcao.nome + funcao.tipo).toUpperCase());
            }
        });
    });
    //guarda lista com os fontes que tem funções duplicadas
    projeto.forEach((fonte) => {
        fonte.funcoes.forEach((funcao) => {
            if (duplicados.indexOf((funcao.nome + funcao.tipo).toUpperCase()) !== -1) {
                //procura a funcao nos duplicados
                let posicao = duplicadosAtual.map(x => x.funcao + x.tipo).indexOf((funcao.nome + funcao.tipo).toUpperCase());
                if (posicao === -1) {
                    duplicadosAtual.push({
                        "funcao": (funcao.nome).toUpperCase(),
                        "tipo": funcao.tipo,
                        "fontes": [fonte]
                    });
                }
                else {
                    duplicadosAtual[posicao].fontes.push(fonte);
                }
            }
        });
    });
    //verifica se mudou a lista de funções duplicadas
    let listDuplicAtual = duplicadosAtual.map(x => x.funcao + x.tipo);
    let listDuplicOld = listaDuplicados.map(x => x.funcao + x.tipo);
    if (listDuplicAtual.toString() !== listDuplicOld.map(x => x.funcao + x.tipo).toString()) {
        //Procura o que mudou
        let incluidos = listDuplicAtual.filter(x => listDuplicOld.indexOf(x) === -1);
        let excluidos = listDuplicOld.filter(x => listDuplicAtual.indexOf(x) === -1);
        //adicina novos erros
        incluidos.forEach(funcaoDuplicada => {
            console.log(` funcaoDuplicada  ${funcaoDuplicada}`);
            //encontra nos fontes a funcao
            let incluido = duplicadosAtual[listDuplicAtual.indexOf(funcaoDuplicada)];
            incluido.fontes.forEach(fonte => {
                console.log(` fonte  ${fonte.fonte}`);
                //busca os erros que estão no fonte
                let erros = Object.assign([], collection.get(fonte.fonte));
                fonte.funcoes.forEach(funcao => {
                    console.log(` funcao  ${funcao.nome}`);
                    erros.push(new vscode.Diagnostic(new vscode.Range(funcao.linha, 0, funcao.linha, 0), traduz("extension.functionDuplicate"), vscode.DiagnosticSeverity.Error));
                });
                //Limpa as mensagens do colection
                collection.delete(fonte.fonte);
                collection.set(fonte.fonte, erros);
            });
        });
        //remove erros corrigidos
        excluidos.forEach(funcaoCorrigida => {
            console.log(` funcaoCorrigida  ${funcaoCorrigida}`);
            //encontra nos fontes a funcao
            let excuido = listaDuplicados[listDuplicOld.indexOf(funcaoCorrigida)];
            excuido.fontes.forEach(fonte => {
                console.log(` fonte  ${fonte.fonte}`);
                //busca os erros que estão no fonte
                let erros = Object.assign([], collection.get(fonte.fonte));
                fonte.funcoes.forEach(funcao => {
                    console.log(` funcao  ${funcao.nome}`);
                    erros.splice(erros.map(X => X.range._start._line).indexOf(funcao.linha));
                });
                //Limpa as mensagens do colection
                collection.delete(fonte.fonte);
                collection.set(fonte.fonte, erros);
            });
        });
    }
    //atualiza lista
    listaDuplicados = duplicadosAtual;
    let endTime = new Date();
    var timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;
    // get seconds 
    var seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");
}
function traduz(key) {
    const vscodeOptions = JSON.parse(process.env.VSCODE_NLS_CONFIG).locale.toLowerCase();
    let i18n = require("i18n");
    let locales = ["en", "pt-br"];
    i18n.configure({
        locales: locales,
        directory: __dirname + "/locales"
    });
    i18n.setLocale(locales.indexOf(vscodeOptions) + 1 ? vscodeOptions : "en");
    return i18n.__(key);
}
//# sourceMappingURL=extension.js.map