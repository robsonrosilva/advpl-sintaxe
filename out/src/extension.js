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
const Cache_1 = require("./Cache");
const vscode_1 = require("vscode");
const fileSystem = require("fs");
const globby = require("globby");
const FileCache_1 = require("./model/FileCache");
const Merge_1 = require("./Merge");
const analise_advpl_1 = require("analise-advpl");
const util_1 = require("util");
//Cria um colection para os erros ADVPL
const collection = vscode_1.languages.createDiagnosticCollection('advpl');
let listaDuplicados = [];
let projeto = [];
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
    //Adiciona comando de envia para Validação
    context.subscriptions.push(vscode_1.commands.registerCommand('advpl-sintaxe.gitValidacao', () => {
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
    context.subscriptions.push(vscode_1.commands.registerCommand('advpl-sintaxe.gitRelease', () => {
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
    context.subscriptions.push(vscode_1.commands.registerCommand('advpl-sintaxe.gitMaster', () => {
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
    context.subscriptions.push(vscode_1.commands.registerCommand('advpl-sintaxe.validaProjeto', () => {
        try {
            validaProjeto();
        }
        catch (e) {
            vscode_1.window.showInformationMessage(e.stdout);
        }
    }));
    //Adiciona comando de envia para master
    context.subscriptions.push(vscode_1.commands.registerCommand('advpl-sintaxe.analisaTags', () => {
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
    //Adiciona comando de Atualiza Branch
    context.subscriptions.push(vscode_1.commands.registerCommand('advpl-sintaxe.atualizaBranch', () => {
        let mergeAdvpl = new Merge_1.MergeAdvpl(true, validaProjeto);
        let branchAtual = mergeAdvpl.repository.headLabel;
        try {
            mergeAdvpl.atualiza(mergeAdvpl.repository, branchAtual, true);
        }
        catch (e) {
            mergeAdvpl.falha(e.stdout);
        }
        mergeAdvpl.repository.checkout(branchAtual);
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
}
exports.activate = activate;
function validaFonte(editor) {
    return __awaiter(this, void 0, void 0, function* () {
        let cache = new Cache_1.Cache(vscode_1.workspace.rootPath);
        if (editor) {
            //verifica se a linguagem é ADVPL
            if (editor.document.languageId === 'advpl') {
                if (editor.document.getText()) {
                    validaAdvpl.validacao(editor.document.getText(), editor.document.uri);
                    //verifica se o fonte já existe no projeto se não adiciona
                    let pos = projeto.map(function (e) {
                        return e.fonte.fsPath;
                    });
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
                        if (erro.message ===
                            localize('extension.functionDuplicate', 'This function is duplicated in the project!')) {
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
        vsErros.push(new vscode_1.Diagnostic(new vscode_1.Range(erro.startLine, 0, erro.endLine, 0), erro.message, erro.severity));
    });
    return vsErros;
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function vscodeFindFilesSync(advplExtensions) {
    return __awaiter(this, void 0, void 0, function* () {
        let globexp = [];
        for (var i = 0; i < advplExtensions.length; i++) {
            globexp.push(`**/*.${advplExtensions[i]}`);
        }
        return yield globby(globexp, {
            cwd: vscode_1.workspace.rootPath,
            nocase: true
        });
    });
}
function validaProjeto(nGeradas = 0, tags = [], fileContent = '', branchAtual = '', objetoMerge = undefined, maxCache = 500) {
    return __awaiter(this, void 0, void 0, function* () {
        let cache = new Cache_1.Cache(vscode_1.workspace.rootPath);
        // se a versão é diferente apaga do cache
        cache.filesInCache = cache.filesInCache.filter((_file) => _file.validaAdvpl.version === validaAdvpl.version);
        let totalAddCache = 0;
        let objeto = this;
        let tag = tags[nGeradas];
        //percorre todos os fontes do Workspace e valida se for ADVPL
        let advplExtensions = ['prw', 'prx', 'prg', 'apw', 'apl', 'tlpp'];
        let start = new Date();
        let files = yield vscodeFindFilesSync(advplExtensions);
        let endTime = new Date();
        var timeDiff = endTime - start; //in ms
        // strip the ms
        timeDiff /= 1000;
        // get seconds
        var seconds = Math.round(timeDiff);
        util_1.debuglog('Tempo gasto buscando arquivos ' + seconds + ' seconds');
        projeto = [];
        listaDuplicados = [];
        files.forEach((fileName) => {
            let file = vscode_1.Uri.file(vscode_1.workspace.rootPath + '\\' + fileName);
            util_1.debuglog('Validando  ' + vscode_1.workspace.rootPath + '\\' + file.fsPath);
            let conteudo = fileSystem.readFileSync(file.fsPath, 'latin1');
            // pepara objeto para o cache
            let fileForCache = new FileCache_1.FileCache();
            fileForCache.file = file;
            fileForCache.content = conteudo;
            // verifica se o arquivo está em cache se estiver compara o conteúdo
            cache.filesInCache.forEach((fileCache) => {
                // se a versão é diferente apaga o arquivo
                if (fileCache.validaAdvpl.version !== validaAdvpl.version) {
                    cache.delFile(fileCache.file.fsPath);
                }
                // se há o arquivo no cache compara o conteúdo e versão do cache com o atual
                if (fileCache.file.fsPath === file.fsPath) {
                    if (fileCache.content === conteudo) {
                        util_1.debuglog('usando cache');
                        // se for igual carrega a validação em cache
                        fileForCache.validaAdvpl = fileCache.validaAdvpl;
                    }
                    else {
                        // se o conteudo mudou apaga da análise
                        cache.delFile(fileCache.file.fsPath);
                    }
                }
            });
            let endTime = new Date();
            timeDiff = endTime - start; //in ms
            // strip the ms
            timeDiff /= 1000;
            // get seconds
            seconds = Math.round(timeDiff);
            // só analisa se há conteúdo e se a validacao estiver vazia(não houver cache ou estiver inválido)
            if (conteudo && !fileForCache.validaAdvpl) {
                try {
                    validaAdvpl.validacao(conteudo, file);
                    fileForCache.validaAdvpl = validaAdvpl;
                    // limita a quantidade de arquivos adicionados em cache
                    if (totalAddCache <= maxCache) {
                        totalAddCache++;
                        cache.addFile(fileForCache);
                    }
                }
                catch (_a) {
                    console.log('Erro na validação do fonte.');
                    conteudo = undefined;
                }
            }
            //Limpa as mensagens do colection
            collection.delete(file);
            if (conteudo) {
                projeto.push(fileForCache.validaAdvpl.fonte);
                collection.set(file, errorVsCode(fileForCache.validaAdvpl.aErros));
            }
            else {
                projeto.push(new analise_advpl_1.Fonte(file));
            }
            if (!fileContent && projeto.length === files.length) {
                verificaDuplicados();
                util_1.debuglog(seconds.toString());
                vscode_1.window.showInformationMessage(localize('extension.finish'));
            }
        });
    });
}
function verificaDuplicados() {
    return __awaiter(this, void 0, void 0, function* () {
        let listaFuncoes = [];
        let startTime = new Date();
        let duplicadosAtual = [];
        //faz a análise de funções ou classes duplicadas em fontes diferentes
        let duplicados = [];
        projeto.forEach((fonte) => {
            //verifica se o fonte ainda existe
            try {
                fileSystem.statSync(fonte.fonte.fsPath);
            }
            catch (e) {
                if (e.code === 'ENOENT') {
                    collection.delete(fonte.fonte);
                    fonte = new analise_advpl_1.Fonte();
                }
            }
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
                    let posicao = duplicadosAtual
                        .map(x => x.funcao + x.tipo)
                        .indexOf((funcao.nome + funcao.tipo).toUpperCase());
                    if (posicao === -1) {
                        duplicadosAtual.push({
                            funcao: funcao.nome.toUpperCase(),
                            tipo: funcao.tipo,
                            fontes: [fonte]
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
        if (listDuplicAtual.toString() !==
            listDuplicOld.map(x => x.funcao + x.tipo).toString()) {
            //Procura o que mudou
            let incluidos = listDuplicAtual.filter(x => listDuplicOld.indexOf(x) === -1);
            let excluidos = listDuplicOld.filter(x => listDuplicAtual.indexOf(x) === -1);
            //adicina novos erros
            incluidos.forEach(funcaoDuplicada => {
                //debuglog(` funcaoDuplicada  ${funcaoDuplicada}`);
                //encontra nos fontes a funcao
                let incluido = duplicadosAtual[listDuplicAtual.indexOf(funcaoDuplicada)];
                incluido.fontes.forEach(fonte => {
                    //debuglog(` fonte  ${fonte.fonte}`);
                    //busca os erros que estão no fonte
                    let erros = Object.assign([], collection.get(fonte.fonte));
                    fonte.funcoes.forEach(funcao => {
                        //debuglog(` funcao  ${funcao.nome}`);
                        erros.push(new vscode_1.Diagnostic(new vscode_1.Range(funcao.linha, 0, funcao.linha, 0), localize('extension.functionDuplicate', 'This function is duplicated in the project!'), vscode_1.DiagnosticSeverity.Error));
                    });
                    //Limpa as mensagens do colection
                    collection.delete(fonte.fonte);
                    collection.set(fonte.fonte, erros);
                });
            });
            //remove erros corrigidos
            excluidos.forEach(funcaoCorrigida => {
                //debuglog(` funcaoCorrigida  ${funcaoCorrigida}`);
                //encontra nos fontes a funcao
                let excuido = listaDuplicados[listDuplicOld.indexOf(funcaoCorrigida)];
                excuido.fontes.forEach(fonte => {
                    //debuglog(` fonte  ${fonte.fonte}`);
                    //busca os erros que estão no fonte
                    let erros = Object.assign([], collection.get(fonte.fonte));
                    fonte.funcoes.forEach(funcao => {
                        ///debuglog(` funcao  ${funcao.nome}`);
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
        util_1.debuglog(seconds + ' seconds');
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
