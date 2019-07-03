module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

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
const vscode_1 = __webpack_require__(1);
const Merge_1 = __webpack_require__(2);
const analise_advpl_1 = __webpack_require__(27);
const util_1 = __webpack_require__(15);
const ItemProject_1 = __webpack_require__(34);
//Cria um colection para os erros ADVPL
const collection = vscode_1.languages.createDiagnosticCollection('advpl');
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
        //verifica se a linguagem é ADVPL
        if (editor && editor.document.languageId === 'advpl' && editor.document.getText()) {
            validaAdvpl.validacao(editor.document.getText(), editor.document.uri.fsPath);
            //verifica se o fonte já existe no projeto se não adiciona
            let pos = projeto.projeto.map(function (e) {
                return editor.document.urifsPath;
            });
            let posicao = pos.indexOf(editor.document.uri.fsPath);
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
            });
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
    let i18n = __webpack_require__(3);
    let locales = ['en', 'pt-br'];
    i18n.configure({
        locales: locales,
        directory: __dirname + '\\locales'
    });
    i18n.setLocale(locales.indexOf(vscodeOptions) + 1 ? vscodeOptions : 'en');
    return i18n.__(key);
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

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
const vscode_1 = __webpack_require__(1);
//Criação sincrona de funções do git
function gitCheckoutSync(objeto, destino) {
    return __awaiter(this, void 0, void 0, function* () {
        return objeto.repository.checkout(destino);
    });
}
function gitMergeSync(repository, branchOrigem) {
    return __awaiter(this, void 0, void 0, function* () {
        return repository.merge(branchOrigem, '');
    });
}
function gitTagSync(repository, tag) {
    return __awaiter(this, void 0, void 0, function* () {
        return repository.tag(tag, '');
    });
}
function gitPushSync(repository) {
    return __awaiter(this, void 0, void 0, function* () {
        repository.pushTags();
        return repository.push();
    });
}
function gitPullSync(repository) {
    return __awaiter(this, void 0, void 0, function* () {
        return repository.pull();
    });
}
class MergeAdvpl {
    constructor(forca, fnValidacao) {
        this.fnValidacao = fnValidacao;
        //Busca Configurações do Settings
        this.branchTeste = vscode_1.workspace
            .getConfiguration('advpl-sintaxe')
            .get('branchTeste');
        if (!this.branchTeste) {
            this.falha(localize('merge.noBranch'));
            return;
        }
        this.branchHomol = vscode_1.workspace
            .getConfiguration('advpl-sintaxe')
            .get('branchHomologacao');
        if (!this.branchHomol) {
            this.falha(localize('merge.noBranch'));
            return;
        }
        this.branchProdu = vscode_1.workspace
            .getConfiguration('advpl-sintaxe')
            .get('branchProducao');
        if (!this.branchProdu) {
            this.falha(localize('merge.noBranch'));
            return;
        }
        this.branchesControladas = Array();
        this.branchesControladas.push(this.branchHomol.toLocaleUpperCase.toString());
        this.branchesControladas.push(this.branchTeste.toLocaleUpperCase.toString());
        this.branchesControladas.push(this.branchProdu.toLocaleUpperCase.toString());
        this.repository = this.getRepository(forca);
    }
    merge(repository, branchAtual, branchdestino, enviaHomolog, enviaMaster) {
        return __awaiter(this, void 0, void 0, function* () {
            //guarda objeto this
            let objeto = this;
            let tagName = '';
            //verifica se não está numa branch controlada
            if (objeto.branchesControladas.indexOf(branchAtual.toUpperCase()) !== -1) {
                vscode_1.window.showErrorMessage(localize('merge.noBranchMerge'));
                return;
            }
            else {
                //Trata quando a branche ainda não subiu para o GIT
                if (!repository.HEAD.upstream) {
                    vscode_1.window.showErrorMessage(localize('merge.noPush'));
                    return;
                }
                // se estiver na branche inicial efetua a atualização antes de iniciar o merge
                if (objeto.getRepository(true).headLabel === branchAtual) {
                    try {
                        yield objeto.atualiza(objeto.repository, branchAtual);
                    }
                    catch (e) {
                        return;
                    }
                }
                try {
                    yield gitPushSync(repository);
                }
                catch (e) {
                    vscode_1.window.showErrorMessage(localize('merge.pushError') + '\n' + e.stdout);
                    return;
                }
                try {
                    yield gitCheckoutSync(objeto, branchdestino);
                }
                catch (e) {
                    vscode_1.window.showErrorMessage(localize('merge.checkoutError') + '\n' + e.stdout);
                    return;
                }
                try {
                    yield gitPullSync(repository);
                }
                catch (e) {
                    vscode_1.window.showErrorMessage(localize('merge.pullError') + '\n' + e.stdout);
                    return;
                }
                let branchOriginal = undefined;
                //se for merge para produção usa no merge a branch de homologação
                if (branchdestino === objeto.branchProdu) {
                    branchOriginal = branchAtual;
                    branchAtual = objeto.branchHomol;
                }
                try {
                    yield gitMergeSync(repository, branchAtual);
                }
                catch (e) {
                    vscode_1.window.showErrorMessage(localize('merge.mergeError') + '\n' + e.stdout);
                    return;
                }
                //Se a branch destino for a master precisa criar tag
                if (branchdestino === objeto.branchProdu) {
                    let aUltimaTag = [0, 0, 0];
                    let commit;
                    //Verifica ultima tag
                    repository.refs.forEach((item) => {
                        //verifica se é TAG
                        if (item.type === 2) {
                            //Verifica se é padrão de numeração
                            let aNiveis = item.name.split('.');
                            if (aNiveis.length === 3) {
                                let aTag = [
                                    Number(aNiveis[0]),
                                    Number(aNiveis[1]),
                                    Number(aNiveis[2])
                                ];
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
                    }
                    else {
                        aUltimaTag[2]++;
                    }
                    if (commit !== repository.HEAD.commit) {
                        try {
                            tagName =
                                String(aUltimaTag[0]) +
                                    '.' +
                                    String(aUltimaTag[1]) +
                                    '.' +
                                    String(aUltimaTag[2]);
                            yield gitTagSync(repository, tagName);
                        }
                        catch (e) {
                            vscode_1.window.showErrorMessage(localize('merge.tagError') + '\n' + e.stdout);
                            return;
                        }
                    }
                }
                try {
                    yield gitPushSync(repository);
                }
                catch (e) {
                    vscode_1.window.showErrorMessage(localize('merge.pushError') + '\n' + e.stdout);
                    return;
                }
                //se for usou a branche de homologação volta o conteúdo original
                if (branchOriginal) {
                    branchAtual = branchOriginal;
                }
                if (enviaHomolog) {
                    objeto.merge(repository, branchAtual, objeto.branchHomol, false, enviaMaster);
                }
                else if (enviaMaster) {
                    objeto.merge(repository, branchAtual, objeto.branchProdu, false, false);
                }
                else {
                    try {
                        yield gitCheckoutSync(repository, branchAtual);
                    }
                    catch (e) {
                        vscode_1.window.showErrorMessage(localize('merge.checkoutError') + '\n' + e.stdout);
                        return;
                    }
                    objeto.sucesso(tagName, localize('merge.mergeFinish') +
                        branchAtual +
                        ' -> ' +
                        branchdestino +
                        '.');
                }
            }
        });
    }
    atualiza(repository, branchAtual, showMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            //guarda objeto this
            let objeto = this;
            //verifica se não está numa branch controlada
            if (objeto.branchesControladas.indexOf(branchAtual.toUpperCase()) !== -1) {
                vscode_1.window.showErrorMessage(localize('merge.noBranchMerge'));
                return;
            }
            else {
                try {
                    yield gitCheckoutSync(objeto, objeto.branchHomol);
                }
                catch (e) {
                    vscode_1.window.showErrorMessage(localize('merge.checkoutError') + '\n' + e.stdout);
                    return;
                }
                try {
                    yield gitPullSync(repository);
                }
                catch (e) {
                    vscode_1.window.showErrorMessage(localize('merge.pullError') + '\n' + e.stdout);
                    return;
                }
                try {
                    yield gitCheckoutSync(objeto, branchAtual);
                }
                catch (e) {
                    vscode_1.window.showErrorMessage(localize('merge.checkoutError') + '\n' + e.stdout);
                    return;
                }
                try {
                    yield gitMergeSync(repository, objeto.branchHomol);
                }
                catch (e) {
                    vscode_1.window.showErrorMessage(localize('merge.mergeError') + '\n' + e.stdout);
                    return;
                }
                if (showMessage) {
                    vscode_1.window.showInformationMessage(localize('merge.atualizacaoFinish'));
                }
            }
        });
    }
    analisaTags() {
        let fileContent = 'TAG\tError\tWarning\tInformation\tHint\tExtension Version\n';
        let branchAtual = this.repository.headLabel;
        let objeto = this;
        let tags = [];
        let nGeradas = 0;
        //Verifica ultima tag
        objeto.repository.refs.forEach((item) => {
            //verifica se é TAG
            if (item.type === 2) {
                //Verifica se é padrão de numeração
                let aNiveis = item.name.split('.');
                if (aNiveis.length === 3) {
                    fileContent += item.name + '\t\t\t\t\n';
                    tags.push(item.name);
                }
            }
        });
        objeto.geraRelatorio(nGeradas, tags, fileContent, branchAtual);
    }
    geraRelatorio(nGeradas, tags, fileContent, branchAtual) {
        return __awaiter(this, void 0, void 0, function* () {
            let tag = tags[nGeradas];
            let objeto = this;
            console.log('TROCANDO PARA TAG ' + tag);
            yield gitCheckoutSync(objeto, tag);
            this.fnValidacao(nGeradas, tags, fileContent, branchAtual, objeto);
            console.log('VALIDANDO TAG ' + tag);
        });
    }
    getRepository(forca) {
        let git = vscode_1.extensions.getExtension('vscode.git');
        if (git) {
            if (git.isActive) {
                let repository;
                // se houver mais de um repositório git aberto e se houver um editor
                if (git.exports._model.repositories.length > 1 &&
                    vscode_1.window.activeTextEditor) {
                    repository = git.exports._model.getRepository(vscode_1.window.activeTextEditor.document.uri);
                }
                else if (git.exports._model.repositories.length === 1) {
                    repository = git.exports._model.repositories[0];
                }
                else {
                    let repository = git.exports._model.getRepository(vscode_1.workspace.rootPath);
                }
                // set resource groups
                if (!repository) {
                    vscode_1.window.showErrorMessage(localize('merge.noRepository'));
                    return;
                }
                // set resource groups
                if (repository.mergeGroup.resourceStates.length !== 0 ||
                    repository.indexGroup.resourceStates.length !== 0 ||
                    repository.workingTreeGroup.resourceStates.length !== 0) {
                    vscode_1.window.showErrorMessage(localize('merge.noCommited'));
                    return;
                }
                return repository;
            }
        }
    }
    sucesso(value, rotina) {
        vscode_1.window.showInformationMessage(localize('merge.success') + rotina + ' [' + value + ']');
        this.fnValidacao();
    }
    falha(rotina) {
        vscode_1.window.showErrorMessage('ERRO ' + rotina + '!');
        this.fnValidacao();
    }
}
exports.MergeAdvpl = MergeAdvpl;
function localize(key, text) {
    const vscodeOptions = JSON.parse(process.env.VSCODE_NLS_CONFIG).locale.toLowerCase();
    let i18n = __webpack_require__(3);
    let locales = ['en', 'pt-br'];
    i18n.configure({
        locales: locales,
        directory: __dirname + '\\locales'
    });
    i18n.setLocale(locales.indexOf(vscodeOptions) + 1 ? vscodeOptions : 'en');
    return i18n.__(key);
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @author      Created by Marcus Spiegel <marcus.spiegel@gmail.com> on 2011-03-25.
 * @link        https://github.com/mashpie/i18n-node
 * @license     http://opensource.org/licenses/MIT
 *
 * @version     0.8.3
 */



// dependencies
var vsprintf = __webpack_require__(5).vsprintf,
  fs = __webpack_require__(6),
  url = __webpack_require__(7),
  path = __webpack_require__(8),
  debug = __webpack_require__(9)('i18n:debug'),
  warn = __webpack_require__(9)('i18n:warn'),
  error = __webpack_require__(9)('i18n:error'),
  Mustache = __webpack_require__(19),
  Messageformat = __webpack_require__(20),
  MakePlural = __webpack_require__(23).load(
    __webpack_require__(24)
  ),
  parseInterval = __webpack_require__(25).default;

// exports an instance
module.exports = (function() {

  var MessageformatInstanceForLocale = {},
    PluralsForLocale = {},
    locales = {},
    api = {
      '__': '__',
      '__n': '__n',
      '__l': '__l',
      '__h': '__h',
      '__mf': '__mf',
      'getLocale': 'getLocale',
      'setLocale': 'setLocale',
      'getCatalog': 'getCatalog',
      'getLocales': 'getLocales',
      'addLocale': 'addLocale',
      'removeLocale': 'removeLocale'
    },
    pathsep = path.sep, // ---> means win support will be available in node 0.8.x and above
    autoReload,
    cookiename,
    defaultLocale,
    directory,
    directoryPermissions,
    extension,
    fallbacks,
    indent,
    logDebugFn,
    logErrorFn,
    logWarnFn,
    objectNotation,
    prefix,
    queryParameter,
    register,
    updateFiles,
    syncFiles;

  // public exports
  var i18n = {};

  i18n.locales = locales;

  i18n.version = '0.8.3';

  i18n.configure = function i18nConfigure(opt) {

    // reset locales
    locales = {};

    // Provide custom API method aliases if desired
    // This needs to be processed before the first call to applyAPItoObject()
    if (opt.api && typeof opt.api === 'object') {
      for (var method in opt.api) {
        if (opt.api.hasOwnProperty(method)) {
          var alias = opt.api[method];
          if (typeof api[method] !== 'undefined') {
            api[method] = alias;
          }
        }
      }
    }

    // you may register i18n in global scope, up to you
    if (typeof opt.register === 'object') {
      register = opt.register;
      // or give an array objects to register to
      if (Array.isArray(opt.register)) {
        register = opt.register;
        register.forEach(function(r) {
          applyAPItoObject(r);
        });
      } else {
        applyAPItoObject(opt.register);
      }
    }

    // sets a custom cookie name to parse locale settings from
    cookiename = (typeof opt.cookie === 'string') ? opt.cookie : null;

    // query-string parameter to be watched - @todo: add test & doc
    queryParameter = (typeof opt.queryParameter === 'string') ? opt.queryParameter : null;

    // where to store json files
    directory = (typeof opt.directory === 'string') ?
      opt.directory : path.join(__dirname, 'locales');

    // permissions when creating new directories
    directoryPermissions = (typeof opt.directoryPermissions === 'string') ?
      parseInt(opt.directoryPermissions, 8) : null;

    // write new locale information to disk
    updateFiles = (typeof opt.updateFiles === 'boolean') ? opt.updateFiles : true;

    // sync locale information accros all files
    syncFiles = (typeof opt.syncFiles === 'boolean') ? opt.syncFiles : false;

    // what to use as the indentation unit (ex: "\t", "  ")
    indent = (typeof opt.indent === 'string') ? opt.indent : '\t';

    // json files prefix
    prefix = (typeof opt.prefix === 'string') ? opt.prefix : '';

    // where to store json files
    extension = (typeof opt.extension === 'string') ? opt.extension : '.json';

    // setting defaultLocale
    defaultLocale = (typeof opt.defaultLocale === 'string') ? opt.defaultLocale : 'en';

    // auto reload locale files when changed
    autoReload = (typeof opt.autoReload === 'boolean') ? opt.autoReload : false;

    // enable object notation?
    objectNotation = (typeof opt.objectNotation !== 'undefined') ? opt.objectNotation : false;
    if (objectNotation === true) objectNotation = '.';

    // read language fallback map
    fallbacks = (typeof opt.fallbacks === 'object') ? opt.fallbacks : {};

    // setting custom logger functions
    logDebugFn = (typeof opt.logDebugFn === 'function') ? opt.logDebugFn : debug;
    logWarnFn = (typeof opt.logWarnFn === 'function') ? opt.logWarnFn : warn;
    logErrorFn = (typeof opt.logErrorFn === 'function') ? opt.logErrorFn : error;

    // when missing locales we try to guess that from directory
    opt.locales = opt.locales || guessLocales(directory);

    // implicitly read all locales
    if (Array.isArray(opt.locales)) {

      opt.locales.forEach(function(l) {
        read(l);
      });

      // auto reload locale files when changed
      if (autoReload) {

        // watch changes of locale files (it's called twice because fs.watch is still unstable)
        fs.watch(directory, function(event, filename) {
          var localeFromFile = guessLocaleFromFile(filename);

          if (localeFromFile && opt.locales.indexOf(localeFromFile) > -1) {
            logDebug('Auto reloading locale file "' + filename + '".');
            read(localeFromFile);
          }

        });
      }
    }
  };

  i18n.init = function i18nInit(request, response, next) {
    if (typeof request === 'object') {

      // guess requested language/locale
      guessLanguage(request);

      // bind api to req
      applyAPItoObject(request);

      // looks double but will ensure schema on api refactor
      i18n.setLocale(request, request.locale);
    } else {
      return logError('i18n.init must be called with one parameter minimum, ie. i18n.init(req)');
    }

    if (typeof response === 'object') {
      applyAPItoObject(response);

      // and set that locale to response too
      i18n.setLocale(response, request.locale);
    }

    // head over to next callback when bound as middleware
    if (typeof next === 'function') {
      return next();
    }
  };

  i18n.__ = function i18nTranslate(phrase) {
    var msg;
    var argv = parseArgv(arguments);
    var namedValues = argv[0];
    var args = argv[1];

    // called like __({phrase: "Hello", locale: "en"})
    if (typeof phrase === 'object') {
      if (typeof phrase.locale === 'string' && typeof phrase.phrase === 'string') {
        msg = translate(phrase.locale, phrase.phrase);
      }
    }
    // called like __("Hello")
    else {
      // get translated message with locale from scope (deprecated) or object
      msg = translate(getLocaleFromObject(this), phrase);
    }

    // postprocess to get compatible to plurals
    if (typeof msg === 'object' && msg.one) {
      msg = msg.one;
    }

    // in case there is no 'one' but an 'other' rule
    if (typeof msg === 'object' && msg.other) {
      msg = msg.other;
    }

    // head over to postProcessing
    return postProcess(msg, namedValues, args);
  };

  i18n.__mf = function i18nMessageformat(phrase) {
    var msg, mf, f;
    var targetLocale = defaultLocale;
    var argv = parseArgv(arguments);
    var namedValues = argv[0];
    var args = argv[1];

    // called like __({phrase: "Hello", locale: "en"})
    if (typeof phrase === 'object') {
      if (typeof phrase.locale === 'string' && typeof phrase.phrase === 'string') {
        msg = phrase.phrase;
        targetLocale = phrase.locale;
      }
    }
    // called like __("Hello")
    else {
      // get translated message with locale from scope (deprecated) or object
      msg = phrase;
      targetLocale = getLocaleFromObject(this);
    }

    msg = translate(targetLocale, msg);
    // --- end get msg

    // now head over to Messageformat
    // and try to cache instance
    if (MessageformatInstanceForLocale[targetLocale]) {
      mf = MessageformatInstanceForLocale[targetLocale];
    } else {
      mf = new Messageformat(targetLocale);
      mf.compiledFunctions = {};
      MessageformatInstanceForLocale[targetLocale] = mf;
    }

    // let's try to cache that function
    if (mf.compiledFunctions[msg]) {
      f = mf.compiledFunctions[msg];
    } else {
      f = mf.compile(msg);
      mf.compiledFunctions[msg] = f;
    }

    return postProcess(f(namedValues), namedValues, args);
  };

  i18n.__l = function i18nTranslationList(phrase) {
    var translations = [];
    Object.keys(locales).sort().forEach(function(l) {
      translations.push(i18n.__({ phrase: phrase, locale: l }));
    });
    return translations;
  };

  i18n.__h = function i18nTranslationHash(phrase) {
    var translations = [];
    Object.keys(locales).sort().forEach(function(l) {
      var hash = {};
      hash[l] = i18n.__({ phrase: phrase, locale: l });
      translations.push(hash);
    });
    return translations;
  };

  i18n.__n = function i18nTranslatePlural(singular, plural, count) {
    var msg, namedValues, targetLocale, args = [];

    // Accept an object with named values as the last parameter
    if (argsEndWithNamedObject(arguments)) {
      namedValues = arguments[arguments.length - 1];
      args = arguments.length >= 5 ? Array.prototype.slice.call(arguments, 3, -1) : [];
    } else {
      namedValues = {};
      args = arguments.length >= 4 ? Array.prototype.slice.call(arguments, 3) : [];
    }

    // called like __n({singular: "%s cat", plural: "%s cats", locale: "en"}, 3)
    if (typeof singular === 'object') {
      if (
        typeof singular.locale === 'string' &&
        typeof singular.singular === 'string' &&
        typeof singular.plural === 'string'
      ) {
        targetLocale = singular.locale;
        msg = translate(singular.locale, singular.singular, singular.plural);
      }
      args.unshift(count);

      // some template engines pass all values as strings -> so we try to convert them to numbers
      if (typeof plural === 'number' || parseInt(plural, 10) + '' === plural) {
        count = plural;
      }

      // called like __n({singular: "%s cat", plural: "%s cats", locale: "en", count: 3})
      if (typeof singular.count === 'number' || typeof singular.count === 'string') {
        count = singular.count;
        args.unshift(plural);
      }
    } else {
      // called like  __n('cat', 3)
      if (typeof plural === 'number' || parseInt(plural, 10) + '' === plural) {
        count = plural;

        // we add same string as default
        // which efectivly copies the key to the plural.value
        // this is for initialization of new empty translations
        plural = singular;

        args.unshift(count);
        args.unshift(plural);
      }
      // called like __n('%s cat', '%s cats', 3)
      // get translated message with locale from scope (deprecated) or object
      msg = translate(getLocaleFromObject(this), singular, plural);
      targetLocale = getLocaleFromObject(this);
    }

    if (count === null) count = namedValues.count;

    // enforce number
    count = parseInt(count, 10);

    // find the correct plural rule for given locale
    if (typeof msg === 'object') {
      var p;
      // create a new Plural for locale
      // and try to cache instance
      if (PluralsForLocale[targetLocale]) {
        p = PluralsForLocale[targetLocale];
      } else {
        // split locales with a region code
        var lc = targetLocale.toLowerCase().split(/[_-\s]+/)
          .filter(function(el){ return  true && el; });
        // take the first part of locale, fallback to full locale
        p = new MakePlural(lc[0] || targetLocale);
        PluralsForLocale[targetLocale] = p;
      }

      // fallback to 'other' on case of missing translations
      msg = msg[p(count)] || msg.other;
    }

    // head over to postProcessing
    return postProcess(msg, namedValues, args, count);
  };

  i18n.setLocale = function i18nSetLocale(object, locale, skipImplicitObjects) {

    // when given an array of objects => setLocale on each
    if (Array.isArray(object) && typeof locale === 'string') {
      for (var i = object.length - 1; i >= 0; i--) {
        i18n.setLocale(object[i], locale, true);
      }
      return i18n.getLocale(object[0]);
    }

    // defaults to called like i18n.setLocale(req, 'en')
    var targetObject = object;
    var targetLocale = locale;

    // called like req.setLocale('en') or i18n.setLocale('en')
    if (locale === undefined && typeof object === 'string') {
      targetObject = this;
      targetLocale = object;
    }

    // consider a fallback
    if (!locales[targetLocale] && fallbacks[targetLocale]) {
      targetLocale = fallbacks[targetLocale];
    }

    // now set locale on object
    targetObject.locale = locales[targetLocale] ? targetLocale : defaultLocale;

    // consider any extra registered objects
    if (typeof register === 'object') {
      if (Array.isArray(register) && !skipImplicitObjects) {
        register.forEach(function(r) {
          r.locale = targetObject.locale;
        });
      } else {
        register.locale = targetObject.locale;
      }
    }

    // consider res
    if (targetObject.res && !skipImplicitObjects) {

      // escape recursion
      // @see  - https://github.com/balderdashy/sails/pull/3631
      //       - https://github.com/mashpie/i18n-node/pull/218
      if (targetObject.res.locals) {
        i18n.setLocale(targetObject.res, targetObject.locale, true);
        i18n.setLocale(targetObject.res.locals, targetObject.locale, true);
      } else {
        i18n.setLocale(targetObject.res, targetObject.locale);
      }
    }

    // consider locals
    if (targetObject.locals && !skipImplicitObjects) {

      // escape recursion
      // @see  - https://github.com/balderdashy/sails/pull/3631
      //       - https://github.com/mashpie/i18n-node/pull/218
      if (targetObject.locals.res) {
        i18n.setLocale(targetObject.locals, targetObject.locale, true);
        i18n.setLocale(targetObject.locals.res, targetObject.locale, true);
      } else {
        i18n.setLocale(targetObject.locals, targetObject.locale);
      }
    }

    return i18n.getLocale(targetObject);
  };

  i18n.getLocale = function i18nGetLocale(request) {

    // called like i18n.getLocale(req)
    if (request && request.locale) {
      return request.locale;
    }

    // called like req.getLocale()
    return this.locale || defaultLocale;
  };

  i18n.getCatalog = function i18nGetCatalog(object, locale) {
    var targetLocale;

    // called like i18n.getCatalog(req)
    if (typeof object === 'object' && typeof object.locale === 'string' && locale === undefined) {
      targetLocale = object.locale;
    }

    // called like i18n.getCatalog(req, 'en')
    if (!targetLocale && typeof object === 'object' && typeof locale === 'string') {
      targetLocale = locale;
    }

    // called like req.getCatalog('en')
    if (!targetLocale && locale === undefined && typeof object === 'string') {
      targetLocale = object;
    }

    // called like req.getCatalog()
    if (!targetLocale &&
      object === undefined &&
      locale === undefined &&
      typeof this.locale === 'string'
    ) {
      if (register && register.GLOBAL) {
        targetLocale = '';
      } else {
        targetLocale = this.locale;
      }
    }

    // called like i18n.getCatalog()
    if (targetLocale === undefined || targetLocale === '') {
      return locales;
    }

    if (!locales[targetLocale] && fallbacks[targetLocale]) {
      targetLocale = fallbacks[targetLocale];
    }

    if (locales[targetLocale]) {
      return locales[targetLocale];
    } else {
      logWarn('No catalog found for "' + targetLocale + '"');
      return false;
    }
  };

  i18n.getLocales = function i18nGetLocales() {
    return Object.keys(locales);
  };

  i18n.addLocale = function i18nAddLocale(locale) {
    read(locale);
  };

  i18n.removeLocale = function i18nRemoveLocale(locale) {
    delete locales[locale];
  };

  // ===================
  // = private methods =
  // ===================

  var postProcess = function(msg, namedValues, args, count) {

    // test for parsable interval string
    if ((/\|/).test(msg)) {
      msg = parsePluralInterval(msg, count);
    }

    // replace the counter
    if (typeof count === 'number') {
      msg = vsprintf(msg, [parseInt(count, 10)]);
    }

    // if the msg string contains {{Mustache}} patterns we render it as a mini tempalate
    if ((/{{.*}}/).test(msg)) {
      msg = Mustache.render(msg, namedValues);
    }

    // if we have extra arguments with values to get replaced,
    // an additional substition injects those strings afterwards
    if ((/%/).test(msg) && args && args.length > 0) {
      msg = vsprintf(msg, args);
    }

    return msg;
  };

  var argsEndWithNamedObject = function(args) {
    return (args.length > 1 &&
      args[args.length - 1] !== null &&
      typeof args[args.length - 1] === 'object');
  };

  var parseArgv = function(args) {
    var namedValues, returnArgs;

    if (argsEndWithNamedObject(args)) {
      namedValues = args[args.length - 1];
      returnArgs = Array.prototype.slice.call(args, 1, -1);
    } else {
      namedValues = {};
      returnArgs = args.length >= 2 ? Array.prototype.slice.call(args, 1) : [];
    }

    return [namedValues, returnArgs];
  };

  /**
   * registers all public API methods to a given response object when not already declared
   */
  var applyAPItoObject = function(object) {

    var alreadySetted = true;

    // attach to itself if not provided
    for (var method in api) {
      if (api.hasOwnProperty(method)) {
        var alias = api[method];

        // be kind rewind, or better not touch anything already existing
        if (!object[alias]) {
          alreadySetted = false;
          object[alias] = i18n[method].bind(object);
        }
      }
    }

    // set initial locale if not set
    if (!object.locale) {
      object.locale = defaultLocale;
    }

    // escape recursion
    if (alreadySetted) {
      return;
    }

    // attach to response if present (ie. in express)
    if (object.res) {
      applyAPItoObject(object.res);
    }

    // attach to locals if present (ie. in express)
    if (object.locals) {
      applyAPItoObject(object.locals);
    }
  };

  /**
   * tries to guess locales by scanning the given directory
   */
  var guessLocales = function(directory) {
    var entries = fs.readdirSync(directory);
    var localesFound = [];

    for (var i = entries.length - 1; i >= 0; i--) {
      if (entries[i].match(/^\./)) continue;
      var localeFromFile = guessLocaleFromFile(entries[i]);
      if (localeFromFile) localesFound.push(localeFromFile);
    }

    return localesFound.sort();
  };

  /**
   * tries to guess locales from a given filename
   */
  var guessLocaleFromFile = function(filename) {
    var extensionRegex = new RegExp(extension + '$', 'g');
    var prefixRegex = new RegExp('^' + prefix, 'g');

    if (prefix && !filename.match(prefixRegex)) return false;
    if (extension && !filename.match(extensionRegex)) return false;
    return filename.replace(prefix, '').replace(extensionRegex, '');
  };

  /**
   * guess language setting based on http headers
   */

  var guessLanguage = function(request) {
    if (typeof request === 'object') {
      var languageHeader = request.headers? request.headers['accept-language'] : undefined,
        languages = [],
        regions = [];

      request.languages = [defaultLocale];
      request.regions = [defaultLocale];
      request.language = defaultLocale;
      request.region = defaultLocale;

      // a query parameter overwrites all
      if (queryParameter && request.url) {
        var urlObj = url.parse(request.url, true);
        if (urlObj.query[queryParameter]) {
          logDebug('Overriding locale from query: ' + urlObj.query[queryParameter]);
          request.language = urlObj.query[queryParameter].toLowerCase();
          return i18n.setLocale(request, request.language);
        }
      }

      // a cookie overwrites headers
      if (cookiename && request.cookies && request.cookies[cookiename]) {
        request.language = request.cookies[cookiename];
        return i18n.setLocale(request, request.language);
      }

      // 'accept-language' is the most common source
      if (languageHeader) {
        var acceptedLanguages = getAcceptedLanguagesFromHeader(languageHeader),
          match, fallbackMatch, fallback;
        for (var i = 0; i < acceptedLanguages.length; i++) {
          var lang = acceptedLanguages[i],
            lr = lang.split('-', 2),
            parentLang = lr[0],
            region = lr[1];

          // Check if we have a configured fallback set for this language.
          if (fallbacks && fallbacks[lang]) {
            fallback = fallbacks[lang];
            // Fallbacks for languages should be inserted
            // where the original, unsupported language existed.
            var acceptedLanguageIndex = acceptedLanguages.indexOf(lang);
            var fallbackIndex = acceptedLanguages.indexOf(fallback);
            if(fallbackIndex > -1) {
              acceptedLanguages.splice(fallbackIndex, 1);
            }
            acceptedLanguages.splice(acceptedLanguageIndex + 1, 0, fallback);
          }

          // Check if we have a configured fallback set for the parent language of the locale.
          if (fallbacks && fallbacks[parentLang]) {
            fallback = fallbacks[parentLang];
            // Fallbacks for a parent language should be inserted
            // to the end of the list, so they're only picked
            // if there is no better match.
            if (acceptedLanguages.indexOf(fallback) < 0) {
              acceptedLanguages.push(fallback);
            }
          }

          if (languages.indexOf(parentLang) < 0) {
            languages.push(parentLang.toLowerCase());
          }
          if (region) {
            regions.push(region.toLowerCase());
          }

          if (!match && locales[lang]) {
            match = lang;
            break;
          }

          if (!fallbackMatch && locales[parentLang]) {
            fallbackMatch = parentLang;
          }
        }

        request.language = match || fallbackMatch || request.language;
        request.region = regions[0] || request.region;
        return i18n.setLocale(request, request.language);
      }
    }

    // last resort: defaultLocale
    return i18n.setLocale(request, defaultLocale);
  };

  /**
   * Get a sorted list of accepted languages from the HTTP Accept-Language header
   */
  var getAcceptedLanguagesFromHeader = function(header) {
    var languages = header.split(','),
      preferences = {};
    return languages.map(function parseLanguagePreference(item) {
      var preferenceParts = item.trim().split(';q=');
      if (preferenceParts.length < 2) {
        preferenceParts[1] = 1.0;
      } else {
        var quality = parseFloat(preferenceParts[1]);
        preferenceParts[1] = quality ? quality : 0.0;
      }
      preferences[preferenceParts[0]] = preferenceParts[1];

      return preferenceParts[0];
    }).filter(function(lang) {
      return preferences[lang] > 0;
    }).sort(function sortLanguages(a, b) {
      return preferences[b] - preferences[a];
    });
  };

  /**
   * searches for locale in given object
   */

  var getLocaleFromObject = function(obj) {
    var locale;
    if (obj && obj.scope) {
      locale = obj.scope.locale;
    }
    if (obj && obj.locale) {
      locale = obj.locale;
    }
    return locale;
  };

  /**
   * splits and parses a phrase for mathematical interval expressions
   */
  var parsePluralInterval = function(phrase, count) {
    var returnPhrase = phrase;
    var phrases = phrase.split(/\|/);

    // some() breaks on 1st true
    phrases.some(function(p) {
      var matches = p.match(/^\s*([\(\)\[\]\d,]+)?\s*(.*)$/);

      // not the same as in combined condition
      if (matches[1]) {
        if (matchInterval(count, matches[1]) === true) {
          returnPhrase = matches[2];
          return true;
        }
      } else {
        returnPhrase = p;
      }

    });
    return returnPhrase;
  };

  /**
   * test a number to match mathematical interval expressions
   * [0,2] - 0 to 2 (including, matches: 0, 1, 2)
   * ]0,3[ - 0 to 3 (excluding, matches: 1, 2)
   * [1]   - 1 (matches: 1)
   * [20,] - all numbers ≥20 (matches: 20, 21, 22, ...)
   * [,20] - all numbers ≤20 (matches: 20, 21, 22, ...)
   */
  var matchInterval = function(number, interval) {
    interval = parseInterval(interval);
    if (interval && typeof number === 'number') {
      if (interval.from.value === number) {
        return interval.from.included;
      }
      if (interval.to.value === number) {
        return interval.to.included;
      }

      return (Math.min(interval.from.value, number) === interval.from.value &&
        Math.max(interval.to.value, number) === interval.to.value);
    }
    return false;
  };

  /**
   * read locale file, translate a msg and write to fs if new
   */
  var translate = function(locale, singular, plural, skipSyncToAllFiles) {

    // add same key to all translations
    if (!skipSyncToAllFiles && syncFiles) {
      syncToAllFiles(singular, plural);
    }

    if (locale === undefined) {
      logWarn('WARN: No locale found - check the context of the call to __(). Using ' +
        defaultLocale + ' as current locale');
      locale = defaultLocale;
    }

    if (!locales[locale] && fallbacks[locale]) {
      locale = fallbacks[locale];
    }

    // attempt to read when defined as valid locale
    if (!locales[locale]) {
      read(locale);
    }

    // fallback to default when missed
    if (!locales[locale]) {

      logWarn('WARN: Locale ' + locale +
        ' couldn\'t be read - check the context of the call to $__. Using ' +
        defaultLocale + ' (default) as current locale');

      locale = defaultLocale;
      read(locale);
    }

    // dotnotaction add on, @todo: factor out
    var defaultSingular = singular;
    var defaultPlural = plural;
    if (objectNotation) {
      var indexOfColon = singular.indexOf(':');
      // We compare against 0 instead of -1 because
      // we don't really expect the string to start with ':'.
      if (0 < indexOfColon) {
        defaultSingular = singular.substring(indexOfColon + 1);
        singular = singular.substring(0, indexOfColon);
      }
      if (plural && typeof plural !== 'number') {
        indexOfColon = plural.indexOf(':');
        if (0 < indexOfColon) {
          defaultPlural = plural.substring(indexOfColon + 1);
          plural = plural.substring(0, indexOfColon);
        }
      }
    }

    var accessor = localeAccessor(locale, singular);
    var mutator = localeMutator(locale, singular);

    if (plural) {
      if (!accessor()) {
        mutator({
          'one': defaultSingular || singular,
          'other': defaultPlural || plural
        });
        write(locale);
      }
    }

    if (!accessor()) {
      mutator(defaultSingular || singular);
      write(locale);
    }

    return accessor();
  };

  /**
   * initialize the same key in all locales
   * when not already existing, checked via translate
   */
  var syncToAllFiles = function(singular, plural) {
    // iterate over locales and translate again
    // this will implicitly write/sync missing keys
    // to the rest of locales
    for (var l in locales) {
      translate(l, singular, plural, true);
    }
  };

  /**
   * Allows delayed access to translations nested inside objects.
   * @param {String} locale The locale to use.
   * @param {String} singular The singular term to look up.
   * @param {Boolean} [allowDelayedTraversal=true] Is delayed traversal of the tree allowed?
   * This parameter is used internally. It allows to signal the accessor that
   * a translation was not found in the initial lookup and that an invocation
   * of the accessor may trigger another traversal of the tree.
   * @returns {Function} A function that, when invoked, returns the current value stored
   * in the object at the requested location.
   */
  var localeAccessor = function(locale, singular, allowDelayedTraversal) {
    // Bail out on non-existent locales to defend against internal errors.
    if (!locales[locale]) return Function.prototype;

    // Handle object lookup notation
    var indexOfDot = objectNotation && singular.lastIndexOf(objectNotation);
    if (objectNotation && (0 < indexOfDot && indexOfDot < singular.length - 1)) {
      // If delayed traversal wasn't specifically forbidden, it is allowed.
      if (typeof allowDelayedTraversal === 'undefined') allowDelayedTraversal = true;
      // The accessor we're trying to find and which we want to return.
      var accessor = null;
      // An accessor that returns null.
      var nullAccessor = function() {
        return null;
      };
      // Do we need to re-traverse the tree upon invocation of the accessor?
      var reTraverse = false;
      // Split the provided term and run the callback for each subterm.
      singular.split(objectNotation).reduce(function(object, index) {
        // Make the accessor return null.
        accessor = nullAccessor;
        // If our current target object (in the locale tree) doesn't exist or
        // it doesn't have the next subterm as a member...
        if (null === object || !object.hasOwnProperty(index)) {
          // ...remember that we need retraversal (because we didn't find our target).
          reTraverse = allowDelayedTraversal;
          // Return null to avoid deeper iterations.
          return null;
        }
        // We can traverse deeper, so we generate an accessor for this current level.
        accessor = function() {
          return object[index];
        };
        // Return a reference to the next deeper level in the locale tree.
        return object[index];

      }, locales[locale]);
      // Return the requested accessor.
      return function() {
        // If we need to re-traverse (because we didn't find our target term)
        // traverse again and return the new result (but don't allow further iterations)
        // or return the previously found accessor if it was already valid.
        return (reTraverse) ? localeAccessor(locale, singular, false)() : accessor();
      };

    } else {
      // No object notation, just return an accessor that performs array lookup.
      return function() {
        return locales[locale][singular];
      };
    }
  };

  /**
   * Allows delayed mutation of a translation nested inside objects.
   * @description Construction of the mutator will attempt to locate the requested term
   * inside the object, but if part of the branch does not exist yet, it will not be
   * created until the mutator is actually invoked. At that point, re-traversal of the
   * tree is performed and missing parts along the branch will be created.
   * @param {String} locale The locale to use.
   * @param {String} singular The singular term to look up.
   * @param [Boolean} [allowBranching=false] Is the mutator allowed to create previously
   * non-existent branches along the requested locale path?
   * @returns {Function} A function that takes one argument. When the function is
   * invoked, the targeted translation term will be set to the given value inside the locale table.
   */
  var localeMutator = function(locale, singular, allowBranching) {
    // Bail out on non-existent locales to defend against internal errors.
    if (!locales[locale]) return Function.prototype;

    // Handle object lookup notation
    var indexOfDot = objectNotation && singular.lastIndexOf(objectNotation);
    if (objectNotation && (0 < indexOfDot && indexOfDot < singular.length - 1)) {
      // If branching wasn't specifically allowed, disable it.
      if (typeof allowBranching === 'undefined') allowBranching = false;
      // This will become the function we want to return.
      var accessor = null;
      // An accessor that takes one argument and returns null.
      var nullAccessor = function() {
        return null;
      };
      // Fix object path.
      var fixObject = function() {
        return {};
      };
      // Are we going to need to re-traverse the tree when the mutator is invoked?
      var reTraverse = false;
      // Split the provided term and run the callback for each subterm.
      singular.split(objectNotation).reduce(function(object, index) {
        // Make the mutator do nothing.
        accessor = nullAccessor;
        // If our current target object (in the locale tree) doesn't exist or
        // it doesn't have the next subterm as a member...
        if (null === object || !object.hasOwnProperty(index)) {
          // ...check if we're allowed to create new branches.
          if (allowBranching) {
            // Fix `object` if `object` is not Object.
            if (null === object || typeof object !== 'object') {
              object = fixObject();
            }
            // If we are allowed to, create a new object along the path.
            object[index] = {};
          } else {
            // If we aren't allowed, remember that we need to re-traverse later on and...
            reTraverse = true;
            // ...return null to make the next iteration bail our early on.
            return null;
          }
        }
        // Generate a mutator for the current level.
        accessor = function(value) {
          object[index] = value;
          return value;
        };
        // Generate a fixer for the current level.
        fixObject = function() {
          object[index] = {};
          return object[index];
        };

        // Return a reference to the next deeper level in the locale tree.
        return object[index];

      }, locales[locale]);

      // Return the final mutator.
      return function(value) {
        // If we need to re-traverse the tree
        // invoke the search again, but allow branching
        // this time (because here the mutator is being invoked)
        // otherwise, just change the value directly.
        return (reTraverse) ? localeMutator(locale, singular, true)(value) : accessor(value);
      };

    } else {
      // No object notation, just return a mutator that performs array lookup and changes the value.
      return function(value) {
        locales[locale][singular] = value;
        return value;
      };
    }
  };

  /**
   * try reading a file
   */
  var read = function(locale) {
    var localeFile = {},
      file = getStorageFilePath(locale);
    try {
      logDebug('read ' + file + ' for locale: ' + locale);
      localeFile = fs.readFileSync(file);
      try {
        // parsing filecontents to locales[locale]
        locales[locale] = JSON.parse(localeFile);
      } catch (parseError) {
        logError('unable to parse locales from file (maybe ' +
          file + ' is empty or invalid json?): ', parseError);
      }
    } catch (readError) {
      // unable to read, so intialize that file
      // locales[locale] are already set in memory, so no extra read required
      // or locales[locale] are empty, which initializes an empty locale.json file

      // since the current invalid locale could exist, we should back it up
      if (fs.existsSync(file)) {
        logDebug('backing up invalid locale ' + locale + ' to ' + file + '.invalid');
        fs.renameSync(file, file + '.invalid');
      }

      logDebug('initializing ' + file);
      write(locale);
    }
  };

  /**
   * try writing a file in a created directory
   */
  var write = function(locale) {
    var stats, target, tmp;

    // don't write new locale information to disk if updateFiles isn't true
    if (!updateFiles) {
      return;
    }

    // creating directory if necessary
    try {
      stats = fs.lstatSync(directory);
    } catch (e) {
      logDebug('creating locales dir in: ' + directory);
      fs.mkdirSync(directory, directoryPermissions);
    }

    // first time init has an empty file
    if (!locales[locale]) {
      locales[locale] = {};
    }

    // writing to tmp and rename on success
    try {
      target = getStorageFilePath(locale);
      tmp = target + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(locales[locale], null, indent), 'utf8');
      stats = fs.statSync(tmp);
      if (stats.isFile()) {
        fs.renameSync(tmp, target);
      } else {
        logError('unable to write locales to file (either ' +
          tmp + ' or ' + target + ' are not writeable?): ');
      }
    } catch (e) {
      logError('unexpected error writing files (either ' +
        tmp + ' or ' + target + ' are not writeable?): ', e);
    }
  };

  /**
   * basic normalization of filepath
   */
  var getStorageFilePath = function(locale) {
    // changed API to use .json as default, #16
    var ext = extension || '.json',
      filepath = path.normalize(directory + pathsep + prefix + locale + ext),
      filepathJS = path.normalize(directory + pathsep + prefix + locale + '.js');
    // use .js as fallback if already existing
    try {
      if (fs.statSync(filepathJS)) {
        logDebug('using existing file ' + filepathJS);
        extension = '.js';
        return filepathJS;
      }
    } catch (e) {
      logDebug('will use ' + filepath);
    }
    return filepath;
  };

  /**
   * Logging proxies
   */
  function logDebug(msg) {
    logDebugFn(msg);
  }

  function logWarn(msg) {
    logWarnFn(msg);
  }

  function logError(msg) {
    logErrorFn(msg);
  }

  return i18n;

}());

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/* global window, exports, define */

!function() {
    'use strict'

    var re = {
        not_string: /[^s]/,
        not_bool: /[^t]/,
        not_type: /[^T]/,
        not_primitive: /[^v]/,
        number: /[diefg]/,
        numeric_arg: /[bcdiefguxX]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[+-]/
    }

    function sprintf(key) {
        // `arguments` is not an array, but should be fine for this call
        return sprintf_format(sprintf_parse(key), arguments)
    }

    function vsprintf(fmt, argv) {
        return sprintf.apply(null, [fmt].concat(argv || []))
    }

    function sprintf_format(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, arg, output = '', i, k, ph, pad, pad_character, pad_length, is_positive, sign
        for (i = 0; i < tree_length; i++) {
            if (typeof parse_tree[i] === 'string') {
                output += parse_tree[i]
            }
            else if (typeof parse_tree[i] === 'object') {
                ph = parse_tree[i] // convenience purposes only
                if (ph.keys) { // keyword argument
                    arg = argv[cursor]
                    for (k = 0; k < ph.keys.length; k++) {
                        if (arg == undefined) {
                            throw new Error(sprintf('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k-1]))
                        }
                        arg = arg[ph.keys[k]]
                    }
                }
                else if (ph.param_no) { // positional argument (explicit)
                    arg = argv[ph.param_no]
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++]
                }

                if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && arg instanceof Function) {
                    arg = arg()
                }

                if (re.numeric_arg.test(ph.type) && (typeof arg !== 'number' && isNaN(arg))) {
                    throw new TypeError(sprintf('[sprintf] expecting number but found %T', arg))
                }

                if (re.number.test(ph.type)) {
                    is_positive = arg >= 0
                }

                switch (ph.type) {
                    case 'b':
                        arg = parseInt(arg, 10).toString(2)
                        break
                    case 'c':
                        arg = String.fromCharCode(parseInt(arg, 10))
                        break
                    case 'd':
                    case 'i':
                        arg = parseInt(arg, 10)
                        break
                    case 'j':
                        arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0)
                        break
                    case 'e':
                        arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential()
                        break
                    case 'f':
                        arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg)
                        break
                    case 'g':
                        arg = ph.precision ? String(Number(arg.toPrecision(ph.precision))) : parseFloat(arg)
                        break
                    case 'o':
                        arg = (parseInt(arg, 10) >>> 0).toString(8)
                        break
                    case 's':
                        arg = String(arg)
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 't':
                        arg = String(!!arg)
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 'T':
                        arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 'u':
                        arg = parseInt(arg, 10) >>> 0
                        break
                    case 'v':
                        arg = arg.valueOf()
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 'x':
                        arg = (parseInt(arg, 10) >>> 0).toString(16)
                        break
                    case 'X':
                        arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase()
                        break
                }
                if (re.json.test(ph.type)) {
                    output += arg
                }
                else {
                    if (re.number.test(ph.type) && (!is_positive || ph.sign)) {
                        sign = is_positive ? '+' : '-'
                        arg = arg.toString().replace(re.sign, '')
                    }
                    else {
                        sign = ''
                    }
                    pad_character = ph.pad_char ? ph.pad_char === '0' ? '0' : ph.pad_char.charAt(1) : ' '
                    pad_length = ph.width - (sign + arg).length
                    pad = ph.width ? (pad_length > 0 ? pad_character.repeat(pad_length) : '') : ''
                    output += ph.align ? sign + arg + pad : (pad_character === '0' ? sign + pad + arg : pad + sign + arg)
                }
            }
        }
        return output
    }

    var sprintf_cache = Object.create(null)

    function sprintf_parse(fmt) {
        if (sprintf_cache[fmt]) {
            return sprintf_cache[fmt]
        }

        var _fmt = fmt, match, parse_tree = [], arg_names = 0
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree.push(match[0])
            }
            else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree.push('%')
            }
            else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1
                    var field_list = [], replacement_field = match[2], field_match = []
                    if ((field_match = re.key.exec(replacement_field)) !== null) {
                        field_list.push(field_match[1])
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1])
                            }
                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1])
                            }
                            else {
                                throw new SyntaxError('[sprintf] failed to parse named argument key')
                            }
                        }
                    }
                    else {
                        throw new SyntaxError('[sprintf] failed to parse named argument key')
                    }
                    match[2] = field_list
                }
                else {
                    arg_names |= 2
                }
                if (arg_names === 3) {
                    throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported')
                }

                parse_tree.push(
                    {
                        placeholder: match[0],
                        param_no:    match[1],
                        keys:        match[2],
                        sign:        match[3],
                        pad_char:    match[4],
                        align:       match[5],
                        width:       match[6],
                        precision:   match[7],
                        type:        match[8]
                    }
                )
            }
            else {
                throw new SyntaxError('[sprintf] unexpected placeholder')
            }
            _fmt = _fmt.substring(match[0].length)
        }
        return sprintf_cache[fmt] = parse_tree
    }

    /**
     * export to either browser or node.js
     */
    /* eslint-disable quote-props */
    if (true) {
        exports['sprintf'] = sprintf
        exports['vsprintf'] = vsprintf
    }
    if (typeof window !== 'undefined') {
        window['sprintf'] = sprintf
        window['vsprintf'] = vsprintf

        if (true) {
            !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
                return {
                    'sprintf': sprintf,
                    'vsprintf': vsprintf
                }
            }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
        }
    }
    /* eslint-enable quote-props */
}(); // eslint-disable-line


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __webpack_require__(10);
} else {
	module.exports = __webpack_require__(13);
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */
function log(...args) {
	// This hackery is required for IE8/9, where
	// the `console.log` function doesn't have 'apply'
	return typeof console === 'object' &&
		console.log &&
		console.log(...args);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(11)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(12);

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

const tty = __webpack_require__(14);
const util = __webpack_require__(15);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __webpack_require__(16);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __webpack_require__(11)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.replace(/\s*\n\s*/g, ' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("tty");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(17);
const hasFlag = __webpack_require__(18);

const env = process.env;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false')) {
	forceColor = false;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = true;
}
if ('FORCE_COLOR' in env) {
	forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(stream) {
	if (forceColor === false) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (stream && !stream.isTTY && forceColor !== true) {
		return 0;
	}

	const min = forceColor ? 1 : 0;

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	if (env.TERM === 'dumb') {
		return min;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = (flag, argv) => {
	argv = argv || process.argv;
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const pos = argv.indexOf(prefix + flag);
	const terminatorPos = argv.indexOf('--');
	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false Mustache: true*/

(function defineMustache (global, factory) {
  if ( true && exports && typeof exports.nodeName !== 'string') {
    factory(exports); // CommonJS
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
  } else {}
}(this, function mustacheFactory (mustache) {

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  /**
   * Safe way of detecting whether or not the given thing is a primitive and
   * whether it has the given property
   */
  function primitiveHasOwnProperty (primitive, propName) {  
    return (
      primitive != null
      && typeof primitive !== 'object'
      && primitive.hasOwnProperty
      && primitive.hasOwnProperty(propName)
    );
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, intermediateValue, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          intermediateValue = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           *
           * In the case where dot notation is used, we consider the lookup
           * to be successful even if the last "object" in the path is
           * not actually an object but a primitive (e.g., a string, or an
           * integer), because it is sometimes useful to access a property
           * of an autoboxed primitive, such as the length of a string.
           **/
          while (intermediateValue != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = (
                hasProperty(intermediateValue, names[index]) 
                || primitiveHasOwnProperty(intermediateValue, names[index])
              );

            intermediateValue = intermediateValue[names[index++]];
          }
        } else {
          intermediateValue = context.view[name];

          /**
           * Only checking against `hasProperty`, which always returns `false` if
           * `context.view` is not an object. Deliberately omitting the check
           * against `primitiveHasOwnProperty` if dot notation is not used.
           *
           * Consider this example:
           * ```
           * Mustache.render("The length of a football field is {{#length}}{{length}}{{/length}}.", {length: "100 yards"})
           * ```
           *
           * If we were to check also against `primitiveHasOwnProperty`, as we do
           * in the dot notation case, then render call would return:
           *
           * "The length of a football field is 9."
           *
           * rather than the expected:
           *
           * "The length of a football field is 100 yards."
           **/
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit) {
          value = intermediateValue;
          break;
        }

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` according to the given `tags` or
   * `mustache.tags` if `tags` is omitted,  and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.cache;
    var cacheKey = template + ':' + (tags || mustache.tags).join(':');
    var tokens = cache[cacheKey];

    if (tokens == null)
      tokens = cache[cacheKey] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   *
   * If the optional `tags` argument is given here it must be an array with two
   * string values: the opening and closing tags used in the template (e.g.
   * [ "<%", "%>" ]). The default is to mustache.tags.
   */
  Writer.prototype.render = function render (template, view, partials, tags) {
    var tokens = this.parse(template, tags);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template, tags);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate, tags) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, tags);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials, tags) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value, tags), context, partials, value);
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  mustache.name = 'mustache.js';
  mustache.version = '3.0.1';
  mustache.tags = [ '{{', '}}' ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer. If the optional `tags` argument is given here it must be an
   * array with two string values: the opening and closing tags used in the
   * template (e.g. [ "<%", "%>" ]). The default is to mustache.tags.
   */
  mustache.render = function render (template, view, partials, tags) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials, tags);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;
}));


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/** @file messageformat.js - ICU PluralFormat + SelectFormat for JavaScript
 *
 * @author Alex Sexton - @SlexAxton, Eemeli Aro
 * @version 0.3.1
 * @copyright 2012-2016 Alex Sexton, Eemeli Aro, and Contributors
 * @license To use or fork, MIT. To contribute back, Dojo CLA  */


/** Utility function for quoting an Object's key value iff required
 *
 * @private  */
function propname(key, obj) {
  /* Quote the key if it contains invalid characters or is an
   * ECMAScript 3rd Edition reserved word.
   */
  if (/^[A-Z_$][0-9A-Z_$]*$/i.test(key) &&
     ['break', 'continue', 'delete', 'else', 'for', 'function', 'if', 'in', 'new',
      'return', 'this', 'typeof', 'var', 'void', 'while', 'with', 'case', 'catch',
      'default', 'do', 'finally', 'instanceof', 'switch', 'throw', 'try'].indexOf(key) < 0) {
    return obj ? obj + '.' + key : key;
  } else {
    var jkey = JSON.stringify(key);
    return obj ? obj + '[' + jkey + ']' : jkey;
  }
}

/** Utility formatter function for enforcing Bidi Structured Text by using UCC
 *
 * @private  */
function bidiMarkText(text, locale) {
  function isLocaleRTL(locale) {
    /* list inlined from data extracted from CLDR v27 & v28
     * to verify/recreate, use the following:
     *   git clone https://github.com/unicode-cldr/cldr-misc-full.git
     *   cd cldr-misc-full/main/
     *   grep characterOrder -r . | tr '"/' '\t' | cut -f2,6 | grep -C4 right-to-left
     */
    var rtlLanguages = ['ar', 'ckb', 'fa', 'he', 'ks($|[^bfh])', 'lrc', 'mzn', 'pa-Arab', 'ps', 'ug', 'ur', 'uz-Arab', 'yi'];
    return new RegExp('^' + rtlLanguages.join('|^')).test(locale);
  }
  var mark = JSON.stringify(isLocaleRTL(locale) ? '\u200F' : '\u200E');
  return mark + ' + ' + text + ' + ' + mark;
}

/** Create a new message formatter
 *
 * @class
 * @param {string|string[]} [locale="en"] - The locale to use, with fallbacks
 * @param {function} [pluralFunc] - Optional custom pluralization function
 * @param {function[]} [formatters] - Optional custom formatting functions  */
function MessageFormat(locale, pluralFunc, formatters) {
  if (!locale) {
    this.lc = ['en'];
  } else if (typeof locale == 'string') {
    this.lc = [];
    for (var l = locale; l; l = l.replace(/[-_]?[^-_]*$/, '')) this.lc.push(l);
  } else {
    this.lc = locale;
  }
  if (!pluralFunc) {
    if (this.lc.every(function(l){
      pluralFunc = MessageFormat.plurals[l];
      return !pluralFunc;
    })) {
      throw new Error('Plural function for locale `' + this.lc.join(',') + '` not found');
    }
  }
  this.runtime = new Runtime(this.lc[0], pluralFunc, formatters);
}

module.exports = MessageFormat;


/** Parse an input string to its AST
 *
 *  Precompiled from `lib/messageformat-parser.pegjs` by
 *  {@link http://pegjs.org/ PEG.js}. Included in MessageFormat object
 *  to enable testing.
 *
 * @private  */
MessageFormat._parse = __webpack_require__(21).parse;


/** Pluralization functions from
 *  {@link http://github.com/eemeli/make-plural.js make-plural}
 *
 * @memberof MessageFormat
 * @type Object.<string,function>  */
MessageFormat.plurals = __webpack_require__(22);


/** Default number formatting functions in the style of ICU's
 *  {@link http://icu-project.org/apiref/icu4j/com/ibm/icu/text/MessageFormat.html simpleArg syntax}
 *  implemented using the
 *  {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl Intl}
 *  object defined by ECMA-402.
 *
 *  **Note**: Intl is not defined in default Node until 0.11.15 / 0.12.0, so
 *  earlier versions require a {@link https://www.npmjs.com/package/intl polyfill}.
 *  Therefore {@link MessageFormat.withIntlSupport} needs to be true for these
 *  functions to be available for inclusion in the output.
 *
 * @see MessageFormat#setIntlSupport
 *
 * @namespace
 * @memberof MessageFormat
 * @property {function} number - Represent a number as an integer, percent or currency value
 * @property {function} date - Represent a date as a full/long/default/short string
 * @property {function} time - Represent a time as a full/long/default/short string
 *
 * @example
 * var mf = new MessageFormat('en').setIntlSupport(true);
 * mf.currency = 'EUR';
 * var cf = mf.compile('The total is {V,number,currency}.');
 *
 * cf({ V: 5.5 })
 * // 'The total is €5.50.'
 *
 * @example
 * var mf = new MessageFormat('en', null, {number: MessageFormat.number});
 * mf.currency = 'EUR';
 * var cf = mf.compile('The total is {V,number,currency}.');
 *
 * cf({ V: 5.5 })
 * // 'The total is €5.50.'  */
MessageFormat.formatters = {
  number: function(self) {
    return new Function("v,lc,p",
      "return Intl.NumberFormat(lc,\n" +
      "    p=='integer' ? {maximumFractionDigits:0}\n" +
      "  : p=='percent' ? {style:'percent'}\n" +
      "  : p=='currency' ? {style:'currency', currency:'" + (self.currency || 'USD') + "', minimumFractionDigits:2, maximumFractionDigits:2}\n" +
      "  : {}).format(v)"
    );
  },
  date: function(v,lc,p) {
    var o = {day:'numeric', month:'short', year:'numeric'};
    switch (p) {
      case 'full': o.weekday = 'long';
      case 'long': o.month = 'long'; break;
      case 'short': o.month = 'numeric';
    }
    return (new Date(v)).toLocaleDateString(lc, o)
  },
  time: function(v,lc,p) {
    var o = {second:'numeric', minute:'numeric', hour:'numeric'};
    switch (p) {
      case 'full': case 'long': o.timeZoneName = 'short'; break;
      case 'short': delete o.minute;
    }
    return (new Date(v)).toLocaleTimeString(lc, o)
  }
};

/** Enable or disable the addition of Unicode control characters to all input
 *  to preserve the integrity of the output when mixing LTR and RTL text.
 *
 * @see http://cldr.unicode.org/development/development-process/design-proposals/bidi-handling-of-structured-text
 *
 * @memberof MessageFormat
 * @param {boolean} [enable=true]
 * @returns {MessageFormat} The MessageFormat instance, to allow for chaining
 *
 * @example
 * // upper case stands for RTL characters, output is shown as rendered
 * var mf = new MessageFormat('en');
 *
 * mf.compile('{0} >> {1} >> {2}')(['first', 'SECOND', 'THIRD']);
 * // 'first >> THIRD << SECOND'
 *
 * mf.setBiDiSupport(true);
 * mf.compile('{0} >> {1} >> {2}')(['first', 'SECOND', 'THIRD']);
 * // 'first >> SECOND >> THIRD'  */
MessageFormat.prototype.setBiDiSupport = function(enable) {
    this.bidiSupport = !!enable || (typeof enable == 'undefined');
    return this;
};


/** Enable or disable support for the default formatters, which require the
 *  `Intl` object. Note that this can't be autodetected, as the environment
 *  in which the formatted text is compiled into Javascript functions is not
 *  necessarily the same environment in which they will get executed.
 *
 * @see MessageFormat.formatters
 *
 * @memberof MessageFormat
 * @param {boolean} [enable=true]
 * @returns {MessageFormat} The MessageFormat instance, to allow for chaining
 *
 * @example
 * // Intl is not defined in default Node until 0.11.15 / 0.12.0
 * var Intl = require('intl');
 * var mf = new MessageFormat('en').setIntlSupport(true);
 * mf.currency = 'EUR';
 *
 * mf.compile('The total is {V,number,currency}.')({ V: 5.5 });
 * // 'The total is €5.50.'  */
MessageFormat.prototype.setIntlSupport = function(enable) {
    this.withIntlSupport = !!enable || (typeof enable == 'undefined');
    return this;
};


/** A set of utility functions that are called by the compiled Javascript
 *  functions, these are included locally in the output of {@link
 *  MessageFormat#compile compile()}.
 *
 * @class
 * @param {string} [locale] - The parsed locale
 * @param {function} [pluralFunc] - Pluralization function for the locale
 * @param {function[]} [formatters] - Optional custom formatting functions  */
function Runtime(locale, pluralFunc, formatters) {

  /** Pluralization functions included in compiled output
   *
   * @instance
   * @type Object.<string,function>  */
  this.pluralFuncs = {};
  this.pluralFuncs[locale] = pluralFunc;

  /** Custom formatting functions called by `{var, fn[, args]*}` syntax
   *
   *  For examples, see {@link MessageFormat.formatters}
   *
   * @instance
   * @see MessageFormat.formatters
   * @type Object.<string,function>  */
  this.fmt = {};
  if (formatters) for (var f in formatters) {
    this.fmt[f] = formatters[f];
  }
}

Runtime.prototype = {

  /** Utility function for `#` in plural rules
   *
   * @param {number} value - The value to operate on
   * @param {number} [offset=0] - An optional offset, set by the surrounding context  */
  number: function(value, offset) {
    if (isNaN(value)) throw new Error("'" + value + "' isn't a number.");
    return value - (offset || 0);
  },

  /** Utility function for `{N, plural|selectordinal, ...}`
   *
   * @param {number} value - The key to use to find a pluralization rule
   * @param {number} offset - An offset to apply to `value`
   * @param {function} lcfunc - A locale function from `pluralFuncs`
   * @param {Object.<string,string>} data - The object from which results are looked up
   * @param {?boolean} isOrdinal - If true, use ordinal rather than cardinal rules
   * @returns {string} The result of the pluralization  */
  plural: function(value, offset, lcfunc, data, isOrdinal) {
    if ({}.hasOwnProperty.call(data, value)) return data[value]();
    if (offset) value -= offset;
    var key = lcfunc(value, isOrdinal);
    if (key in data) return data[key]();
    return data.other();
  },

  /** Utility function for `{N, select, ...}`
   *
   * @param {number} value - The key to use to find a selection
   * @param {Object.<string,string>} data - The object from which results are looked up
   * @returns {string} The result of the select statement  */
  select: function(value, data) {
    if ({}.hasOwnProperty.call(data, value)) return data[value]();
    return data.other()
  },

  /** Custom stringifier
   *
   * @example
   * var mf = new MessageFormat('en');
   * console.log(mf.runtime.toString())
   * > var pluralFuncs = {
   * >   en: function (n, ord) {
   * >     var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
   * >         n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
   * >     if (ord) return (n10 == 1 && n100 != 11) ? 'one'
   * >         : (n10 == 2 && n100 != 12) ? 'two'
   * >         : (n10 == 3 && n100 != 13) ? 'few'
   * >         : 'other';
   * >     return (n == 1 && v0) ? 'one' : 'other';
   * >   }
   * > };
   * > var fmt = {};
   * > var number = function (value, offset) {
   * >   if (isNaN(value)) throw new Error("'" + value + "' isn't a number.");
   * >   return value - (offset || 0);
   * > };
   * > var plural = function (value, offset, lcfunc, data, isOrdinal) {
   * >   if ({}.hasOwnProperty.call(data, value)) return data[value]();
   * >   if (offset) value -= offset;
   * >   var key = lcfunc(value, isOrdinal);
   * >   if (key in data) return data[key]();
   * >   return data.other();
   * > };
   * > var select = function (value, data) {
   * >   if ({}.hasOwnProperty.call(data, value)) return data[value]();
   * >   return data.other()
   * > };  */
  toString: function () {
    var _stringify = function(o, level) {
      if (typeof o != 'object') {
        var funcStr = o.toString().replace(/^(function )\w*/, '$1');
        var indent = /([ \t]*)\S.*$/.exec(funcStr);
        return indent ? funcStr.replace(new RegExp('^' + indent[1], 'mg'), '') : funcStr;
      }
      var s = [];
      for (var i in o) if (i != 'toString') {
        if (level == 0) s.push('var ' + i + ' = ' + _stringify(o[i], level + 1) + ';\n');
        else s.push(propname(i) + ': ' + _stringify(o[i], level + 1));
      }
      if (level == 0) return s.join('');
      if (s.length == 0) return '{}';
      var indent = '  '; while (--level) indent += '  ';
      return '{\n' + s.join(',\n').replace(/^/gm, indent) + '\n}';
    };
    return _stringify(this, 0);
  }
};


/** Recursively map an AST to its resulting string
 *
 * @memberof MessageFormat
 * @param ast - the Ast node for which the JS code should be generated
 * @private  */
MessageFormat.prototype._precompile = function(ast, data) {
  data = data || { keys: {}, offset: {} };
  var r = [], i, tmp, args = [];

  switch ( ast.type ) {
    case 'messageFormatPattern':
      for ( i = 0; i < ast.statements.length; ++i ) {
        r.push(this._precompile( ast.statements[i], data ));
      }
      tmp = r.join(' + ') || '""';
      return data.pf_count ? tmp : 'function(d) { return ' + tmp + '; }';

    case 'messageFormatElement':
      data.pf_count = data.pf_count || 0;
      if ( ast.output ) {
        var ret = propname(ast.argumentIndex, 'd');
        return this.bidiSupport ? bidiMarkText(ret, this.lc) : ret;
      }
      else {
        data.keys[data.pf_count] = ast.argumentIndex;
        return this._precompile( ast.elementFormat, data );
      }
      return '';

    case 'elementFormat':
      args = [ propname(data.keys[data.pf_count], 'd') ];
      switch (ast.key) {
        case 'select':
          args.push(this._precompile(ast.val, data));
          return 'select(' + args.join(', ') + ')';
        case 'selectordinal':
          args = args.concat([ 0, propname(this.lc[0], 'pluralFuncs'), this._precompile(ast.val, data), 1 ]);
          return 'plural(' + args.join(', ') + ')';
        case 'plural':
          data.offset[data.pf_count || 0] = ast.val.offset || 0;
          args = args.concat([ data.offset[data.pf_count] || 0, propname(this.lc[0], 'pluralFuncs'), this._precompile(ast.val, data) ]);
          return 'plural(' + args.join(', ') + ')';
        default:
          if (this.withIntlSupport && !(ast.key in this.runtime.fmt) && (ast.key in MessageFormat.formatters)) {
            tmp = MessageFormat.formatters[ast.key];
            this.runtime.fmt[ast.key] = (typeof tmp(this) == 'function') ? tmp(this) : tmp;
          }
          args.push(JSON.stringify(this.lc));
          if (ast.val && ast.val.length) args.push(JSON.stringify(ast.val.length == 1 ? ast.val[0] : ast.val));
          return 'fmt.' + ast.key + '(' + args.join(', ') + ')';
      }

    case 'pluralFormatPattern':
    case 'selectFormatPattern':
      data.pf_count = data.pf_count || 0;
      if (ast.type == 'selectFormatPattern') data.offset[data.pf_count] = 0;
      var needOther = true;
      for (i = 0; i < ast.pluralForms.length; ++i) {
        var key = ast.pluralForms[i].key;
        if (key === 'other') needOther = false;
        var data_copy = JSON.parse(JSON.stringify(data));
        data_copy.pf_count++;
        r.push(propname(key) + ': function() { return ' + this._precompile(ast.pluralForms[i].val, data_copy) + ';}');
      }
      if (needOther) throw new Error("No 'other' form found in " + ast.type + " " + data.pf_count);
      return '{ ' + r.join(', ') + ' }';

    case 'string':
      return JSON.stringify(ast.val || "");

    case 'octothorpe':
      if (!data.pf_count) return '"#"';
      args = [ propname(data.keys[data.pf_count-1], 'd') ];
      if (data.offset[data.pf_count-1]) args.push(data.offset[data.pf_count-1]);
      return 'number(' + args.join(', ') + ')';

    default:
      throw new Error( 'Bad AST type: ' + ast.type );
  }
};

/** Compile messages into an executable function with clean string
 *  representation.
 *
 *  If `messages` is a single string including ICU MessageFormat declarations,
 *  `opt` is ignored and the returned function takes a single Object parameter
 *  `d` representing each of the input's defined variables. The returned
 *  function will be defined in a local scope that includes all the required
 *  runtime variables.
 *
 *  If `messages` is a map of keys to strings, or a map of namespace keys to
 *  such key/string maps, the returned function will fill the specified global
 *  with javascript functions matching the structure of the input. In such use,
 *  the result of `compile()` may be serialized using its `toString()` method,
 *  including all required runtime function definitions. If `opt.global` is
 *  null, calling the output function will return the object itself.
 *
 *  Together, the input parameters should match the following patterns:
 *  ```js
 *  messages = "string" || { key0: "string0", key1: "string1", ... } || {
 *    ns0: { key0: "string0", key1: "string1", ...  },
 *    ns1: { key0: "string0", key1: "string1", ...  },
 *    ...
 *  }
 *
 *  opt = null || {
 *    locale: null || {
 *      ns0: "lc0" || [ "lc0", ... ],
 *      ns1: "lc1" || [ "lc1", ... ],
 *      ...
 *    },
 *    global: null || "module.exports" || "exports" || "i18n" || ...
 *  }
 *  ```
 *
 * @memberof MessageFormat
 * @param {string|Object}
 *     messages - The input message(s) to be compiled, in ICU MessageFormat
 * @param {Object} [opt={}] - Options controlling output for non-simple intput
 * @param {Object} [opt.locale] - The locales to use for the messages, with a
 *     structure matching that of `messages`
 * @param {string} [opt.global=""] - The global variable that the output
 *     function should use, or a null string for none. "exports" and
 *     "module.exports" are recognised as special cases.
 * @returns {function} The first match found for the given locale(s)
 *
 * @example
 * var mf = new MessageFormat('en');
 * var cf = mf.compile('A {TYPE} example.');
 *
 * cf({ TYPE: 'simple' })
 * // 'A simple example.'
 *
 * cf.toString()
 * // 'function (d) { return "A " + d.TYPE + " example."; }'
 *
 * @example
 * var fs = require('fs');
 * var mf = new MessageFormat('en');
 * var msgSet = {
 *   a: 'A {TYPE} example.',
 *   b: 'This has {COUNT, plural, one{one member} other{# members}}.'
 * };
 * var cfSet = mf.compile(msgSet, { global: 'module.exports' });
 * var str = cfSet.toString().replace(/^[^{]*{/, '').replace(/}\s*$/, '').trim();
 * fs.writeFileSync('messages.js', str);
 * ...
 * var messages = require('./messages');
 *
 * messages.a({ TYPE: 'more complex' })
 * // 'A more complex example.'
 *
 * messages.b({ COUNT: 2 })
 * // 'This has 2 members.'
 *
 * @example
 * var mf = new MessageFormat('en');
 * mf.runtime.pluralFuncs.fi = MessageFormat.plurals.fi;
 * mf.compile({
 *   en: { a: 'A {TYPE} example.',
 *         b: 'This is the {COUNT, selectordinal, one{#st} two{#nd} few{#rd} other{#th}} example.' },
 *   fi: { a: '{TYPE} esimerkki.',
 *         b: 'Tämä on {COUNT, selectordinal, other{#.}} esimerkki.' }
 * }, {
 *   locale: { en: 'en', fi: 'fi' },
 *   global: 'i18n'
 * })(this);
 *
 * i18n.en.b({ COUNT: 3 })
 * // 'This is the 3rd example.'
 *
 * i18n.fi.b({ COUNT: 3 })
 * // 'Tämä on 3. esimerkki.'  */
MessageFormat.prototype.compile = function ( messages, opt ) {
  var r = {}, lc0 = this.lc,
      compileMsg = function(self, msg) {
        try {
          var ast = MessageFormat._parse(msg);
          return self._precompile(ast);
        } catch (e) {
          throw new Error((ast ? 'Precompiler' : 'Parser') + ' error: ' + e.toString());
        }
      },
      stringify = function(r, level) {
        if (!level) level = 0;
        if (typeof r != 'object') return r;
        var o = [], indent = '';
        for (var i = 0; i < level; ++i) indent += '  ';
        for (var k in r) o.push('\n' + indent + '  ' + propname(k) + ': ' + stringify(r[k], level + 1));
        return '{' + o.join(',') + '\n' + indent + '}';
      };

  if (typeof messages == 'string') {
    var f = new Function(
        'number, plural, select, pluralFuncs, fmt',
        'return ' + compileMsg(this, messages));
    return f(this.runtime.number, this.runtime.plural, this.runtime.select,
        this.runtime.pluralFuncs, this.runtime.fmt);
  }

  opt = opt || {};

  for (var ns in messages) {
    if (opt.locale) this.lc = opt.locale[ns] && [].concat(opt.locale[ns]) || lc0;
    if (typeof messages[ns] == 'string') {
      try { r[ns] = compileMsg(this, messages[ns]); }
      catch (e) { e.message = e.message.replace(':', ' with `' + ns + '`:'); throw e; }
    } else {
      r[ns] = {};
      for (var key in messages[ns]) {
        try { r[ns][key] = compileMsg(this, messages[ns][key]); }
        catch (e) { e.message = e.message.replace(':', ' with `' + key + '` in `' + ns + '`:'); throw e; }
      }
    }
  }

  this.lc = lc0;
  var s = this.runtime.toString() + '\n';
  switch (opt.global || '') {
    case 'exports':
      var o = [];
      for (var k in r) o.push(propname(k, 'exports') + ' = ' + stringify(r[k]));
      return new Function(s + o.join(';\n'));
    case 'module.exports':
      return new Function(s + 'module.exports = ' + stringify(r));
    case '':
      return new Function(s + 'return ' + stringify(r));
    default:
      return new Function('G', s + propname(opt.global, 'G') + ' = ' + stringify(r));
  }
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = (function() {
  "use strict";

  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        parser  = this,

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = function(st) {
              return { type: 'messageFormatPattern', statements: st };
            },
        peg$c1 = "{",
        peg$c2 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c3 = ",",
        peg$c4 = { type: "literal", value: ",", description: "\",\"" },
        peg$c5 = "}",
        peg$c6 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c7 = function(argIdx, efmt) {
              var res = {
                type: "messageFormatElement",
                argumentIndex: argIdx
              };
              if (efmt && efmt.length) {
                res.elementFormat = efmt[1];
              } else {
                res.output = true;
              }
              return res;
            },
        peg$c8 = "plural",
        peg$c9 = { type: "literal", value: "plural", description: "\"plural\"" },
        peg$c10 = function(t, s) {
              return { type: "elementFormat", key: t, val: s };
            },
        peg$c11 = "selectordinal",
        peg$c12 = { type: "literal", value: "selectordinal", description: "\"selectordinal\"" },
        peg$c13 = "select",
        peg$c14 = { type: "literal", value: "select", description: "\"select\"" },
        peg$c15 = function(t, p) {
              return { type: "elementFormat", key: t, val: p };
            },
        peg$c16 = function(op, pf) {
              return { type: "pluralFormatPattern", pluralForms: pf, offset: op || 0 };
            },
        peg$c17 = "offset",
        peg$c18 = { type: "literal", value: "offset", description: "\"offset\"" },
        peg$c19 = ":",
        peg$c20 = { type: "literal", value: ":", description: "\":\"" },
        peg$c21 = function(d) { return d; },
        peg$c22 = function(k, mfp) {
              return { key: k, val: mfp };
            },
        peg$c23 = function(i) { return i; },
        peg$c24 = "=",
        peg$c25 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c26 = function(pf) { return { type: "selectFormatPattern", pluralForms: pf }; },
        peg$c27 = function(p) { return p; },
        peg$c28 = "#",
        peg$c29 = { type: "literal", value: "#", description: "\"#\"" },
        peg$c30 = function() { return {type: 'octothorpe'}; },
        peg$c31 = function(s) { return { type: "string", val: s.join('') }; },
        peg$c32 = { type: "other", description: "identifier" },
        peg$c33 = /^[0-9a-zA-Z$_]/,
        peg$c34 = { type: "class", value: "[0-9a-zA-Z$_]", description: "[0-9a-zA-Z$_]" },
        peg$c35 = /^[^ \t\n\r,.+={}]/,
        peg$c36 = { type: "class", value: "[^ \\t\\n\\r,.+={}]", description: "[^ \\t\\n\\r,.+={}]" },
        peg$c37 = function(s) { return s; },
        peg$c38 = function(chars) { return chars.join(''); },
        peg$c39 = /^[^{}#\\\0-\x1F \t\n\r]/,
        peg$c40 = { type: "class", value: "[^{}#\\\\\\0-\\x1F\\x7f \\t\\n\\r]", description: "[^{}#\\\\\\0-\\x1F\\x7f \\t\\n\\r]" },
        peg$c41 = function(x) { return x; },
        peg$c42 = "\\\\",
        peg$c43 = { type: "literal", value: "\\\\", description: "\"\\\\\\\\\"" },
        peg$c44 = function() { return "\\"; },
        peg$c45 = "\\#",
        peg$c46 = { type: "literal", value: "\\#", description: "\"\\\\#\"" },
        peg$c47 = function() { return "#"; },
        peg$c48 = "\\{",
        peg$c49 = { type: "literal", value: "\\{", description: "\"\\\\{\"" },
        peg$c50 = function() { return "\u007B"; },
        peg$c51 = "\\}",
        peg$c52 = { type: "literal", value: "\\}", description: "\"\\\\}\"" },
        peg$c53 = function() { return "\u007D"; },
        peg$c54 = "\\u",
        peg$c55 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },
        peg$c56 = function(h1, h2, h3, h4) {
              return String.fromCharCode(parseInt("0x" + h1 + h2 + h3 + h4));
            },
        peg$c57 = /^[0-9]/,
        peg$c58 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c59 = function(ds) {
            //the number might start with 0 but must not be interpreted as an octal number
            //Hence, the base is passed to parseInt explicitely
            return parseInt((ds.join('')), 10);
          },
        peg$c60 = /^[0-9a-fA-F]/,
        peg$c61 = { type: "class", value: "[0-9a-fA-F]", description: "[0-9a-fA-F]" },
        peg$c62 = { type: "other", description: "whitespace" },
        peg$c63 = function(w) { return w.join(''); },
        peg$c64 = /^[ \t\n\r]/,
        peg$c65 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function error(message) {
      throw peg$buildException(
        message,
        null,
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p, ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parsestart() {
      var s0;

      s0 = peg$parsemessageFormatPattern();

      return s0;
    }

    function peg$parsemessageFormatPattern() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsemessageFormatElement();
      if (s2 === peg$FAILED) {
        s2 = peg$parsestring();
        if (s2 === peg$FAILED) {
          s2 = peg$parseoctothorpe();
        }
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsemessageFormatElement();
        if (s2 === peg$FAILED) {
          s2 = peg$parsestring();
          if (s2 === peg$FAILED) {
            s2 = peg$parseoctothorpe();
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c0(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsemessageFormatElement() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c1;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c2); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseid();
          if (s3 !== peg$FAILED) {
            s4 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 44) {
              s5 = peg$c3;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c4); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parseelementFormat();
              if (s6 !== peg$FAILED) {
                s5 = [s5, s6];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 125) {
                  s6 = peg$c5;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c6); }
                }
                if (s6 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c7(s3, s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseelementFormat() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 6) === peg$c8) {
          s2 = peg$c8;
          peg$currPos += 6;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c9); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s4 = peg$c3;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c4); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsepluralFormatPattern();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c10(s2, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
          if (input.substr(peg$currPos, 13) === peg$c11) {
            s2 = peg$c11;
            peg$currPos += 13;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c12); }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parse_();
            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 44) {
                s4 = peg$c3;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c4); }
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parse_();
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsepluralFormatPattern();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parse_();
                    if (s7 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c10(s2, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            if (input.substr(peg$currPos, 6) === peg$c13) {
              s2 = peg$c13;
              peg$currPos += 6;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c14); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parse_();
              if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 44) {
                  s4 = peg$c3;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c4); }
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$parse_();
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parseselectFormatPattern();
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parse_();
                      if (s7 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c10(s2, s6);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse_();
            if (s1 !== peg$FAILED) {
              s2 = peg$parseid();
              if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parseargStylePattern();
                while (s4 !== peg$FAILED) {
                  s3.push(s4);
                  s4 = peg$parseargStylePattern();
                }
                if (s3 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c15(s2, s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          }
        }
      }

      return s0;
    }

    function peg$parsepluralFormatPattern() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseoffsetPattern();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsepluralForm();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parsepluralForm();
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c16(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseoffsetPattern() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 6) === peg$c17) {
          s2 = peg$c17;
          peg$currPos += 6;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c18); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 58) {
              s4 = peg$c19;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c20); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsedigits();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c21(s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsepluralForm() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsepluralKey();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 123) {
              s4 = peg$c1;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c2); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsemessageFormatPattern();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s8 = peg$c5;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c6); }
                    }
                    if (s8 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c22(s2, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsepluralKey() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseid();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c23(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 61) {
          s1 = peg$c24;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c25); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsedigits();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c21(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseselectFormatPattern() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseselectForm();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseselectForm();
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c26(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseselectForm() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseid();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 123) {
              s4 = peg$c1;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c2); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsemessageFormatPattern();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s8 = peg$c5;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c6); }
                    }
                    if (s8 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c22(s2, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseargStylePattern() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 44) {
          s2 = peg$c3;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c4); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseid();
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c27(s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseoctothorpe() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 35) {
        s1 = peg$c28;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c29); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c30();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsestring() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsechars();
      if (s2 === peg$FAILED) {
        s2 = peg$parsewhitespace();
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsechars();
          if (s2 === peg$FAILED) {
            s2 = peg$parsewhitespace();
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c31(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseid() {
      var s0, s1, s2, s3, s4, s5, s6;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$currPos;
        if (peg$c33.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c34); }
        }
        if (s4 !== peg$FAILED) {
          s5 = [];
          if (peg$c35.test(input.charAt(peg$currPos))) {
            s6 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s6 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c36); }
          }
          while (s6 !== peg$FAILED) {
            s5.push(s6);
            if (peg$c35.test(input.charAt(peg$currPos))) {
              s6 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c36); }
            }
          }
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          s2 = input.substring(s2, peg$currPos);
        } else {
          s2 = s3;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c37(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }

      return s0;
    }

    function peg$parsechars() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsechar();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsechar();
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c38(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsechar() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (peg$c39.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c40); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c41(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c42) {
          s1 = peg$c42;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c43); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c44();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c45) {
            s1 = peg$c45;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c46); }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c47();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c48) {
              s1 = peg$c48;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c49); }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c50();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c51) {
                s1 = peg$c51;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c52); }
              }
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c53();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c54) {
                  s1 = peg$c54;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c55); }
                }
                if (s1 !== peg$FAILED) {
                  s2 = peg$parsehexDigit();
                  if (s2 !== peg$FAILED) {
                    s3 = peg$parsehexDigit();
                    if (s3 !== peg$FAILED) {
                      s4 = peg$parsehexDigit();
                      if (s4 !== peg$FAILED) {
                        s5 = peg$parsehexDigit();
                        if (s5 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c56(s2, s3, s4, s5);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsedigits() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c57.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c58); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c57.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c58); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c59(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsehexDigit() {
      var s0;

      if (peg$c60.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c61); }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsewhitespace();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsewhitespace();
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c63(s1);
      }
      s0 = s1;
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c62); }
      }

      return s0;
    }

    function peg$parsewhitespace() {
      var s0;

      if (peg$c64.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c65); }
      }

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var _cp = [
function(n, ord) {
  if (ord) return 'other';
  return 'other';
},
function(n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},
function(n, ord) {
  if (ord) return 'other';
  return ((n == 0
          || n == 1)) ? 'one' : 'other';
},
function(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}
];

(function (root, plurals) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (plurals),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, {
af: _cp[1],

ak: _cp[2],

am: function(n, ord) {
  if (ord) return 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

ar: function(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n,
      n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return (n == 0) ? 'zero'
      : (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : ((n100 >= 3 && n100 <= 10)) ? 'few'
      : ((n100 >= 11 && n100 <= 99)) ? 'many'
      : 'other';
},

as: function(n, ord) {
  if (ord) return ((n == 1 || n == 5 || n == 7 || n == 8 || n == 9
          || n == 10)) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

asa: _cp[1],

ast: _cp[3],

az: function(n, ord) {
  var s = String(n).split('.'), i = s[0], i10 = i.slice(-1),
      i100 = i.slice(-2), i1000 = i.slice(-3);
  if (ord) return ((i10 == 1 || i10 == 2 || i10 == 5 || i10 == 7 || i10 == 8)
          || (i100 == 20 || i100 == 50 || i100 == 70
          || i100 == 80)) ? 'one'
      : ((i10 == 3 || i10 == 4) || (i1000 == 100 || i1000 == 200
          || i1000 == 300 || i1000 == 400 || i1000 == 500 || i1000 == 600 || i1000 == 700
          || i1000 == 800
          || i1000 == 900)) ? 'few'
      : (i == 0 || i10 == 6 || (i100 == 40 || i100 == 60
          || i100 == 90)) ? 'many'
      : 'other';
  return (n == 1) ? 'one' : 'other';
},

be: function(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return ((n10 == 2
          || n10 == 3) && n100 != 12 && n100 != 13) ? 'few' : 'other';
  return (n10 == 1 && n100 != 11) ? 'one'
      : ((n10 >= 2 && n10 <= 4) && (n100 < 12
          || n100 > 14)) ? 'few'
      : (t0 && n10 == 0 || (n10 >= 5 && n10 <= 9)
          || (n100 >= 11 && n100 <= 14)) ? 'many'
      : 'other';
},

bem: _cp[1],

bez: _cp[1],

bg: _cp[1],

bh: _cp[2],

bm: _cp[0],

bn: function(n, ord) {
  if (ord) return ((n == 1 || n == 5 || n == 7 || n == 8 || n == 9
          || n == 10)) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

bo: _cp[0],

br: function(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2),
      n1000000 = t0 && s[0].slice(-6);
  if (ord) return 'other';
  return (n10 == 1 && n100 != 11 && n100 != 71 && n100 != 91) ? 'one'
      : (n10 == 2 && n100 != 12 && n100 != 72 && n100 != 92) ? 'two'
      : (((n10 == 3 || n10 == 4) || n10 == 9) && (n100 < 10
          || n100 > 19) && (n100 < 70 || n100 > 79) && (n100 < 90
          || n100 > 99)) ? 'few'
      : (n != 0 && t0 && n1000000 == 0) ? 'many'
      : 'other';
},

brx: _cp[1],

bs: function(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1],
      i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return (v0 && i10 == 1 && i100 != 11
          || f10 == 1 && f100 != 11) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14)
          || (f10 >= 2 && f10 <= 4) && (f100 < 12
          || f100 > 14)) ? 'few'
      : 'other';
},

ca: function(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return ((n == 1
          || n == 3)) ? 'one'
      : (n == 2) ? 'two'
      : (n == 4) ? 'few'
      : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

ce: _cp[1],

cgg: _cp[1],

chr: _cp[1],

ckb: _cp[1],

cs: function(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one'
      : ((i >= 2 && i <= 4) && v0) ? 'few'
      : (!v0) ? 'many'
      : 'other';
},

cy: function(n, ord) {
  if (ord) return ((n == 0 || n == 7 || n == 8
          || n == 9)) ? 'zero'
      : (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : ((n == 3
          || n == 4)) ? 'few'
      : ((n == 5
          || n == 6)) ? 'many'
      : 'other';
  return (n == 0) ? 'zero'
      : (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : (n == 3) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
},

da: function(n, ord) {
  var s = String(n).split('.'), i = s[0], t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return (n == 1 || !t0 && (i == 0
          || i == 1)) ? 'one' : 'other';
},

de: _cp[3],

dsb: function(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1],
      i100 = i.slice(-2), f100 = f.slice(-2);
  if (ord) return 'other';
  return (v0 && i100 == 1
          || f100 == 1) ? 'one'
      : (v0 && i100 == 2
          || f100 == 2) ? 'two'
      : (v0 && (i100 == 3 || i100 == 4) || (f100 == 3
          || f100 == 4)) ? 'few'
      : 'other';
},

dv: _cp[1],

dz: _cp[0],

ee: _cp[1],

el: _cp[1],

en: function(n, ord) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return (n10 == 1 && n100 != 11) ? 'one'
      : (n10 == 2 && n100 != 12) ? 'two'
      : (n10 == 3 && n100 != 13) ? 'few'
      : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

eo: _cp[1],

es: _cp[1],

et: _cp[3],

eu: _cp[1],

fa: function(n, ord) {
  if (ord) return 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

ff: function(n, ord) {
  if (ord) return 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
},

fi: _cp[3],

fil: function(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1],
      i10 = i.slice(-1), f10 = f.slice(-1);
  if (ord) return (n == 1) ? 'one' : 'other';
  return (v0 && (i == 1 || i == 2 || i == 3)
          || v0 && i10 != 4 && i10 != 6 && i10 != 9
          || !v0 && f10 != 4 && f10 != 6 && f10 != 9) ? 'one' : 'other';
},

fo: _cp[1],

fr: function(n, ord) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
},

fur: _cp[1],

fy: _cp[3],

ga: function(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : ((t0 && n >= 3 && n <= 6)) ? 'few'
      : ((t0 && n >= 7 && n <= 10)) ? 'many'
      : 'other';
},

gd: function(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return ((n == 1
          || n == 11)) ? 'one'
      : ((n == 2
          || n == 12)) ? 'two'
      : (((t0 && n >= 3 && n <= 10)
          || (t0 && n >= 13 && n <= 19))) ? 'few'
      : 'other';
},

gl: _cp[3],

gsw: _cp[1],

gu: function(n, ord) {
  if (ord) return (n == 1) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

guw: _cp[2],

gv: function(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i10 = i.slice(-1),
      i100 = i.slice(-2);
  if (ord) return 'other';
  return (v0 && i10 == 1) ? 'one'
      : (v0 && i10 == 2) ? 'two'
      : (v0 && (i100 == 0 || i100 == 20 || i100 == 40 || i100 == 60
          || i100 == 80)) ? 'few'
      : (!v0) ? 'many'
      : 'other';
},

ha: _cp[1],

haw: _cp[1],

he: function(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1);
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one'
      : (i == 2 && v0) ? 'two'
      : (v0 && (n < 0
          || n > 10) && t0 && n10 == 0) ? 'many'
      : 'other';
},

hi: function(n, ord) {
  if (ord) return (n == 1) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

hr: function(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1],
      i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return (v0 && i10 == 1 && i100 != 11
          || f10 == 1 && f100 != 11) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14)
          || (f10 >= 2 && f10 <= 4) && (f100 < 12
          || f100 > 14)) ? 'few'
      : 'other';
},

hsb: function(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1],
      i100 = i.slice(-2), f100 = f.slice(-2);
  if (ord) return 'other';
  return (v0 && i100 == 1
          || f100 == 1) ? 'one'
      : (v0 && i100 == 2
          || f100 == 2) ? 'two'
      : (v0 && (i100 == 3 || i100 == 4) || (f100 == 3
          || f100 == 4)) ? 'few'
      : 'other';
},

hu: function(n, ord) {
  if (ord) return ((n == 1
          || n == 5)) ? 'one' : 'other';
  return (n == 1) ? 'one' : 'other';
},

hy: function(n, ord) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
},

id: _cp[0],

ig: _cp[0],

ii: _cp[0],

"in": _cp[0],

is: function(n, ord) {
  var s = String(n).split('.'), i = s[0], t0 = Number(s[0]) == n,
      i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return 'other';
  return (t0 && i10 == 1 && i100 != 11
          || !t0) ? 'one' : 'other';
},

it: function(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return ((n == 11 || n == 8 || n == 80
          || n == 800)) ? 'many' : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

iu: function(n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

iw: function(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1);
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one'
      : (i == 2 && v0) ? 'two'
      : (v0 && (n < 0
          || n > 10) && t0 && n10 == 0) ? 'many'
      : 'other';
},

ja: _cp[0],

jbo: _cp[0],

jgo: _cp[1],

ji: _cp[3],

jmc: _cp[1],

jv: _cp[0],

jw: _cp[0],

ka: function(n, ord) {
  var s = String(n).split('.'), i = s[0], i100 = i.slice(-2);
  if (ord) return (i == 1) ? 'one'
      : (i == 0 || ((i100 >= 2 && i100 <= 20) || i100 == 40 || i100 == 60
          || i100 == 80)) ? 'many'
      : 'other';
  return (n == 1) ? 'one' : 'other';
},

kab: function(n, ord) {
  if (ord) return 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
},

kaj: _cp[1],

kcg: _cp[1],

kde: _cp[0],

kea: _cp[0],

kk: function(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1);
  if (ord) return (n10 == 6 || n10 == 9
          || t0 && n10 == 0 && n != 0) ? 'many' : 'other';
  return (n == 1) ? 'one' : 'other';
},

kkj: _cp[1],

kl: _cp[1],

km: _cp[0],

kn: function(n, ord) {
  if (ord) return 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

ko: _cp[0],

ks: _cp[1],

ksb: _cp[1],

ksh: function(n, ord) {
  if (ord) return 'other';
  return (n == 0) ? 'zero'
      : (n == 1) ? 'one'
      : 'other';
},

ku: _cp[1],

kw: function(n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

ky: _cp[1],

lag: function(n, ord) {
  var s = String(n).split('.'), i = s[0];
  if (ord) return 'other';
  return (n == 0) ? 'zero'
      : ((i == 0
          || i == 1) && n != 0) ? 'one'
      : 'other';
},

lb: _cp[1],

lg: _cp[1],

lkt: _cp[0],

ln: _cp[2],

lo: function(n, ord) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return 'other';
},

lt: function(n, ord) {
  var s = String(n).split('.'), f = s[1] || '', t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return (n10 == 1 && (n100 < 11
          || n100 > 19)) ? 'one'
      : ((n10 >= 2 && n10 <= 9) && (n100 < 11
          || n100 > 19)) ? 'few'
      : (f != 0) ? 'many'
      : 'other';
},

lv: function(n, ord) {
  var s = String(n).split('.'), f = s[1] || '', v = f.length,
      t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1),
      n100 = t0 && s[0].slice(-2), f100 = f.slice(-2), f10 = f.slice(-1);
  if (ord) return 'other';
  return (t0 && n10 == 0 || (n100 >= 11 && n100 <= 19)
          || v == 2 && (f100 >= 11 && f100 <= 19)) ? 'zero'
      : (n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11
          || v != 2 && f10 == 1) ? 'one'
      : 'other';
},

mas: _cp[1],

mg: _cp[2],

mgo: _cp[1],

mk: function(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1],
      i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1);
  if (ord) return (i10 == 1 && i100 != 11) ? 'one'
      : (i10 == 2 && i100 != 12) ? 'two'
      : ((i10 == 7
          || i10 == 8) && i100 != 17 && i100 != 18) ? 'many'
      : 'other';
  return (v0 && i10 == 1
          || f10 == 1) ? 'one' : 'other';
},

ml: _cp[1],

mn: _cp[1],

mo: function(n, ord) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
      n100 = t0 && s[0].slice(-2);
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n == 1 && v0) ? 'one'
      : (!v0 || n == 0
          || n != 1 && (n100 >= 1 && n100 <= 19)) ? 'few'
      : 'other';
},

mr: function(n, ord) {
  if (ord) return (n == 1) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

ms: function(n, ord) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return 'other';
},

mt: function(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n,
      n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 0
          || (n100 >= 2 && n100 <= 10)) ? 'few'
      : ((n100 >= 11 && n100 <= 19)) ? 'many'
      : 'other';
},

my: _cp[0],

nah: _cp[1],

naq: function(n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

nb: _cp[1],

nd: _cp[1],

ne: function(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return ((t0 && n >= 1 && n <= 4)) ? 'one' : 'other';
  return (n == 1) ? 'one' : 'other';
},

nl: _cp[3],

nn: _cp[1],

nnh: _cp[1],

no: _cp[1],

nqo: _cp[0],

nr: _cp[1],

nso: _cp[2],

ny: _cp[1],

nyn: _cp[1],

om: _cp[1],

or: _cp[1],

os: _cp[1],

pa: _cp[2],

pap: _cp[1],

pl: function(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i10 = i.slice(-1),
      i100 = i.slice(-2);
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12
          || i100 > 14)) ? 'few'
      : (v0 && i != 1 && (i10 == 0 || i10 == 1)
          || v0 && (i10 >= 5 && i10 <= 9)
          || v0 && (i100 >= 12 && i100 <= 14)) ? 'many'
      : 'other';
},

prg: function(n, ord) {
  var s = String(n).split('.'), f = s[1] || '', v = f.length,
      t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1),
      n100 = t0 && s[0].slice(-2), f100 = f.slice(-2), f10 = f.slice(-1);
  if (ord) return 'other';
  return (t0 && n10 == 0 || (n100 >= 11 && n100 <= 19)
          || v == 2 && (f100 >= 11 && f100 <= 19)) ? 'zero'
      : (n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11
          || v != 2 && f10 == 1) ? 'one'
      : 'other';
},

ps: _cp[1],

pt: function(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return ((t0 && n >= 0 && n <= 2) && n != 2) ? 'one' : 'other';
},

"pt-PT": _cp[3],

rm: _cp[1],

ro: function(n, ord) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
      n100 = t0 && s[0].slice(-2);
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n == 1 && v0) ? 'one'
      : (!v0 || n == 0
          || n != 1 && (n100 >= 1 && n100 <= 19)) ? 'few'
      : 'other';
},

rof: _cp[1],

root: _cp[0],

ru: function(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i10 = i.slice(-1),
      i100 = i.slice(-2);
  if (ord) return 'other';
  return (v0 && i10 == 1 && i100 != 11) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12
          || i100 > 14)) ? 'few'
      : (v0 && i10 == 0 || v0 && (i10 >= 5 && i10 <= 9)
          || v0 && (i100 >= 11 && i100 <= 14)) ? 'many'
      : 'other';
},

rwk: _cp[1],

sah: _cp[0],

saq: _cp[1],

sdh: _cp[1],

se: function(n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

seh: _cp[1],

ses: _cp[0],

sg: _cp[0],

sh: function(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1],
      i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return (v0 && i10 == 1 && i100 != 11
          || f10 == 1 && f100 != 11) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14)
          || (f10 >= 2 && f10 <= 4) && (f100 < 12
          || f100 > 14)) ? 'few'
      : 'other';
},

shi: function(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return (n >= 0 && n <= 1) ? 'one'
      : ((t0 && n >= 2 && n <= 10)) ? 'few'
      : 'other';
},

si: function(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '';
  if (ord) return 'other';
  return ((n == 0 || n == 1)
          || i == 0 && f == 1) ? 'one' : 'other';
},

sk: function(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one'
      : ((i >= 2 && i <= 4) && v0) ? 'few'
      : (!v0) ? 'many'
      : 'other';
},

sl: function(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i100 = i.slice(-2);
  if (ord) return 'other';
  return (v0 && i100 == 1) ? 'one'
      : (v0 && i100 == 2) ? 'two'
      : (v0 && (i100 == 3 || i100 == 4)
          || !v0) ? 'few'
      : 'other';
},

sma: function(n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

smi: function(n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

smj: function(n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

smn: function(n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

sms: function(n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

sn: _cp[1],

so: _cp[1],

sq: function(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return (n == 1) ? 'one'
      : (n10 == 4 && n100 != 14) ? 'many'
      : 'other';
  return (n == 1) ? 'one' : 'other';
},

sr: function(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1],
      i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return (v0 && i10 == 1 && i100 != 11
          || f10 == 1 && f100 != 11) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14)
          || (f10 >= 2 && f10 <= 4) && (f100 < 12
          || f100 > 14)) ? 'few'
      : 'other';
},

ss: _cp[1],

ssy: _cp[1],

st: _cp[1],

sv: function(n, ord) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return ((n10 == 1
          || n10 == 2) && n100 != 11 && n100 != 12) ? 'one' : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

sw: _cp[3],

syr: _cp[1],

ta: _cp[1],

te: _cp[1],

teo: _cp[1],

th: _cp[0],

ti: _cp[2],

tig: _cp[1],

tk: _cp[1],

tl: function(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1],
      i10 = i.slice(-1), f10 = f.slice(-1);
  if (ord) return (n == 1) ? 'one' : 'other';
  return (v0 && (i == 1 || i == 2 || i == 3)
          || v0 && i10 != 4 && i10 != 6 && i10 != 9
          || !v0 && f10 != 4 && f10 != 6 && f10 != 9) ? 'one' : 'other';
},

tn: _cp[1],

to: _cp[0],

tr: _cp[1],

ts: _cp[1],

tzm: function(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return ((n == 0 || n == 1)
          || (t0 && n >= 11 && n <= 99)) ? 'one' : 'other';
},

ug: _cp[1],

uk: function(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), i10 = i.slice(-1),
      i100 = i.slice(-2);
  if (ord) return (n10 == 3 && n100 != 13) ? 'few' : 'other';
  return (v0 && i10 == 1 && i100 != 11) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12
          || i100 > 14)) ? 'few'
      : (v0 && i10 == 0 || v0 && (i10 >= 5 && i10 <= 9)
          || v0 && (i100 >= 11 && i100 <= 14)) ? 'many'
      : 'other';
},

ur: _cp[3],

uz: _cp[1],

ve: _cp[1],

vi: function(n, ord) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return 'other';
},

vo: _cp[1],

vun: _cp[1],

wa: _cp[2],

wae: _cp[1],

wo: _cp[0],

xh: _cp[1],

xog: _cp[1],

yi: _cp[3],

yo: _cp[0],

zh: _cp[0],

zu: function(n, ord) {
  if (ord) return 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
}
}));


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var require;var require;(function(f){if(true){module.exports=f()}else { var g; }})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * make-plural.js -- https://github.com/eemeli/make-plural.js/
 * Copyright (c) 2014-2016 by Eemeli Aro <eemeli@gmail.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * The software is provided "as is" and the author disclaims all warranties
 * with regard to this software including all implied warranties of
 * merchantability and fitness. In no event shall the author be liable for
 * any special, direct, indirect, or consequential damages or any damages
 * whatsoever resulting from loss of use, data or profits, whether in an
 * action of contract, negligence or other tortious action, arising out of
 * or in connection with the use or performance of this software.
 */

var Parser = function () {
    function Parser() {
        _classCallCheck(this, Parser);
    }

    _createClass(Parser, [{
        key: 'parse',
        value: function parse(cond) {
            var _this = this;

            if (cond === 'i = 0 or n = 1') return 'n >= 0 && n <= 1';
            if (cond === 'i = 0,1') return 'n >= 0 && n < 2';
            if (cond === 'i = 1 and v = 0') {
                this.v0 = 1;
                return 'n == 1 && v0';
            }
            return cond.replace(/([tv]) (!?)= 0/g, function (m, sym, noteq) {
                var sn = sym + '0';
                _this[sn] = 1;
                return noteq ? '!' + sn : sn;
            }).replace(/\b[fintv]\b/g, function (m) {
                _this[m] = 1;
                return m;
            }).replace(/([fin]) % (10+)/g, function (m, sym, num) {
                var sn = sym + num;
                _this[sn] = 1;
                return sn;
            }).replace(/n10+ = 0/g, 't0 && $&').replace(/(\w+ (!?)= )([0-9.]+,[0-9.,]+)/g, function (m, se, noteq, x) {
                if (m === 'n = 0,1') return '(n == 0 || n == 1)';
                if (noteq) return se + x.split(',').join(' && ' + se);
                return '(' + se + x.split(',').join(' || ' + se) + ')';
            }).replace(/(\w+) (!?)= ([0-9]+)\.\.([0-9]+)/g, function (m, sym, noteq, x0, x1) {
                if (Number(x0) + 1 === Number(x1)) {
                    if (noteq) return sym + ' != ' + x0 + ' && ' + sym + ' != ' + x1;
                    return '(' + sym + ' == ' + x0 + ' || ' + sym + ' == ' + x1 + ')';
                }
                if (noteq) return '(' + sym + ' < ' + x0 + ' || ' + sym + ' > ' + x1 + ')';
                if (sym === 'n') {
                    _this.t0 = 1;return '(t0 && n >= ' + x0 + ' && n <= ' + x1 + ')';
                }
                return '(' + sym + ' >= ' + x0 + ' && ' + sym + ' <= ' + x1 + ')';
            }).replace(/ and /g, ' && ').replace(/ or /g, ' || ').replace(/ = /g, ' == ');
        }
    }, {
        key: 'vars',
        value: function vars() {
            var vars = [];
            if (this.i) vars.push('i = s[0]');
            if (this.f || this.v) vars.push("f = s[1] || ''");
            if (this.t) vars.push("t = (s[1] || '').replace(/0+$/, '')");
            if (this.v) vars.push('v = f.length');
            if (this.v0) vars.push('v0 = !s[1]');
            if (this.t0 || this.n10 || this.n100) vars.push('t0 = Number(s[0]) == n');
            for (var k in this) {
                if (/^.10+$/.test(k)) {
                    var k0 = k[0] === 'n' ? 't0 && s[0]' : k[0];
                    vars.push(k + ' = ' + k0 + '.slice(-' + k.substr(2).length + ')');
                }
            }
            if (!vars.length) return '';
            return 'var ' + ["s = String(n).split('.')"].concat(vars).join(', ');
        }
    }]);

    return Parser;
}();

var Tests = function () {
    function Tests(obj) {
        _classCallCheck(this, Tests);

        this.obj = obj;
        this.ordinal = {};
        this.cardinal = {};
    }

    _createClass(Tests, [{
        key: 'add',
        value: function add(type, cat, examples) {
            this[type][cat] = examples.join(' ').replace(/^[ ,]+|[ ,…]+$/g, '').replace(/(0\.[0-9])~(1\.[1-9])/g, '$1 1.0 $2').split(/[ ,~…]+/);
        }
    }, {
        key: 'testCond',
        value: function testCond(n, type, expResult, fn) {
            try {
                var r = (fn || this.obj.fn)(n, type === 'ordinal');
            } catch (e) {
                r = e.toString();
            }
            if (r !== expResult) {
                throw new Error('Locale ' + JSON.stringify(this.obj.lc) + type + ' rule self-test failed for v = ' + JSON.stringify(n) + ' (was ' + JSON.stringify(r) + ', expected ' + JSON.stringify(expResult) + ')');
            }
            return true;
        }
    }, {
        key: 'testCat',
        value: function testCat(type, cat, fn) {
            var _this2 = this;

            this[type][cat].forEach(function (n) {
                _this2.testCond(n, type, cat, fn);
                if (!/\.0+$/.test(n)) _this2.testCond(Number(n), type, cat, fn);
            });
            return true;
        }
    }, {
        key: 'testAll',
        value: function testAll() {
            for (var cat in this.cardinal) {
                this.testCat('cardinal', cat);
            }for (var _cat in this.ordinal) {
                this.testCat('ordinal', _cat);
            }return true;
        }
    }]);

    return Tests;
}();

var MakePlural = function () {
    function MakePlural(lc) {
        var _ref = arguments.length <= 1 || arguments[1] === undefined ? MakePlural : arguments[1];

        var cardinals = _ref.cardinals;
        var ordinals = _ref.ordinals;

        _classCallCheck(this, MakePlural);

        if (!cardinals && !ordinals) throw new Error('At least one type of plural is required');
        this.lc = lc;
        this.categories = { cardinal: [], ordinal: [] };
        this.parser = new Parser();
        this.tests = new Tests(this);
        this.fn = this.buildFunction(cardinals, ordinals);
        this.fn._obj = this;
        this.fn.categories = this.categories;
        this.fn.test = function () {
            return this.tests.testAll() && this.fn;
        }.bind(this);
        this.fn.toString = this.fnToString.bind(this);
        return this.fn;
    }

    _createClass(MakePlural, [{
        key: 'compile',
        value: function compile(type, req) {
            var cases = [];
            var rules = MakePlural.rules[type][this.lc];
            if (!rules) {
                if (req) throw new Error('Locale "' + this.lc + '" ' + type + ' rules not found');
                this.categories[type] = ['other'];
                return "'other'";
            }
            for (var r in rules) {
                var _rules$r$trim$split = rules[r].trim().split(/\s*@\w*/);

                var _rules$r$trim$split2 = _toArray(_rules$r$trim$split);

                var cond = _rules$r$trim$split2[0];
                var examples = _rules$r$trim$split2.slice(1);
                var cat = r.replace('pluralRule-count-', '');
                if (cond) cases.push([this.parser.parse(cond), cat]);
                this.tests.add(type, cat, examples);
            }
            this.categories[type] = cases.map(function (c) {
                return c[1];
            }).concat('other');
            if (cases.length === 1) {
                return '(' + cases[0][0] + ') ? \'' + cases[0][1] + '\' : \'other\'';
            } else {
                return [].concat(_toConsumableArray(cases.map(function (c) {
                    return '(' + c[0] + ') ? \'' + c[1] + '\'';
                })), ["'other'"]).join('\n      : ');
            }
        }
    }, {
        key: 'buildFunction',
        value: function buildFunction(cardinals, ordinals) {
            var _this3 = this;

            var compile = function compile(c) {
                return c ? (c[1] ? 'return ' : 'if (ord) return ') + _this3.compile.apply(_this3, _toConsumableArray(c)) : '';
            },
                fold = { vars: function vars(str) {
                    return ('  ' + str + ';').replace(/(.{1,78})(,|$) ?/g, '$1$2\n      ');
                },
                cond: function cond(str) {
                    return ('  ' + str + ';').replace(/(.{1,78}) (\|\| |$) ?/gm, '$1\n          $2');
                } },
                cond = [ordinals && ['ordinal', !cardinals], cardinals && ['cardinal', true]].map(compile).map(fold.cond),
                body = [fold.vars(this.parser.vars())].concat(_toConsumableArray(cond)).filter(function (line) {
                return !/^[\s;]*$/.test(line);
            }).map(function (line) {
                return line.replace(/\s+$/gm, '');
            }).join('\n'),
                args = ordinals && cardinals ? 'n, ord' : 'n';
            return new Function(args, body);
        }
    }, {
        key: 'fnToString',
        value: function fnToString(name) {
            return Function.prototype.toString.call(this.fn).replace(/^function( \w+)?/, name ? 'function ' + name : 'function').replace('\n/**/', '');
        }
    }], [{
        key: 'load',
        value: function load() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            args.forEach(function (cldr) {
                var data = cldr && cldr.supplemental || null;
                if (!data) throw new Error('Data does not appear to be CLDR data');
                MakePlural.rules = {
                    cardinal: data['plurals-type-cardinal'] || MakePlural.rules.cardinal,
                    ordinal: data['plurals-type-ordinal'] || MakePlural.rules.ordinal
                };
            });
            return MakePlural;
        }
    }]);

    return MakePlural;
}();

exports.default = MakePlural;


MakePlural.cardinals = true;
MakePlural.ordinals = false;
MakePlural.rules = { cardinal: {}, ordinal: {} };
module.exports = exports['default'];

},{}]},{},[1])(1)
});

/***/ }),
/* 24 */
/***/ (function(module) {

module.exports = {"supplemental":{"version":{"_number":"$Revision: 12002 $","_unicodeVersion":"8.0.0","_cldrVersion":"29"},"plurals-type-cardinal":{"af":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ak":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"am":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ar":{"pluralRule-count-zero":"n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000","pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-few":"n % 100 = 3..10 @integer 3~10, 103~110, 1003, … @decimal 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 103.0, 1003.0, …","pluralRule-count-many":"n % 100 = 11..99 @integer 11~26, 111, 1011, … @decimal 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 111.0, 1011.0, …","pluralRule-count-other":" @integer 100~102, 200~202, 300~302, 400~402, 500~502, 600, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"as":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"asa":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ast":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"az":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"be":{"pluralRule-count-one":"n % 10 = 1 and n % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 1.0, 21.0, 31.0, 41.0, 51.0, 61.0, 71.0, 81.0, 101.0, 1001.0, …","pluralRule-count-few":"n % 10 = 2..4 and n % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … @decimal 2.0, 3.0, 4.0, 22.0, 23.0, 24.0, 32.0, 33.0, 102.0, 1002.0, …","pluralRule-count-many":"n % 10 = 0 or n % 10 = 5..9 or n % 100 = 11..14 @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":"   @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.1, 1000.1, …"},"bem":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"bez":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"bg":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"bh":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"bm":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"bn":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"bo":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"br":{"pluralRule-count-one":"n % 10 = 1 and n % 100 != 11,71,91 @integer 1, 21, 31, 41, 51, 61, 81, 101, 1001, … @decimal 1.0, 21.0, 31.0, 41.0, 51.0, 61.0, 81.0, 101.0, 1001.0, …","pluralRule-count-two":"n % 10 = 2 and n % 100 != 12,72,92 @integer 2, 22, 32, 42, 52, 62, 82, 102, 1002, … @decimal 2.0, 22.0, 32.0, 42.0, 52.0, 62.0, 82.0, 102.0, 1002.0, …","pluralRule-count-few":"n % 10 = 3..4,9 and n % 100 != 10..19,70..79,90..99 @integer 3, 4, 9, 23, 24, 29, 33, 34, 39, 43, 44, 49, 103, 1003, … @decimal 3.0, 4.0, 9.0, 23.0, 24.0, 29.0, 33.0, 34.0, 103.0, 1003.0, …","pluralRule-count-many":"n != 0 and n % 1000000 = 0 @integer 1000000, … @decimal 1000000.0, 1000000.00, 1000000.000, …","pluralRule-count-other":" @integer 0, 5~8, 10~20, 100, 1000, 10000, 100000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, …"},"brx":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"bs":{"pluralRule-count-one":"v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-few":"v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … @decimal 0.2~0.4, 1.2~1.4, 2.2~2.4, 3.2~3.4, 4.2~4.4, 5.2, 10.2, 100.2, 1000.2, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ca":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ce":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"cgg":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"chr":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ckb":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"cs":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-few":"i = 2..4 and v = 0 @integer 2~4","pluralRule-count-many":"v != 0   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …"},"cy":{"pluralRule-count-zero":"n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000","pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-few":"n = 3 @integer 3 @decimal 3.0, 3.00, 3.000, 3.0000","pluralRule-count-many":"n = 6 @integer 6 @decimal 6.0, 6.00, 6.000, 6.0000","pluralRule-count-other":" @integer 4, 5, 7~20, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"da":{"pluralRule-count-one":"n = 1 or t != 0 and i = 0,1 @integer 1 @decimal 0.1~1.6","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 2.0~3.4, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"de":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"dsb":{"pluralRule-count-one":"v = 0 and i % 100 = 1 or f % 100 = 1 @integer 1, 101, 201, 301, 401, 501, 601, 701, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-two":"v = 0 and i % 100 = 2 or f % 100 = 2 @integer 2, 102, 202, 302, 402, 502, 602, 702, 1002, … @decimal 0.2, 1.2, 2.2, 3.2, 4.2, 5.2, 6.2, 7.2, 10.2, 100.2, 1000.2, …","pluralRule-count-few":"v = 0 and i % 100 = 3..4 or f % 100 = 3..4 @integer 3, 4, 103, 104, 203, 204, 303, 304, 403, 404, 503, 504, 603, 604, 703, 704, 1003, … @decimal 0.3, 0.4, 1.3, 1.4, 2.3, 2.4, 3.3, 3.4, 4.3, 4.4, 5.3, 5.4, 6.3, 6.4, 7.3, 7.4, 10.3, 100.3, 1000.3, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"dv":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"dz":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ee":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"el":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"en":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"eo":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"es":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"et":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"eu":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"fa":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ff":{"pluralRule-count-one":"i = 0,1 @integer 0, 1 @decimal 0.0~1.5","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"fi":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"fil":{"pluralRule-count-one":"v = 0 and i = 1,2,3 or v = 0 and i % 10 != 4,6,9 or v != 0 and f % 10 != 4,6,9 @integer 0~3, 5, 7, 8, 10~13, 15, 17, 18, 20, 21, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.3, 0.5, 0.7, 0.8, 1.0~1.3, 1.5, 1.7, 1.8, 2.0, 2.1, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 4, 6, 9, 14, 16, 19, 24, 26, 104, 1004, … @decimal 0.4, 0.6, 0.9, 1.4, 1.6, 1.9, 2.4, 2.6, 10.4, 100.4, 1000.4, …"},"fo":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"fr":{"pluralRule-count-one":"i = 0,1 @integer 0, 1 @decimal 0.0~1.5","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"fur":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"fy":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ga":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-few":"n = 3..6 @integer 3~6 @decimal 3.0, 4.0, 5.0, 6.0, 3.00, 4.00, 5.00, 6.00, 3.000, 4.000, 5.000, 6.000, 3.0000, 4.0000, 5.0000, 6.0000","pluralRule-count-many":"n = 7..10 @integer 7~10 @decimal 7.0, 8.0, 9.0, 10.0, 7.00, 8.00, 9.00, 10.00, 7.000, 8.000, 9.000, 10.000, 7.0000, 8.0000, 9.0000, 10.0000","pluralRule-count-other":" @integer 0, 11~25, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"gd":{"pluralRule-count-one":"n = 1,11 @integer 1, 11 @decimal 1.0, 11.0, 1.00, 11.00, 1.000, 11.000, 1.0000","pluralRule-count-two":"n = 2,12 @integer 2, 12 @decimal 2.0, 12.0, 2.00, 12.00, 2.000, 12.000, 2.0000","pluralRule-count-few":"n = 3..10,13..19 @integer 3~10, 13~19 @decimal 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 3.00","pluralRule-count-other":" @integer 0, 20~34, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"gl":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"gsw":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"gu":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"guw":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"gv":{"pluralRule-count-one":"v = 0 and i % 10 = 1 @integer 1, 11, 21, 31, 41, 51, 61, 71, 101, 1001, …","pluralRule-count-two":"v = 0 and i % 10 = 2 @integer 2, 12, 22, 32, 42, 52, 62, 72, 102, 1002, …","pluralRule-count-few":"v = 0 and i % 100 = 0,20,40,60,80 @integer 0, 20, 40, 60, 80, 100, 120, 140, 1000, 10000, 100000, 1000000, …","pluralRule-count-many":"v != 0   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 3~10, 13~19, 23, 103, 1003, …"},"ha":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"haw":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"he":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-two":"i = 2 and v = 0 @integer 2","pluralRule-count-many":"v = 0 and n != 0..10 and n % 10 = 0 @integer 20, 30, 40, 50, 60, 70, 80, 90, 100, 1000, 10000, 100000, 1000000, …","pluralRule-count-other":" @integer 0, 3~17, 101, 1001, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"hi":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"hr":{"pluralRule-count-one":"v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-few":"v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … @decimal 0.2~0.4, 1.2~1.4, 2.2~2.4, 3.2~3.4, 4.2~4.4, 5.2, 10.2, 100.2, 1000.2, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"hsb":{"pluralRule-count-one":"v = 0 and i % 100 = 1 or f % 100 = 1 @integer 1, 101, 201, 301, 401, 501, 601, 701, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-two":"v = 0 and i % 100 = 2 or f % 100 = 2 @integer 2, 102, 202, 302, 402, 502, 602, 702, 1002, … @decimal 0.2, 1.2, 2.2, 3.2, 4.2, 5.2, 6.2, 7.2, 10.2, 100.2, 1000.2, …","pluralRule-count-few":"v = 0 and i % 100 = 3..4 or f % 100 = 3..4 @integer 3, 4, 103, 104, 203, 204, 303, 304, 403, 404, 503, 504, 603, 604, 703, 704, 1003, … @decimal 0.3, 0.4, 1.3, 1.4, 2.3, 2.4, 3.3, 3.4, 4.3, 4.4, 5.3, 5.4, 6.3, 6.4, 7.3, 7.4, 10.3, 100.3, 1000.3, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"hu":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"hy":{"pluralRule-count-one":"i = 0,1 @integer 0, 1 @decimal 0.0~1.5","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"id":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ig":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ii":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"in":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"is":{"pluralRule-count-one":"t = 0 and i % 10 = 1 and i % 100 != 11 or t != 0 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1~1.6, 10.1, 100.1, 1000.1, …","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"it":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"iu":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"iw":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-two":"i = 2 and v = 0 @integer 2","pluralRule-count-many":"v = 0 and n != 0..10 and n % 10 = 0 @integer 20, 30, 40, 50, 60, 70, 80, 90, 100, 1000, 10000, 100000, 1000000, …","pluralRule-count-other":" @integer 0, 3~17, 101, 1001, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ja":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"jbo":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"jgo":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ji":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"jmc":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"jv":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"jw":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ka":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kab":{"pluralRule-count-one":"i = 0,1 @integer 0, 1 @decimal 0.0~1.5","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kaj":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kcg":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kde":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kea":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kk":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kkj":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kl":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"km":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kn":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ko":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ks":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ksb":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ksh":{"pluralRule-count-zero":"n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000","pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ku":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"kw":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ky":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"lag":{"pluralRule-count-zero":"n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000","pluralRule-count-one":"i = 0,1 and n != 0 @integer 1 @decimal 0.1~1.6","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"lb":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"lg":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"lkt":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ln":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"lo":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"lt":{"pluralRule-count-one":"n % 10 = 1 and n % 100 != 11..19 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 1.0, 21.0, 31.0, 41.0, 51.0, 61.0, 71.0, 81.0, 101.0, 1001.0, …","pluralRule-count-few":"n % 10 = 2..9 and n % 100 != 11..19 @integer 2~9, 22~29, 102, 1002, … @decimal 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 22.0, 102.0, 1002.0, …","pluralRule-count-many":"f != 0   @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.1, 1000.1, …","pluralRule-count-other":" @integer 0, 10~20, 30, 40, 50, 60, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"lv":{"pluralRule-count-zero":"n % 10 = 0 or n % 100 = 11..19 or v = 2 and f % 100 = 11..19 @integer 0, 10~20, 30, 40, 50, 60, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-one":"n % 10 = 1 and n % 100 != 11 or v = 2 and f % 10 = 1 and f % 100 != 11 or v != 2 and f % 10 = 1 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.0, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-other":" @integer 2~9, 22~29, 102, 1002, … @decimal 0.2~0.9, 1.2~1.9, 10.2, 100.2, 1000.2, …"},"mas":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"mg":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"mgo":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"mk":{"pluralRule-count-one":"v = 0 and i % 10 = 1 or f % 10 = 1 @integer 1, 11, 21, 31, 41, 51, 61, 71, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-other":" @integer 0, 2~10, 12~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.2~1.0, 1.2~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ml":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"mn":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"mo":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-few":"v != 0 or n = 0 or n != 1 and n % 100 = 1..19 @integer 0, 2~16, 101, 1001, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 20~35, 100, 1000, 10000, 100000, 1000000, …"},"mr":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ms":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"mt":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-few":"n = 0 or n % 100 = 2..10 @integer 0, 2~10, 102~107, 1002, … @decimal 0.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 10.0, 102.0, 1002.0, …","pluralRule-count-many":"n % 100 = 11..19 @integer 11~19, 111~117, 1011, … @decimal 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 111.0, 1011.0, …","pluralRule-count-other":" @integer 20~35, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"my":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nah":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"naq":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nb":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nd":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ne":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nl":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nn":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nnh":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"no":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nqo":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nr":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nso":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ny":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"nyn":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"om":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"or":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"os":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"pa":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"pap":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"pl":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-few":"v = 0 and i % 10 = 2..4 and i % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, …","pluralRule-count-many":"v = 0 and i != 1 and i % 10 = 0..1 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 12..14 @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …","pluralRule-count-other":"   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"prg":{"pluralRule-count-zero":"n % 10 = 0 or n % 100 = 11..19 or v = 2 and f % 100 = 11..19 @integer 0, 10~20, 30, 40, 50, 60, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-one":"n % 10 = 1 and n % 100 != 11 or v = 2 and f % 10 = 1 and f % 100 != 11 or v != 2 and f % 10 = 1 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.0, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-other":" @integer 2~9, 22~29, 102, 1002, … @decimal 0.2~0.9, 1.2~1.9, 10.2, 100.2, 1000.2, …"},"ps":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"pt":{"pluralRule-count-one":"n = 0..2 and n != 2 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"pt-PT":{"pluralRule-count-one":"n = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"rm":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ro":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-few":"v != 0 or n = 0 or n != 1 and n % 100 = 1..19 @integer 0, 2~16, 101, 1001, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 20~35, 100, 1000, 10000, 100000, 1000000, …"},"rof":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"root":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ru":{"pluralRule-count-one":"v = 0 and i % 10 = 1 and i % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, …","pluralRule-count-few":"v = 0 and i % 10 = 2..4 and i % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, …","pluralRule-count-many":"v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14 @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …","pluralRule-count-other":"   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"rwk":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sah":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"saq":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sdh":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"se":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"seh":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ses":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sg":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sh":{"pluralRule-count-one":"v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-few":"v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … @decimal 0.2~0.4, 1.2~1.4, 2.2~2.4, 3.2~3.4, 4.2~4.4, 5.2, 10.2, 100.2, 1000.2, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"shi":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-few":"n = 2..10 @integer 2~10 @decimal 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 2.00, 3.00, 4.00, 5.00, 6.00, 7.00, 8.00","pluralRule-count-other":" @integer 11~26, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~1.9, 2.1~2.7, 10.1, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"si":{"pluralRule-count-one":"n = 0,1 or i = 0 and f = 1 @integer 0, 1 @decimal 0.0, 0.1, 1.0, 0.00, 0.01, 1.00, 0.000, 0.001, 1.000, 0.0000, 0.0001, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.2~0.9, 1.1~1.8, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sk":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-few":"i = 2..4 and v = 0 @integer 2~4","pluralRule-count-many":"v != 0   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …"},"sl":{"pluralRule-count-one":"v = 0 and i % 100 = 1 @integer 1, 101, 201, 301, 401, 501, 601, 701, 1001, …","pluralRule-count-two":"v = 0 and i % 100 = 2 @integer 2, 102, 202, 302, 402, 502, 602, 702, 1002, …","pluralRule-count-few":"v = 0 and i % 100 = 3..4 or v != 0 @integer 3, 4, 103, 104, 203, 204, 303, 304, 403, 404, 503, 504, 603, 604, 703, 704, 1003, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …"},"sma":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"smi":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"smj":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"smn":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sms":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-two":"n = 2 @integer 2 @decimal 2.0, 2.00, 2.000, 2.0000","pluralRule-count-other":" @integer 0, 3~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sn":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"so":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sq":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sr":{"pluralRule-count-one":"v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, … @decimal 0.1, 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 10.1, 100.1, 1000.1, …","pluralRule-count-few":"v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, … @decimal 0.2~0.4, 1.2~1.4, 2.2~2.4, 3.2~3.4, 4.2~4.4, 5.2, 10.2, 100.2, 1000.2, …","pluralRule-count-other":" @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0, 0.5~1.0, 1.5~2.0, 2.5~2.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ss":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ssy":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"st":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sv":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"sw":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"syr":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ta":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"te":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"teo":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"th":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ti":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"tig":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"tk":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"tl":{"pluralRule-count-one":"v = 0 and i = 1,2,3 or v = 0 and i % 10 != 4,6,9 or v != 0 and f % 10 != 4,6,9 @integer 0~3, 5, 7, 8, 10~13, 15, 17, 18, 20, 21, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.3, 0.5, 0.7, 0.8, 1.0~1.3, 1.5, 1.7, 1.8, 2.0, 2.1, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …","pluralRule-count-other":" @integer 4, 6, 9, 14, 16, 19, 24, 26, 104, 1004, … @decimal 0.4, 0.6, 0.9, 1.4, 1.6, 1.9, 2.4, 2.6, 10.4, 100.4, 1000.4, …"},"tn":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"to":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"tr":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ts":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"tzm":{"pluralRule-count-one":"n = 0..1 or n = 11..99 @integer 0, 1, 11~24 @decimal 0.0, 1.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0","pluralRule-count-other":" @integer 2~10, 100~106, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ug":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"uk":{"pluralRule-count-one":"v = 0 and i % 10 = 1 and i % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, …","pluralRule-count-few":"v = 0 and i % 10 = 2..4 and i % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, …","pluralRule-count-many":"v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14 @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …","pluralRule-count-other":"   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ur":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"uz":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"ve":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"vi":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"vo":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"vun":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"wa":{"pluralRule-count-one":"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, 0.000, 1.000, 0.0000, 1.0000","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"wae":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"wo":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"xh":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"xog":{"pluralRule-count-one":"n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"yi":{"pluralRule-count-one":"i = 1 and v = 0 @integer 1","pluralRule-count-other":" @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"yo":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"zh":{"pluralRule-count-other":" @integer 0~15, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"},"zu":{"pluralRule-count-one":"i = 0 or n = 1 @integer 0, 1 @decimal 0.0~1.0, 0.00~0.04","pluralRule-count-other":" @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 1.1~2.6, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"}}}};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/// <reference path="../typings/tsd.d.ts" />

var xregexp_1 = __webpack_require__(26);
var value = '[-+]?(?:Infinity|[[0-9]*\\.?\\d*(?:[eE][-+]?\\d+)?)';
var mathInterval = xregexp_1.XRegExp("(?<leftBrace>  [\\(\\]\\[] )                                (?<fromValue>  " + value + "    )?                               (?<delimeter>  ,           )?                               (?<toValue>    " + value + "    )?                               (?<rightBrace> [\\)\\]\\[] )", 'x');
function parse(str) {
    var match = xregexp_1.XRegExp.exec(str, mathInterval);
    if (!match) {
        return null;
    }
    return {
        from: {
            value: match.fromValue !== undefined ?
                +match.fromValue :
                -Infinity,
            included: match.leftBrace === '['
        },
        to: {
            value: match.toValue !== undefined ?
                +match.toValue :
                (match.delimeter ?
                    +Infinity :
                    +match.fromValue),
            included: match.rightBrace === ']'
        }
    };
}
function check(interval) {
    if (!interval) {
        return false;
    }
    if (interval.from.value === interval.to.value) {
        return interval.from.included && interval.to.included;
    }
    return Math.min(interval.from.value, interval.to.value) === interval.from.value;
}
function entry(str) {
    var interval = parse(str);
    if (!check(interval)) {
        return null;
    }
    return interval;
}
exports.default = entry;
;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {


/***** xregexp.js *****/

/*!
 * XRegExp v2.0.0
 * (c) 2007-2012 Steven Levithan <http://xregexp.com/>
 * MIT License
 */

/**
 * XRegExp provides augmented, extensible JavaScript regular expressions. You get new syntax,
 * flags, and methods beyond what browsers support natively. XRegExp is also a regex utility belt
 * with tools to make your client-side grepping simpler and more powerful, while freeing you from
 * worrying about pesky cross-browser inconsistencies and the dubious `lastIndex` property. See
 * XRegExp's documentation (http://xregexp.com/) for more details.
 * @module xregexp
 * @requires N/A
 */
var XRegExp;

// Avoid running twice; that would reset tokens and could break references to native globals
XRegExp = XRegExp || (function (undef) {
    "use strict";

/*--------------------------------------
 *  Private variables
 *------------------------------------*/

    var self,
        addToken,
        add,

// Optional features; can be installed and uninstalled
        features = {
            natives: false,
            extensibility: false
        },

// Store native methods to use and restore ("native" is an ES3 reserved keyword)
        nativ = {
            exec: RegExp.prototype.exec,
            test: RegExp.prototype.test,
            match: String.prototype.match,
            replace: String.prototype.replace,
            split: String.prototype.split
        },

// Storage for fixed/extended native methods
        fixed = {},

// Storage for cached regexes
        cache = {},

// Storage for addon tokens
        tokens = [],

// Token scopes
        defaultScope = "default",
        classScope = "class",

// Regexes that match native regex syntax
        nativeTokens = {
            // Any native multicharacter token in default scope (includes octals, excludes character classes)
            "default": /^(?:\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??)/,
            // Any native multicharacter token in character class scope (includes octals)
            "class": /^(?:\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S]))/
        },

// Any backreference in replacement strings
        replacementToken = /\$(?:{([\w$]+)}|(\d\d?|[\s\S]))/g,

// Any character with a later instance in the string
        duplicateFlags = /([\s\S])(?=[\s\S]*\1)/g,

// Any greedy/lazy quantifier
        quantifier = /^(?:[?*+]|{\d+(?:,\d*)?})\??/,

// Check for correct `exec` handling of nonparticipating capturing groups
        compliantExecNpcg = nativ.exec.call(/()??/, "")[1] === undef,

// Check for flag y support (Firefox 3+)
        hasNativeY = RegExp.prototype.sticky !== undef,

// Used to kill infinite recursion during XRegExp construction
        isInsideConstructor = false,

// Storage for known flags, including addon flags
        registeredFlags = "gim" + (hasNativeY ? "y" : "");

/*--------------------------------------
 *  Private helper functions
 *------------------------------------*/

/**
 * Attaches XRegExp.prototype properties and named capture supporting data to a regex object.
 * @private
 * @param {RegExp} regex Regex to augment.
 * @param {Array} captureNames Array with capture names, or null.
 * @param {Boolean} [isNative] Whether the regex was created by `RegExp` rather than `XRegExp`.
 * @returns {RegExp} Augmented regex.
 */
    function augment(regex, captureNames, isNative) {
        var p;
        // Can't auto-inherit these since the XRegExp constructor returns a nonprimitive value
        for (p in self.prototype) {
            if (self.prototype.hasOwnProperty(p)) {
                regex[p] = self.prototype[p];
            }
        }
        regex.xregexp = {captureNames: captureNames, isNative: !!isNative};
        return regex;
    }

/**
 * Returns native `RegExp` flags used by a regex object.
 * @private
 * @param {RegExp} regex Regex to check.
 * @returns {String} Native flags in use.
 */
    function getNativeFlags(regex) {
        //return nativ.exec.call(/\/([a-z]*)$/i, String(regex))[1];
        return (regex.global     ? "g" : "") +
               (regex.ignoreCase ? "i" : "") +
               (regex.multiline  ? "m" : "") +
               (regex.extended   ? "x" : "") + // Proposed for ES6, included in AS3
               (regex.sticky     ? "y" : ""); // Proposed for ES6, included in Firefox 3+
    }

/**
 * Copies a regex object while preserving special properties for named capture and augmenting with
 * `XRegExp.prototype` methods. The copy has a fresh `lastIndex` property (set to zero). Allows
 * adding and removing flags while copying the regex.
 * @private
 * @param {RegExp} regex Regex to copy.
 * @param {String} [addFlags] Flags to be added while copying the regex.
 * @param {String} [removeFlags] Flags to be removed while copying the regex.
 * @returns {RegExp} Copy of the provided regex, possibly with modified flags.
 */
    function copy(regex, addFlags, removeFlags) {
        if (!self.isRegExp(regex)) {
            throw new TypeError("type RegExp expected");
        }
        var flags = nativ.replace.call(getNativeFlags(regex) + (addFlags || ""), duplicateFlags, "");
        if (removeFlags) {
            // Would need to escape `removeFlags` if this was public
            flags = nativ.replace.call(flags, new RegExp("[" + removeFlags + "]+", "g"), "");
        }
        if (regex.xregexp && !regex.xregexp.isNative) {
            // Compiling the current (rather than precompilation) source preserves the effects of nonnative source flags
            regex = augment(self(regex.source, flags),
                            regex.xregexp.captureNames ? regex.xregexp.captureNames.slice(0) : null);
        } else {
            // Augment with `XRegExp.prototype` methods, but use native `RegExp` (avoid searching for special tokens)
            regex = augment(new RegExp(regex.source, flags), null, true);
        }
        return regex;
    }

/*
 * Returns the last index at which a given value can be found in an array, or `-1` if it's not
 * present. The array is searched backwards.
 * @private
 * @param {Array} array Array to search.
 * @param {*} value Value to locate in the array.
 * @returns {Number} Last zero-based index at which the item is found, or -1.
 */
    function lastIndexOf(array, value) {
        var i = array.length;
        if (Array.prototype.lastIndexOf) {
            return array.lastIndexOf(value); // Use the native method if available
        }
        while (i--) {
            if (array[i] === value) {
                return i;
            }
        }
        return -1;
    }

/**
 * Determines whether an object is of the specified type.
 * @private
 * @param {*} value Object to check.
 * @param {String} type Type to check for, in lowercase.
 * @returns {Boolean} Whether the object matches the type.
 */
    function isType(value, type) {
        return Object.prototype.toString.call(value).toLowerCase() === "[object " + type + "]";
    }

/**
 * Prepares an options object from the given value.
 * @private
 * @param {String|Object} value Value to convert to an options object.
 * @returns {Object} Options object.
 */
    function prepareOptions(value) {
        value = value || {};
        if (value === "all" || value.all) {
            value = {natives: true, extensibility: true};
        } else if (isType(value, "string")) {
            value = self.forEach(value, /[^\s,]+/, function (m) {
                this[m] = true;
            }, {});
        }
        return value;
    }

/**
 * Runs built-in/custom tokens in reverse insertion order, until a match is found.
 * @private
 * @param {String} pattern Original pattern from which an XRegExp object is being built.
 * @param {Number} pos Position to search for tokens within `pattern`.
 * @param {Number} scope Current regex scope.
 * @param {Object} context Context object assigned to token handler functions.
 * @returns {Object} Object with properties `output` (the substitution string returned by the
 *   successful token handler) and `match` (the token's match array), or null.
 */
    function runTokens(pattern, pos, scope, context) {
        var i = tokens.length,
            result = null,
            match,
            t;
        // Protect against constructing XRegExps within token handler and trigger functions
        isInsideConstructor = true;
        // Must reset `isInsideConstructor`, even if a `trigger` or `handler` throws
        try {
            while (i--) { // Run in reverse order
                t = tokens[i];
                if ((t.scope === "all" || t.scope === scope) && (!t.trigger || t.trigger.call(context))) {
                    t.pattern.lastIndex = pos;
                    match = fixed.exec.call(t.pattern, pattern); // Fixed `exec` here allows use of named backreferences, etc.
                    if (match && match.index === pos) {
                        result = {
                            output: t.handler.call(context, match, scope),
                            match: match
                        };
                        break;
                    }
                }
            }
        } catch (err) {
            throw err;
        } finally {
            isInsideConstructor = false;
        }
        return result;
    }

/**
 * Enables or disables XRegExp syntax and flag extensibility.
 * @private
 * @param {Boolean} on `true` to enable; `false` to disable.
 */
    function setExtensibility(on) {
        self.addToken = addToken[on ? "on" : "off"];
        features.extensibility = on;
    }

/**
 * Enables or disables native method overrides.
 * @private
 * @param {Boolean} on `true` to enable; `false` to disable.
 */
    function setNatives(on) {
        RegExp.prototype.exec = (on ? fixed : nativ).exec;
        RegExp.prototype.test = (on ? fixed : nativ).test;
        String.prototype.match = (on ? fixed : nativ).match;
        String.prototype.replace = (on ? fixed : nativ).replace;
        String.prototype.split = (on ? fixed : nativ).split;
        features.natives = on;
    }

/*--------------------------------------
 *  Constructor
 *------------------------------------*/

/**
 * Creates an extended regular expression object for matching text with a pattern. Differs from a
 * native regular expression in that additional syntax and flags are supported. The returned object
 * is in fact a native `RegExp` and works with all native methods.
 * @class XRegExp
 * @constructor
 * @param {String|RegExp} pattern Regex pattern string, or an existing `RegExp` object to copy.
 * @param {String} [flags] Any combination of flags:
 *   <li>`g` - global
 *   <li>`i` - ignore case
 *   <li>`m` - multiline anchors
 *   <li>`n` - explicit capture
 *   <li>`s` - dot matches all (aka singleline)
 *   <li>`x` - free-spacing and line comments (aka extended)
 *   <li>`y` - sticky (Firefox 3+ only)
 *   Flags cannot be provided when constructing one `RegExp` from another.
 * @returns {RegExp} Extended regular expression object.
 * @example
 *
 * // With named capture and flag x
 * date = XRegExp('(?<year>  [0-9]{4}) -?  # year  \n\
 *                 (?<month> [0-9]{2}) -?  # month \n\
 *                 (?<day>   [0-9]{2})     # day   ', 'x');
 *
 * // Passing a regex object to copy it. The copy maintains special properties for named capture,
 * // is augmented with `XRegExp.prototype` methods, and has a fresh `lastIndex` property (set to
 * // zero). Native regexes are not recompiled using XRegExp syntax.
 * XRegExp(/regex/);
 */
    self = function (pattern, flags) {
        if (self.isRegExp(pattern)) {
            if (flags !== undef) {
                throw new TypeError("can't supply flags when constructing one RegExp from another");
            }
            return copy(pattern);
        }
        // Tokens become part of the regex construction process, so protect against infinite recursion
        // when an XRegExp is constructed within a token handler function
        if (isInsideConstructor) {
            throw new Error("can't call the XRegExp constructor within token definition functions");
        }

        var output = [],
            scope = defaultScope,
            tokenContext = {
                hasNamedCapture: false,
                captureNames: [],
                hasFlag: function (flag) {
                    return flags.indexOf(flag) > -1;
                }
            },
            pos = 0,
            tokenResult,
            match,
            chr;
        pattern = pattern === undef ? "" : String(pattern);
        flags = flags === undef ? "" : String(flags);

        if (nativ.match.call(flags, duplicateFlags)) { // Don't use test/exec because they would update lastIndex
            throw new SyntaxError("invalid duplicate regular expression flag");
        }
        // Strip/apply leading mode modifier with any combination of flags except g or y: (?imnsx)
        pattern = nativ.replace.call(pattern, /^\(\?([\w$]+)\)/, function ($0, $1) {
            if (nativ.test.call(/[gy]/, $1)) {
                throw new SyntaxError("can't use flag g or y in mode modifier");
            }
            flags = nativ.replace.call(flags + $1, duplicateFlags, "");
            return "";
        });
        self.forEach(flags, /[\s\S]/, function (m) {
            if (registeredFlags.indexOf(m[0]) < 0) {
                throw new SyntaxError("invalid regular expression flag " + m[0]);
            }
        });

        while (pos < pattern.length) {
            // Check for custom tokens at the current position
            tokenResult = runTokens(pattern, pos, scope, tokenContext);
            if (tokenResult) {
                output.push(tokenResult.output);
                pos += (tokenResult.match[0].length || 1);
            } else {
                // Check for native tokens (except character classes) at the current position
                match = nativ.exec.call(nativeTokens[scope], pattern.slice(pos));
                if (match) {
                    output.push(match[0]);
                    pos += match[0].length;
                } else {
                    chr = pattern.charAt(pos);
                    if (chr === "[") {
                        scope = classScope;
                    } else if (chr === "]") {
                        scope = defaultScope;
                    }
                    // Advance position by one character
                    output.push(chr);
                    ++pos;
                }
            }
        }

        return augment(new RegExp(output.join(""), nativ.replace.call(flags, /[^gimy]+/g, "")),
                       tokenContext.hasNamedCapture ? tokenContext.captureNames : null);
    };

/*--------------------------------------
 *  Public methods/properties
 *------------------------------------*/

// Installed and uninstalled states for `XRegExp.addToken`
    addToken = {
        on: function (regex, handler, options) {
            options = options || {};
            if (regex) {
                tokens.push({
                    pattern: copy(regex, "g" + (hasNativeY ? "y" : "")),
                    handler: handler,
                    scope: options.scope || defaultScope,
                    trigger: options.trigger || null
                });
            }
            // Providing `customFlags` with null `regex` and `handler` allows adding flags that do
            // nothing, but don't throw an error
            if (options.customFlags) {
                registeredFlags = nativ.replace.call(registeredFlags + options.customFlags, duplicateFlags, "");
            }
        },
        off: function () {
            throw new Error("extensibility must be installed before using addToken");
        }
    };

/**
 * Extends or changes XRegExp syntax and allows custom flags. This is used internally and can be
 * used to create XRegExp addons. `XRegExp.install('extensibility')` must be run before calling
 * this function, or an error is thrown. If more than one token can match the same string, the last
 * added wins.
 * @memberOf XRegExp
 * @param {RegExp} regex Regex object that matches the new token.
 * @param {Function} handler Function that returns a new pattern string (using native regex syntax)
 *   to replace the matched token within all future XRegExp regexes. Has access to persistent
 *   properties of the regex being built, through `this`. Invoked with two arguments:
 *   <li>The match array, with named backreference properties.
 *   <li>The regex scope where the match was found.
 * @param {Object} [options] Options object with optional properties:
 *   <li>`scope` {String} Scopes where the token applies: 'default', 'class', or 'all'.
 *   <li>`trigger` {Function} Function that returns `true` when the token should be applied; e.g.,
 *     if a flag is set. If `false` is returned, the matched string can be matched by other tokens.
 *     Has access to persistent properties of the regex being built, through `this` (including
 *     function `this.hasFlag`).
 *   <li>`customFlags` {String} Nonnative flags used by the token's handler or trigger functions.
 *     Prevents XRegExp from throwing an invalid flag error when the specified flags are used.
 * @example
 *
 * // Basic usage: Adds \a for ALERT character
 * XRegExp.addToken(
 *   /\\a/,
 *   function () {return '\\x07';},
 *   {scope: 'all'}
 * );
 * XRegExp('\\a[\\a-\\n]+').test('\x07\n\x07'); // -> true
 */
    self.addToken = addToken.off;

/**
 * Caches and returns the result of calling `XRegExp(pattern, flags)`. On any subsequent call with
 * the same pattern and flag combination, the cached copy is returned.
 * @memberOf XRegExp
 * @param {String} pattern Regex pattern string.
 * @param {String} [flags] Any combination of XRegExp flags.
 * @returns {RegExp} Cached XRegExp object.
 * @example
 *
 * while (match = XRegExp.cache('.', 'gs').exec(str)) {
 *   // The regex is compiled once only
 * }
 */
    self.cache = function (pattern, flags) {
        var key = pattern + "/" + (flags || "");
        return cache[key] || (cache[key] = self(pattern, flags));
    };

/**
 * Escapes any regular expression metacharacters, for use when matching literal strings. The result
 * can safely be used at any point within a regex that uses any flags.
 * @memberOf XRegExp
 * @param {String} str String to escape.
 * @returns {String} String with regex metacharacters escaped.
 * @example
 *
 * XRegExp.escape('Escaped? <.>');
 * // -> 'Escaped\?\ <\.>'
 */
    self.escape = function (str) {
        return nativ.replace.call(str, /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

/**
 * Executes a regex search in a specified string. Returns a match array or `null`. If the provided
 * regex uses named capture, named backreference properties are included on the match array.
 * Optional `pos` and `sticky` arguments specify the search start position, and whether the match
 * must start at the specified position only. The `lastIndex` property of the provided regex is not
 * used, but is updated for compatibility. Also fixes browser bugs compared to the native
 * `RegExp.prototype.exec` and can be used reliably cross-browser.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {Number} [pos=0] Zero-based index at which to start the search.
 * @param {Boolean|String} [sticky=false] Whether the match must start at the specified position
 *   only. The string `'sticky'` is accepted as an alternative to `true`.
 * @returns {Array} Match array with named backreference properties, or null.
 * @example
 *
 * // Basic use, with named backreference
 * var match = XRegExp.exec('U+2620', XRegExp('U\\+(?<hex>[0-9A-F]{4})'));
 * match.hex; // -> '2620'
 *
 * // With pos and sticky, in a loop
 * var pos = 2, result = [], match;
 * while (match = XRegExp.exec('<1><2><3><4>5<6>', /<(\d)>/, pos, 'sticky')) {
 *   result.push(match[1]);
 *   pos = match.index + match[0].length;
 * }
 * // result -> ['2', '3', '4']
 */
    self.exec = function (str, regex, pos, sticky) {
        var r2 = copy(regex, "g" + (sticky && hasNativeY ? "y" : ""), (sticky === false ? "y" : "")),
            match;
        r2.lastIndex = pos = pos || 0;
        match = fixed.exec.call(r2, str); // Fixed `exec` required for `lastIndex` fix, etc.
        if (sticky && match && match.index !== pos) {
            match = null;
        }
        if (regex.global) {
            regex.lastIndex = match ? r2.lastIndex : 0;
        }
        return match;
    };

/**
 * Executes a provided function once per regex match.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {Function} callback Function to execute for each match. Invoked with four arguments:
 *   <li>The match array, with named backreference properties.
 *   <li>The zero-based match index.
 *   <li>The string being traversed.
 *   <li>The regex object being used to traverse the string.
 * @param {*} [context] Object to use as `this` when executing `callback`.
 * @returns {*} Provided `context` object.
 * @example
 *
 * // Extracts every other digit from a string
 * XRegExp.forEach('1a2345', /\d/, function (match, i) {
 *   if (i % 2) this.push(+match[0]);
 * }, []);
 * // -> [2, 4]
 */
    self.forEach = function (str, regex, callback, context) {
        var pos = 0,
            i = -1,
            match;
        while ((match = self.exec(str, regex, pos))) {
            callback.call(context, match, ++i, str, regex);
            pos = match.index + (match[0].length || 1);
        }
        return context;
    };

/**
 * Copies a regex object and adds flag `g`. The copy maintains special properties for named
 * capture, is augmented with `XRegExp.prototype` methods, and has a fresh `lastIndex` property
 * (set to zero). Native regexes are not recompiled using XRegExp syntax.
 * @memberOf XRegExp
 * @param {RegExp} regex Regex to globalize.
 * @returns {RegExp} Copy of the provided regex with flag `g` added.
 * @example
 *
 * var globalCopy = XRegExp.globalize(/regex/);
 * globalCopy.global; // -> true
 */
    self.globalize = function (regex) {
        return copy(regex, "g");
    };

/**
 * Installs optional features according to the specified options.
 * @memberOf XRegExp
 * @param {Object|String} options Options object or string.
 * @example
 *
 * // With an options object
 * XRegExp.install({
 *   // Overrides native regex methods with fixed/extended versions that support named
 *   // backreferences and fix numerous cross-browser bugs
 *   natives: true,
 *
 *   // Enables extensibility of XRegExp syntax and flags
 *   extensibility: true
 * });
 *
 * // With an options string
 * XRegExp.install('natives extensibility');
 *
 * // Using a shortcut to install all optional features
 * XRegExp.install('all');
 */
    self.install = function (options) {
        options = prepareOptions(options);
        if (!features.natives && options.natives) {
            setNatives(true);
        }
        if (!features.extensibility && options.extensibility) {
            setExtensibility(true);
        }
    };

/**
 * Checks whether an individual optional feature is installed.
 * @memberOf XRegExp
 * @param {String} feature Name of the feature to check. One of:
 *   <li>`natives`
 *   <li>`extensibility`
 * @returns {Boolean} Whether the feature is installed.
 * @example
 *
 * XRegExp.isInstalled('natives');
 */
    self.isInstalled = function (feature) {
        return !!(features[feature]);
    };

/**
 * Returns `true` if an object is a regex; `false` if it isn't. This works correctly for regexes
 * created in another frame, when `instanceof` and `constructor` checks would fail.
 * @memberOf XRegExp
 * @param {*} value Object to check.
 * @returns {Boolean} Whether the object is a `RegExp` object.
 * @example
 *
 * XRegExp.isRegExp('string'); // -> false
 * XRegExp.isRegExp(/regex/i); // -> true
 * XRegExp.isRegExp(RegExp('^', 'm')); // -> true
 * XRegExp.isRegExp(XRegExp('(?s).')); // -> true
 */
    self.isRegExp = function (value) {
        return isType(value, "regexp");
    };

/**
 * Retrieves the matches from searching a string using a chain of regexes that successively search
 * within previous matches. The provided `chain` array can contain regexes and objects with `regex`
 * and `backref` properties. When a backreference is specified, the named or numbered backreference
 * is passed forward to the next regex or returned.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {Array} chain Regexes that each search for matches within preceding results.
 * @returns {Array} Matches by the last regex in the chain, or an empty array.
 * @example
 *
 * // Basic usage; matches numbers within <b> tags
 * XRegExp.matchChain('1 <b>2</b> 3 <b>4 a 56</b>', [
 *   XRegExp('(?is)<b>.*?</b>'),
 *   /\d+/
 * ]);
 * // -> ['2', '4', '56']
 *
 * // Passing forward and returning specific backreferences
 * html = '<a href="http://xregexp.com/api/">XRegExp</a>\
 *         <a href="http://www.google.com/">Google</a>';
 * XRegExp.matchChain(html, [
 *   {regex: /<a href="([^"]+)">/i, backref: 1},
 *   {regex: XRegExp('(?i)^https?://(?<domain>[^/?#]+)'), backref: 'domain'}
 * ]);
 * // -> ['xregexp.com', 'www.google.com']
 */
    self.matchChain = function (str, chain) {
        return (function recurseChain(values, level) {
            var item = chain[level].regex ? chain[level] : {regex: chain[level]},
                matches = [],
                addMatch = function (match) {
                    matches.push(item.backref ? (match[item.backref] || "") : match[0]);
                },
                i;
            for (i = 0; i < values.length; ++i) {
                self.forEach(values[i], item.regex, addMatch);
            }
            return ((level === chain.length - 1) || !matches.length) ?
                    matches :
                    recurseChain(matches, level + 1);
        }([str], 0));
    };

/**
 * Returns a new string with one or all matches of a pattern replaced. The pattern can be a string
 * or regex, and the replacement can be a string or a function to be called for each match. To
 * perform a global search and replace, use the optional `scope` argument or include flag `g` if
 * using a regex. Replacement strings can use `${n}` for named and numbered backreferences.
 * Replacement functions can use named backreferences via `arguments[0].name`. Also fixes browser
 * bugs compared to the native `String.prototype.replace` and can be used reliably cross-browser.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp|String} search Search pattern to be replaced.
 * @param {String|Function} replacement Replacement string or a function invoked to create it.
 *   Replacement strings can include special replacement syntax:
 *     <li>$$ - Inserts a literal '$'.
 *     <li>$&, $0 - Inserts the matched substring.
 *     <li>$` - Inserts the string that precedes the matched substring (left context).
 *     <li>$' - Inserts the string that follows the matched substring (right context).
 *     <li>$n, $nn - Where n/nn are digits referencing an existent capturing group, inserts
 *       backreference n/nn.
 *     <li>${n} - Where n is a name or any number of digits that reference an existent capturing
 *       group, inserts backreference n.
 *   Replacement functions are invoked with three or more arguments:
 *     <li>The matched substring (corresponds to $& above). Named backreferences are accessible as
 *       properties of this first argument.
 *     <li>0..n arguments, one for each backreference (corresponding to $1, $2, etc. above).
 *     <li>The zero-based index of the match within the total search string.
 *     <li>The total string being searched.
 * @param {String} [scope='one'] Use 'one' to replace the first match only, or 'all'. If not
 *   explicitly specified and using a regex with flag `g`, `scope` is 'all'.
 * @returns {String} New string with one or all matches replaced.
 * @example
 *
 * // Regex search, using named backreferences in replacement string
 * var name = XRegExp('(?<first>\\w+) (?<last>\\w+)');
 * XRegExp.replace('John Smith', name, '${last}, ${first}');
 * // -> 'Smith, John'
 *
 * // Regex search, using named backreferences in replacement function
 * XRegExp.replace('John Smith', name, function (match) {
 *   return match.last + ', ' + match.first;
 * });
 * // -> 'Smith, John'
 *
 * // Global string search/replacement
 * XRegExp.replace('RegExp builds RegExps', 'RegExp', 'XRegExp', 'all');
 * // -> 'XRegExp builds XRegExps'
 */
    self.replace = function (str, search, replacement, scope) {
        var isRegex = self.isRegExp(search),
            search2 = search,
            result;
        if (isRegex) {
            if (scope === undef && search.global) {
                scope = "all"; // Follow flag g when `scope` isn't explicit
            }
            // Note that since a copy is used, `search`'s `lastIndex` isn't updated *during* replacement iterations
            search2 = copy(search, scope === "all" ? "g" : "", scope === "all" ? "" : "g");
        } else if (scope === "all") {
            search2 = new RegExp(self.escape(String(search)), "g");
        }
        result = fixed.replace.call(String(str), search2, replacement); // Fixed `replace` required for named backreferences, etc.
        if (isRegex && search.global) {
            search.lastIndex = 0; // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
        }
        return result;
    };

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @memberOf XRegExp
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * XRegExp.split('a b c', ' ');
 * // -> ['a', 'b', 'c']
 *
 * // With limit
 * XRegExp.split('a b c', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * XRegExp.split('..word1..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', '..']
 */
    self.split = function (str, separator, limit) {
        return fixed.split.call(str, separator, limit);
    };

/**
 * Executes a regex search in a specified string. Returns `true` or `false`. Optional `pos` and
 * `sticky` arguments specify the search start position, and whether the match must start at the
 * specified position only. The `lastIndex` property of the provided regex is not used, but is
 * updated for compatibility. Also fixes browser bugs compared to the native
 * `RegExp.prototype.test` and can be used reliably cross-browser.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {Number} [pos=0] Zero-based index at which to start the search.
 * @param {Boolean|String} [sticky=false] Whether the match must start at the specified position
 *   only. The string `'sticky'` is accepted as an alternative to `true`.
 * @returns {Boolean} Whether the regex matched the provided value.
 * @example
 *
 * // Basic use
 * XRegExp.test('abc', /c/); // -> true
 *
 * // With pos and sticky
 * XRegExp.test('abc', /c/, 0, 'sticky'); // -> false
 */
    self.test = function (str, regex, pos, sticky) {
        // Do this the easy way :-)
        return !!self.exec(str, regex, pos, sticky);
    };

/**
 * Uninstalls optional features according to the specified options.
 * @memberOf XRegExp
 * @param {Object|String} options Options object or string.
 * @example
 *
 * // With an options object
 * XRegExp.uninstall({
 *   // Restores native regex methods
 *   natives: true,
 *
 *   // Disables additional syntax and flag extensions
 *   extensibility: true
 * });
 *
 * // With an options string
 * XRegExp.uninstall('natives extensibility');
 *
 * // Using a shortcut to uninstall all optional features
 * XRegExp.uninstall('all');
 */
    self.uninstall = function (options) {
        options = prepareOptions(options);
        if (features.natives && options.natives) {
            setNatives(false);
        }
        if (features.extensibility && options.extensibility) {
            setExtensibility(false);
        }
    };

/**
 * Returns an XRegExp object that is the union of the given patterns. Patterns can be provided as
 * regex objects or strings. Metacharacters are escaped in patterns provided as strings.
 * Backreferences in provided regex objects are automatically renumbered to work correctly. Native
 * flags used by provided regexes are ignored in favor of the `flags` argument.
 * @memberOf XRegExp
 * @param {Array} patterns Regexes and strings to combine.
 * @param {String} [flags] Any combination of XRegExp flags.
 * @returns {RegExp} Union of the provided regexes and strings.
 * @example
 *
 * XRegExp.union(['a+b*c', /(dogs)\1/, /(cats)\1/], 'i');
 * // -> /a\+b\*c|(dogs)\1|(cats)\2/i
 *
 * XRegExp.union([XRegExp('(?<pet>dogs)\\k<pet>'), XRegExp('(?<pet>cats)\\k<pet>')]);
 * // -> XRegExp('(?<pet>dogs)\\k<pet>|(?<pet>cats)\\k<pet>')
 */
    self.union = function (patterns, flags) {
        var parts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g,
            numCaptures = 0,
            numPriorCaptures,
            captureNames,
            rewrite = function (match, paren, backref) {
                var name = captureNames[numCaptures - numPriorCaptures];
                if (paren) { // Capturing group
                    ++numCaptures;
                    if (name) { // If the current capture has a name
                        return "(?<" + name + ">";
                    }
                } else if (backref) { // Backreference
                    return "\\" + (+backref + numPriorCaptures);
                }
                return match;
            },
            output = [],
            pattern,
            i;
        if (!(isType(patterns, "array") && patterns.length)) {
            throw new TypeError("patterns must be a nonempty array");
        }
        for (i = 0; i < patterns.length; ++i) {
            pattern = patterns[i];
            if (self.isRegExp(pattern)) {
                numPriorCaptures = numCaptures;
                captureNames = (pattern.xregexp && pattern.xregexp.captureNames) || [];
                // Rewrite backreferences. Passing to XRegExp dies on octals and ensures patterns
                // are independently valid; helps keep this simple. Named captures are put back
                output.push(self(pattern.source).source.replace(parts, rewrite));
            } else {
                output.push(self.escape(pattern));
            }
        }
        return self(output.join("|"), flags);
    };

/**
 * The XRegExp version number.
 * @static
 * @memberOf XRegExp
 * @type String
 */
    self.version = "2.0.0";

/*--------------------------------------
 *  Fixed/extended native methods
 *------------------------------------*/

/**
 * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
 * bugs in the native `RegExp.prototype.exec`. Calling `XRegExp.install('natives')` uses this to
 * override the native method. Use via `XRegExp.exec` without overriding natives.
 * @private
 * @param {String} str String to search.
 * @returns {Array} Match array with named backreference properties, or null.
 */
    fixed.exec = function (str) {
        var match, name, r2, origLastIndex, i;
        if (!this.global) {
            origLastIndex = this.lastIndex;
        }
        match = nativ.exec.apply(this, arguments);
        if (match) {
            // Fix browsers whose `exec` methods don't consistently return `undefined` for
            // nonparticipating capturing groups
            if (!compliantExecNpcg && match.length > 1 && lastIndexOf(match, "") > -1) {
                r2 = new RegExp(this.source, nativ.replace.call(getNativeFlags(this), "g", ""));
                // Using `str.slice(match.index)` rather than `match[0]` in case lookahead allowed
                // matching due to characters outside the match
                nativ.replace.call(String(str).slice(match.index), r2, function () {
                    var i;
                    for (i = 1; i < arguments.length - 2; ++i) {
                        if (arguments[i] === undef) {
                            match[i] = undef;
                        }
                    }
                });
            }
            // Attach named capture properties
            if (this.xregexp && this.xregexp.captureNames) {
                for (i = 1; i < match.length; ++i) {
                    name = this.xregexp.captureNames[i - 1];
                    if (name) {
                        match[name] = match[i];
                    }
                }
            }
            // Fix browsers that increment `lastIndex` after zero-length matches
            if (this.global && !match[0].length && (this.lastIndex > match.index)) {
                this.lastIndex = match.index;
            }
        }
        if (!this.global) {
            this.lastIndex = origLastIndex; // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
        }
        return match;
    };

/**
 * Fixes browser bugs in the native `RegExp.prototype.test`. Calling `XRegExp.install('natives')`
 * uses this to override the native method.
 * @private
 * @param {String} str String to search.
 * @returns {Boolean} Whether the regex matched the provided value.
 */
    fixed.test = function (str) {
        // Do this the easy way :-)
        return !!fixed.exec.call(this, str);
    };

/**
 * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
 * bugs in the native `String.prototype.match`. Calling `XRegExp.install('natives')` uses this to
 * override the native method.
 * @private
 * @param {RegExp} regex Regex to search with.
 * @returns {Array} If `regex` uses flag g, an array of match strings or null. Without flag g, the
 *   result of calling `regex.exec(this)`.
 */
    fixed.match = function (regex) {
        if (!self.isRegExp(regex)) {
            regex = new RegExp(regex); // Use native `RegExp`
        } else if (regex.global) {
            var result = nativ.match.apply(this, arguments);
            regex.lastIndex = 0; // Fixes IE bug
            return result;
        }
        return fixed.exec.call(regex, this);
    };

/**
 * Adds support for `${n}` tokens for named and numbered backreferences in replacement text, and
 * provides named backreferences to replacement functions as `arguments[0].name`. Also fixes
 * browser bugs in replacement text syntax when performing a replacement using a nonregex search
 * value, and the value of a replacement regex's `lastIndex` property during replacement iterations
 * and upon completion. Note that this doesn't support SpiderMonkey's proprietary third (`flags`)
 * argument. Calling `XRegExp.install('natives')` uses this to override the native method. Use via
 * `XRegExp.replace` without overriding natives.
 * @private
 * @param {RegExp|String} search Search pattern to be replaced.
 * @param {String|Function} replacement Replacement string or a function invoked to create it.
 * @returns {String} New string with one or all matches replaced.
 */
    fixed.replace = function (search, replacement) {
        var isRegex = self.isRegExp(search), captureNames, result, str, origLastIndex;
        if (isRegex) {
            if (search.xregexp) {
                captureNames = search.xregexp.captureNames;
            }
            if (!search.global) {
                origLastIndex = search.lastIndex;
            }
        } else {
            search += "";
        }
        if (isType(replacement, "function")) {
            result = nativ.replace.call(String(this), search, function () {
                var args = arguments, i;
                if (captureNames) {
                    // Change the `arguments[0]` string primitive to a `String` object that can store properties
                    args[0] = new String(args[0]);
                    // Store named backreferences on the first argument
                    for (i = 0; i < captureNames.length; ++i) {
                        if (captureNames[i]) {
                            args[0][captureNames[i]] = args[i + 1];
                        }
                    }
                }
                // Update `lastIndex` before calling `replacement`.
                // Fixes IE, Chrome, Firefox, Safari bug (last tested IE 9, Chrome 17, Firefox 11, Safari 5.1)
                if (isRegex && search.global) {
                    search.lastIndex = args[args.length - 2] + args[0].length;
                }
                return replacement.apply(null, args);
            });
        } else {
            str = String(this); // Ensure `args[args.length - 1]` will be a string when given nonstring `this`
            result = nativ.replace.call(str, search, function () {
                var args = arguments; // Keep this function's `arguments` available through closure
                return nativ.replace.call(String(replacement), replacementToken, function ($0, $1, $2) {
                    var n;
                    // Named or numbered backreference with curly brackets
                    if ($1) {
                        /* XRegExp behavior for `${n}`:
                         * 1. Backreference to numbered capture, where `n` is 1+ digits. `0`, `00`, etc. is the entire match.
                         * 2. Backreference to named capture `n`, if it exists and is not a number overridden by numbered capture.
                         * 3. Otherwise, it's an error.
                         */
                        n = +$1; // Type-convert; drop leading zeros
                        if (n <= args.length - 3) {
                            return args[n] || "";
                        }
                        n = captureNames ? lastIndexOf(captureNames, $1) : -1;
                        if (n < 0) {
                            throw new SyntaxError("backreference to undefined group " + $0);
                        }
                        return args[n + 1] || "";
                    }
                    // Else, special variable or numbered backreference (without curly brackets)
                    if ($2 === "$") return "$";
                    if ($2 === "&" || +$2 === 0) return args[0]; // $&, $0 (not followed by 1-9), $00
                    if ($2 === "`") return args[args.length - 1].slice(0, args[args.length - 2]);
                    if ($2 === "'") return args[args.length - 1].slice(args[args.length - 2] + args[0].length);
                    // Else, numbered backreference (without curly brackets)
                    $2 = +$2; // Type-convert; drop leading zero
                    /* XRegExp behavior:
                     * - Backreferences without curly brackets end after 1 or 2 digits. Use `${..}` for more digits.
                     * - `$1` is an error if there are no capturing groups.
                     * - `$10` is an error if there are less than 10 capturing groups. Use `${1}0` instead.
                     * - `$01` is equivalent to `$1` if a capturing group exists, otherwise it's an error.
                     * - `$0` (not followed by 1-9), `$00`, and `$&` are the entire match.
                     * Native behavior, for comparison:
                     * - Backreferences end after 1 or 2 digits. Cannot use backreference to capturing group 100+.
                     * - `$1` is a literal `$1` if there are no capturing groups.
                     * - `$10` is `$1` followed by a literal `0` if there are less than 10 capturing groups.
                     * - `$01` is equivalent to `$1` if a capturing group exists, otherwise it's a literal `$01`.
                     * - `$0` is a literal `$0`. `$&` is the entire match.
                     */
                    if (!isNaN($2)) {
                        if ($2 > args.length - 3) {
                            throw new SyntaxError("backreference to undefined group " + $0);
                        }
                        return args[$2] || "";
                    }
                    throw new SyntaxError("invalid token " + $0);
                });
            });
        }
        if (isRegex) {
            if (search.global) {
                search.lastIndex = 0; // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
            } else {
                search.lastIndex = origLastIndex; // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
            }
        }
        return result;
    };

/**
 * Fixes browser bugs in the native `String.prototype.split`. Calling `XRegExp.install('natives')`
 * uses this to override the native method. Use via `XRegExp.split` without overriding natives.
 * @private
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 */
    fixed.split = function (separator, limit) {
        if (!self.isRegExp(separator)) {
            return nativ.split.apply(this, arguments); // use faster native method
        }
        var str = String(this),
            origLastIndex = separator.lastIndex,
            output = [],
            lastLastIndex = 0,
            lastLength;
        /* Values for `limit`, per the spec:
         * If undefined: pow(2,32) - 1
         * If 0, Infinity, or NaN: 0
         * If positive number: limit = floor(limit); if (limit >= pow(2,32)) limit -= pow(2,32);
         * If negative number: pow(2,32) - floor(abs(limit))
         * If other: Type-convert, then use the above rules
         */
        limit = (limit === undef ? -1 : limit) >>> 0;
        self.forEach(str, separator, function (match) {
            if ((match.index + match[0].length) > lastLastIndex) { // != `if (match[0].length)`
                output.push(str.slice(lastLastIndex, match.index));
                if (match.length > 1 && match.index < str.length) {
                    Array.prototype.push.apply(output, match.slice(1));
                }
                lastLength = match[0].length;
                lastLastIndex = match.index + lastLength;
            }
        });
        if (lastLastIndex === str.length) {
            if (!nativ.test.call(separator, "") || lastLength) {
                output.push("");
            }
        } else {
            output.push(str.slice(lastLastIndex));
        }
        separator.lastIndex = origLastIndex;
        return output.length > limit ? output.slice(0, limit) : output;
    };

/*--------------------------------------
 *  Built-in tokens
 *------------------------------------*/

// Shortcut
    add = addToken.on;

/* Letter identity escapes that natively match literal characters: \p, \P, etc.
 * Should be SyntaxErrors but are allowed in web reality. XRegExp makes them errors for cross-
 * browser consistency and to reserve their syntax, but lets them be superseded by XRegExp addons.
 */
    add(/\\([ABCE-RTUVXYZaeg-mopqyz]|c(?![A-Za-z])|u(?![\dA-Fa-f]{4})|x(?![\dA-Fa-f]{2}))/,
        function (match, scope) {
            // \B is allowed in default scope only
            if (match[1] === "B" && scope === defaultScope) {
                return match[0];
            }
            throw new SyntaxError("invalid escape " + match[0]);
        },
        {scope: "all"});

/* Empty character class: [] or [^]
 * Fixes a critical cross-browser syntax inconsistency. Unless this is standardized (per the spec),
 * regex syntax can't be accurately parsed because character class endings can't be determined.
 */
    add(/\[(\^?)]/,
        function (match) {
            // For cross-browser compatibility with ES3, convert [] to \b\B and [^] to [\s\S].
            // (?!) should work like \b\B, but is unreliable in Firefox
            return match[1] ? "[\\s\\S]" : "\\b\\B";
        });

/* Comment pattern: (?# )
 * Inline comments are an alternative to the line comments allowed in free-spacing mode (flag x).
 */
    add(/(?:\(\?#[^)]*\))+/,
        function (match) {
            // Keep tokens separated unless the following token is a quantifier
            return nativ.test.call(quantifier, match.input.slice(match.index + match[0].length)) ? "" : "(?:)";
        });

/* Named backreference: \k<name>
 * Backreference names can use the characters A-Z, a-z, 0-9, _, and $ only.
 */
    add(/\\k<([\w$]+)>/,
        function (match) {
            var index = isNaN(match[1]) ? (lastIndexOf(this.captureNames, match[1]) + 1) : +match[1],
                endIndex = match.index + match[0].length;
            if (!index || index > this.captureNames.length) {
                throw new SyntaxError("backreference to undefined group " + match[0]);
            }
            // Keep backreferences separate from subsequent literal numbers
            return "\\" + index + (
                endIndex === match.input.length || isNaN(match.input.charAt(endIndex)) ? "" : "(?:)"
            );
        });

/* Whitespace and line comments, in free-spacing mode (aka extended mode, flag x) only.
 */
    add(/(?:\s+|#.*)+/,
        function (match) {
            // Keep tokens separated unless the following token is a quantifier
            return nativ.test.call(quantifier, match.input.slice(match.index + match[0].length)) ? "" : "(?:)";
        },
        {
            trigger: function () {
                return this.hasFlag("x");
            },
            customFlags: "x"
        });

/* Dot, in dotall mode (aka singleline mode, flag s) only.
 */
    add(/\./,
        function () {
            return "[\\s\\S]";
        },
        {
            trigger: function () {
                return this.hasFlag("s");
            },
            customFlags: "s"
        });

/* Named capturing group; match the opening delimiter only: (?<name>
 * Capture names can use the characters A-Z, a-z, 0-9, _, and $ only. Names can't be integers.
 * Supports Python-style (?P<name> as an alternate syntax to avoid issues in recent Opera (which
 * natively supports the Python-style syntax). Otherwise, XRegExp might treat numbered
 * backreferences to Python-style named capture as octals.
 */
    add(/\(\?P?<([\w$]+)>/,
        function (match) {
            if (!isNaN(match[1])) {
                // Avoid incorrect lookups, since named backreferences are added to match arrays
                throw new SyntaxError("can't use integer as capture name " + match[0]);
            }
            this.captureNames.push(match[1]);
            this.hasNamedCapture = true;
            return "(";
        });

/* Numbered backreference or octal, plus any following digits: \0, \11, etc.
 * Octals except \0 not followed by 0-9 and backreferences to unopened capture groups throw an
 * error. Other matches are returned unaltered. IE <= 8 doesn't support backreferences greater than
 * \99 in regex syntax.
 */
    add(/\\(\d+)/,
        function (match, scope) {
            if (!(scope === defaultScope && /^[1-9]/.test(match[1]) && +match[1] <= this.captureNames.length) &&
                    match[1] !== "0") {
                throw new SyntaxError("can't use octal escape or backreference to undefined group " + match[0]);
            }
            return match[0];
        },
        {scope: "all"});

/* Capturing group; match the opening parenthesis only.
 * Required for support of named capturing groups. Also adds explicit capture mode (flag n).
 */
    add(/\((?!\?)/,
        function () {
            if (this.hasFlag("n")) {
                return "(?:";
            }
            this.captureNames.push(null);
            return "(";
        },
        {customFlags: "n"});

/*--------------------------------------
 *  Expose XRegExp
 *------------------------------------*/

// For CommonJS enviroments
    if (true) {
        exports.XRegExp = self;
    }

    return self;

}());


/***** unicode-base.js *****/

/*!
 * XRegExp Unicode Base v1.0.0
 * (c) 2008-2012 Steven Levithan <http://xregexp.com/>
 * MIT License
 * Uses Unicode 6.1 <http://unicode.org/>
 */

/**
 * Adds support for the `\p{L}` or `\p{Letter}` Unicode category. Addon packages for other Unicode
 * categories, scripts, blocks, and properties are available separately. All Unicode tokens can be
 * inverted using `\P{..}` or `\p{^..}`. Token names are case insensitive, and any spaces, hyphens,
 * and underscores are ignored.
 * @requires XRegExp
 */
(function (XRegExp) {
    "use strict";

    var unicode = {};

/*--------------------------------------
 *  Private helper functions
 *------------------------------------*/

// Generates a standardized token name (lowercase, with hyphens, spaces, and underscores removed)
    function slug(name) {
        return name.replace(/[- _]+/g, "").toLowerCase();
    }

// Expands a list of Unicode code points and ranges to be usable in a regex character class
    function expand(str) {
        return str.replace(/\w{4}/g, "\\u$&");
    }

// Adds leading zeros if shorter than four characters
    function pad4(str) {
        while (str.length < 4) {
            str = "0" + str;
        }
        return str;
    }

// Converts a hexadecimal number to decimal
    function dec(hex) {
        return parseInt(hex, 16);
    }

// Converts a decimal number to hexadecimal
    function hex(dec) {
        return parseInt(dec, 10).toString(16);
    }

// Inverts a list of Unicode code points and ranges
    function invert(range) {
        var output = [],
            lastEnd = -1,
            start;
        XRegExp.forEach(range, /\\u(\w{4})(?:-\\u(\w{4}))?/, function (m) {
            start = dec(m[1]);
            if (start > (lastEnd + 1)) {
                output.push("\\u" + pad4(hex(lastEnd + 1)));
                if (start > (lastEnd + 2)) {
                    output.push("-\\u" + pad4(hex(start - 1)));
                }
            }
            lastEnd = dec(m[2] || m[1]);
        });
        if (lastEnd < 0xFFFF) {
            output.push("\\u" + pad4(hex(lastEnd + 1)));
            if (lastEnd < 0xFFFE) {
                output.push("-\\uFFFF");
            }
        }
        return output.join("");
    }

// Generates an inverted token on first use
    function cacheInversion(item) {
        return unicode["^" + item] || (unicode["^" + item] = invert(unicode[item]));
    }

/*--------------------------------------
 *  Core functionality
 *------------------------------------*/

    XRegExp.install("extensibility");

/**
 * Adds to the list of Unicode properties that XRegExp regexes can match via \p{..} or \P{..}.
 * @memberOf XRegExp
 * @param {Object} pack Named sets of Unicode code points and ranges.
 * @param {Object} [aliases] Aliases for the primary token names.
 * @example
 *
 * XRegExp.addUnicodePackage({
 *   XDigit: '0030-00390041-00460061-0066' // 0-9A-Fa-f
 * }, {
 *   XDigit: 'Hexadecimal'
 * });
 */
    XRegExp.addUnicodePackage = function (pack, aliases) {
        var p;
        if (!XRegExp.isInstalled("extensibility")) {
            throw new Error("extensibility must be installed before adding Unicode packages");
        }
        if (pack) {
            for (p in pack) {
                if (pack.hasOwnProperty(p)) {
                    unicode[slug(p)] = expand(pack[p]);
                }
            }
        }
        if (aliases) {
            for (p in aliases) {
                if (aliases.hasOwnProperty(p)) {
                    unicode[slug(aliases[p])] = unicode[slug(p)];
                }
            }
        }
    };

/* Adds data for the Unicode `Letter` category. Addon packages include other categories, scripts,
 * blocks, and properties.
 */
    XRegExp.addUnicodePackage({
        L: "0041-005A0061-007A00AA00B500BA00C0-00D600D8-00F600F8-02C102C6-02D102E0-02E402EC02EE0370-037403760377037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-05270531-055605590561-058705D0-05EA05F0-05F20620-064A066E066F0671-06D306D506E506E606EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA07F407F507FA0800-0815081A082408280840-085808A008A2-08AC0904-0939093D09500958-09610971-09770979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10CF10CF20D05-0D0C0D0E-0D100D12-0D3A0D3D0D4E0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E460E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EC60EDC-0EDF0F000F40-0F470F49-0F6C0F88-0F8C1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10A0-10C510C710CD10D0-10FA10FC-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317D717DC1820-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541AA71B05-1B331B45-1B4B1B83-1BA01BAE1BAF1BBA-1BE51C00-1C231C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF11CF51CF61D00-1DBF1E00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-1FF41FF6-1FFC2071207F2090-209C21022107210A-211321152119-211D212421262128212A-212D212F-2139213C-213F2145-2149214E218321842C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2CF22CF32D00-2D252D272D2D2D30-2D672D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2E2F300530063031-3035303B303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-318E31A0-31BA31F0-31FF3400-4DB54E00-9FCCA000-A48CA4D0-A4FDA500-A60CA610-A61FA62AA62BA640-A66EA67F-A697A6A0-A6E5A717-A71FA722-A788A78B-A78EA790-A793A7A0-A7AAA7F8-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2A9CFAA00-AA28AA40-AA42AA44-AA4BAA60-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADB-AADDAAE0-AAEAAAF2-AAF4AB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2EABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC"
    }, {
        L: "Letter"
    });

/* Adds Unicode property syntax to XRegExp: \p{..}, \P{..}, \p{^..}
 */
    XRegExp.addToken(
        /\\([pP]){(\^?)([^}]*)}/,
        function (match, scope) {
            var inv = (match[1] === "P" || match[2]) ? "^" : "",
                item = slug(match[3]);
            // The double negative \P{^..} is invalid
            if (match[1] === "P" && match[2]) {
                throw new SyntaxError("invalid double negation \\P{^");
            }
            if (!unicode.hasOwnProperty(item)) {
                throw new SyntaxError("invalid or unknown Unicode property " + match[0]);
            }
            return scope === "class" ?
                    (inv ? cacheInversion(item) : unicode[item]) :
                    "[" + inv + unicode[item] + "]";
        },
        {scope: "all"}
    );

}(XRegExp));


/***** unicode-categories.js *****/

/*!
 * XRegExp Unicode Categories v1.2.0
 * (c) 2010-2012 Steven Levithan <http://xregexp.com/>
 * MIT License
 * Uses Unicode 6.1 <http://unicode.org/>
 */

/**
 * Adds support for all Unicode categories (aka properties) E.g., `\p{Lu}` or
 * `\p{Uppercase Letter}`. Token names are case insensitive, and any spaces, hyphens, and
 * underscores are ignored.
 * @requires XRegExp, XRegExp Unicode Base
 */
(function (XRegExp) {
    "use strict";

    if (!XRegExp.addUnicodePackage) {
        throw new ReferenceError("Unicode Base must be loaded before Unicode Categories");
    }

    XRegExp.install("extensibility");

    XRegExp.addUnicodePackage({
        //L: "", // Included in the Unicode Base addon
        Ll: "0061-007A00B500DF-00F600F8-00FF01010103010501070109010B010D010F01110113011501170119011B011D011F01210123012501270129012B012D012F01310133013501370138013A013C013E014001420144014601480149014B014D014F01510153015501570159015B015D015F01610163016501670169016B016D016F0171017301750177017A017C017E-0180018301850188018C018D019201950199-019B019E01A101A301A501A801AA01AB01AD01B001B401B601B901BA01BD-01BF01C601C901CC01CE01D001D201D401D601D801DA01DC01DD01DF01E101E301E501E701E901EB01ED01EF01F001F301F501F901FB01FD01FF02010203020502070209020B020D020F02110213021502170219021B021D021F02210223022502270229022B022D022F02310233-0239023C023F0240024202470249024B024D024F-02930295-02AF037103730377037B-037D039003AC-03CE03D003D103D5-03D703D903DB03DD03DF03E103E303E503E703E903EB03ED03EF-03F303F503F803FB03FC0430-045F04610463046504670469046B046D046F04710473047504770479047B047D047F0481048B048D048F04910493049504970499049B049D049F04A104A304A504A704A904AB04AD04AF04B104B304B504B704B904BB04BD04BF04C204C404C604C804CA04CC04CE04CF04D104D304D504D704D904DB04DD04DF04E104E304E504E704E904EB04ED04EF04F104F304F504F704F904FB04FD04FF05010503050505070509050B050D050F05110513051505170519051B051D051F05210523052505270561-05871D00-1D2B1D6B-1D771D79-1D9A1E011E031E051E071E091E0B1E0D1E0F1E111E131E151E171E191E1B1E1D1E1F1E211E231E251E271E291E2B1E2D1E2F1E311E331E351E371E391E3B1E3D1E3F1E411E431E451E471E491E4B1E4D1E4F1E511E531E551E571E591E5B1E5D1E5F1E611E631E651E671E691E6B1E6D1E6F1E711E731E751E771E791E7B1E7D1E7F1E811E831E851E871E891E8B1E8D1E8F1E911E931E95-1E9D1E9F1EA11EA31EA51EA71EA91EAB1EAD1EAF1EB11EB31EB51EB71EB91EBB1EBD1EBF1EC11EC31EC51EC71EC91ECB1ECD1ECF1ED11ED31ED51ED71ED91EDB1EDD1EDF1EE11EE31EE51EE71EE91EEB1EED1EEF1EF11EF31EF51EF71EF91EFB1EFD1EFF-1F071F10-1F151F20-1F271F30-1F371F40-1F451F50-1F571F60-1F671F70-1F7D1F80-1F871F90-1F971FA0-1FA71FB0-1FB41FB61FB71FBE1FC2-1FC41FC61FC71FD0-1FD31FD61FD71FE0-1FE71FF2-1FF41FF61FF7210A210E210F2113212F21342139213C213D2146-2149214E21842C30-2C5E2C612C652C662C682C6A2C6C2C712C732C742C76-2C7B2C812C832C852C872C892C8B2C8D2C8F2C912C932C952C972C992C9B2C9D2C9F2CA12CA32CA52CA72CA92CAB2CAD2CAF2CB12CB32CB52CB72CB92CBB2CBD2CBF2CC12CC32CC52CC72CC92CCB2CCD2CCF2CD12CD32CD52CD72CD92CDB2CDD2CDF2CE12CE32CE42CEC2CEE2CF32D00-2D252D272D2DA641A643A645A647A649A64BA64DA64FA651A653A655A657A659A65BA65DA65FA661A663A665A667A669A66BA66DA681A683A685A687A689A68BA68DA68FA691A693A695A697A723A725A727A729A72BA72DA72F-A731A733A735A737A739A73BA73DA73FA741A743A745A747A749A74BA74DA74FA751A753A755A757A759A75BA75DA75FA761A763A765A767A769A76BA76DA76FA771-A778A77AA77CA77FA781A783A785A787A78CA78EA791A793A7A1A7A3A7A5A7A7A7A9A7FAFB00-FB06FB13-FB17FF41-FF5A",
        Lu: "0041-005A00C0-00D600D8-00DE01000102010401060108010A010C010E01100112011401160118011A011C011E01200122012401260128012A012C012E01300132013401360139013B013D013F0141014301450147014A014C014E01500152015401560158015A015C015E01600162016401660168016A016C016E017001720174017601780179017B017D018101820184018601870189-018B018E-0191019301940196-0198019C019D019F01A001A201A401A601A701A901AC01AE01AF01B1-01B301B501B701B801BC01C401C701CA01CD01CF01D101D301D501D701D901DB01DE01E001E201E401E601E801EA01EC01EE01F101F401F6-01F801FA01FC01FE02000202020402060208020A020C020E02100212021402160218021A021C021E02200222022402260228022A022C022E02300232023A023B023D023E02410243-02460248024A024C024E03700372037603860388-038A038C038E038F0391-03A103A3-03AB03CF03D2-03D403D803DA03DC03DE03E003E203E403E603E803EA03EC03EE03F403F703F903FA03FD-042F04600462046404660468046A046C046E04700472047404760478047A047C047E0480048A048C048E04900492049404960498049A049C049E04A004A204A404A604A804AA04AC04AE04B004B204B404B604B804BA04BC04BE04C004C104C304C504C704C904CB04CD04D004D204D404D604D804DA04DC04DE04E004E204E404E604E804EA04EC04EE04F004F204F404F604F804FA04FC04FE05000502050405060508050A050C050E05100512051405160518051A051C051E05200522052405260531-055610A0-10C510C710CD1E001E021E041E061E081E0A1E0C1E0E1E101E121E141E161E181E1A1E1C1E1E1E201E221E241E261E281E2A1E2C1E2E1E301E321E341E361E381E3A1E3C1E3E1E401E421E441E461E481E4A1E4C1E4E1E501E521E541E561E581E5A1E5C1E5E1E601E621E641E661E681E6A1E6C1E6E1E701E721E741E761E781E7A1E7C1E7E1E801E821E841E861E881E8A1E8C1E8E1E901E921E941E9E1EA01EA21EA41EA61EA81EAA1EAC1EAE1EB01EB21EB41EB61EB81EBA1EBC1EBE1EC01EC21EC41EC61EC81ECA1ECC1ECE1ED01ED21ED41ED61ED81EDA1EDC1EDE1EE01EE21EE41EE61EE81EEA1EEC1EEE1EF01EF21EF41EF61EF81EFA1EFC1EFE1F08-1F0F1F18-1F1D1F28-1F2F1F38-1F3F1F48-1F4D1F591F5B1F5D1F5F1F68-1F6F1FB8-1FBB1FC8-1FCB1FD8-1FDB1FE8-1FEC1FF8-1FFB21022107210B-210D2110-211221152119-211D212421262128212A-212D2130-2133213E213F214521832C00-2C2E2C602C62-2C642C672C692C6B2C6D-2C702C722C752C7E-2C802C822C842C862C882C8A2C8C2C8E2C902C922C942C962C982C9A2C9C2C9E2CA02CA22CA42CA62CA82CAA2CAC2CAE2CB02CB22CB42CB62CB82CBA2CBC2CBE2CC02CC22CC42CC62CC82CCA2CCC2CCE2CD02CD22CD42CD62CD82CDA2CDC2CDE2CE02CE22CEB2CED2CF2A640A642A644A646A648A64AA64CA64EA650A652A654A656A658A65AA65CA65EA660A662A664A666A668A66AA66CA680A682A684A686A688A68AA68CA68EA690A692A694A696A722A724A726A728A72AA72CA72EA732A734A736A738A73AA73CA73EA740A742A744A746A748A74AA74CA74EA750A752A754A756A758A75AA75CA75EA760A762A764A766A768A76AA76CA76EA779A77BA77DA77EA780A782A784A786A78BA78DA790A792A7A0A7A2A7A4A7A6A7A8A7AAFF21-FF3A",
        Lt: "01C501C801CB01F21F88-1F8F1F98-1F9F1FA8-1FAF1FBC1FCC1FFC",
        Lm: "02B0-02C102C6-02D102E0-02E402EC02EE0374037A0559064006E506E607F407F507FA081A0824082809710E460EC610FC17D718431AA71C78-1C7D1D2C-1D6A1D781D9B-1DBF2071207F2090-209C2C7C2C7D2D6F2E2F30053031-3035303B309D309E30FC-30FEA015A4F8-A4FDA60CA67FA717-A71FA770A788A7F8A7F9A9CFAA70AADDAAF3AAF4FF70FF9EFF9F",
        Lo: "00AA00BA01BB01C0-01C3029405D0-05EA05F0-05F20620-063F0641-064A066E066F0671-06D306D506EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA0800-08150840-085808A008A2-08AC0904-0939093D09500958-09610972-09770979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10CF10CF20D05-0D0C0D0E-0D100D12-0D3A0D3D0D4E0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E450E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EDC-0EDF0F000F40-0F470F49-0F6C0F88-0F8C1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10D0-10FA10FD-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317DC1820-18421844-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541B05-1B331B45-1B4B1B83-1BA01BAE1BAF1BBA-1BE51C00-1C231C4D-1C4F1C5A-1C771CE9-1CEC1CEE-1CF11CF51CF62135-21382D30-2D672D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE3006303C3041-3096309F30A1-30FA30FF3105-312D3131-318E31A0-31BA31F0-31FF3400-4DB54E00-9FCCA000-A014A016-A48CA4D0-A4F7A500-A60BA610-A61FA62AA62BA66EA6A0-A6E5A7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2AA00-AA28AA40-AA42AA44-AA4BAA60-AA6FAA71-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADBAADCAAE0-AAEAAAF2AB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2EABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA6DFA70-FAD9FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF66-FF6FFF71-FF9DFFA0-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
        M: "0300-036F0483-04890591-05BD05BF05C105C205C405C505C70610-061A064B-065F067006D6-06DC06DF-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0859-085B08E4-08FE0900-0903093A-093C093E-094F0951-0957096209630981-098309BC09BE-09C409C709C809CB-09CD09D709E209E30A01-0A030A3C0A3E-0A420A470A480A4B-0A4D0A510A700A710A750A81-0A830ABC0ABE-0AC50AC7-0AC90ACB-0ACD0AE20AE30B01-0B030B3C0B3E-0B440B470B480B4B-0B4D0B560B570B620B630B820BBE-0BC20BC6-0BC80BCA-0BCD0BD70C01-0C030C3E-0C440C46-0C480C4A-0C4D0C550C560C620C630C820C830CBC0CBE-0CC40CC6-0CC80CCA-0CCD0CD50CD60CE20CE30D020D030D3E-0D440D46-0D480D4A-0D4D0D570D620D630D820D830DCA0DCF-0DD40DD60DD8-0DDF0DF20DF30E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F3E0F3F0F71-0F840F860F870F8D-0F970F99-0FBC0FC6102B-103E1056-1059105E-10601062-10641067-106D1071-10741082-108D108F109A-109D135D-135F1712-17141732-1734175217531772177317B4-17D317DD180B-180D18A91920-192B1930-193B19B0-19C019C819C91A17-1A1B1A55-1A5E1A60-1A7C1A7F1B00-1B041B34-1B441B6B-1B731B80-1B821BA1-1BAD1BE6-1BF31C24-1C371CD0-1CD21CD4-1CE81CED1CF2-1CF41DC0-1DE61DFC-1DFF20D0-20F02CEF-2CF12D7F2DE0-2DFF302A-302F3099309AA66F-A672A674-A67DA69FA6F0A6F1A802A806A80BA823-A827A880A881A8B4-A8C4A8E0-A8F1A926-A92DA947-A953A980-A983A9B3-A9C0AA29-AA36AA43AA4CAA4DAA7BAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1AAEB-AAEFAAF5AAF6ABE3-ABEAABECABEDFB1EFE00-FE0FFE20-FE26",
        Mn: "0300-036F0483-04870591-05BD05BF05C105C205C405C505C70610-061A064B-065F067006D6-06DC06DF-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0859-085B08E4-08FE0900-0902093A093C0941-0948094D0951-095709620963098109BC09C1-09C409CD09E209E30A010A020A3C0A410A420A470A480A4B-0A4D0A510A700A710A750A810A820ABC0AC1-0AC50AC70AC80ACD0AE20AE30B010B3C0B3F0B41-0B440B4D0B560B620B630B820BC00BCD0C3E-0C400C46-0C480C4A-0C4D0C550C560C620C630CBC0CBF0CC60CCC0CCD0CE20CE30D41-0D440D4D0D620D630DCA0DD2-0DD40DD60E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F71-0F7E0F80-0F840F860F870F8D-0F970F99-0FBC0FC6102D-10301032-10371039103A103D103E10581059105E-10601071-1074108210851086108D109D135D-135F1712-17141732-1734175217531772177317B417B517B7-17BD17C617C9-17D317DD180B-180D18A91920-19221927192819321939-193B1A171A181A561A58-1A5E1A601A621A65-1A6C1A73-1A7C1A7F1B00-1B031B341B36-1B3A1B3C1B421B6B-1B731B801B811BA2-1BA51BA81BA91BAB1BE61BE81BE91BED1BEF-1BF11C2C-1C331C361C371CD0-1CD21CD4-1CE01CE2-1CE81CED1CF41DC0-1DE61DFC-1DFF20D0-20DC20E120E5-20F02CEF-2CF12D7F2DE0-2DFF302A-302D3099309AA66FA674-A67DA69FA6F0A6F1A802A806A80BA825A826A8C4A8E0-A8F1A926-A92DA947-A951A980-A982A9B3A9B6-A9B9A9BCAA29-AA2EAA31AA32AA35AA36AA43AA4CAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1AAECAAEDAAF6ABE5ABE8ABEDFB1EFE00-FE0FFE20-FE26",
        Mc: "0903093B093E-09400949-094C094E094F0982098309BE-09C009C709C809CB09CC09D70A030A3E-0A400A830ABE-0AC00AC90ACB0ACC0B020B030B3E0B400B470B480B4B0B4C0B570BBE0BBF0BC10BC20BC6-0BC80BCA-0BCC0BD70C01-0C030C41-0C440C820C830CBE0CC0-0CC40CC70CC80CCA0CCB0CD50CD60D020D030D3E-0D400D46-0D480D4A-0D4C0D570D820D830DCF-0DD10DD8-0DDF0DF20DF30F3E0F3F0F7F102B102C10311038103B103C105610571062-10641067-106D108310841087-108C108F109A-109C17B617BE-17C517C717C81923-19261929-192B193019311933-193819B0-19C019C819C91A19-1A1B1A551A571A611A631A641A6D-1A721B041B351B3B1B3D-1B411B431B441B821BA11BA61BA71BAA1BAC1BAD1BE71BEA-1BEC1BEE1BF21BF31C24-1C2B1C341C351CE11CF21CF3302E302FA823A824A827A880A881A8B4-A8C3A952A953A983A9B4A9B5A9BAA9BBA9BD-A9C0AA2FAA30AA33AA34AA4DAA7BAAEBAAEEAAEFAAF5ABE3ABE4ABE6ABE7ABE9ABEAABEC",
        Me: "0488048920DD-20E020E2-20E4A670-A672",
        N: "0030-003900B200B300B900BC-00BE0660-066906F0-06F907C0-07C90966-096F09E6-09EF09F4-09F90A66-0A6F0AE6-0AEF0B66-0B6F0B72-0B770BE6-0BF20C66-0C6F0C78-0C7E0CE6-0CEF0D66-0D750E50-0E590ED0-0ED90F20-0F331040-10491090-10991369-137C16EE-16F017E0-17E917F0-17F91810-18191946-194F19D0-19DA1A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C5920702074-20792080-20892150-21822185-21892460-249B24EA-24FF2776-27932CFD30073021-30293038-303A3192-31953220-32293248-324F3251-325F3280-328932B1-32BFA620-A629A6E6-A6EFA830-A835A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",
        Nd: "0030-00390660-066906F0-06F907C0-07C90966-096F09E6-09EF0A66-0A6F0AE6-0AEF0B66-0B6F0BE6-0BEF0C66-0C6F0CE6-0CEF0D66-0D6F0E50-0E590ED0-0ED90F20-0F291040-10491090-109917E0-17E91810-18191946-194F19D0-19D91A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C59A620-A629A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",
        Nl: "16EE-16F02160-21822185-218830073021-30293038-303AA6E6-A6EF",
        No: "00B200B300B900BC-00BE09F4-09F90B72-0B770BF0-0BF20C78-0C7E0D70-0D750F2A-0F331369-137C17F0-17F919DA20702074-20792080-20892150-215F21892460-249B24EA-24FF2776-27932CFD3192-31953220-32293248-324F3251-325F3280-328932B1-32BFA830-A835",
        P: "0021-00230025-002A002C-002F003A003B003F0040005B-005D005F007B007D00A100A700AB00B600B700BB00BF037E0387055A-055F0589058A05BE05C005C305C605F305F40609060A060C060D061B061E061F066A-066D06D40700-070D07F7-07F90830-083E085E0964096509700AF00DF40E4F0E5A0E5B0F04-0F120F140F3A-0F3D0F850FD0-0FD40FD90FDA104A-104F10FB1360-13681400166D166E169B169C16EB-16ED1735173617D4-17D617D8-17DA1800-180A194419451A1E1A1F1AA0-1AA61AA8-1AAD1B5A-1B601BFC-1BFF1C3B-1C3F1C7E1C7F1CC0-1CC71CD32010-20272030-20432045-20512053-205E207D207E208D208E2329232A2768-277527C527C627E6-27EF2983-299829D8-29DB29FC29FD2CF9-2CFC2CFE2CFF2D702E00-2E2E2E30-2E3B3001-30033008-30113014-301F3030303D30A030FBA4FEA4FFA60D-A60FA673A67EA6F2-A6F7A874-A877A8CEA8CFA8F8-A8FAA92EA92FA95FA9C1-A9CDA9DEA9DFAA5C-AA5FAADEAADFAAF0AAF1ABEBFD3EFD3FFE10-FE19FE30-FE52FE54-FE61FE63FE68FE6AFE6BFF01-FF03FF05-FF0AFF0C-FF0FFF1AFF1BFF1FFF20FF3B-FF3DFF3FFF5BFF5DFF5F-FF65",
        Pd: "002D058A05BE140018062010-20152E172E1A2E3A2E3B301C303030A0FE31FE32FE58FE63FF0D",
        Ps: "0028005B007B0F3A0F3C169B201A201E2045207D208D23292768276A276C276E27702772277427C527E627E827EA27EC27EE2983298529872989298B298D298F299129932995299729D829DA29FC2E222E242E262E283008300A300C300E3010301430163018301A301DFD3EFE17FE35FE37FE39FE3BFE3DFE3FFE41FE43FE47FE59FE5BFE5DFF08FF3BFF5BFF5FFF62",
        Pe: "0029005D007D0F3B0F3D169C2046207E208E232A2769276B276D276F27712773277527C627E727E927EB27ED27EF298429862988298A298C298E2990299229942996299829D929DB29FD2E232E252E272E293009300B300D300F3011301530173019301B301E301FFD3FFE18FE36FE38FE3AFE3CFE3EFE40FE42FE44FE48FE5AFE5CFE5EFF09FF3DFF5DFF60FF63",
        Pi: "00AB2018201B201C201F20392E022E042E092E0C2E1C2E20",
        Pf: "00BB2019201D203A2E032E052E0A2E0D2E1D2E21",
        Pc: "005F203F20402054FE33FE34FE4D-FE4FFF3F",
        Po: "0021-00230025-0027002A002C002E002F003A003B003F0040005C00A100A700B600B700BF037E0387055A-055F058905C005C305C605F305F40609060A060C060D061B061E061F066A-066D06D40700-070D07F7-07F90830-083E085E0964096509700AF00DF40E4F0E5A0E5B0F04-0F120F140F850FD0-0FD40FD90FDA104A-104F10FB1360-1368166D166E16EB-16ED1735173617D4-17D617D8-17DA1800-18051807-180A194419451A1E1A1F1AA0-1AA61AA8-1AAD1B5A-1B601BFC-1BFF1C3B-1C3F1C7E1C7F1CC0-1CC71CD3201620172020-20272030-2038203B-203E2041-20432047-205120532055-205E2CF9-2CFC2CFE2CFF2D702E002E012E06-2E082E0B2E0E-2E162E182E192E1B2E1E2E1F2E2A-2E2E2E30-2E393001-3003303D30FBA4FEA4FFA60D-A60FA673A67EA6F2-A6F7A874-A877A8CEA8CFA8F8-A8FAA92EA92FA95FA9C1-A9CDA9DEA9DFAA5C-AA5FAADEAADFAAF0AAF1ABEBFE10-FE16FE19FE30FE45FE46FE49-FE4CFE50-FE52FE54-FE57FE5F-FE61FE68FE6AFE6BFF01-FF03FF05-FF07FF0AFF0CFF0EFF0FFF1AFF1BFF1FFF20FF3CFF61FF64FF65",
        S: "0024002B003C-003E005E0060007C007E00A2-00A600A800A900AC00AE-00B100B400B800D700F702C2-02C502D2-02DF02E5-02EB02ED02EF-02FF03750384038503F60482058F0606-0608060B060E060F06DE06E906FD06FE07F609F209F309FA09FB0AF10B700BF3-0BFA0C7F0D790E3F0F01-0F030F130F15-0F170F1A-0F1F0F340F360F380FBE-0FC50FC7-0FCC0FCE0FCF0FD5-0FD8109E109F1390-139917DB194019DE-19FF1B61-1B6A1B74-1B7C1FBD1FBF-1FC11FCD-1FCF1FDD-1FDF1FED-1FEF1FFD1FFE20442052207A-207C208A-208C20A0-20B9210021012103-21062108210921142116-2118211E-2123212521272129212E213A213B2140-2144214A-214D214F2190-2328232B-23F32400-24262440-244A249C-24E92500-26FF2701-27672794-27C427C7-27E527F0-29822999-29D729DC-29FB29FE-2B4C2B50-2B592CE5-2CEA2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB300430123013302030363037303E303F309B309C319031913196-319F31C0-31E33200-321E322A-324732503260-327F328A-32B032C0-32FE3300-33FF4DC0-4DFFA490-A4C6A700-A716A720A721A789A78AA828-A82BA836-A839AA77-AA79FB29FBB2-FBC1FDFCFDFDFE62FE64-FE66FE69FF04FF0BFF1C-FF1EFF3EFF40FF5CFF5EFFE0-FFE6FFE8-FFEEFFFCFFFD",
        Sm: "002B003C-003E007C007E00AC00B100D700F703F60606-060820442052207A-207C208A-208C21182140-2144214B2190-2194219A219B21A021A321A621AE21CE21CF21D221D421F4-22FF2308-230B23202321237C239B-23B323DC-23E125B725C125F8-25FF266F27C0-27C427C7-27E527F0-27FF2900-29822999-29D729DC-29FB29FE-2AFF2B30-2B442B47-2B4CFB29FE62FE64-FE66FF0BFF1C-FF1EFF5CFF5EFFE2FFE9-FFEC",
        Sc: "002400A2-00A5058F060B09F209F309FB0AF10BF90E3F17DB20A0-20B9A838FDFCFE69FF04FFE0FFE1FFE5FFE6",
        Sk: "005E006000A800AF00B400B802C2-02C502D2-02DF02E5-02EB02ED02EF-02FF0375038403851FBD1FBF-1FC11FCD-1FCF1FDD-1FDF1FED-1FEF1FFD1FFE309B309CA700-A716A720A721A789A78AFBB2-FBC1FF3EFF40FFE3",
        So: "00A600A900AE00B00482060E060F06DE06E906FD06FE07F609FA0B700BF3-0BF80BFA0C7F0D790F01-0F030F130F15-0F170F1A-0F1F0F340F360F380FBE-0FC50FC7-0FCC0FCE0FCF0FD5-0FD8109E109F1390-1399194019DE-19FF1B61-1B6A1B74-1B7C210021012103-210621082109211421162117211E-2123212521272129212E213A213B214A214C214D214F2195-2199219C-219F21A121A221A421A521A7-21AD21AF-21CD21D021D121D321D5-21F32300-2307230C-231F2322-2328232B-237B237D-239A23B4-23DB23E2-23F32400-24262440-244A249C-24E92500-25B625B8-25C025C2-25F72600-266E2670-26FF2701-27672794-27BF2800-28FF2B00-2B2F2B452B462B50-2B592CE5-2CEA2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB300430123013302030363037303E303F319031913196-319F31C0-31E33200-321E322A-324732503260-327F328A-32B032C0-32FE3300-33FF4DC0-4DFFA490-A4C6A828-A82BA836A837A839AA77-AA79FDFDFFE4FFE8FFEDFFEEFFFCFFFD",
        Z: "002000A01680180E2000-200A20282029202F205F3000",
        Zs: "002000A01680180E2000-200A202F205F3000",
        Zl: "2028",
        Zp: "2029",
        C: "0000-001F007F-009F00AD03780379037F-0383038B038D03A20528-05300557055805600588058B-058E059005C8-05CF05EB-05EF05F5-0605061C061D06DD070E070F074B074C07B2-07BF07FB-07FF082E082F083F085C085D085F-089F08A108AD-08E308FF097809800984098D098E0991099209A909B109B3-09B509BA09BB09C509C609C909CA09CF-09D609D8-09DB09DE09E409E509FC-0A000A040A0B-0A0E0A110A120A290A310A340A370A3A0A3B0A3D0A43-0A460A490A4A0A4E-0A500A52-0A580A5D0A5F-0A650A76-0A800A840A8E0A920AA90AB10AB40ABA0ABB0AC60ACA0ACE0ACF0AD1-0ADF0AE40AE50AF2-0B000B040B0D0B0E0B110B120B290B310B340B3A0B3B0B450B460B490B4A0B4E-0B550B58-0B5B0B5E0B640B650B78-0B810B840B8B-0B8D0B910B96-0B980B9B0B9D0BA0-0BA20BA5-0BA70BAB-0BAD0BBA-0BBD0BC3-0BC50BC90BCE0BCF0BD1-0BD60BD8-0BE50BFB-0C000C040C0D0C110C290C340C3A-0C3C0C450C490C4E-0C540C570C5A-0C5F0C640C650C70-0C770C800C810C840C8D0C910CA90CB40CBA0CBB0CC50CC90CCE-0CD40CD7-0CDD0CDF0CE40CE50CF00CF3-0D010D040D0D0D110D3B0D3C0D450D490D4F-0D560D58-0D5F0D640D650D76-0D780D800D810D840D97-0D990DB20DBC0DBE0DBF0DC7-0DC90DCB-0DCE0DD50DD70DE0-0DF10DF5-0E000E3B-0E3E0E5C-0E800E830E850E860E890E8B0E8C0E8E-0E930E980EA00EA40EA60EA80EA90EAC0EBA0EBE0EBF0EC50EC70ECE0ECF0EDA0EDB0EE0-0EFF0F480F6D-0F700F980FBD0FCD0FDB-0FFF10C610C8-10CC10CE10CF1249124E124F12571259125E125F1289128E128F12B112B612B712BF12C112C612C712D7131113161317135B135C137D-137F139A-139F13F5-13FF169D-169F16F1-16FF170D1715-171F1737-173F1754-175F176D17711774-177F17DE17DF17EA-17EF17FA-17FF180F181A-181F1878-187F18AB-18AF18F6-18FF191D-191F192C-192F193C-193F1941-1943196E196F1975-197F19AC-19AF19CA-19CF19DB-19DD1A1C1A1D1A5F1A7D1A7E1A8A-1A8F1A9A-1A9F1AAE-1AFF1B4C-1B4F1B7D-1B7F1BF4-1BFB1C38-1C3A1C4A-1C4C1C80-1CBF1CC8-1CCF1CF7-1CFF1DE7-1DFB1F161F171F1E1F1F1F461F471F4E1F4F1F581F5A1F5C1F5E1F7E1F7F1FB51FC51FD41FD51FDC1FF01FF11FF51FFF200B-200F202A-202E2060-206F20722073208F209D-209F20BA-20CF20F1-20FF218A-218F23F4-23FF2427-243F244B-245F27002B4D-2B4F2B5A-2BFF2C2F2C5F2CF4-2CF82D262D28-2D2C2D2E2D2F2D68-2D6E2D71-2D7E2D97-2D9F2DA72DAF2DB72DBF2DC72DCF2DD72DDF2E3C-2E7F2E9A2EF4-2EFF2FD6-2FEF2FFC-2FFF3040309730983100-3104312E-3130318F31BB-31BF31E4-31EF321F32FF4DB6-4DBF9FCD-9FFFA48D-A48FA4C7-A4CFA62C-A63FA698-A69EA6F8-A6FFA78FA794-A79FA7AB-A7F7A82C-A82FA83A-A83FA878-A87FA8C5-A8CDA8DA-A8DFA8FC-A8FFA954-A95EA97D-A97FA9CEA9DA-A9DDA9E0-A9FFAA37-AA3FAA4EAA4FAA5AAA5BAA7C-AA7FAAC3-AADAAAF7-AB00AB07AB08AB0FAB10AB17-AB1FAB27AB2F-ABBFABEEABEFABFA-ABFFD7A4-D7AFD7C7-D7CAD7FC-F8FFFA6EFA6FFADA-FAFFFB07-FB12FB18-FB1CFB37FB3DFB3FFB42FB45FBC2-FBD2FD40-FD4FFD90FD91FDC8-FDEFFDFEFDFFFE1A-FE1FFE27-FE2FFE53FE67FE6C-FE6FFE75FEFD-FF00FFBF-FFC1FFC8FFC9FFD0FFD1FFD8FFD9FFDD-FFDFFFE7FFEF-FFFBFFFEFFFF",
        Cc: "0000-001F007F-009F",
        Cf: "00AD0600-060406DD070F200B-200F202A-202E2060-2064206A-206FFEFFFFF9-FFFB",
        Co: "E000-F8FF",
        Cs: "D800-DFFF",
        Cn: "03780379037F-0383038B038D03A20528-05300557055805600588058B-058E059005C8-05CF05EB-05EF05F5-05FF0605061C061D070E074B074C07B2-07BF07FB-07FF082E082F083F085C085D085F-089F08A108AD-08E308FF097809800984098D098E0991099209A909B109B3-09B509BA09BB09C509C609C909CA09CF-09D609D8-09DB09DE09E409E509FC-0A000A040A0B-0A0E0A110A120A290A310A340A370A3A0A3B0A3D0A43-0A460A490A4A0A4E-0A500A52-0A580A5D0A5F-0A650A76-0A800A840A8E0A920AA90AB10AB40ABA0ABB0AC60ACA0ACE0ACF0AD1-0ADF0AE40AE50AF2-0B000B040B0D0B0E0B110B120B290B310B340B3A0B3B0B450B460B490B4A0B4E-0B550B58-0B5B0B5E0B640B650B78-0B810B840B8B-0B8D0B910B96-0B980B9B0B9D0BA0-0BA20BA5-0BA70BAB-0BAD0BBA-0BBD0BC3-0BC50BC90BCE0BCF0BD1-0BD60BD8-0BE50BFB-0C000C040C0D0C110C290C340C3A-0C3C0C450C490C4E-0C540C570C5A-0C5F0C640C650C70-0C770C800C810C840C8D0C910CA90CB40CBA0CBB0CC50CC90CCE-0CD40CD7-0CDD0CDF0CE40CE50CF00CF3-0D010D040D0D0D110D3B0D3C0D450D490D4F-0D560D58-0D5F0D640D650D76-0D780D800D810D840D97-0D990DB20DBC0DBE0DBF0DC7-0DC90DCB-0DCE0DD50DD70DE0-0DF10DF5-0E000E3B-0E3E0E5C-0E800E830E850E860E890E8B0E8C0E8E-0E930E980EA00EA40EA60EA80EA90EAC0EBA0EBE0EBF0EC50EC70ECE0ECF0EDA0EDB0EE0-0EFF0F480F6D-0F700F980FBD0FCD0FDB-0FFF10C610C8-10CC10CE10CF1249124E124F12571259125E125F1289128E128F12B112B612B712BF12C112C612C712D7131113161317135B135C137D-137F139A-139F13F5-13FF169D-169F16F1-16FF170D1715-171F1737-173F1754-175F176D17711774-177F17DE17DF17EA-17EF17FA-17FF180F181A-181F1878-187F18AB-18AF18F6-18FF191D-191F192C-192F193C-193F1941-1943196E196F1975-197F19AC-19AF19CA-19CF19DB-19DD1A1C1A1D1A5F1A7D1A7E1A8A-1A8F1A9A-1A9F1AAE-1AFF1B4C-1B4F1B7D-1B7F1BF4-1BFB1C38-1C3A1C4A-1C4C1C80-1CBF1CC8-1CCF1CF7-1CFF1DE7-1DFB1F161F171F1E1F1F1F461F471F4E1F4F1F581F5A1F5C1F5E1F7E1F7F1FB51FC51FD41FD51FDC1FF01FF11FF51FFF2065-206920722073208F209D-209F20BA-20CF20F1-20FF218A-218F23F4-23FF2427-243F244B-245F27002B4D-2B4F2B5A-2BFF2C2F2C5F2CF4-2CF82D262D28-2D2C2D2E2D2F2D68-2D6E2D71-2D7E2D97-2D9F2DA72DAF2DB72DBF2DC72DCF2DD72DDF2E3C-2E7F2E9A2EF4-2EFF2FD6-2FEF2FFC-2FFF3040309730983100-3104312E-3130318F31BB-31BF31E4-31EF321F32FF4DB6-4DBF9FCD-9FFFA48D-A48FA4C7-A4CFA62C-A63FA698-A69EA6F8-A6FFA78FA794-A79FA7AB-A7F7A82C-A82FA83A-A83FA878-A87FA8C5-A8CDA8DA-A8DFA8FC-A8FFA954-A95EA97D-A97FA9CEA9DA-A9DDA9E0-A9FFAA37-AA3FAA4EAA4FAA5AAA5BAA7C-AA7FAAC3-AADAAAF7-AB00AB07AB08AB0FAB10AB17-AB1FAB27AB2F-ABBFABEEABEFABFA-ABFFD7A4-D7AFD7C7-D7CAD7FC-D7FFFA6EFA6FFADA-FAFFFB07-FB12FB18-FB1CFB37FB3DFB3FFB42FB45FBC2-FBD2FD40-FD4FFD90FD91FDC8-FDEFFDFEFDFFFE1A-FE1FFE27-FE2FFE53FE67FE6C-FE6FFE75FEFDFEFEFF00FFBF-FFC1FFC8FFC9FFD0FFD1FFD8FFD9FFDD-FFDFFFE7FFEF-FFF8FFFEFFFF"
    }, {
        //L: "Letter", // Included in the Unicode Base addon
        Ll: "Lowercase_Letter",
        Lu: "Uppercase_Letter",
        Lt: "Titlecase_Letter",
        Lm: "Modifier_Letter",
        Lo: "Other_Letter",
        M: "Mark",
        Mn: "Nonspacing_Mark",
        Mc: "Spacing_Mark",
        Me: "Enclosing_Mark",
        N: "Number",
        Nd: "Decimal_Number",
        Nl: "Letter_Number",
        No: "Other_Number",
        P: "Punctuation",
        Pd: "Dash_Punctuation",
        Ps: "Open_Punctuation",
        Pe: "Close_Punctuation",
        Pi: "Initial_Punctuation",
        Pf: "Final_Punctuation",
        Pc: "Connector_Punctuation",
        Po: "Other_Punctuation",
        S: "Symbol",
        Sm: "Math_Symbol",
        Sc: "Currency_Symbol",
        Sk: "Modifier_Symbol",
        So: "Other_Symbol",
        Z: "Separator",
        Zs: "Space_Separator",
        Zl: "Line_Separator",
        Zp: "Paragraph_Separator",
        C: "Other",
        Cc: "Control",
        Cf: "Format",
        Co: "Private_Use",
        Cs: "Surrogate",
        Cn: "Unassigned"
    });

}(XRegExp));


/***** unicode-scripts.js *****/

/*!
 * XRegExp Unicode Scripts v1.2.0
 * (c) 2010-2012 Steven Levithan <http://xregexp.com/>
 * MIT License
 * Uses Unicode 6.1 <http://unicode.org/>
 */

/**
 * Adds support for all Unicode scripts in the Basic Multilingual Plane (U+0000-U+FFFF).
 * E.g., `\p{Latin}`. Token names are case insensitive, and any spaces, hyphens, and underscores
 * are ignored.
 * @requires XRegExp, XRegExp Unicode Base
 */
(function (XRegExp) {
    "use strict";

    if (!XRegExp.addUnicodePackage) {
        throw new ReferenceError("Unicode Base must be loaded before Unicode Scripts");
    }

    XRegExp.install("extensibility");

    XRegExp.addUnicodePackage({
        Arabic: "0600-06040606-060B060D-061A061E0620-063F0641-064A0656-065E066A-066F0671-06DC06DE-06FF0750-077F08A008A2-08AC08E4-08FEFB50-FBC1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFCFE70-FE74FE76-FEFC",
        Armenian: "0531-05560559-055F0561-0587058A058FFB13-FB17",
        Balinese: "1B00-1B4B1B50-1B7C",
        Bamum: "A6A0-A6F7",
        Batak: "1BC0-1BF31BFC-1BFF",
        Bengali: "0981-09830985-098C098F09900993-09A809AA-09B009B209B6-09B909BC-09C409C709C809CB-09CE09D709DC09DD09DF-09E309E6-09FB",
        Bopomofo: "02EA02EB3105-312D31A0-31BA",
        Braille: "2800-28FF",
        Buginese: "1A00-1A1B1A1E1A1F",
        Buhid: "1740-1753",
        Canadian_Aboriginal: "1400-167F18B0-18F5",
        Cham: "AA00-AA36AA40-AA4DAA50-AA59AA5C-AA5F",
        Cherokee: "13A0-13F4",
        Common: "0000-0040005B-0060007B-00A900AB-00B900BB-00BF00D700F702B9-02DF02E5-02E902EC-02FF0374037E038503870589060C061B061F06400660-066906DD096409650E3F0FD5-0FD810FB16EB-16ED173517361802180318051CD31CE11CE9-1CEC1CEE-1CF31CF51CF62000-200B200E-2064206A-20702074-207E2080-208E20A0-20B92100-21252127-2129212C-21312133-214D214F-215F21892190-23F32400-24262440-244A2460-26FF2701-27FF2900-2B4C2B50-2B592E00-2E3B2FF0-2FFB3000-300430063008-30203030-3037303C-303F309B309C30A030FB30FC3190-319F31C0-31E33220-325F327F-32CF3358-33FF4DC0-4DFFA700-A721A788-A78AA830-A839FD3EFD3FFDFDFE10-FE19FE30-FE52FE54-FE66FE68-FE6BFEFFFF01-FF20FF3B-FF40FF5B-FF65FF70FF9EFF9FFFE0-FFE6FFE8-FFEEFFF9-FFFD",
        Coptic: "03E2-03EF2C80-2CF32CF9-2CFF",
        Cyrillic: "0400-04840487-05271D2B1D782DE0-2DFFA640-A697A69F",
        Devanagari: "0900-09500953-09630966-09770979-097FA8E0-A8FB",
        Ethiopic: "1200-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A135D-137C1380-13992D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDEAB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2E",
        Georgian: "10A0-10C510C710CD10D0-10FA10FC-10FF2D00-2D252D272D2D",
        Glagolitic: "2C00-2C2E2C30-2C5E",
        Greek: "0370-03730375-0377037A-037D038403860388-038A038C038E-03A103A3-03E103F0-03FF1D26-1D2A1D5D-1D611D66-1D6A1DBF1F00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FC41FC6-1FD31FD6-1FDB1FDD-1FEF1FF2-1FF41FF6-1FFE2126",
        Gujarati: "0A81-0A830A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABC-0AC50AC7-0AC90ACB-0ACD0AD00AE0-0AE30AE6-0AF1",
        Gurmukhi: "0A01-0A030A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A3C0A3E-0A420A470A480A4B-0A4D0A510A59-0A5C0A5E0A66-0A75",
        Han: "2E80-2E992E9B-2EF32F00-2FD5300530073021-30293038-303B3400-4DB54E00-9FCCF900-FA6DFA70-FAD9",
        Hangul: "1100-11FF302E302F3131-318E3200-321E3260-327EA960-A97CAC00-D7A3D7B0-D7C6D7CB-D7FBFFA0-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
        Hanunoo: "1720-1734",
        Hebrew: "0591-05C705D0-05EA05F0-05F4FB1D-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FB4F",
        Hiragana: "3041-3096309D-309F",
        Inherited: "0300-036F04850486064B-0655065F0670095109521CD0-1CD21CD4-1CE01CE2-1CE81CED1CF41DC0-1DE61DFC-1DFF200C200D20D0-20F0302A-302D3099309AFE00-FE0FFE20-FE26",
        Javanese: "A980-A9CDA9CF-A9D9A9DEA9DF",
        Kannada: "0C820C830C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBC-0CC40CC6-0CC80CCA-0CCD0CD50CD60CDE0CE0-0CE30CE6-0CEF0CF10CF2",
        Katakana: "30A1-30FA30FD-30FF31F0-31FF32D0-32FE3300-3357FF66-FF6FFF71-FF9D",
        Kayah_Li: "A900-A92F",
        Khmer: "1780-17DD17E0-17E917F0-17F919E0-19FF",
        Lao: "0E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB90EBB-0EBD0EC0-0EC40EC60EC8-0ECD0ED0-0ED90EDC-0EDF",
        Latin: "0041-005A0061-007A00AA00BA00C0-00D600D8-00F600F8-02B802E0-02E41D00-1D251D2C-1D5C1D62-1D651D6B-1D771D79-1DBE1E00-1EFF2071207F2090-209C212A212B2132214E2160-21882C60-2C7FA722-A787A78B-A78EA790-A793A7A0-A7AAA7F8-A7FFFB00-FB06FF21-FF3AFF41-FF5A",
        Lepcha: "1C00-1C371C3B-1C491C4D-1C4F",
        Limbu: "1900-191C1920-192B1930-193B19401944-194F",
        Lisu: "A4D0-A4FF",
        Malayalam: "0D020D030D05-0D0C0D0E-0D100D12-0D3A0D3D-0D440D46-0D480D4A-0D4E0D570D60-0D630D66-0D750D79-0D7F",
        Mandaic: "0840-085B085E",
        Meetei_Mayek: "AAE0-AAF6ABC0-ABEDABF0-ABF9",
        Mongolian: "1800180118041806-180E1810-18191820-18771880-18AA",
        Myanmar: "1000-109FAA60-AA7B",
        New_Tai_Lue: "1980-19AB19B0-19C919D0-19DA19DE19DF",
        Nko: "07C0-07FA",
        Ogham: "1680-169C",
        Ol_Chiki: "1C50-1C7F",
        Oriya: "0B01-0B030B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3C-0B440B470B480B4B-0B4D0B560B570B5C0B5D0B5F-0B630B66-0B77",
        Phags_Pa: "A840-A877",
        Rejang: "A930-A953A95F",
        Runic: "16A0-16EA16EE-16F0",
        Samaritan: "0800-082D0830-083E",
        Saurashtra: "A880-A8C4A8CE-A8D9",
        Sinhala: "0D820D830D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60DCA0DCF-0DD40DD60DD8-0DDF0DF2-0DF4",
        Sundanese: "1B80-1BBF1CC0-1CC7",
        Syloti_Nagri: "A800-A82B",
        Syriac: "0700-070D070F-074A074D-074F",
        Tagalog: "1700-170C170E-1714",
        Tagbanwa: "1760-176C176E-177017721773",
        Tai_Le: "1950-196D1970-1974",
        Tai_Tham: "1A20-1A5E1A60-1A7C1A7F-1A891A90-1A991AA0-1AAD",
        Tai_Viet: "AA80-AAC2AADB-AADF",
        Tamil: "0B820B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BBE-0BC20BC6-0BC80BCA-0BCD0BD00BD70BE6-0BFA",
        Telugu: "0C01-0C030C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D-0C440C46-0C480C4A-0C4D0C550C560C580C590C60-0C630C66-0C6F0C78-0C7F",
        Thaana: "0780-07B1",
        Thai: "0E01-0E3A0E40-0E5B",
        Tibetan: "0F00-0F470F49-0F6C0F71-0F970F99-0FBC0FBE-0FCC0FCE-0FD40FD90FDA",
        Tifinagh: "2D30-2D672D6F2D702D7F",
        Vai: "A500-A62B",
        Yi: "A000-A48CA490-A4C6"
    });

}(XRegExp));


/***** unicode-blocks.js *****/

/*!
 * XRegExp Unicode Blocks v1.2.0
 * (c) 2010-2012 Steven Levithan <http://xregexp.com/>
 * MIT License
 * Uses Unicode 6.1 <http://unicode.org/>
 */

/**
 * Adds support for all Unicode blocks in the Basic Multilingual Plane (U+0000-U+FFFF). Unicode
 * blocks use the prefix "In". E.g., `\p{InBasicLatin}`. Token names are case insensitive, and any
 * spaces, hyphens, and underscores are ignored.
 * @requires XRegExp, XRegExp Unicode Base
 */
(function (XRegExp) {
    "use strict";

    if (!XRegExp.addUnicodePackage) {
        throw new ReferenceError("Unicode Base must be loaded before Unicode Blocks");
    }

    XRegExp.install("extensibility");

    XRegExp.addUnicodePackage({
        InBasic_Latin: "0000-007F",
        InLatin_1_Supplement: "0080-00FF",
        InLatin_Extended_A: "0100-017F",
        InLatin_Extended_B: "0180-024F",
        InIPA_Extensions: "0250-02AF",
        InSpacing_Modifier_Letters: "02B0-02FF",
        InCombining_Diacritical_Marks: "0300-036F",
        InGreek_and_Coptic: "0370-03FF",
        InCyrillic: "0400-04FF",
        InCyrillic_Supplement: "0500-052F",
        InArmenian: "0530-058F",
        InHebrew: "0590-05FF",
        InArabic: "0600-06FF",
        InSyriac: "0700-074F",
        InArabic_Supplement: "0750-077F",
        InThaana: "0780-07BF",
        InNKo: "07C0-07FF",
        InSamaritan: "0800-083F",
        InMandaic: "0840-085F",
        InArabic_Extended_A: "08A0-08FF",
        InDevanagari: "0900-097F",
        InBengali: "0980-09FF",
        InGurmukhi: "0A00-0A7F",
        InGujarati: "0A80-0AFF",
        InOriya: "0B00-0B7F",
        InTamil: "0B80-0BFF",
        InTelugu: "0C00-0C7F",
        InKannada: "0C80-0CFF",
        InMalayalam: "0D00-0D7F",
        InSinhala: "0D80-0DFF",
        InThai: "0E00-0E7F",
        InLao: "0E80-0EFF",
        InTibetan: "0F00-0FFF",
        InMyanmar: "1000-109F",
        InGeorgian: "10A0-10FF",
        InHangul_Jamo: "1100-11FF",
        InEthiopic: "1200-137F",
        InEthiopic_Supplement: "1380-139F",
        InCherokee: "13A0-13FF",
        InUnified_Canadian_Aboriginal_Syllabics: "1400-167F",
        InOgham: "1680-169F",
        InRunic: "16A0-16FF",
        InTagalog: "1700-171F",
        InHanunoo: "1720-173F",
        InBuhid: "1740-175F",
        InTagbanwa: "1760-177F",
        InKhmer: "1780-17FF",
        InMongolian: "1800-18AF",
        InUnified_Canadian_Aboriginal_Syllabics_Extended: "18B0-18FF",
        InLimbu: "1900-194F",
        InTai_Le: "1950-197F",
        InNew_Tai_Lue: "1980-19DF",
        InKhmer_Symbols: "19E0-19FF",
        InBuginese: "1A00-1A1F",
        InTai_Tham: "1A20-1AAF",
        InBalinese: "1B00-1B7F",
        InSundanese: "1B80-1BBF",
        InBatak: "1BC0-1BFF",
        InLepcha: "1C00-1C4F",
        InOl_Chiki: "1C50-1C7F",
        InSundanese_Supplement: "1CC0-1CCF",
        InVedic_Extensions: "1CD0-1CFF",
        InPhonetic_Extensions: "1D00-1D7F",
        InPhonetic_Extensions_Supplement: "1D80-1DBF",
        InCombining_Diacritical_Marks_Supplement: "1DC0-1DFF",
        InLatin_Extended_Additional: "1E00-1EFF",
        InGreek_Extended: "1F00-1FFF",
        InGeneral_Punctuation: "2000-206F",
        InSuperscripts_and_Subscripts: "2070-209F",
        InCurrency_Symbols: "20A0-20CF",
        InCombining_Diacritical_Marks_for_Symbols: "20D0-20FF",
        InLetterlike_Symbols: "2100-214F",
        InNumber_Forms: "2150-218F",
        InArrows: "2190-21FF",
        InMathematical_Operators: "2200-22FF",
        InMiscellaneous_Technical: "2300-23FF",
        InControl_Pictures: "2400-243F",
        InOptical_Character_Recognition: "2440-245F",
        InEnclosed_Alphanumerics: "2460-24FF",
        InBox_Drawing: "2500-257F",
        InBlock_Elements: "2580-259F",
        InGeometric_Shapes: "25A0-25FF",
        InMiscellaneous_Symbols: "2600-26FF",
        InDingbats: "2700-27BF",
        InMiscellaneous_Mathematical_Symbols_A: "27C0-27EF",
        InSupplemental_Arrows_A: "27F0-27FF",
        InBraille_Patterns: "2800-28FF",
        InSupplemental_Arrows_B: "2900-297F",
        InMiscellaneous_Mathematical_Symbols_B: "2980-29FF",
        InSupplemental_Mathematical_Operators: "2A00-2AFF",
        InMiscellaneous_Symbols_and_Arrows: "2B00-2BFF",
        InGlagolitic: "2C00-2C5F",
        InLatin_Extended_C: "2C60-2C7F",
        InCoptic: "2C80-2CFF",
        InGeorgian_Supplement: "2D00-2D2F",
        InTifinagh: "2D30-2D7F",
        InEthiopic_Extended: "2D80-2DDF",
        InCyrillic_Extended_A: "2DE0-2DFF",
        InSupplemental_Punctuation: "2E00-2E7F",
        InCJK_Radicals_Supplement: "2E80-2EFF",
        InKangxi_Radicals: "2F00-2FDF",
        InIdeographic_Description_Characters: "2FF0-2FFF",
        InCJK_Symbols_and_Punctuation: "3000-303F",
        InHiragana: "3040-309F",
        InKatakana: "30A0-30FF",
        InBopomofo: "3100-312F",
        InHangul_Compatibility_Jamo: "3130-318F",
        InKanbun: "3190-319F",
        InBopomofo_Extended: "31A0-31BF",
        InCJK_Strokes: "31C0-31EF",
        InKatakana_Phonetic_Extensions: "31F0-31FF",
        InEnclosed_CJK_Letters_and_Months: "3200-32FF",
        InCJK_Compatibility: "3300-33FF",
        InCJK_Unified_Ideographs_Extension_A: "3400-4DBF",
        InYijing_Hexagram_Symbols: "4DC0-4DFF",
        InCJK_Unified_Ideographs: "4E00-9FFF",
        InYi_Syllables: "A000-A48F",
        InYi_Radicals: "A490-A4CF",
        InLisu: "A4D0-A4FF",
        InVai: "A500-A63F",
        InCyrillic_Extended_B: "A640-A69F",
        InBamum: "A6A0-A6FF",
        InModifier_Tone_Letters: "A700-A71F",
        InLatin_Extended_D: "A720-A7FF",
        InSyloti_Nagri: "A800-A82F",
        InCommon_Indic_Number_Forms: "A830-A83F",
        InPhags_pa: "A840-A87F",
        InSaurashtra: "A880-A8DF",
        InDevanagari_Extended: "A8E0-A8FF",
        InKayah_Li: "A900-A92F",
        InRejang: "A930-A95F",
        InHangul_Jamo_Extended_A: "A960-A97F",
        InJavanese: "A980-A9DF",
        InCham: "AA00-AA5F",
        InMyanmar_Extended_A: "AA60-AA7F",
        InTai_Viet: "AA80-AADF",
        InMeetei_Mayek_Extensions: "AAE0-AAFF",
        InEthiopic_Extended_A: "AB00-AB2F",
        InMeetei_Mayek: "ABC0-ABFF",
        InHangul_Syllables: "AC00-D7AF",
        InHangul_Jamo_Extended_B: "D7B0-D7FF",
        InHigh_Surrogates: "D800-DB7F",
        InHigh_Private_Use_Surrogates: "DB80-DBFF",
        InLow_Surrogates: "DC00-DFFF",
        InPrivate_Use_Area: "E000-F8FF",
        InCJK_Compatibility_Ideographs: "F900-FAFF",
        InAlphabetic_Presentation_Forms: "FB00-FB4F",
        InArabic_Presentation_Forms_A: "FB50-FDFF",
        InVariation_Selectors: "FE00-FE0F",
        InVertical_Forms: "FE10-FE1F",
        InCombining_Half_Marks: "FE20-FE2F",
        InCJK_Compatibility_Forms: "FE30-FE4F",
        InSmall_Form_Variants: "FE50-FE6F",
        InArabic_Presentation_Forms_B: "FE70-FEFF",
        InHalfwidth_and_Fullwidth_Forms: "FF00-FFEF",
        InSpecials: "FFF0-FFFF"
    });

}(XRegExp));


/***** unicode-properties.js *****/

/*!
 * XRegExp Unicode Properties v1.0.0
 * (c) 2012 Steven Levithan <http://xregexp.com/>
 * MIT License
 * Uses Unicode 6.1 <http://unicode.org/>
 */

/**
 * Adds Unicode properties necessary to meet Level 1 Unicode support (detailed in UTS#18 RL1.2).
 * Includes code points from the Basic Multilingual Plane (U+0000-U+FFFF) only. Token names are
 * case insensitive, and any spaces, hyphens, and underscores are ignored.
 * @requires XRegExp, XRegExp Unicode Base
 */
(function (XRegExp) {
    "use strict";

    if (!XRegExp.addUnicodePackage) {
        throw new ReferenceError("Unicode Base must be loaded before Unicode Properties");
    }

    XRegExp.install("extensibility");

    XRegExp.addUnicodePackage({
        Alphabetic: "0041-005A0061-007A00AA00B500BA00C0-00D600D8-00F600F8-02C102C6-02D102E0-02E402EC02EE03450370-037403760377037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-05270531-055605590561-058705B0-05BD05BF05C105C205C405C505C705D0-05EA05F0-05F20610-061A0620-06570659-065F066E-06D306D5-06DC06E1-06E806ED-06EF06FA-06FC06FF0710-073F074D-07B107CA-07EA07F407F507FA0800-0817081A-082C0840-085808A008A2-08AC08E4-08E908F0-08FE0900-093B093D-094C094E-09500955-09630971-09770979-097F0981-09830985-098C098F09900993-09A809AA-09B009B209B6-09B909BD-09C409C709C809CB09CC09CE09D709DC09DD09DF-09E309F009F10A01-0A030A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A3E-0A420A470A480A4B0A4C0A510A59-0A5C0A5E0A70-0A750A81-0A830A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD-0AC50AC7-0AC90ACB0ACC0AD00AE0-0AE30B01-0B030B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D-0B440B470B480B4B0B4C0B560B570B5C0B5D0B5F-0B630B710B820B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BBE-0BC20BC6-0BC80BCA-0BCC0BD00BD70C01-0C030C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D-0C440C46-0C480C4A-0C4C0C550C560C580C590C60-0C630C820C830C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD-0CC40CC6-0CC80CCA-0CCC0CD50CD60CDE0CE0-0CE30CF10CF20D020D030D05-0D0C0D0E-0D100D12-0D3A0D3D-0D440D46-0D480D4A-0D4C0D4E0D570D60-0D630D7A-0D7F0D820D830D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60DCF-0DD40DD60DD8-0DDF0DF20DF30E01-0E3A0E40-0E460E4D0E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB90EBB-0EBD0EC0-0EC40EC60ECD0EDC-0EDF0F000F40-0F470F49-0F6C0F71-0F810F88-0F970F99-0FBC1000-10361038103B-103F1050-10621065-1068106E-1086108E109C109D10A0-10C510C710CD10D0-10FA10FC-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A135F1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA16EE-16F01700-170C170E-17131720-17331740-17531760-176C176E-1770177217731780-17B317B6-17C817D717DC1820-18771880-18AA18B0-18F51900-191C1920-192B1930-19381950-196D1970-19741980-19AB19B0-19C91A00-1A1B1A20-1A5E1A61-1A741AA71B00-1B331B35-1B431B45-1B4B1B80-1BA91BAC-1BAF1BBA-1BE51BE7-1BF11C00-1C351C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF31CF51CF61D00-1DBF1E00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-1FF41FF6-1FFC2071207F2090-209C21022107210A-211321152119-211D212421262128212A-212D212F-2139213C-213F2145-2149214E2160-218824B6-24E92C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2CF22CF32D00-2D252D272D2D2D30-2D672D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2DE0-2DFF2E2F3005-30073021-30293031-30353038-303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-318E31A0-31BA31F0-31FF3400-4DB54E00-9FCCA000-A48CA4D0-A4FDA500-A60CA610-A61FA62AA62BA640-A66EA674-A67BA67F-A697A69F-A6EFA717-A71FA722-A788A78B-A78EA790-A793A7A0-A7AAA7F8-A801A803-A805A807-A80AA80C-A827A840-A873A880-A8C3A8F2-A8F7A8FBA90A-A92AA930-A952A960-A97CA980-A9B2A9B4-A9BFA9CFAA00-AA36AA40-AA4DAA60-AA76AA7AAA80-AABEAAC0AAC2AADB-AADDAAE0-AAEFAAF2-AAF5AB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2EABC0-ABEAAC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1D-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
        Uppercase: "0041-005A00C0-00D600D8-00DE01000102010401060108010A010C010E01100112011401160118011A011C011E01200122012401260128012A012C012E01300132013401360139013B013D013F0141014301450147014A014C014E01500152015401560158015A015C015E01600162016401660168016A016C016E017001720174017601780179017B017D018101820184018601870189-018B018E-0191019301940196-0198019C019D019F01A001A201A401A601A701A901AC01AE01AF01B1-01B301B501B701B801BC01C401C701CA01CD01CF01D101D301D501D701D901DB01DE01E001E201E401E601E801EA01EC01EE01F101F401F6-01F801FA01FC01FE02000202020402060208020A020C020E02100212021402160218021A021C021E02200222022402260228022A022C022E02300232023A023B023D023E02410243-02460248024A024C024E03700372037603860388-038A038C038E038F0391-03A103A3-03AB03CF03D2-03D403D803DA03DC03DE03E003E203E403E603E803EA03EC03EE03F403F703F903FA03FD-042F04600462046404660468046A046C046E04700472047404760478047A047C047E0480048A048C048E04900492049404960498049A049C049E04A004A204A404A604A804AA04AC04AE04B004B204B404B604B804BA04BC04BE04C004C104C304C504C704C904CB04CD04D004D204D404D604D804DA04DC04DE04E004E204E404E604E804EA04EC04EE04F004F204F404F604F804FA04FC04FE05000502050405060508050A050C050E05100512051405160518051A051C051E05200522052405260531-055610A0-10C510C710CD1E001E021E041E061E081E0A1E0C1E0E1E101E121E141E161E181E1A1E1C1E1E1E201E221E241E261E281E2A1E2C1E2E1E301E321E341E361E381E3A1E3C1E3E1E401E421E441E461E481E4A1E4C1E4E1E501E521E541E561E581E5A1E5C1E5E1E601E621E641E661E681E6A1E6C1E6E1E701E721E741E761E781E7A1E7C1E7E1E801E821E841E861E881E8A1E8C1E8E1E901E921E941E9E1EA01EA21EA41EA61EA81EAA1EAC1EAE1EB01EB21EB41EB61EB81EBA1EBC1EBE1EC01EC21EC41EC61EC81ECA1ECC1ECE1ED01ED21ED41ED61ED81EDA1EDC1EDE1EE01EE21EE41EE61EE81EEA1EEC1EEE1EF01EF21EF41EF61EF81EFA1EFC1EFE1F08-1F0F1F18-1F1D1F28-1F2F1F38-1F3F1F48-1F4D1F591F5B1F5D1F5F1F68-1F6F1FB8-1FBB1FC8-1FCB1FD8-1FDB1FE8-1FEC1FF8-1FFB21022107210B-210D2110-211221152119-211D212421262128212A-212D2130-2133213E213F21452160-216F218324B6-24CF2C00-2C2E2C602C62-2C642C672C692C6B2C6D-2C702C722C752C7E-2C802C822C842C862C882C8A2C8C2C8E2C902C922C942C962C982C9A2C9C2C9E2CA02CA22CA42CA62CA82CAA2CAC2CAE2CB02CB22CB42CB62CB82CBA2CBC2CBE2CC02CC22CC42CC62CC82CCA2CCC2CCE2CD02CD22CD42CD62CD82CDA2CDC2CDE2CE02CE22CEB2CED2CF2A640A642A644A646A648A64AA64CA64EA650A652A654A656A658A65AA65CA65EA660A662A664A666A668A66AA66CA680A682A684A686A688A68AA68CA68EA690A692A694A696A722A724A726A728A72AA72CA72EA732A734A736A738A73AA73CA73EA740A742A744A746A748A74AA74CA74EA750A752A754A756A758A75AA75CA75EA760A762A764A766A768A76AA76CA76EA779A77BA77DA77EA780A782A784A786A78BA78DA790A792A7A0A7A2A7A4A7A6A7A8A7AAFF21-FF3A",
        Lowercase: "0061-007A00AA00B500BA00DF-00F600F8-00FF01010103010501070109010B010D010F01110113011501170119011B011D011F01210123012501270129012B012D012F01310133013501370138013A013C013E014001420144014601480149014B014D014F01510153015501570159015B015D015F01610163016501670169016B016D016F0171017301750177017A017C017E-0180018301850188018C018D019201950199-019B019E01A101A301A501A801AA01AB01AD01B001B401B601B901BA01BD-01BF01C601C901CC01CE01D001D201D401D601D801DA01DC01DD01DF01E101E301E501E701E901EB01ED01EF01F001F301F501F901FB01FD01FF02010203020502070209020B020D020F02110213021502170219021B021D021F02210223022502270229022B022D022F02310233-0239023C023F0240024202470249024B024D024F-02930295-02B802C002C102E0-02E40345037103730377037A-037D039003AC-03CE03D003D103D5-03D703D903DB03DD03DF03E103E303E503E703E903EB03ED03EF-03F303F503F803FB03FC0430-045F04610463046504670469046B046D046F04710473047504770479047B047D047F0481048B048D048F04910493049504970499049B049D049F04A104A304A504A704A904AB04AD04AF04B104B304B504B704B904BB04BD04BF04C204C404C604C804CA04CC04CE04CF04D104D304D504D704D904DB04DD04DF04E104E304E504E704E904EB04ED04EF04F104F304F504F704F904FB04FD04FF05010503050505070509050B050D050F05110513051505170519051B051D051F05210523052505270561-05871D00-1DBF1E011E031E051E071E091E0B1E0D1E0F1E111E131E151E171E191E1B1E1D1E1F1E211E231E251E271E291E2B1E2D1E2F1E311E331E351E371E391E3B1E3D1E3F1E411E431E451E471E491E4B1E4D1E4F1E511E531E551E571E591E5B1E5D1E5F1E611E631E651E671E691E6B1E6D1E6F1E711E731E751E771E791E7B1E7D1E7F1E811E831E851E871E891E8B1E8D1E8F1E911E931E95-1E9D1E9F1EA11EA31EA51EA71EA91EAB1EAD1EAF1EB11EB31EB51EB71EB91EBB1EBD1EBF1EC11EC31EC51EC71EC91ECB1ECD1ECF1ED11ED31ED51ED71ED91EDB1EDD1EDF1EE11EE31EE51EE71EE91EEB1EED1EEF1EF11EF31EF51EF71EF91EFB1EFD1EFF-1F071F10-1F151F20-1F271F30-1F371F40-1F451F50-1F571F60-1F671F70-1F7D1F80-1F871F90-1F971FA0-1FA71FB0-1FB41FB61FB71FBE1FC2-1FC41FC61FC71FD0-1FD31FD61FD71FE0-1FE71FF2-1FF41FF61FF72071207F2090-209C210A210E210F2113212F21342139213C213D2146-2149214E2170-217F218424D0-24E92C30-2C5E2C612C652C662C682C6A2C6C2C712C732C742C76-2C7D2C812C832C852C872C892C8B2C8D2C8F2C912C932C952C972C992C9B2C9D2C9F2CA12CA32CA52CA72CA92CAB2CAD2CAF2CB12CB32CB52CB72CB92CBB2CBD2CBF2CC12CC32CC52CC72CC92CCB2CCD2CCF2CD12CD32CD52CD72CD92CDB2CDD2CDF2CE12CE32CE42CEC2CEE2CF32D00-2D252D272D2DA641A643A645A647A649A64BA64DA64FA651A653A655A657A659A65BA65DA65FA661A663A665A667A669A66BA66DA681A683A685A687A689A68BA68DA68FA691A693A695A697A723A725A727A729A72BA72DA72F-A731A733A735A737A739A73BA73DA73FA741A743A745A747A749A74BA74DA74FA751A753A755A757A759A75BA75DA75FA761A763A765A767A769A76BA76DA76F-A778A77AA77CA77FA781A783A785A787A78CA78EA791A793A7A1A7A3A7A5A7A7A7A9A7F8-A7FAFB00-FB06FB13-FB17FF41-FF5A",
        White_Space: "0009-000D0020008500A01680180E2000-200A20282029202F205F3000",
        Noncharacter_Code_Point: "FDD0-FDEFFFFEFFFF",
        Default_Ignorable_Code_Point: "00AD034F115F116017B417B5180B-180D200B-200F202A-202E2060-206F3164FE00-FE0FFEFFFFA0FFF0-FFF8",
        // \p{Any} matches a code unit. To match any code point via surrogate pairs, use (?:[\0-\uD7FF\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF])
        Any: "0000-FFFF", // \p{^Any} compiles to [^\u0000-\uFFFF]; [\p{^Any}] to []
        Ascii: "0000-007F",
        // \p{Assigned} is equivalent to \p{^Cn}
        //Assigned: XRegExp("[\\p{^Cn}]").source.replace(/[[\]]|\\u/g, "") // Negation inside a character class triggers inversion
        Assigned: "0000-0377037A-037E0384-038A038C038E-03A103A3-05270531-05560559-055F0561-05870589058A058F0591-05C705D0-05EA05F0-05F40600-06040606-061B061E-070D070F-074A074D-07B107C0-07FA0800-082D0830-083E0840-085B085E08A008A2-08AC08E4-08FE0900-09770979-097F0981-09830985-098C098F09900993-09A809AA-09B009B209B6-09B909BC-09C409C709C809CB-09CE09D709DC09DD09DF-09E309E6-09FB0A01-0A030A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A3C0A3E-0A420A470A480A4B-0A4D0A510A59-0A5C0A5E0A66-0A750A81-0A830A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABC-0AC50AC7-0AC90ACB-0ACD0AD00AE0-0AE30AE6-0AF10B01-0B030B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3C-0B440B470B480B4B-0B4D0B560B570B5C0B5D0B5F-0B630B66-0B770B820B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BBE-0BC20BC6-0BC80BCA-0BCD0BD00BD70BE6-0BFA0C01-0C030C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D-0C440C46-0C480C4A-0C4D0C550C560C580C590C60-0C630C66-0C6F0C78-0C7F0C820C830C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBC-0CC40CC6-0CC80CCA-0CCD0CD50CD60CDE0CE0-0CE30CE6-0CEF0CF10CF20D020D030D05-0D0C0D0E-0D100D12-0D3A0D3D-0D440D46-0D480D4A-0D4E0D570D60-0D630D66-0D750D79-0D7F0D820D830D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60DCA0DCF-0DD40DD60DD8-0DDF0DF2-0DF40E01-0E3A0E3F-0E5B0E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB90EBB-0EBD0EC0-0EC40EC60EC8-0ECD0ED0-0ED90EDC-0EDF0F00-0F470F49-0F6C0F71-0F970F99-0FBC0FBE-0FCC0FCE-0FDA1000-10C510C710CD10D0-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A135D-137C1380-139913A0-13F41400-169C16A0-16F01700-170C170E-17141720-17361740-17531760-176C176E-1770177217731780-17DD17E0-17E917F0-17F91800-180E1810-18191820-18771880-18AA18B0-18F51900-191C1920-192B1930-193B19401944-196D1970-19741980-19AB19B0-19C919D0-19DA19DE-1A1B1A1E-1A5E1A60-1A7C1A7F-1A891A90-1A991AA0-1AAD1B00-1B4B1B50-1B7C1B80-1BF31BFC-1C371C3B-1C491C4D-1C7F1CC0-1CC71CD0-1CF61D00-1DE61DFC-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FC41FC6-1FD31FD6-1FDB1FDD-1FEF1FF2-1FF41FF6-1FFE2000-2064206A-20712074-208E2090-209C20A0-20B920D0-20F02100-21892190-23F32400-24262440-244A2460-26FF2701-2B4C2B50-2B592C00-2C2E2C30-2C5E2C60-2CF32CF9-2D252D272D2D2D30-2D672D6F2D702D7F-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2DE0-2E3B2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB3000-303F3041-30963099-30FF3105-312D3131-318E3190-31BA31C0-31E331F0-321E3220-32FE3300-4DB54DC0-9FCCA000-A48CA490-A4C6A4D0-A62BA640-A697A69F-A6F7A700-A78EA790-A793A7A0-A7AAA7F8-A82BA830-A839A840-A877A880-A8C4A8CE-A8D9A8E0-A8FBA900-A953A95F-A97CA980-A9CDA9CF-A9D9A9DEA9DFAA00-AA36AA40-AA4DAA50-AA59AA5C-AA7BAA80-AAC2AADB-AAF6AB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2EABC0-ABEDABF0-ABF9AC00-D7A3D7B0-D7C6D7CB-D7FBD800-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1D-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBC1FBD3-FD3FFD50-FD8FFD92-FDC7FDF0-FDFDFE00-FE19FE20-FE26FE30-FE52FE54-FE66FE68-FE6BFE70-FE74FE76-FEFCFEFFFF01-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDCFFE0-FFE6FFE8-FFEEFFF9-FFFD"
    });

}(XRegExp));


/***** matchrecursive.js *****/

/*!
 * XRegExp.matchRecursive v0.2.0
 * (c) 2009-2012 Steven Levithan <http://xregexp.com/>
 * MIT License
 */

(function (XRegExp) {
    "use strict";

/**
 * Returns a match detail object composed of the provided values.
 * @private
 */
    function row(value, name, start, end) {
        return {value:value, name:name, start:start, end:end};
    }

/**
 * Returns an array of match strings between outermost left and right delimiters, or an array of
 * objects with detailed match parts and position data. An error is thrown if delimiters are
 * unbalanced within the data.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {String} left Left delimiter as an XRegExp pattern.
 * @param {String} right Right delimiter as an XRegExp pattern.
 * @param {String} [flags] Flags for the left and right delimiters. Use any of: `gimnsxy`.
 * @param {Object} [options] Lets you specify `valueNames` and `escapeChar` options.
 * @returns {Array} Array of matches, or an empty array.
 * @example
 *
 * // Basic usage
 * var str = '(t((e))s)t()(ing)';
 * XRegExp.matchRecursive(str, '\\(', '\\)', 'g');
 * // -> ['t((e))s', '', 'ing']
 *
 * // Extended information mode with valueNames
 * str = 'Here is <div> <div>an</div></div> example';
 * XRegExp.matchRecursive(str, '<div\\s*>', '</div>', 'gi', {
 *   valueNames: ['between', 'left', 'match', 'right']
 * });
 * // -> [
 * // {name: 'between', value: 'Here is ',       start: 0,  end: 8},
 * // {name: 'left',    value: '<div>',          start: 8,  end: 13},
 * // {name: 'match',   value: ' <div>an</div>', start: 13, end: 27},
 * // {name: 'right',   value: '</div>',         start: 27, end: 33},
 * // {name: 'between', value: ' example',       start: 33, end: 41}
 * // ]
 *
 * // Omitting unneeded parts with null valueNames, and using escapeChar
 * str = '...{1}\\{{function(x,y){return y+x;}}';
 * XRegExp.matchRecursive(str, '{', '}', 'g', {
 *   valueNames: ['literal', null, 'value', null],
 *   escapeChar: '\\'
 * });
 * // -> [
 * // {name: 'literal', value: '...', start: 0, end: 3},
 * // {name: 'value',   value: '1',   start: 4, end: 5},
 * // {name: 'literal', value: '\\{', start: 6, end: 8},
 * // {name: 'value',   value: 'function(x,y){return y+x;}', start: 9, end: 35}
 * // ]
 *
 * // Sticky mode via flag y
 * str = '<1><<<2>>><3>4<5>';
 * XRegExp.matchRecursive(str, '<', '>', 'gy');
 * // -> ['1', '<<2>>', '3']
 */
    XRegExp.matchRecursive = function (str, left, right, flags, options) {
        flags = flags || "";
        options = options || {};
        var global = flags.indexOf("g") > -1,
            sticky = flags.indexOf("y") > -1,
            basicFlags = flags.replace(/y/g, ""), // Flag y controlled internally
            escapeChar = options.escapeChar,
            vN = options.valueNames,
            output = [],
            openTokens = 0,
            delimStart = 0,
            delimEnd = 0,
            lastOuterEnd = 0,
            outerStart,
            innerStart,
            leftMatch,
            rightMatch,
            esc;
        left = XRegExp(left, basicFlags);
        right = XRegExp(right, basicFlags);

        if (escapeChar) {
            if (escapeChar.length > 1) {
                throw new SyntaxError("can't use more than one escape character");
            }
            escapeChar = XRegExp.escape(escapeChar);
            // Using XRegExp.union safely rewrites backreferences in `left` and `right`
            esc = new RegExp(
                "(?:" + escapeChar + "[\\S\\s]|(?:(?!" + XRegExp.union([left, right]).source + ")[^" + escapeChar + "])+)+",
                flags.replace(/[^im]+/g, "") // Flags gy not needed here; flags nsx handled by XRegExp
            );
        }

        while (true) {
            // If using an escape character, advance to the delimiter's next starting position,
            // skipping any escaped characters in between
            if (escapeChar) {
                delimEnd += (XRegExp.exec(str, esc, delimEnd, "sticky") || [""])[0].length;
            }
            leftMatch = XRegExp.exec(str, left, delimEnd);
            rightMatch = XRegExp.exec(str, right, delimEnd);
            // Keep the leftmost match only
            if (leftMatch && rightMatch) {
                if (leftMatch.index <= rightMatch.index) {
                    rightMatch = null;
                } else {
                    leftMatch = null;
                }
            }
            /* Paths (LM:leftMatch, RM:rightMatch, OT:openTokens):
            LM | RM | OT | Result
            1  | 0  | 1  | loop
            1  | 0  | 0  | loop
            0  | 1  | 1  | loop
            0  | 1  | 0  | throw
            0  | 0  | 1  | throw
            0  | 0  | 0  | break
            * Doesn't include the sticky mode special case
            * Loop ends after the first completed match if `!global` */
            if (leftMatch || rightMatch) {
                delimStart = (leftMatch || rightMatch).index;
                delimEnd = delimStart + (leftMatch || rightMatch)[0].length;
            } else if (!openTokens) {
                break;
            }
            if (sticky && !openTokens && delimStart > lastOuterEnd) {
                break;
            }
            if (leftMatch) {
                if (!openTokens) {
                    outerStart = delimStart;
                    innerStart = delimEnd;
                }
                ++openTokens;
            } else if (rightMatch && openTokens) {
                if (!--openTokens) {
                    if (vN) {
                        if (vN[0] && outerStart > lastOuterEnd) {
                            output.push(row(vN[0], str.slice(lastOuterEnd, outerStart), lastOuterEnd, outerStart));
                        }
                        if (vN[1]) {
                            output.push(row(vN[1], str.slice(outerStart, innerStart), outerStart, innerStart));
                        }
                        if (vN[2]) {
                            output.push(row(vN[2], str.slice(innerStart, delimStart), innerStart, delimStart));
                        }
                        if (vN[3]) {
                            output.push(row(vN[3], str.slice(delimStart, delimEnd), delimStart, delimEnd));
                        }
                    } else {
                        output.push(str.slice(innerStart, delimStart));
                    }
                    lastOuterEnd = delimEnd;
                    if (!global) {
                        break;
                    }
                }
            } else {
                throw new Error("string contains unbalanced delimiters");
            }
            // If the delimiter matched an empty string, avoid an infinite loop
            if (delimStart === delimEnd) {
                ++delimEnd;
            }
        }

        if (global && !sticky && vN && vN[0] && str.length > lastOuterEnd) {
            output.push(row(vN[0], str.slice(lastOuterEnd), lastOuterEnd, str.length));
        }

        return output;
    };

}(XRegExp));


/***** build.js *****/

/*!
 * XRegExp.build v0.1.0
 * (c) 2012 Steven Levithan <http://xregexp.com/>
 * MIT License
 * Inspired by RegExp.create by Lea Verou <http://lea.verou.me/>
 */

(function (XRegExp) {
    "use strict";

    var subparts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g,
        parts = XRegExp.union([/\({{([\w$]+)}}\)|{{([\w$]+)}}/, subparts], "g");

/**
 * Strips a leading `^` and trailing unescaped `$`, if both are present.
 * @private
 * @param {String} pattern Pattern to process.
 * @returns {String} Pattern with edge anchors removed.
 */
    function deanchor(pattern) {
        var startAnchor = /^(?:\(\?:\))?\^/, // Leading `^` or `(?:)^` (handles /x cruft)
            endAnchor = /\$(?:\(\?:\))?$/; // Trailing `$` or `$(?:)` (handles /x cruft)
        if (endAnchor.test(pattern.replace(/\\[\s\S]/g, ""))) { // Ensure trailing `$` isn't escaped
            return pattern.replace(startAnchor, "").replace(endAnchor, "");
        }
        return pattern;
    }

/**
 * Converts the provided value to an XRegExp.
 * @private
 * @param {String|RegExp} value Value to convert.
 * @returns {RegExp} XRegExp object with XRegExp syntax applied.
 */
    function asXRegExp(value) {
        return XRegExp.isRegExp(value) ?
                (value.xregexp && !value.xregexp.isNative ? value : XRegExp(value.source)) :
                XRegExp(value);
    }

/**
 * Builds regexes using named subpatterns, for readability and pattern reuse. Backreferences in the
 * outer pattern and provided subpatterns are automatically renumbered to work correctly. Native
 * flags used by provided subpatterns are ignored in favor of the `flags` argument.
 * @memberOf XRegExp
 * @param {String} pattern XRegExp pattern using `{{name}}` for embedded subpatterns. Allows
 *   `({{name}})` as shorthand for `(?<name>{{name}})`. Patterns cannot be embedded within
 *   character classes.
 * @param {Object} subs Lookup object for named subpatterns. Values can be strings or regexes. A
 *   leading `^` and trailing unescaped `$` are stripped from subpatterns, if both are present.
 * @param {String} [flags] Any combination of XRegExp flags.
 * @returns {RegExp} Regex with interpolated subpatterns.
 * @example
 *
 * var time = XRegExp.build('(?x)^ {{hours}} ({{minutes}}) $', {
 *   hours: XRegExp.build('{{h12}} : | {{h24}}', {
 *     h12: /1[0-2]|0?[1-9]/,
 *     h24: /2[0-3]|[01][0-9]/
 *   }, 'x'),
 *   minutes: /^[0-5][0-9]$/
 * });
 * time.test('10:59'); // -> true
 * XRegExp.exec('10:59', time).minutes; // -> '59'
 */
    XRegExp.build = function (pattern, subs, flags) {
        var inlineFlags = /^\(\?([\w$]+)\)/.exec(pattern),
            data = {},
            numCaps = 0, // Caps is short for captures
            numPriorCaps,
            numOuterCaps = 0,
            outerCapsMap = [0],
            outerCapNames,
            sub,
            p;

        // Add flags within a leading mode modifier to the overall pattern's flags
        if (inlineFlags) {
            flags = flags || "";
            inlineFlags[1].replace(/./g, function (flag) {
                flags += (flags.indexOf(flag) > -1 ? "" : flag); // Don't add duplicates
            });
        }

        for (p in subs) {
            if (subs.hasOwnProperty(p)) {
                // Passing to XRegExp enables entended syntax for subpatterns provided as strings
                // and ensures independent validity, lest an unescaped `(`, `)`, `[`, or trailing
                // `\` breaks the `(?:)` wrapper. For subpatterns provided as regexes, it dies on
                // octals and adds the `xregexp` property, for simplicity
                sub = asXRegExp(subs[p]);
                // Deanchoring allows embedding independently useful anchored regexes. If you
                // really need to keep your anchors, double them (i.e., `^^...$$`)
                data[p] = {pattern: deanchor(sub.source), names: sub.xregexp.captureNames || []};
            }
        }

        // Passing to XRegExp dies on octals and ensures the outer pattern is independently valid;
        // helps keep this simple. Named captures will be put back
        pattern = asXRegExp(pattern);
        outerCapNames = pattern.xregexp.captureNames || [];
        pattern = pattern.source.replace(parts, function ($0, $1, $2, $3, $4) {
            var subName = $1 || $2, capName, intro;
            if (subName) { // Named subpattern
                if (!data.hasOwnProperty(subName)) {
                    throw new ReferenceError("undefined property " + $0);
                }
                if ($1) { // Named subpattern was wrapped in a capturing group
                    capName = outerCapNames[numOuterCaps];
                    outerCapsMap[++numOuterCaps] = ++numCaps;
                    // If it's a named group, preserve the name. Otherwise, use the subpattern name
                    // as the capture name
                    intro = "(?<" + (capName || subName) + ">";
                } else {
                    intro = "(?:";
                }
                numPriorCaps = numCaps;
                return intro + data[subName].pattern.replace(subparts, function (match, paren, backref) {
                    if (paren) { // Capturing group
                        capName = data[subName].names[numCaps - numPriorCaps];
                        ++numCaps;
                        if (capName) { // If the current capture has a name, preserve the name
                            return "(?<" + capName + ">";
                        }
                    } else if (backref) { // Backreference
                        return "\\" + (+backref + numPriorCaps); // Rewrite the backreference
                    }
                    return match;
                }) + ")";
            }
            if ($3) { // Capturing group
                capName = outerCapNames[numOuterCaps];
                outerCapsMap[++numOuterCaps] = ++numCaps;
                if (capName) { // If the current capture has a name, preserve the name
                    return "(?<" + capName + ">";
                }
            } else if ($4) { // Backreference
                return "\\" + outerCapsMap[+$4]; // Rewrite the backreference
            }
            return $0;
        });

        return XRegExp(pattern, flags);
    };

}(XRegExp));


/***** prototypes.js *****/

/*!
 * XRegExp Prototype Methods v1.0.0
 * (c) 2012 Steven Levithan <http://xregexp.com/>
 * MIT License
 */

/**
 * Adds a collection of methods to `XRegExp.prototype`. RegExp objects copied by XRegExp are also
 * augmented with any `XRegExp.prototype` methods. Hence, the following work equivalently:
 *
 * XRegExp('[a-z]', 'ig').xexec('abc');
 * XRegExp(/[a-z]/ig).xexec('abc');
 * XRegExp.globalize(/[a-z]/i).xexec('abc');
 */
(function (XRegExp) {
    "use strict";

/**
 * Copy properties of `b` to `a`.
 * @private
 * @param {Object} a Object that will receive new properties.
 * @param {Object} b Object whose properties will be copied.
 */
    function extend(a, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) {
                a[p] = b[p];
            }
        }
        //return a;
    }

    extend(XRegExp.prototype, {

/**
 * Implicitly calls the regex's `test` method with the first value in the provided arguments array.
 * @memberOf XRegExp.prototype
 * @param {*} context Ignored. Accepted only for congruity with `Function.prototype.apply`.
 * @param {Array} args Array with the string to search as its first value.
 * @returns {Boolean} Whether the regex matched the provided value.
 * @example
 *
 * XRegExp('[a-z]').apply(null, ['abc']); // -> true
 */
        apply: function (context, args) {
            return this.test(args[0]);
        },

/**
 * Implicitly calls the regex's `test` method with the provided string.
 * @memberOf XRegExp.prototype
 * @param {*} context Ignored. Accepted only for congruity with `Function.prototype.call`.
 * @param {String} str String to search.
 * @returns {Boolean} Whether the regex matched the provided value.
 * @example
 *
 * XRegExp('[a-z]').call(null, 'abc'); // -> true
 */
        call: function (context, str) {
            return this.test(str);
        },

/**
 * Implicitly calls {@link #XRegExp.forEach}.
 * @memberOf XRegExp.prototype
 * @example
 *
 * XRegExp('\\d').forEach('1a2345', function (match, i) {
 *   if (i % 2) this.push(+match[0]);
 * }, []);
 * // -> [2, 4]
 */
        forEach: function (str, callback, context) {
            return XRegExp.forEach(str, this, callback, context);
        },

/**
 * Implicitly calls {@link #XRegExp.globalize}.
 * @memberOf XRegExp.prototype
 * @example
 *
 * var globalCopy = XRegExp('regex').globalize();
 * globalCopy.global; // -> true
 */
        globalize: function () {
            return XRegExp.globalize(this);
        },

/**
 * Implicitly calls {@link #XRegExp.exec}.
 * @memberOf XRegExp.prototype
 * @example
 *
 * var match = XRegExp('U\\+(?<hex>[0-9A-F]{4})').xexec('U+2620');
 * match.hex; // -> '2620'
 */
        xexec: function (str, pos, sticky) {
            return XRegExp.exec(str, this, pos, sticky);
        },

/**
 * Implicitly calls {@link #XRegExp.test}.
 * @memberOf XRegExp.prototype
 * @example
 *
 * XRegExp('c').xtest('abc'); // -> true
 */
        xtest: function (str, pos, sticky) {
            return XRegExp.test(str, this, pos, sticky);
        }

    });

}(XRegExp));



/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(28));
__export(__webpack_require__(29));
__export(__webpack_require__(31));
__export(__webpack_require__(30));
__export(__webpack_require__(33));
//# sourceMappingURL=index.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Tipos;
(function (Tipos) {
    Tipos[Tipos["Function"] = 0] = "Function";
    Tipos[Tipos["User Function"] = 1] = "User Function";
    Tipos[Tipos["Class"] = 2] = "Class";
    Tipos[Tipos["Method"] = 3] = "Method";
    Tipos[Tipos["Static Function"] = 4] = "Static Function";
})(Tipos = exports.Tipos || (exports.Tipos = {}));
class Fonte {
    constructor(fonte) {
        this.fonte = fonte;
        this.funcoes = [];
    }
    addFunction(tipo, nome, linha) {
        this.funcoes.push(new Funcao(tipo, nome, linha));
    }
    addVariavel(variavel) {
        this.funcoes[this.funcoes.length - 1].variaveisLocais.push(variavel);
    }
}
exports.Fonte = Fonte;
class Funcao {
    constructor(tipo, nome, linha) {
        this.tipo = tipo;
        this.nome = nome;
        this.linha = linha;
        this.variaveisLocais = [];
    }
}
exports.Funcao = Funcao;
//# sourceMappingURL=fonte.js.map

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const include_1 = __webpack_require__(30);
const Erro_1 = __webpack_require__(31);
const fonte_1 = __webpack_require__(28);
const package_json_1 = __webpack_require__(32);
class ValidaAdvpl {
    constructor(comentFontePad, local, log = true) {
        this.log = log;
        this.local = local;
        this.aErros = [];
        this.includes = [];
        this.error = 0;
        this.warning = 0;
        this.information = 0;
        this.hint = 0;
        //Se nÃ£o estÃ¡ preenchido seta com valor padrÃ£o
        this.comentFontPad = comentFontePad;
        this.ownerDb = [];
        this.empresas = [];
        this.version = package_json_1.version;
    }
    validacao(texto, path) {
        return new Promise((resolve, reject) => {
            try {
                let objeto = this;
                objeto.conteudoFonte = texto;
                objeto.aErros = [];
                objeto.includes = [];
                objeto.fonte = new fonte_1.Fonte(path);
                let conteudoSComentario = '';
                let linhas = texto.split('\n');
                //Pega as linhas do documento ativo e separa o array por linha
                let comentFuncoes = new Array();
                let funcoes = new Array();
                let cBeginSql = false;
                let FromQuery = false;
                let JoinQuery = false;
                let cSelect = false;
                let ProtheusDoc = false;
                let emComentario = false;
                //Percorre todas as linhas
                for (var key in linhas) {
                    //seta linha atual em caixa alta
                    let linha = linhas[key].toLocaleUpperCase();
                    let linhaClean = '';
                    //se estiver no PotheusDoc vê se está fechando
                    if (ProtheusDoc && linha.search('\\/\\*\\/') !== -1) {
                        ProtheusDoc = false;
                    }
                    //verifica se é protheusDoc
                    if (linha.search(/\/\*\/+( |)+\{PROTHEUS\.DOC\}/) !== -1) {
                        ProtheusDoc = true;
                        //reseta todas as ariáveis de controle pois se entrou em ProtheusDoc está fora de qualquer função
                        cBeginSql = false;
                        FromQuery = false;
                        JoinQuery = false;
                        cSelect = false;
                        //verifica se é um comentário de função e adiciona no array
                        comentFuncoes.push([
                            linha
                                .trim()
                                .replace(/\/\*\/+( |)+\{PROTHEUS\.DOC\}/, '')
                                .trim()
                                .toLocaleUpperCase(),
                            key
                        ]);
                    }
                    //verifica se a linha está toda comentada
                    let posComentLinha = linha.search(/\/\//);
                    let posComentBloco = linha.search(/\/\*/);
                    posComentBloco = posComentBloco === -1 ? 999999 : posComentBloco;
                    posComentLinha = posComentLinha === -1 ? 999999 : posComentLinha;
                    if (!emComentario && posComentLinha < posComentBloco) {
                        linha = linha.split('//')[0];
                    }
                    //Verifica se está em comentário de bloco
                    //trata comentários dentro da linha
                    linha = linha.replace(/\/\*+.+\*\//, '');
                    if (linha.search(/\*\//) !== -1 && emComentario) {
                        emComentario = false;
                        linha = linha.split(/\*\//)[1];
                    }
                    //se não estiver dentro do Protheus DOC valida linha
                    if (!emComentario) {
                        if (linha
                            .replace(/\"+.+\"/, '')
                            .replace(/\'+.+\'/, '')
                            .search(/\/\*/) !== -1) {
                            emComentario = true;
                            linha = linha.split(/\/\*/)[0];
                        }
                        //Se não estiver em comentário verifica se o último caracter da linha é ;
                        if (!emComentario && linha.charAt(linha.length - 1) === ';') {
                            linhas[parseInt(key) + 1] =
                                linha + ' ' + linhas[parseInt(key) + 1];
                            linha = '';
                        }
                        //trata comentários em linha ou strings em aspas simples ou duplas
                        //não remove aspas quando for include
                        linha = linha.split('//')[0];
                        linhaClean = linha;
                        if (linha.search(/#INCLUDE/) === -1) {
                            while (linhaClean.search(/\"+.+\"/) !== -1 ||
                                linhaClean.search(/\'+.+\'/) !== -1) {
                                let colunaDupla = linhaClean.search(/\"+.+\"/);
                                let colunaSimples = linhaClean.search(/\'+.+\'/);
                                //se a primeira for a dupla
                                if (colunaDupla !== -1 &&
                                    (colunaDupla < colunaSimples || colunaSimples === -1)) {
                                    let quebra = linhaClean.split('"');
                                    linhaClean = linhaClean.replace('"' + quebra[1] + '"', '');
                                }
                                else {
                                    let quebra = linhaClean.split("'");
                                    linhaClean = linhaClean.replace("'" + quebra[1] + "'", '');
                                }
                            }
                        }
                        //Remove espaços ou tabulações seguidas
                        linhaClean = linhaClean.replace(/\t/g, ' ');
                        linhaClean = linhaClean.replace(/\:\=/g, ' :=');
                        let conteudos = linhaClean.split(' ');
                        linhaClean = '';
                        for (const key in conteudos) {
                            if (conteudos[key]) {
                                linhaClean += conteudos[key] + ' ';
                            }
                        }
                        conteudoSComentario = conteudoSComentario + linhaClean + '\n';
                        let firstWord = linhaClean.split(' ')[0].split('\t')[0];
                        //verifica se é função e adiciona no array
                        if (linhaClean.search(/(STATIC|USER|)+(\ |\t)+FUNCTION+(\ |\t)/) !==
                            -1 &&
                            linhaClean
                                .trim()
                                .split(' ')[0]
                                .match(/STATIC|USER|FUNCTION/)) {
                            //reseta todas as ariáveis de controle pois está fora de qualquer função
                            cBeginSql = false;
                            FromQuery = false;
                            JoinQuery = false;
                            cSelect = false;
                            let nomeFuncao = linhaClean
                                .replace('\t', ' ')
                                .trim()
                                .split(' ')[2]
                                .split('(')[0];
                            //verifica se é um função e adiciona no array
                            funcoes.push([nomeFuncao, key]);
                            //verifica o TIPO
                            if (linhaClean.search(/(USER)+(\ |\t)+FUNCTION+(\ |\t)/) !== -1) {
                                objeto.fonte.addFunction(fonte_1.Tipos['User Function'], nomeFuncao, parseInt(key));
                            }
                            else if (linhaClean.search(/(STATIC)+(\ |\t)+FUNCTION+(\ |\t)/) !== -1) {
                                //verifica se a primeira palavra é FUNCTION
                                objeto.fonte.addFunction(fonte_1.Tipos['Static Function'], nomeFuncao, parseInt(key));
                            }
                            else if (firstWord === 'FUNCTION') {
                                //verifica se a primeira palavra é FUNCTION
                                objeto.fonte.addFunction(fonte_1.Tipos.Function, nomeFuncao, parseInt(key));
                            }
                        }
                        //Verifica se é CLASSE ou WEBSERVICE
                        if (linhaClean.search('METHOD\\ .*?CLASS') !== -1 ||
                            firstWord === 'CLASS' ||
                            linhaClean.search('WSMETHOD.*?WSSERVICE') !== -1 ||
                            linhaClean.search('WSSERVICE\\ ') !== -1) {
                            //reseta todas as ariáveis de controle pois está fora de qualquer função
                            cBeginSql = false;
                            FromQuery = false;
                            JoinQuery = false;
                            cSelect = false;
                            //verifica se é um função e adiciona no array
                            funcoes.push([
                                linhaClean
                                    .trim()
                                    .split(' ')[1]
                                    .split('(')[0],
                                key
                            ]);
                            if (firstWord === 'CLASS') {
                                objeto.fonte.addFunction(fonte_1.Tipos.Class, linhaClean
                                    .trim()
                                    .split(' ')[1]
                                    .split('(')[0], parseInt(key));
                            }
                            if (firstWord.match(/METHOD/)) {
                                let palavras = linhaClean.split(/,| |\t|\(/);
                                let metodo = palavras[1];
                                let classe;
                                for (var i = 0; i < palavras.length; i++) {
                                    let key2 = palavras[i];
                                    if (key2 === 'WSSERVICE' || key2 === 'CLASS') {
                                        classe = palavras[i + 1];
                                        break;
                                    }
                                }
                                objeto.fonte.addFunction(fonte_1.Tipos.Method, classe + '|' + metodo, parseInt(key));
                            }
                        }
                        //Adiciona no objeto as variáveis locais
                        if (firstWord === 'LOCAL') {
                            //remove o LOCAL
                            let variaveis = linhaClean.split(/,| |\t|\r/);
                            for (var key2 of variaveis) {
                                if (key2 !== 'LOCAL' && key2 !== '') {
                                    // se terminar as variáveis
                                    if (key2.match(/\:\=/)) {
                                        break;
                                    }
                                    //objeto.fonte.addVariavel(key2);
                                }
                            }
                        }
                        //Verifica se adicionou o include TOTVS.CH
                        if (linha.search(/#INCLUDE/) !== -1) {
                            //REMOVE as aspas a palavra #include e os espacos e tabulações
                            objeto.includes.push({
                                include: linha
                                    .replace(/#INCLUDE/g, '')
                                    .replace(/\t/g, '')
                                    .replace(/\'/g, '')
                                    .replace(/\"/g, '')
                                    .trim(),
                                linha: parseInt(key)
                            });
                        }
                        if (linhaClean.search(/BEGINSQL+(\ |\t)+ALIAS/) !== -1) {
                            cBeginSql = true;
                        }
                        if (linha.match(/(\ |\t|\'|\"|)+SELECT+(\ |\t)/) ||
                            linha.match(/(\ |\t|\'|\"|)+DELETE+(\ |\t)/) ||
                            linha.match(/(\ |\t|\'|\"|)+UPDATE+(\ |\t)/)) {
                            cSelect = true;
                        }
                        if (!cBeginSql &&
                            (linha.search(/(\ |\t|\'|\"|)+DBUSEAREA+(\ |\t|)+\(+.+TOPCONN+.+TCGENQRY/) !== -1 ||
                                linhaClean.search(/TCQUERY+(\ |\t)/) !== -1)) {
                            objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.queryNoEmbedded', objeto.local), Erro_1.Severity.Warning));
                            FromQuery = false;
                            cSelect = false;
                        }
                        if (linha.search(/(\ |\t|\'|\")+DELETE+(\ |\t)+FROM+(\ |\t)/) !== -1) {
                            objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.deleteFrom', objeto.local), Erro_1.Severity.Warning));
                        }
                        if (linhaClean.search(/MSGBOX\(/) !== -1) {
                            objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.msgBox', objeto.local), Erro_1.Severity.Information));
                        }
                        if (linha.search(/GETMV\(+(\ |\t|)+(\"|\')+MV_FOLMES+(\"|\')+(\ |\t|)\)/) !== -1) {
                            objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.folMes', objeto.local), Erro_1.Severity.Information));
                        }
                        if (linha.search('\\<\\<\\<\\<\\<\\<\\<\\ HEAD') !== -1) {
                            //Verifica linha onde terminou o conflito
                            let nFim = key;
                            for (var key2 in linhas) {
                                if (linhas[key2].search('\\>\\>\\>\\>\\>\\>\\>') !== -1 &&
                                    nFim === key &&
                                    key2 > key) {
                                    nFim = key2;
                                }
                            }
                            objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(nFim), traduz('validaAdvpl.conflictMerge', objeto.local), Erro_1.Severity.Error));
                        }
                        if (linha.search(/(\ |\t|\'|\"|)+SELECT+(\ |\t)/) !== -1 &&
                            linha.search('\\ \\*\\ ') !== -1) {
                            objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.selectAll', objeto.local), Erro_1.Severity.Warning));
                        }
                        if (linha.search('CHR\\(13\\)') !== -1 &&
                            linha.search('CHR\\(10\\)') !== -1) {
                            objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.crlf', objeto.local), Erro_1.Severity.Warning));
                        }
                        if (cSelect && linha.search('FROM') !== -1) {
                            FromQuery = true;
                        }
                        if (cSelect && FromQuery && linha.search('JOIN') !== -1) {
                            JoinQuery = true;
                        }
                        if (linha.search('ENDSQL') !== -1 ||
                            linha.search('WHERE') !== -1 ||
                            linha.search('TCQUERY') !== -1) {
                            FromQuery = false;
                            cSelect = false;
                        }
                        //Implementação para aceitar vários bancos de dados
                        objeto.ownerDb.forEach(banco => {
                            if (cSelect && FromQuery && linha.search(banco) !== -1) {
                                objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.noSchema', objeto.local) +
                                    banco +
                                    traduz('validaAdvpl.inQuery', objeto.local), Erro_1.Severity.Error));
                            }
                        });
                        if (cSelect &&
                            (FromQuery || JoinQuery || linha.search('SET') !== -1) &&
                            linha.search('exp:cTable') === -1) {
                            //procura códigos de empresas nas queryes
                            objeto.empresas.forEach(empresa => {
                                //para melhorar a análise vou quebrar a string por espaços
                                //e removendo as quebras de linhas, vou varrer os itens do array e verificar o tamanho
                                //e o código da empresa chumbado
                                let palavras = linha
                                    .replace(/\r/g, '')
                                    .replace(/\t/g, '')
                                    .split(' ');
                                palavras.forEach(palavra => {
                                    if (palavra.search(empresa + '0') !== -1 &&
                                        palavra.length === 6) {
                                        objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.tableFixed', objeto.local), Erro_1.Severity.Error));
                                    }
                                });
                            });
                        }
                        if (cSelect && JoinQuery && linha.search('ON') !== -1) {
                            JoinQuery = false;
                        }
                        if (linhaClean.search(/CONOUT\(/) !== -1) {
                            objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.conout', objeto.local), Erro_1.Severity.Warning));
                        }
                        //  PUTSX1
                        if (linhaClean.search(/PUTSX1\(/) !== -1) {
                            objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.PutSX1', objeto.local), Erro_1.Severity.Error));
                        }
                        // Uso de Dicionários Fora do BeginSql
                        if (!cBeginSql &&
                            linhaClean.search(/(,| |\t|\>|\()+X+(1|2|3|5|6|7|9|A|B|D|G)+\_/gim) !== -1) {
                            objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.Dictionary', objeto.local), Erro_1.Severity.Error));
                        }
                        if (linhaClean.search(/(,| |\t||\()+(MSFILE|MSFILE|DBCREATE|DBUSEAREA|CRIATRAB)+( \(|\t\(|\()/gim) !== -1 ||
                            linhaClean.search(/( |)+(MSCOPYFILE|MSERASE|COPY TO)+( |\t)/gim) !== -1) {
                            objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.Isam', objeto.local), Erro_1.Severity.Error));
                        }
                        //recomendação para melhorar identificação de problemas em queryes
                        if ((linha.match(/(\ |\t|)+SELECT+(\ |\t)/) ||
                            linha.match(/(\ |\t|)+DELETE+(\ |\t)/) ||
                            linha.match(/(\ |\t|)+UPDATE+(\ |\t)/) ||
                            linha.match(/(\ |\t|)+JOIN+(\ |\t)/)) &&
                            (linha.match(/(\ |\t|)+FROM+(\ |\t)/) ||
                                linha.match(/(\ |\t|)+ON+(\ |\t)/) ||
                                linha.match(/(\ |\t|)+WHERE+(\ |\t)/)) &&
                            linha.search(/(\ |\t)+TCSQLEXEC+\(/) === -1) {
                            //verifica o caracter anterior tem que ser ou ESPACO ou ' ou " ou nada
                            let itens1 = ['FROM', 'ON', 'WHERE'];
                            let addErro = false;
                            itens1.forEach(item => {
                                addErro = addErro || linha.search("\\'" + item) !== -1;
                                addErro = addErro || linha.search('\\"' + item) !== -1;
                                addErro = addErro || linha.search('\\ ' + item) !== -1;
                            });
                            if (addErro) {
                                objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.bestAnalitc', objeto.local) +
                                    ' SELECT, DELETE, UPDATE, JOIN, FROM, ON, WHERE.', Erro_1.Severity.Information));
                            }
                        }
                    }
                    else {
                        conteudoSComentario += '\n';
                    }
                }
                //Validação de padrão de comentáris de fontes
                let comentariosFonte = true;
                for (var _i = 0; _i < objeto.comentFontPad.length; _i++) {
                    let cExpressao = objeto.comentFontPad[_i];
                    let linha = linhas[_i];
                    comentariosFonte =
                        comentariosFonte && linha.search(cExpressao) !== -1;
                }
                if (!comentariosFonte) {
                    objeto.aErros.push(new Erro_1.Erro(0, 0, traduz('validaAdvpl.padComment', objeto.local), Erro_1.Severity.Information));
                }
                //Validação funções sem comentários
                funcoes.forEach(funcao => {
                    let achou = false;
                    comentFuncoes.forEach(comentario => {
                        achou = achou || comentario[0] === funcao[0];
                    });
                    if (!achou) {
                        objeto.aErros.push(new Erro_1.Erro(parseInt(funcao[1]), parseInt(funcao[1]), traduz('validaAdvpl.functionNoCommented', objeto.local), Erro_1.Severity.Warning));
                    }
                });
                //Validação comentários sem funções
                comentFuncoes.forEach(comentario => {
                    let achou = false;
                    funcoes.forEach(funcao => {
                        achou = achou || comentario[0] === funcao[0];
                    });
                    if (!achou) {
                        objeto.aErros.push(new Erro_1.Erro(parseInt(comentario[1]), parseInt(comentario[1]), traduz('validaAdvpl.CommentNoFunction', objeto.local), Erro_1.Severity.Warning));
                    }
                });
                //Validador de includes
                let oInclude = new include_1.Include(objeto.local);
                oInclude.valida(objeto, conteudoSComentario);
                //Conta os erros por tipo e totaliza no objeto
                objeto.hint = 0;
                objeto.information = 0;
                objeto.warning = 0;
                objeto.error = 0;
                objeto.aErros.forEach((erro) => {
                    if (erro.severity === Erro_1.Severity.Hint) {
                        objeto.hint++;
                    }
                    if (erro.severity === Erro_1.Severity.Information) {
                        objeto.information++;
                    }
                    if (erro.severity === Erro_1.Severity.Warning) {
                        objeto.warning++;
                    }
                    if (erro.severity === Erro_1.Severity.Error) {
                        objeto.error++;
                    }
                });
                if (objeto.error + objeto.hint + objeto.warning + objeto.information >
                    0 &&
                    this.log) {
                    if (objeto.error > 0) {
                        console.log(`\t\t${objeto.error} Errors .`);
                    }
                    if (objeto.warning > 0) {
                        console.log(`\t\t${objeto.warning} Warnings .`);
                    }
                    if (objeto.information > 0) {
                        console.log(`\t\t${objeto.information} Informations .`);
                    }
                    if (objeto.hint > 0) {
                        console.log(`\t\t${objeto.hint} Hints .`);
                    }
                }
                resolve(objeto);
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.ValidaAdvpl = ValidaAdvpl;
function traduz(key, local) {
    let locales = ['en', 'pt-br'];
    let i18n = __webpack_require__(3);
    i18n.configure({
        locales: locales,
        directory: __dirname + '/locales'
    });
    i18n.setLocale(locales.indexOf(local) + 1 ? local : 'en');
    return i18n.__(key);
}
//# sourceMappingURL=validaAdvpl.js.map

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Erro_1 = __webpack_require__(31);
class Include {
    constructor(local) {
        this.local = local;
        this.includesObsoletos = [];
        this.includesObsoletos.push('PROTHEUS.CH');
        this.includesObsoletos.push('DIALOG.CH');
        this.includesObsoletos.push('FONT.CH');
        this.includesObsoletos.push('PTMENU.CH');
        this.includesObsoletos.push('PRINT.CH');
        this.includesObsoletos.push('COLORS.CH');
        this.includesObsoletos.push('FOLDER.CH');
        this.includesObsoletos.push('MSOBJECT.CH');
        this.includesObsoletos.push('VKEY.CH');
        this.includesObsoletos.push('WINAPI.CH');
        this.includesObsoletos.push('FWCOMMAND.CH');
        this.includesObsoletos.push('FWCSS.CH');
        this.includeExpressoes = [];
        //AP5MAIL.CH
        this.includeExpressoes.push({
            expressoes: [
                /CONNECT+(\ |\t)+SMTP+(\ |\t)+SERVER/gim,
                /CONNECT+(\ |\t)+POP+(\ |\t)+SERVER/gim,
                /DISCONNECT+(\ |\t)+SMTP+(\ |\t)+SERVER/gim,
                /DISCONNECT+(\ |\t)+POP+(\ |\t)+SERVER/gim,
                /POP+(\ |\t)+MESSAGE+(\ |\t)+COUNT/gim,
                /SEND+(\ |\t)+MAIL+(\ |\t)+FROM/gim,
                /GET+(\ |\t)+MAIL+(\ |\t)+ERROR/gim,
                /RECEIVE+(\ |\t)+MAIL+(\ |\t)+MESSAGE/gim
            ],
            include: 'AP5MAIL.CH',
            precisa: false,
            includes: []
        });
        //APVISIO.CH
        //APWEB.CH
        this.includeExpressoes.push({
            expressoes: [
                /APWEB+(\ |\t)+INIT+(\ |\t)+.+(\ |\t)+USING/gim,
                /APWEB+(\ |\t)+END/gim
            ],
            include: 'APWEB.CH',
            precisa: false,
            includes: []
        });
        //APWEBEX.CH
        this.includeExpressoes.push({
            expressoes: [
                /OPEN+(\ |\t)+QUERY+(\ |\t)+ALIAS/gim,
                /CLOSE+(\ |\t)+QUERY/gim,
                /WEB+(\ |\t)+EXTENDED+(\ |\t)+INIT/gim,
                /WEB+(\ |\t)+EXTENDED+(\ |\t)+END/gim
            ],
            include: 'APWEBEX.CH',
            precisa: false,
            includes: []
        });
        //APWEBSRV.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+SOAPFAULT_VERSIONMISMATCH/gim,
                /(\ |\t|\(|\,)+SOAPFAULT_MUSTUNDERSTAND/gim,
                /(\ |\t|\(|\,)+SOAPFAULT_DTDNOTSUPPORTED/gim,
                /(\ |\t|\(|\,)+SOAPFAULT_DATAENCODINGUNKNOWN/gim,
                /(\ |\t|\(|\,)+SOAPFAULT_SENDER/gim,
                /(\ |\t|\(|\,)+SOAPFAULT_RECEIVER/gim,
                /(\ |\t|\(|\,)+BYREF/gim,
                /(^|\t|\ )+WSSTRUCT/gim,
                /(^|\t|\ )+WSSERVICE/gim,
                /(^|\t|\ )+WSCLIENT/gim
            ],
            include: 'APWEBSRV.CH',
            precisa: false,
            includes: []
        });
        //APWIZARD.CH
        this.includeExpressoes.push({
            expressoes: [
                /DEFINE+(\ |\t)+WIZARD/gim,
                /ACTIVATE+(\ |\t)+WIZARD/gim,
                /CREATE+(\ |\t)+PANEL/gim
            ],
            include: 'APWIZARD.CH',
            precisa: false,
            includes: []
        });
        //AVPRINT.CH
        //AXSDEF.CH
        //BIRTDATASET.CH
        //COLORS.CH - DENTRO DO PROTHEUS.CH
        //COMMON.CH
        //CONSTANT.CH
        //DBFCDXAX.CH
        //TOPCONN.CH
        this.includeExpressoes.push({
            expressoes: [/TCQUERY+(\ |\t)/gim],
            include: 'TOPCONN.CH',
            precisa: false,
            includes: []
        });
        //TBICONN.CH
        this.includeExpressoes.push({
            expressoes: [
                /CREATE+(\ |\t)+RPCCONN+(\ |\t)/gim,
                /CLOSE+(\ |\t)+RPCCONN+(\ |\t)/gim,
                /PREPARE+(\ |\t)+ENVIRONMENT+(\ |\t)/gim,
                /RESET+(\ |\t)+ENVIRONMENT+(\ |\t)/gim,
                /OPEN+(\ |\t)+REMOTE+(\ |\t)+TRANSACTION+(\ |\t)/gim,
                /CLOSE+(\ |\t)+REMOTE+(\ |\t)+TRANSACTION+(\ |\t)/gim,
                /CALLPROC+(\ |\t)+IN+(\ |\t)/gim,
                /OPEN+(\ |\t)+REMOTE+(\ |\t)+TABLES+(\ |\t)/gim
            ],
            include: 'TBICONN.CH',
            precisa: false,
            includes: ['AP5MAIL.CH']
        });
        //REPORT.CH
        this.includeExpressoes.push({
            expressoes: [
                /DEFINE+(\ |\t)+REPORT+(\ |\t)+.+(\ |\t)+NAME+(\ |\t)/gim,
                /DEFINE+(\ |\t)+SECTION+(\ |\t)+.+(\ |\t)+OF+(\ |\t)/gim,
                /DEFINE+(\ |\t)+CELL+(\ |\t)+NAME+(\ |\t)+.+(\ |\t)+OF+(\ |\t)/gim,
                /DEFINE+(\ |\t)+BREAK+(\ |\t)+OF+(\ |\t)/gim,
                /DEFINE+(\ |\t)+FUNCTION+(\ |\t)+FROM+(\ |\t)/gim,
                /DEFINE+(\ |\t)+COLLECTION+(\ |\t)+.+(\ |\t)+OF+(\ |\t)/gim,
                /DEFINE+(\ |\t)+BORDER+(\ |\t)+.+(\ |\t)+OF+(\ |\t)+/gim,
                /DEFINE+(\ |\t)+HEADER+(\ |\t)+BORDER+(\ |\t)+.+(\ |\t)+OF+(\ |\t)/gim,
                /DEFINE+(\ |\t)+CELL+(\ |\t)+BORDER+(\ |\t)+.+(\ |\t)+OF+(\ |\t)/gim,
                /DEFINE+(\ |\t)+CELL+(\ |\t)+HEADER+(\ |\t)+BORDER+(\ |\t)+.+(\ |\t)+OF+(\ |\t)/gim
            ],
            include: 'REPORT.CH',
            precisa: false,
            includes: []
        });
        //RESTFUL.CH
        this.includeExpressoes.push({
            expressoes: [
                /(^|\t|\ )+WSRESTFUL/gim,
                /(^|\t|\ )+WADL/gim,
                /(^|\t|\ )+WADLMETHOD/gim
            ],
            include: 'RESTFUL.CH',
            precisa: false,
            includes: ['APWEBSRV.CH']
        });
        //FILEIO.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+F_ERROR/gim,
                /(\ |\t|\(|\,)+FS_SET/gim,
                /(\ |\t|\(|\,)+FS_RELATIVE/gim,
                /(\ |\t|\(|\,)+FS_END/gim,
                /(\ |\t|\(|\,)+FO_READ/gim,
                /(\ |\t|\(|\,)+FO_WRITE/gim,
                /(\ |\t|\(|\,)+FO_READWRITE/gim,
                /(\ |\t|\(|\,)+FO_COMPAT/gim,
                /(\ |\t|\(|\,)+FO_EXCLUSIVE/gim,
                /(\ |\t|\(|\,)+FO_DENYWRITE/gim,
                /(\ |\t|\(|\,)+FO_DENYREAD/gim,
                /(\ |\t|\(|\,)+FO_DENYNONE/gim,
                /(\ |\t|\(|\,)+FO_SHARED/gim,
                /(\ |\t|\(|\,)+FC_NORMAL/gim,
                /(\ |\t|\(|\,)+FC_READONLY/gim,
                /(\ |\t|\(|\,)+FC_HIDDEN/gim,
                /(\ |\t|\(|\,)+FC_SYSTEM/gim,
                /(\ |\t|\(|\,)+FD_RAW/gim,
                /(\ |\t|\(|\,)+FD_BINARY/gim,
                /(\ |\t|\(|\,)+FD_COOKED/gim,
                /(\ |\t|\(|\,)+FD_TEXT/gim,
                /(\ |\t|\(|\,)+FD_ASCII/gim
            ],
            include: 'FILEIO.CH',
            precisa: false,
            includes: []
        });
        //TBICODE.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+RPC_LOGIN/gim,
                /(\ |\t|\(|\,)+RPC_LOGOFF/gim,
                /(\ |\t|\(|\,)+RPC_SEND_COTACAO/gim,
                /(\ |\t|\(|\,)+RPC_ESTORNA_COTACAO/gim,
                /(\ |\t|\(|\,)+RPC_READ_COTACAO/gim,
                /(\ |\t|\(|\,)+RPC_SEND_ORCAMENTO/gim,
                /(\ |\t|\(|\,)+RPC_ESTORNA_ORCAMENTO/gim,
                /(\ |\t|\(|\,)+RPC_READ_ORCAMENTO/gim
            ],
            include: 'TBICODE.CH',
            precisa: false,
            includes: []
        });
        //PARMTYPE.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+PARAMEXCEPTION/gim,
                /(\ |\t|\(|\,)+CLASSEXCEPTION/gim,
                /(\ |\t|\(|\,)+CLASSPARAMEXCEPTION/gim,
                /(\ |\t|\(|\,)+BLOCKPARAMEXCEPTION/gim,
                /(\ |\t|\(|\,)+PARAMTYPE/gim
            ],
            include: 'PARMTYPE.CH',
            precisa: false,
            includes: []
        });
        //FWMVCDEF.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+FORM_STRUCT_TABLE_/gim,
                /(\ |\t|\(|\,)+FORM_STRUCT_CARGO_/gim,
                /(\ |\t|\(|\,)+MVC_BUTTON_/gim,
                /(\ |\t|\(|\,)+MVC_TOOLBAR_/gim,
                /(\ |\t|\(|\,)+MODELO_PK_/gim,
                /(\ |\t|\(|\,)+MODEL_TRIGGER_/gim,
                /(\ |\t|\(|\,)+MODEL_FIELD_/gim,
                /(\ |\t|\(|\,)+MODEL_RELATION_/gim,
                /(\ |\t|\(|\,)+MODEL_STRUCT_/gim,
                /(\ |\t|\(|\,)+STRUCT_FEATURE_/gim,
                /(\ |\t|\(|\,)+STRUCT_RULES_/gim,
                /(\ |\t|\(|\,)+MODEL_GRID_/gim,
                /(\ |\t|\(|\,)+MODEL_GRIDLINE_/gim,
                /(\ |\t|\(|\,)+MODEL_RULES_/gim,
                /(\ |\t|\(|\,)+MODEL_MSGERR_/gim,
                /(\ |\t|\(|\,)+MODEL_OPERATION_/gim,
                /(\ |\t|\(|\,)+MVC_LOADFILTER_/gim,
                /(\ |\t|\(|\,)+MODEL_CONTROL_/gim,
                /(\ |\t|\(|\,)+VIEWS_VIEW_/gim,
                /(\ |\t|\(|\,)+MVC_VIEW_/gim,
                /(\ |\t|\(|\,)+MVC_MODEL_/gim,
                /(\ |\t|\(|\,)+FORMSTRUFIELD/gim,
                /(\ |\t|\(|\,)+FORMSTRUTRIGGER/gim,
                /(\ |\t|\(|\,)+VIEWSTRUFIELD/gim,
                /(\ |\t|\(|\,)+VIEWSTRUFOLDER/gim,
                /(\ |\t|\(|\,)+VIEWSTRUDOCKWINDOW/gim,
                /(\ |\t|\(|\,)+VIEWSTRUGROUP/gim,
                /(\ |\t|\(|\,)+VIEW_BUTTON_/gim,
                /(\ |\t|\(|\,)+OP_PESQUISAR/gim,
                /(\ |\t|\(|\,)+OP_VISUALIZAR/gim,
                /(\ |\t|\(|\,)+OP_INCLUIR/gim,
                /(\ |\t|\(|\,)+OP_ALTERAR/gim,
                /(\ |\t|\(|\,)+OP_EXCLUIR/gim,
                /(\ |\t|\(|\,)+OP_IMPRIMIR/gim,
                /(\ |\t|\(|\,)+OP_COPIA/gim,
                /(^|\t|\ )+ADD+(\ |\t)+FWTOOLBUTTON/gim,
                /(^|\t|\ )+NEW+(\ |\t)+MODEL/gim,
                /(^|\t|\ )+PUBLISH+(\ |\t)+MODEL+(\ |\t)+REST+(\ |\t)+NAME/gim,
                /(^|\t|\ )+ADD+(\ |\t)+OPTION+(\ |\t)+(.|)+(\ |\t|)+TITLE+(\ |\t|)+(.|)+(\ |\t|)+ACTION+(\ |\t)+(.|)+(\ |\t|)+OPERATION+(\ |\t)+(.|)+(\ |\t)+ACCESS/gim
            ],
            include: 'FWMVCDEF.CH',
            precisa: false,
            includes: ['PARMTYPE.CH', 'FWMBROWSE.CH']
        });
        //AARRAY.CH
        this.includeExpressoes.push({
            expressoes: [/\[+(\ |\t|)+\#+(.|)+\]/gim],
            include: 'AARRAY.CH',
            precisa: false,
            includes: []
        });
        //RPTDEF.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+CELL_ALIGN_LEFT/gim,
                /(\ |\t|\(|\,)+CELL_ALIGN_CENTER/gim,
                /(\ |\t|\(|\,)+CELL_ALIGN_RIGHT/gim,
                /(\ |\t|\(|\,)+BORDER_NONE/gim,
                /(\ |\t|\(|\,)+BORDER_CONTINUOUS/gim,
                /(\ |\t|\(|\,)+BORDER_PARENT/gim,
                /(\ |\t|\(|\,)+BORDER_HEADERPARENT/gim,
                /(\ |\t|\(|\,)+BORDER_CELL/gim,
                /(\ |\t|\(|\,)+BORDER_FUNCTION/gim,
                /(\ |\t|\(|\,)+BORDER_SECTION/gim,
                /(\ |\t|\(|\,)+EDGE_TOP/gim,
                /(\ |\t|\(|\,)+EDGE_BOTTOM/gim,
                /(\ |\t|\(|\,)+EDGE_LEFT/gim,
                /(\ |\t|\(|\,)+EDGE_RIGHT/gim,
                /(\ |\t|\(|\,)+EDGE_ALL/gim,
                /(\ |\t|\(|\,)+NEGATIVE_PARENTHESES/gim,
                /(\ |\t|\(|\,)+NEGATIVE_SIGNAL/gim,
                /(\ |\t|\(|\,)+IMP_DISCO/gim,
                /(\ |\t|\(|\,)+IMP_SPOOL/gim,
                /(\ |\t|\(|\,)+IMP_EMAIL/gim,
                /(\ |\t|\(|\,)+IMP_EXCEL/gim,
                /(\ |\t|\(|\,)+IMP_HTML/gim,
                /(\ |\t|\(|\,)+IMP_PDF/gim,
                /(\ |\t|\(|\,)+IMP_ODF/gim,
                /(\ |\t|\(|\,)+IMP_PDFMAIL/gim,
                /(\ |\t|\(|\,)+IMP_MAILCOMPROVA/gim,
                /(\ |\t|\(|\,)+IMP_ECM/gim,
                /(\ |\t|\(|\,)+AMB_SERVER/gim,
                /(\ |\t|\(|\,)+AMB_CLIENT/gim,
                /(\ |\t|\(|\,)+AMB_ECM+(\ |\t)/gim,
                /(\ |\t|\(|\,)+PORTRAIT+(\ |\t)/gim,
                /(\ |\t|\(|\,)+LANDSCAPE+(\ |\t)/gim,
                /(\ |\t|\(|\,)+NO_REMOTE/gim,
                /(\ |\t|\(|\,)+REMOTE_DELPHI/gim,
                /(\ |\t|\(|\,)+REMOTE_QTWIN/gim,
                /(\ |\t|\(|\,)+REMOTE_QTLINUX/gim,
                /(\ |\t|\(|\,)+TYPE_CELL/gim,
                /(\ |\t|\(|\,)+TYPE_FORMULA/gim,
                /(\ |\t|\(|\,)+TYPE_FUNCTION/gim,
                /(\ |\t|\(|\,)+TYPE_USER/gim,
                /(\ |\t|\(|\,)+COLLECTION_VALUE/gim,
                /(\ |\t|\(|\,)+COLLECTION_REPORT/gim,
                /(\ |\t|\(|\,)+COLLECTION_SECTION/gim,
                /(\ |\t|\(|\,)+COLLECTION_PAGE/gim,
                /(\ |\t|\(|\,)+TSEEK/gim,
                /(\ |\t|\(|\,)+TCACHE/gim,
                /(\ |\t|\(|\,)+TSTRUCT/gim,
                /(\ |\t|\(|\,)+TALIAS/gim,
                /(\ |\t|\(|\,)+TDESC/gim,
                /(\ |\t|\(|\,)+FSTRUCTALL/gim,
                /(\ |\t|\(|\,)+FSTRUCTFIELD/gim,
                /(\ |\t|\(|\,)+FTITLE/gim,
                /(\ |\t|\(|\,)+FTOOLTIP/gim,
                /(\ |\t|\(|\,)+FFIELD/gim,
                /(\ |\t|\(|\,)+FTYPE/gim,
                /(\ |\t|\(|\,)+FSIZE/gim,
                /(\ |\t|\(|\,)+FDECIMAL/gim,
                /(\ |\t|\(|\,)+FCOMBOBOX/gim,
                /(\ |\t|\(|\,)+FOBRIGAT/gim,
                /(\ |\t|\(|\,)+FUSED/gim,
                /(\ |\t|\(|\,)+FCONTEXT/gim,
                /(\ |\t|\(|\,)+FNIVEL/gim,
                /(\ |\t|\(|\,)+FTABLE/gim,
                /(\ |\t|\(|\,)+FPICTURE/gim,
                /(\ |\t|\(|\,)+FCONPAD/gim,
                /(\ |\t|\(|\,)+ISTRUCTALL/gim,
                /(\ |\t|\(|\,)+ISTRUCTINDEX/gim,
                /(\ |\t|\(|\,)+IDESC/gim,
                /(\ |\t|\(|\,)+IKEY/gim,
                /(\ |\t|\(|\,)+IDESC/gim,
                /(\ |\t|\(|\,)+ITABLE/gim,
                /(\ |\t|\(|\,)+PGROUP/gim,
                /(\ |\t|\(|\,)+PORDER/gim,
                /(\ |\t|\(|\,)+PGSC/gim,
                /(\ |\t|\(|\,)+PTYPE/gim,
                /(\ |\t|\(|\,)+PDESC/gim,
                /(\ |\t|\(|\,)+PPERG1/gim,
                /(\ |\t|\(|\,)+PPERG2/gim,
                /(\ |\t|\(|\,)+PPERG3/gim,
                /(\ |\t|\(|\,)+PPERG4/gim,
                /(\ |\t|\(|\,)+PPERG5/gim,
                /(\ |\t|\(|\,)+PPYME/gim,
                /(\ |\t|\(|\,)+PPICTURE/gim
            ],
            include: 'RPTDEF.CH',
            precisa: false,
            includes: []
        });
        //FWPRINTSETUP.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+PD_ISTOTVSPRINTER/gim,
                /(\ |\t|\(|\,)+PD_DISABLEDESTINATION/gim,
                /(\ |\t|\(|\,)+PD_DISABLEORIENTATION/gim,
                /(\ |\t|\(|\,)+PD_DISABLEPAPERSIZE/gim,
                /(\ |\t|\(|\,)+PD_DISABLEPREVIEW/gim,
                /(\ |\t|\(|\,)+PD_DISABLEMARGIN/gim,
                /(\ |\t|\(|\,)+PD_TYPE_FILE/gim,
                /(\ |\t|\(|\,)+PD_TYPE_SPOOL/gim,
                /(\ |\t|\(|\,)+PD_TYPE_EMAIL/gim,
                /(\ |\t|\(|\,)+PD_TYPE_EXCEL/gim,
                /(\ |\t|\(|\,)+PD_TYPE_HTML/gim,
                /(\ |\t|\(|\,)+PD_TYPE_PDF/gim,
                /(\ |\t|\(|\,)+PD_DESTINATION/gim,
                /(\ |\t|\(|\,)+PD_PRINTTYPE/gim,
                /(\ |\t|\(|\,)+PD_ORIENTATION/gim,
                /(\ |\t|\(|\,)+PD_PAPERSIZE/gim,
                /(\ |\t|\(|\,)+PD_PREVIEW/gim,
                /(\ |\t|\(|\,)+PD_VALUETYPE/gim,
                /(\ |\t|\(|\,)+PD_MARGIN/gim,
                /(\ |\t|\(|\,)+PD_MARGIN_LEFT/gim,
                /(\ |\t|\(|\,)+PD_MARGIN_TOP/gim,
                /(\ |\t|\(|\,)+PD_MARGIN_RIGHT/gim,
                /(\ |\t|\(|\,)+PD_MARGIN_BOTTOM/gim,
                /(\ |\t|\(|\,)+PD_OK/gim,
                /(\ |\t|\(|\,)+PD_CANCEL/gim
            ],
            include: 'FWPRINTSETUP.CH',
            precisa: false,
            includes: []
        });
        //MSOLE.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+OLEONERROR/gim,
                /(\ |\t|\(|\,)+OLEWDLEFT/gim,
                /(\ |\t|\(|\,)+OLEWDTOP/gim,
                /(\ |\t|\(|\,)+OLEWDWIDTH/gim,
                /(\ |\t|\(|\,)+OLEWDHEIGHT/gim,
                /(\ |\t|\(|\,)+OLEWDCAPTION/gim,
                /(\ |\t|\(|\,)+OLEWDVISIBLE/gim,
                /(\ |\t|\(|\,)+OLEWDWINDOWSTATE/gim,
                /(\ |\t|\(|\,)+OLEWDPRINTBACK/gim,
                /(\ |\t|\(|\,)+OLEWDVERSION/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATDOCUMENT/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATTEMPLATE/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATTEXT/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATTEXTLINEBREAKS/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATDOSTEXT/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATDOSTEXTLINEBREAKS/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATRTF/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATUNICODETEXT/gim,
                /(\ |\t|\(|\,)+WDFORMATHTML/gim,
                /(\ |\t|\(|\,)+WDFORMATDOCUMENTDEFAULT/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATHTML/gim
            ],
            include: 'MSOLE.CH',
            precisa: false,
            includes: []
        });
        //RWMAKE.CH
        this.includeExpressoes.push({
            expressoes: [
                /@+(\ |\t)+.+\,+.+(\ |\t)+TO+(\ |\t)+.+\,+.+(\ |\t)+DIALOG/gim,
                /@+(\ |\t)+.+\,+.+(\ |\t)+BMPBUTTON/gim
            ],
            include: 'RWMAKE.CH',
            precisa: false,
            includes: ['STDWIN.CH']
        });
    }
    valida(objetoValidacao, conteudoFile) {
        //Monta array com includes no fonte
        let includesFonte = objetoValidacao.includes.map((x) => x.include);
        let includesAnalise = this.includeExpressoes.map((x) => x.include);
        if (!objetoValidacao.includes.indexOf((x) => x.include === 'TOTVS.CH')) {
            objetoValidacao.aErros.push(new Erro_1.Erro(0, 0, traduz('includes.faltaTOTVS', this.local), Erro_1.Severity.Warning));
        }
        //Busca includes duplicados
        for (let i = 0, il = objetoValidacao.includes.length; i < il; i++) {
            let include = objetoValidacao.includes[i];
            //Verifica se o include é obsoleto
            if (this.includesObsoletos.indexOf(include.include) !== -1) {
                objetoValidacao.aErros.push(new Erro_1.Erro(include.linha, include.linha, traduz('includes.oInclude', this.local) +
                    include.include +
                    traduz('includes.SubstTOTVS', this.local), Erro_1.Severity.Warning));
            }
            //Verifica se há o mesmo include em uma linha diferente do mesmo fonte
            if (objetoValidacao.includes.findIndex(function (x) {
                return x.include === include.include && x.linha !== include.linha;
            }) !== -1) {
                objetoValidacao.aErros.push(new Erro_1.Erro(include.linha, include.linha, traduz('includes.oInclude', this.local) +
                    include.include +
                    traduz('includes.emDuplicidade', this.local), Erro_1.Severity.Warning));
            }
        }
        //valida necessidade de includes
        let linhas = conteudoFile.split('\n');
        let listaAnalise = [];
        // verifica se alguma expressão foi utilizada no fonte todo
        for (let i = 0, il = this.includeExpressoes.length; i < il; i++) {
            let element = this.includeExpressoes[i];
            for (let i2 = 0, il2 = element.expressoes.length; i2 < il2; i2++) {
                let expressao = element.expressoes[i2];
                if (conteudoFile.search(expressao) !== -1) {
                    listaAnalise.push(element);
                    break;
                }
            }
        }
        // monta lista de includes com os contidos
        let includesFonteAll = includesFonte;
        for (let i2 = 0, il2 = objetoValidacao.includes.length; i2 < il2; i2++) {
            let element = this.includeExpressoes[includesAnalise.indexOf(objetoValidacao.includes[i2].include)];
            if (element) {
                includesFonteAll = includesFonteAll.concat(element.includes);
            }
        }
        //Se houver algo para analisar entra no fonte
        if (listaAnalise.length > 0) {
            for (var key in linhas) {
                //seta linha atual
                let linha = ' ' + linhas[key];
                let linhacls = linhas[key];
                for (let i = 0, il = listaAnalise.length; i < il; i++) {
                    let element = listaAnalise[i];
                    for (let i2 = 0, il2 = element.expressoes.length; i2 < il2; i2++) {
                        let expressao = element.expressoes[i2];
                        if (linha.search(expressao) !== -1 ||
                            linhacls.search(expressao) !== -1) {
                            element.precisa = true;
                            //se não estiver na lista de includes
                            if (includesFonteAll.indexOf(element.include) === -1) {
                                objetoValidacao.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('includes.faltaInclude', this.local) +
                                    element.include +
                                    '!', Erro_1.Severity.Error));
                            }
                        }
                    }
                }
            }
        }
        //Verifica se o include é desnecessário
        for (let i2 = 0, il2 = objetoValidacao.includes.length; i2 < il2; i2++) {
            let include = objetoValidacao.includes[i2];
            //se o include é analisado
            let includeAnalise = this.includeExpressoes[includesAnalise.indexOf(include.include)];
            if (includeAnalise) {
                //Verifica se há algum include que está contido nesse INCLUDE
                for (let i = 0, il = includeAnalise.includes.length; i < il; i++) {
                    let includeContido = includeAnalise.includes[i];
                    let includeAnaliseContido = objetoValidacao.includes[includesFonte.indexOf(includeContido)];
                    if (includeAnaliseContido) {
                        includeAnaliseContido.precisa = false;
                        objetoValidacao.aErros.push(new Erro_1.Erro(includeAnaliseContido.linha, includeAnaliseContido.linha, traduz('includes.oInclude', this.local) +
                            includeAnaliseContido.include +
                            traduz('includes.desnecessarioContido', this.local) +
                            include.include +
                            '!', Erro_1.Severity.Warning));
                    }
                }
                if (!includeAnalise.precisa) {
                    objetoValidacao.aErros.push(new Erro_1.Erro(include.linha, include.linha, 'Include ' +
                        include.include +
                        traduz('includes.desnecessario', this.local), Erro_1.Severity.Warning));
                }
            }
        }
    }
}
exports.Include = Include;
function traduz(key, local) {
    let locales = ['en', 'pt-br'];
    let i18n = __webpack_require__(3);
    i18n.configure({
        locales: locales,
        directory: __dirname + '/locales'
    });
    i18n.setLocale(locales.indexOf(local) + 1 ? local : 'en');
    return i18n.__(key);
}
//# sourceMappingURL=include.js.map

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Severity;
(function (Severity) {
    Severity[Severity["Error"] = 0] = "Error";
    Severity[Severity["Warning"] = 1] = "Warning";
    Severity[Severity["Information"] = 2] = "Information";
    Severity[Severity["Hint"] = 3] = "Hint";
})(Severity = exports.Severity || (exports.Severity = {}));
class Erro {
    constructor(startLine, endLine, message, severity) {
        this.startLine = startLine;
        this.endLine = endLine;
        this.message = message;
        this.severity = severity;
    }
}
exports.Erro = Erro;
//# sourceMappingURL=Erro.js.map

/***/ }),
/* 32 */
/***/ (function(module) {

module.exports = {"name":"analise-advpl","version":"5.0.3","description":"Extension of ADVPL code analysis.","types":"lib/index.d.ts","main":"lib/index.js","scripts":{"compile":"tsc -p ./","prepublish":"npm run compile","test":"npm run compile && mocha \"./test/validaadvpl.js\""},"keywords":[],"author":"Robson Rogério Silva","license":"ISC","dependencies":{"@types/node":"^10.14.10","asserts":"^4.0.2","chai":"^4.2.0","file-system":"^2.2.2","globby":"^10.0.0","i18n":"^0.8.3","mocha":"^5.2.0"},"devDependencies":{"typescript":"^3.5.2","vscode":"^1.1.35"}};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Erro_1 = __webpack_require__(31);
const fonte_1 = __webpack_require__(28);
const ItemProject_1 = __webpack_require__(34);
const globby = __importStar(__webpack_require__(35));
const fileSystem = __importStar(__webpack_require__(6));
const validaAdvpl_1 = __webpack_require__(29);
const package_json_1 = __webpack_require__(32);
class ValidaProjeto {
    constructor(comentFontePad, local, log = true) {
        this.log = log;
        this.version = package_json_1.version;
        this.advplExtensions = ['prw', 'prx', 'prg', 'apw', 'apl', 'tlpp'];
        this.listaDuplicados = { files: [], functions: [] };
        this.local = local;
        this.comentFontPad = comentFontePad;
        this.ownerDb = [];
        this.empresas = [];
    }
    validaProjeto(pathProject) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                this.projeto = [];
                // monta expressão para buscar arquivos
                let globexp = [];
                for (var i = 0; i < this.advplExtensions.length; i++) {
                    globexp.push(`**/*.${this.advplExtensions[i]}`);
                }
                // busca arquivos na pasta
                let files = yield globby.sync(globexp, {
                    cwd: pathProject,
                    caseSensitiveMatch: false
                });
                // valida arquivos
                let promisses = [];
                let startTime = new Date();
                if (this.log) {
                    console.log(startTime);
                    console.log('Analise de Projeto: ' + pathProject);
                }
                files.forEach((fileName) => {
                    let valida = new validaAdvpl_1.ValidaAdvpl(this.comentFontPad, this.local, this.log);
                    valida.ownerDb = this.ownerDb;
                    valida.empresas = this.empresas;
                    if (this.log) {
                        console.log('Arquivo: ' + fileName);
                    }
                    let conteudo = fileSystem.readFileSync(pathProject + '\\' + fileName, 'latin1');
                    promisses.push(valida.validacao(conteudo, pathProject + '\\' + fileName));
                });
                Promise.all(promisses).then((validacoes) => {
                    validacoes.forEach((validacao) => {
                        let itemProjeto = new ItemProject_1.ItemModel();
                        itemProjeto.content = validacao.conteudoFonte;
                        itemProjeto.errors = validacao.aErros;
                        itemProjeto.fonte = validacao.fonte;
                        this.projeto.push(itemProjeto);
                    });
                    // verifica duplicados
                    this.verificaDuplicados().then(() => {
                        if (this.log) {
                            // calcula tempo gasto
                            let endTime = new Date();
                            let timeDiff = endTime - startTime; //in ms
                            // strip the ms
                            timeDiff /= 1000;
                            // get seconds
                            let seconds = Math.round(timeDiff);
                            console.log('Terminou! (' + seconds + ' segundos)');
                        }
                        resolve(this);
                    });
                });
            }));
        });
    }
    verificaDuplicados() {
        return new Promise((resolve) => {
            let listaFuncoes = [];
            let funcoesDuplicadas = [];
            let listaArquivos = [];
            let arquivosDuplicados = [];
            this.projeto.forEach((item) => {
                let fonte = item.fonte;
                //verifica se o fonte ainda existe
                try {
                    fileSystem.statSync(fonte.fonte);
                    fonte.funcoes.forEach((funcao) => {
                        // não aponta como duplicadas as static Functions ou metodos
                        if (funcao.tipo !== fonte_1.Tipos['Static Function'] &&
                            funcao.tipo !== fonte_1.Tipos.Method) {
                            let functionName = (funcao.nome + funcao.tipo).toUpperCase();
                            //monta lista de funções duplicadas
                            if (listaFuncoes.indexOf(functionName) === -1) {
                                listaFuncoes.push(functionName);
                            }
                            else if (funcoesDuplicadas.indexOf(functionName) === -1) {
                                funcoesDuplicadas.push(functionName);
                            }
                        }
                    });
                    let fileName = fonte.fonte
                        .replace(/\\/g, '/')
                        .substring(fonte.fonte.replace(/\\/g, '/').lastIndexOf('/') + 1)
                        .toUpperCase();
                    //monta lista de qrquivos duplicados
                    if (listaArquivos.indexOf(fileName) === -1) {
                        listaArquivos.push(fileName);
                    }
                    else if (arquivosDuplicados.indexOf(fileName) === -1) {
                        arquivosDuplicados.push(fileName);
                    }
                }
                catch (e) {
                    if (e.code === 'ENOENT') {
                        item.content = '';
                        item.errors = [];
                        item.fonte.funcoes = [];
                    }
                    else {
                        console.log(`Erro ao validar : ${fonte.fonte}`);
                        console.log(e);
                    }
                }
            });
            // guarda lista de duplicados
            let duplicadosOld = JSON.parse(JSON.stringify(this.listaDuplicados));
            this.listaDuplicados.files = JSON.parse(JSON.stringify(arquivosDuplicados));
            this.listaDuplicados.functions = JSON.parse(JSON.stringify(funcoesDuplicadas));
            //Procura o que mudou
            let filesIncluidos = this.listaDuplicados.files.filter(x => duplicadosOld.files.indexOf(x) === -1);
            let filesExcluidos = duplicadosOld.files.filter(x => this.listaDuplicados.files.indexOf(x) === -1);
            let functionsIncluidos = this.listaDuplicados.functions.filter(x => duplicadosOld.functions.indexOf(x) === -1);
            let functionsExcluidos = duplicadosOld.functions.filter(x => this.listaDuplicados.functions.indexOf(x) === -1);
            // marca duplicados
            this.projeto.forEach((item) => {
                let fonte = item.fonte;
                fonte.funcoes.forEach((funcao) => {
                    let functionName = (funcao.nome + funcao.tipo).toUpperCase();
                    //adiciona o erro
                    if (functionsIncluidos.indexOf(functionName) > -1) {
                        item.errors.push(new Erro_1.Erro(funcao.linha, funcao.linha, traduz('validaAdvpl.functionDuplicate', this.local), Erro_1.Severity.Error));
                    }
                    if (functionsExcluidos.indexOf(functionName) > -1) {
                        item.errors = item.errors.filter((erro) => {
                            return (erro.message !==
                                traduz('validaAdvpl.functionDuplicate', this.local) ||
                                funcao.linha !== erro.startLine);
                        });
                    }
                });
                let fileName = fonte.fonte
                    .replace(/\\/g, '/')
                    .substring(fonte.fonte.replace(/\\/g, '/').lastIndexOf('/') + 1)
                    .toUpperCase();
                //adiciona o erro
                if (filesIncluidos.indexOf(fileName) > -1) {
                    item.errors.push(new Erro_1.Erro(0, 0, traduz('validaAdvpl.fileDuplicate', this.local), Erro_1.Severity.Error));
                }
                else if (filesExcluidos.indexOf(fileName) > -1) {
                    item.errors = item.errors.filter((erro) => {
                        return (erro.message !== traduz('validaAdvpl.fileDuplicate', this.local));
                    });
                }
            });
            if (this.log) {
                let errosContagem = this.contaErros();
                console.log(`\t${errosContagem.errors} Errors`);
                console.log(`\t${errosContagem.warnings} Warnings`);
                console.log(`\t${errosContagem.information} Informations`);
                console.log(`\t${errosContagem.hint} Hints`);
            }
            resolve();
        });
    }
    contaErros() {
        let erros = { errors: 0, warnings: 0, information: 0, hint: 0 };
        this.projeto.forEach((item) => {
            item.errors.forEach((erro) => {
                if (erro.severity === Erro_1.Severity.Error) {
                    erros.errors++;
                }
                else if (erro.severity === Erro_1.Severity.Warning) {
                    erros.warnings++;
                }
                else if (erro.severity === Erro_1.Severity.Information) {
                    erros.information++;
                }
                else if (erro.severity === Erro_1.Severity.Hint) {
                    erros.hint++;
                }
            });
        });
        return erros;
    }
}
exports.ValidaProjeto = ValidaProjeto;
function traduz(key, local) {
    let locales = ['en', 'pt-br'];
    let i18n = __webpack_require__(3);
    i18n.configure({
        locales: locales,
        directory: __dirname + '/locales'
    });
    i18n.setLocale(locales.indexOf(local) + 1 ? local : 'en');
    return i18n.__(key);
}
//# sourceMappingURL=validaProjeto.js.map

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ItemModel {
}
exports.ItemModel = ItemModel;
//# sourceMappingURL=ItemProject.js.map

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const fs = __webpack_require__(6);
const arrayUnion = __webpack_require__(36);
const merge2 = __webpack_require__(37);
const glob = __webpack_require__(39);
const fastGlob = __webpack_require__(56);
const dirGlob = __webpack_require__(127);
const gitignore = __webpack_require__(129);
const {FilterStream, UniqueStream} = __webpack_require__(132);

const DEFAULT_FILTER = () => false;

const isNegative = pattern => pattern[0] === '!';

const assertPatternsInput = patterns => {
	if (!patterns.every(pattern => typeof pattern === 'string')) {
		throw new TypeError('Patterns must be a string or an array of strings');
	}
};

const checkCwdOption = options => {
	if (options && options.cwd && !fs.statSync(options.cwd).isDirectory()) {
		throw new Error('The `cwd` option must be a path to a directory');
	}
};

const getPathString = p => p.stats instanceof fs.Stats ? p.path : p;

const generateGlobTasks = (patterns, taskOptions) => {
	patterns = arrayUnion([].concat(patterns));
	assertPatternsInput(patterns);
	checkCwdOption(taskOptions);

	const globTasks = [];

	taskOptions = {
		ignore: [],
		expandDirectories: true,
		...taskOptions
	};

	for (const [index, pattern] of patterns.entries()) {
		if (isNegative(pattern)) {
			continue;
		}

		const ignore = patterns
			.slice(index)
			.filter(isNegative)
			.map(pattern => pattern.slice(1));

		const options = {
			...taskOptions,
			ignore: taskOptions.ignore.concat(ignore)
		};

		globTasks.push({pattern, options});
	}

	return globTasks;
};

const globDirs = (task, fn) => {
	let options = {};
	if (task.options.cwd) {
		options.cwd = task.options.cwd;
	}

	if (Array.isArray(task.options.expandDirectories)) {
		options = {
			...options,
			files: task.options.expandDirectories
		};
	} else if (typeof task.options.expandDirectories === 'object') {
		options = {
			...options,
			...task.options.expandDirectories
		};
	}

	return fn(task.pattern, options);
};

const getPattern = (task, fn) => task.options.expandDirectories ? globDirs(task, fn) : [task.pattern];

const getFilterSync = options => {
	return options && options.gitignore ?
		gitignore.sync({cwd: options.cwd, ignore: options.ignore}) :
		DEFAULT_FILTER;
};

const globToTask = task => glob => {
	const {options} = task;
	if (options.ignore && Array.isArray(options.ignore) && options.expandDirectories) {
		options.ignore = dirGlob.sync(options.ignore);
	}

	return {
		pattern: glob,
		options
	};
};

module.exports = async (patterns, options) => {
	const globTasks = generateGlobTasks(patterns, options);

	const getFilter = async () => {
		return options && options.gitignore ?
			gitignore({cwd: options.cwd, ignore: options.ignore}) :
			DEFAULT_FILTER;
	};

	const getTasks = async () => {
		const tasks = await Promise.all(globTasks.map(async task => {
			const globs = await getPattern(task, dirGlob);
			return Promise.all(globs.map(globToTask(task)));
		}));

		return arrayUnion(...tasks);
	};

	const [filter, tasks] = await Promise.all([getFilter(), getTasks()]);
	const paths = await Promise.all(tasks.map(task => fastGlob(task.pattern, task.options)));

	return arrayUnion(...paths).filter(path_ => !filter(getPathString(path_)));
};

module.exports.sync = (patterns, options) => {
	const globTasks = generateGlobTasks(patterns, options);

	const tasks = globTasks.reduce((tasks, task) => {
		const newTask = getPattern(task, dirGlob.sync).map(globToTask(task));
		return tasks.concat(newTask);
	}, []);

	const filter = getFilterSync(options);

	return tasks.reduce(
		(matches, task) => arrayUnion(matches, fastGlob.sync(task.pattern, task.options)),
		[]
	).filter(path_ => !filter(path_));
};

module.exports.stream = (patterns, options) => {
	const globTasks = generateGlobTasks(patterns, options);

	const tasks = globTasks.reduce((tasks, task) => {
		const newTask = getPattern(task, dirGlob.sync).map(globToTask(task));
		return tasks.concat(newTask);
	}, []);

	const filter = getFilterSync(options);
	const filterStream = new FilterStream(p => !filter(p));
	const uniqueStream = new UniqueStream();

	return merge2(tasks.map(task => fastGlob.stream(task.pattern, task.options)))
		.pipe(filterStream)
		.pipe(uniqueStream);
};

module.exports.generateGlobTasks = generateGlobTasks;

module.exports.hasMagic = (patterns, options) => []
	.concat(patterns)
	.some(pattern => glob.hasMagic(pattern, options));

module.exports.gitignore = gitignore;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (...arguments_) => {
	return [...new Set([].concat(...arguments_))];
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * merge2
 * https://github.com/teambition/merge2
 *
 * Copyright (c) 2014-2016 Teambition
 * Licensed under the MIT license.
 */
const Stream = __webpack_require__(38)
const PassThrough = Stream.PassThrough
const slice = Array.prototype.slice

module.exports = merge2

function merge2 () {
  const streamsQueue = []
  let merging = false
  const args = slice.call(arguments)
  let options = args[args.length - 1]

  if (options && !Array.isArray(options) && options.pipe == null) args.pop()
  else options = {}

  const doEnd = options.end !== false
  if (options.objectMode == null) options.objectMode = true
  if (options.highWaterMark == null) options.highWaterMark = 64 * 1024
  const mergedStream = PassThrough(options)

  function addStream () {
    for (let i = 0, len = arguments.length; i < len; i++) {
      streamsQueue.push(pauseStreams(arguments[i], options))
    }
    mergeStream()
    return this
  }

  function mergeStream () {
    if (merging) return
    merging = true

    let streams = streamsQueue.shift()
    if (!streams) {
      process.nextTick(endStream)
      return
    }
    if (!Array.isArray(streams)) streams = [streams]

    let pipesCount = streams.length + 1

    function next () {
      if (--pipesCount > 0) return
      merging = false
      mergeStream()
    }

    function pipe (stream) {
      function onend () {
        stream.removeListener('merge2UnpipeEnd', onend)
        stream.removeListener('end', onend)
        next()
      }
      // skip ended stream
      if (stream._readableState.endEmitted) return next()

      stream.on('merge2UnpipeEnd', onend)
      stream.on('end', onend)
      stream.pipe(mergedStream, { end: false })
      // compatible for old stream
      stream.resume()
    }

    for (let i = 0; i < streams.length; i++) pipe(streams[i])

    next()
  }

  function endStream () {
    merging = false
    // emit 'queueDrain' when all streams merged.
    mergedStream.emit('queueDrain')
    return doEnd && mergedStream.end()
  }

  mergedStream.setMaxListeners(0)
  mergedStream.add = addStream
  mergedStream.on('unpipe', function (stream) {
    stream.emit('merge2UnpipeEnd')
  })

  if (args.length) addStream.apply(null, args)
  return mergedStream
}

// check and pause streams for pipe.
function pauseStreams (streams, options) {
  if (!Array.isArray(streams)) {
    // Backwards-compat with old-style streams
    if (!streams._readableState && streams.pipe) streams = streams.pipe(PassThrough(options))
    if (!streams._readableState || !streams.pause || !streams.pipe) {
      throw new Error('Only readable stream can be merged.')
    }
    streams.pause()
  } else {
    for (let i = 0, len = streams.length; i < len; i++) streams[i] = pauseStreams(streams[i], options)
  }
  return streams
}


/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

module.exports = glob

var fs = __webpack_require__(6)
var rp = __webpack_require__(40)
var minimatch = __webpack_require__(42)
var Minimatch = minimatch.Minimatch
var inherits = __webpack_require__(46)
var EE = __webpack_require__(48).EventEmitter
var path = __webpack_require__(8)
var assert = __webpack_require__(49)
var isAbsolute = __webpack_require__(50)
var globSync = __webpack_require__(51)
var common = __webpack_require__(52)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __webpack_require__(53)
var util = __webpack_require__(15)
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __webpack_require__(55)

function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {}
  if (!options) options = {}

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync
var GlobSync = glob.GlobSync = globSync.GlobSync

// old api surface
glob.glob = glob

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_)
  options.noprocess = true

  var g = new Glob(pattern, options)
  var set = g.minimatch.set

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
}

glob.Glob = Glob
inherits(Glob, EE)
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = null
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options)
  this._didRealPath = false

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n)

  if (typeof cb === 'function') {
    cb = once(cb)
    this.on('error', cb)
    this.on('end', function (matches) {
      cb(null, matches)
    })
  }

  var self = this
  this._processing = 0

  this._emitQueue = []
  this._processQueue = []
  this.paused = false

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done)
  }
  sync = false

  function done () {
    --self._processing
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish()
        })
      } else {
        self._finish()
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this)
  this.emit('end', this.found)
}

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true

  var n = this.matches.length
  if (n === 0)
    return this._finish()

  var self = this
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next)

  function next () {
    if (--n === 0)
      self._finish()
  }
}

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index]
  if (!matchset)
    return cb()

  var found = Object.keys(matchset)
  var self = this
  var n = found.length

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null)
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p)
    rp.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true
      else if (er.syscall === 'stat')
        set[p] = true
      else
        self.emit('error', er) // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set
        cb()
      }
    })
  })
}

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
}

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit('abort')
}

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume')
    this.paused = false
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0)
      this._emitQueue.length = 0
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i]
        this._emitMatch(e[0], e[1])
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0)
      this._processQueue.length = 0
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i]
        this._processing--
        this._process(p[0], p[1], p[2], p[3])
      }
    }
  }
}

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob)
  assert(typeof cb === 'function')

  if (this.aborted)
    return

  this._processing++
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb])
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
}

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e
      else
        e = prefix + e
    }
    this._process([e].concat(remain), index, inGlobStar, cb)
  }
  cb()
}

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e])
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute)
    e = abs

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  var st = this.statCache[abs]
  if (st)
    this.emit('stat', e, st)

  this.emit('match', e)
}

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs
  var self = this
  var lstatcb = inflight(lstatkey, lstatcb_)

  if (lstatcb)
    fs.lstat(abs, lstatcb)

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink()
    self.symlinks[abs] = isSym

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE'
      cb()
    } else
      self._readdir(abs, false, cb)
  }
}

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb)
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }

  var self = this
  fs.readdir(abs, readdirCb(this, abs, cb))
}

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb)
    else
      self._readdirEntries(abs, entries, cb)
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries
  return cb(null, entries)
}

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        this.emit('error', error)
        this.abort()
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict) {
        this.emit('error', er)
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort()
      }
      if (!this.silent)
        console.error('glob error', er)
      break
  }

  return cb()
}

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb)

  var isSym = this.symlinks[abs]
  var len = entries.length

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true, cb)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true, cb)
  }

  cb()
}

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb)
  })
}
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
  cb()
}

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE'
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this
  var statcb = inflight('stat\0' + abs, lstatcb_)
  if (statcb)
    fs.lstat(abs, statcb)

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb)
        else
          self._stat2(f, abs, er, stat, cb)
      })
    } else {
      self._stat2(f, abs, er, lstat, cb)
    }
  }
}

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false
    return cb()
  }

  var needDir = f.slice(-1) === '/'
  this.statCache[abs] = stat

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'
  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
}


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __webpack_require__(6)
var origRealpath = fs.realpath
var origRealpathSync = fs.realpathSync

var version = process.version
var ok = /^v[0-5]\./.test(version)
var old = __webpack_require__(41)

function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache
    cache = null
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb)
    } else {
      cb(er, result)
    }
  })
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs.realpath = realpath
  fs.realpathSync = realpathSync
}

function unmonkeypatch () {
  fs.realpath = origRealpath
  fs.realpathSync = origRealpathSync
}


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var pathModule = __webpack_require__(8);
var isWindows = process.platform === 'win32';
var fs = __webpack_require__(6);

// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
    callback = debugCallback;
  } else
    callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

var normalize = pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

exports.realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


exports.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs.stat(base, function(err) {
      if (err) return cb(err);

      fs.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __webpack_require__(8)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __webpack_require__(43)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var concatMap = __webpack_require__(44);
var balanced = __webpack_require__(45);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

try {
  var util = __webpack_require__(15);
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  module.exports = __webpack_require__(47);
}


/***/ }),
/* 47 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function posix(path) {
	return path.charAt(0) === '/';
}

function win32(path) {
	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path);
	var device = result[1] || '';
	var isUnc = Boolean(device && device.charAt(1) !== ':');

	// UNC paths are always absolute
	return Boolean(result[2] || isUnc);
}

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = globSync
globSync.GlobSync = GlobSync

var fs = __webpack_require__(6)
var rp = __webpack_require__(40)
var minimatch = __webpack_require__(42)
var Minimatch = minimatch.Minimatch
var Glob = __webpack_require__(39).Glob
var util = __webpack_require__(15)
var path = __webpack_require__(8)
var assert = __webpack_require__(49)
var isAbsolute = __webpack_require__(50)
var common = __webpack_require__(52)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

function globSync (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync(pattern, options).found
}

function GlobSync (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync))
    return new GlobSync(pattern, options)

  setopts(this, pattern, options)

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length
  this.matches = new Array(n)
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false)
  }
  this._finish()
}

GlobSync.prototype._finish = function () {
  assert(this instanceof GlobSync)
  if (this.realpath) {
    var self = this
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null)
      for (var p in matchset) {
        try {
          p = self._makeAbs(p)
          var real = rp.realpathSync(p, self.realpathCache)
          set[real] = true
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true
          else
            throw er
        }
      }
    })
  }
  common.finish(this)
}


GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert(this instanceof GlobSync)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip processing
  if (childrenIgnored(this, read))
    return

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
}


GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix)
      newPattern = [prefix, e]
    else
      newPattern = [e]
    this._process(newPattern.concat(remain), index, inGlobStar)
  }
}


GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored(this, e))
    return

  var abs = this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute) {
    e = abs
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  if (this.stat)
    this._stat(e)
}


GlobSync.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries
  var lstat
  var stat
  try {
    lstat = fs.lstatSync(abs)
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink()
  this.symlinks[abs] = isSym

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE'
  else
    entries = this._readdir(abs, false)

  return entries
}

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  var entries

  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er)
    return null
  }
}

GlobSync.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries

  // mark and cache dir-ness
  return entries
}

GlobSync.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er)
      break
  }
}

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false)

  var len = entries.length
  var isSym = this.symlinks[abs]

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true)
  }
}

GlobSync.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
}

// Returns either 'DIR', 'FILE', or false
GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (!stat) {
    var lstat
    try {
      lstat = fs.lstatSync(abs)
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = fs.statSync(abs)
      } catch (er) {
        stat = lstat
      }
    } else {
      stat = lstat
    }
  }

  this.statCache[abs] = stat

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'

  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return false

  return c
}

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p)
}

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

exports.alphasort = alphasort
exports.alphasorti = alphasorti
exports.setopts = setopts
exports.ownProp = ownProp
exports.makeAbs = makeAbs
exports.finish = finish
exports.mark = mark
exports.isIgnored = isIgnored
exports.childrenIgnored = childrenIgnored

function ownProp (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var path = __webpack_require__(8)
var minimatch = __webpack_require__(42)
var isAbsolute = __webpack_require__(50)
var Minimatch = minimatch.Minimatch

function alphasorti (a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase())
}

function alphasort (a, b) {
  return a.localeCompare(b)
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || []

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore]

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap)
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
    gmatcher = new Minimatch(gpattern, { dot: true })
  }

  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts (self, pattern, options) {
  if (!options)
    options = {}

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern
  }

  self.silent = !!options.silent
  self.pattern = pattern
  self.strict = options.strict !== false
  self.realpath = !!options.realpath
  self.realpathCache = options.realpathCache || Object.create(null)
  self.follow = !!options.follow
  self.dot = !!options.dot
  self.mark = !!options.mark
  self.nodir = !!options.nodir
  if (self.nodir)
    self.mark = true
  self.sync = !!options.sync
  self.nounique = !!options.nounique
  self.nonull = !!options.nonull
  self.nosort = !!options.nosort
  self.nocase = !!options.nocase
  self.stat = !!options.stat
  self.noprocess = !!options.noprocess
  self.absolute = !!options.absolute

  self.maxLength = options.maxLength || Infinity
  self.cache = options.cache || Object.create(null)
  self.statCache = options.statCache || Object.create(null)
  self.symlinks = options.symlinks || Object.create(null)

  setupIgnores(self, options)

  self.changedCwd = false
  var cwd = process.cwd()
  if (!ownProp(options, "cwd"))
    self.cwd = cwd
  else {
    self.cwd = path.resolve(options.cwd)
    self.changedCwd = self.cwd !== cwd
  }

  self.root = options.root || path.resolve(self.cwd, "/")
  self.root = path.resolve(self.root)
  if (process.platform === "win32")
    self.root = self.root.replace(/\\/g, "/")

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
  if (process.platform === "win32")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
  self.nomount = !!options.nomount

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true
  options.nocomment = true

  self.minimatch = new Minimatch(pattern, options)
  self.options = self.minimatch.options
}

function finish (self) {
  var nou = self.nounique
  var all = nou ? [] : Object.create(null)

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i]
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i]
        if (nou)
          all.push(literal)
        else
          all[literal] = true
      }
    } else {
      // had matches
      var m = Object.keys(matches)
      if (nou)
        all.push.apply(all, m)
      else
        m.forEach(function (m) {
          all[m] = true
        })
    }
  }

  if (!nou)
    all = Object.keys(all)

  if (!self.nosort)
    all = all.sort(self.nocase ? alphasorti : alphasort)

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i])
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e))
        var c = self.cache[e] || self.cache[makeAbs(self, e)]
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c)
        return notDir
      })
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored(self, m)
    })

  self.found = all
}

function mark (self, p) {
  var abs = makeAbs(self, p)
  var c = self.cache[abs]
  var m = p
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c)
    var slash = p.slice(-1) === '/'

    if (isDir && !slash)
      m += '/'
    else if (!isDir && slash)
      m = m.slice(0, -1)

    if (m !== p) {
      var mabs = makeAbs(self, m)
      self.statCache[mabs] = self.statCache[abs]
      self.cache[mabs] = self.cache[abs]
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f
  if (f.charAt(0) === '/') {
    abs = path.join(self.root, f)
  } else if (isAbsolute(f) || f === '') {
    abs = f
  } else if (self.changedCwd) {
    abs = path.resolve(self.cwd, f)
  } else {
    abs = path.resolve(f)
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/')

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
  })
}

function childrenIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path))
  })
}


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var wrappy = __webpack_require__(54)
var reqs = Object.create(null)
var once = __webpack_require__(55)

module.exports = wrappy(inflight)

function inflight (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb)
    return null
  } else {
    reqs[key] = [cb]
    return makeres(key)
  }
}

function makeres (key) {
  return once(function RES () {
    var cbs = reqs[key]
    var len = cbs.length
    var args = slice(arguments)

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args)
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len)
        process.nextTick(function () {
          RES.apply(null, args)
        })
      } else {
        delete reqs[key]
      }
    }
  })
}

function slice (args) {
  var length = args.length
  var array = []

  for (var i = 0; i < length; i++) array[i] = args[i]
  return array
}


/***/ }),
/* 54 */
/***/ (function(module, exports) {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var wrappy = __webpack_require__(54)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const taskManager = __webpack_require__(57);
const async_1 = __webpack_require__(85);
const stream_1 = __webpack_require__(123);
const sync_1 = __webpack_require__(124);
const settings_1 = __webpack_require__(126);
const utils = __webpack_require__(58);
function FastGlob(source, options) {
    try {
        assertPatternsInput(source);
    }
    catch (error) {
        return Promise.reject(error);
    }
    const works = getWorks(source, async_1.default, options);
    return Promise.all(works).then(utils.array.flatten);
}
(function (FastGlob) {
    function sync(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, sync_1.default, options);
        return utils.array.flatten(works);
    }
    FastGlob.sync = sync;
    function stream(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, stream_1.default, options);
        /**
         * The stream returned by the provider cannot work with an asynchronous iterator.
         * To support asynchronous iterators, regardless of the number of tasks, we always multiplex streams.
         * This affects performance (+25%). I don't see best solution right now.
         */
        return utils.stream.merge(works);
    }
    FastGlob.stream = stream;
    function generateTasks(source, options) {
        assertPatternsInput(source);
        const patterns = [].concat(source);
        const settings = new settings_1.default(options);
        return taskManager.generate(patterns, settings);
    }
    FastGlob.generateTasks = generateTasks;
})(FastGlob || (FastGlob = {}));
function getWorks(source, _Provider, options) {
    const patterns = [].concat(source);
    const settings = new settings_1.default(options);
    const tasks = taskManager.generate(patterns, settings);
    const provider = new _Provider(settings);
    return tasks.map(provider.read, provider);
}
function assertPatternsInput(source) {
    if ([].concat(source).every(isString)) {
        return;
    }
    throw new TypeError('Patterns must be a string or an array of strings');
}
function isString(source) {
    /* tslint:disable-next-line strict-type-predicates */
    return typeof source === 'string';
}
module.exports = FastGlob;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(58);
function generate(patterns, settings) {
    const positivePatterns = getPositivePatterns(patterns);
    const negativePatterns = getNegativePatternsAsPositive(patterns, settings.ignore);
    /**
     * When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
     * filepath directly (without read directory).
     */
    const staticPatterns = !settings.caseSensitiveMatch ? [] : positivePatterns.filter(utils.pattern.isStaticPattern);
    const dynamicPatterns = !settings.caseSensitiveMatch ? positivePatterns : positivePatterns.filter(utils.pattern.isDynamicPattern);
    const staticTasks = convertPatternsToTasks(staticPatterns, negativePatterns, /* dynamic */ false);
    const dynamicTasks = convertPatternsToTasks(dynamicPatterns, negativePatterns, /* dynamic */ true);
    return staticTasks.concat(dynamicTasks);
}
exports.generate = generate;
function convertPatternsToTasks(positive, negative, dynamic) {
    const positivePatternsGroup = groupPatternsByBaseDirectory(positive);
    // When we have a global group – there is no reason to divide the patterns into independent tasks.
    // In this case, the global task covers the rest.
    if ('.' in positivePatternsGroup) {
        const task = convertPatternGroupToTask('.', positive, negative, dynamic);
        return [task];
    }
    return convertPatternGroupsToTasks(positivePatternsGroup, negative, dynamic);
}
exports.convertPatternsToTasks = convertPatternsToTasks;
function getPositivePatterns(patterns) {
    return utils.pattern.getPositivePatterns(patterns);
}
exports.getPositivePatterns = getPositivePatterns;
function getNegativePatternsAsPositive(patterns, ignore) {
    const negative = utils.pattern.getNegativePatterns(patterns).concat(ignore);
    const positive = negative.map(utils.pattern.convertToPositivePattern);
    return positive;
}
exports.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
function groupPatternsByBaseDirectory(patterns) {
    return patterns.reduce((collection, pattern) => {
        const base = utils.pattern.getBaseDirectory(pattern);
        if (base in collection) {
            collection[base].push(pattern);
        }
        else {
            collection[base] = [pattern];
        }
        return collection;
    }, {});
}
exports.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
function convertPatternGroupsToTasks(positive, negative, dynamic) {
    return Object.keys(positive).map((base) => {
        return convertPatternGroupToTask(base, positive[base], negative, dynamic);
    });
}
exports.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
function convertPatternGroupToTask(base, positive, negative, dynamic) {
    return {
        dynamic,
        positive,
        negative,
        base,
        patterns: [].concat(positive, negative.map(utils.pattern.convertToNegativePattern))
    };
}
exports.convertPatternGroupToTask = convertPatternGroupToTask;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const array = __webpack_require__(59);
exports.array = array;
const errno = __webpack_require__(60);
exports.errno = errno;
const fs = __webpack_require__(61);
exports.fs = fs;
const path = __webpack_require__(62);
exports.path = path;
const pattern = __webpack_require__(63);
exports.pattern = pattern;
const stream = __webpack_require__(84);
exports.stream = stream;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function flatten(items) {
    return items.reduce((collection, item) => [].concat(collection, item), []);
}
exports.flatten = flatten;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isEnoentCodeError(error) {
    return error.code === 'ENOENT';
}
exports.isEnoentCodeError = isEnoentCodeError;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class DirentFromStats {
    constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
    }
}
function createDirentFromStats(name, stats) {
    return new DirentFromStats(name, stats);
}
exports.createDirentFromStats = createDirentFromStats;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(8);
/**
 * Designed to work only with simple paths: `dir\\file`.
 */
function unixify(filepath) {
    return filepath.replace(/\\/g, '/');
}
exports.unixify = unixify;
function makeAbsolute(cwd, filepath) {
    return path.resolve(cwd, filepath);
}
exports.makeAbsolute = makeAbsolute;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(8);
const globParent = __webpack_require__(64);
const isGlob = __webpack_require__(65);
const micromatch = __webpack_require__(67);
const GLOBSTAR = '**';
function isStaticPattern(pattern) {
    return !isDynamicPattern(pattern);
}
exports.isStaticPattern = isStaticPattern;
function isDynamicPattern(pattern) {
    return isGlob(pattern, { strict: false });
}
exports.isDynamicPattern = isDynamicPattern;
function convertToPositivePattern(pattern) {
    return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
}
exports.convertToPositivePattern = convertToPositivePattern;
function convertToNegativePattern(pattern) {
    return '!' + pattern;
}
exports.convertToNegativePattern = convertToNegativePattern;
function isNegativePattern(pattern) {
    return pattern.startsWith('!') && pattern[1] !== '(';
}
exports.isNegativePattern = isNegativePattern;
function isPositivePattern(pattern) {
    return !isNegativePattern(pattern);
}
exports.isPositivePattern = isPositivePattern;
function getNegativePatterns(patterns) {
    return patterns.filter(isNegativePattern);
}
exports.getNegativePatterns = getNegativePatterns;
function getPositivePatterns(patterns) {
    return patterns.filter(isPositivePattern);
}
exports.getPositivePatterns = getPositivePatterns;
function getBaseDirectory(pattern) {
    return globParent(pattern);
}
exports.getBaseDirectory = getBaseDirectory;
function hasGlobStar(pattern) {
    return pattern.indexOf(GLOBSTAR) !== -1;
}
exports.hasGlobStar = hasGlobStar;
function endsWithSlashGlobStar(pattern) {
    return pattern.endsWith('/' + GLOBSTAR);
}
exports.endsWithSlashGlobStar = endsWithSlashGlobStar;
function isAffectDepthOfReadingPattern(pattern) {
    const basename = path.basename(pattern);
    return endsWithSlashGlobStar(pattern) || isStaticPattern(basename);
}
exports.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
function getNaiveDepth(pattern) {
    const base = getBaseDirectory(pattern);
    const patternDepth = pattern.split('/').length;
    const patternBaseDepth = base.split('/').length;
    /**
     * This is a hack for pattern that has no base directory.
     *
     * This is related to the `*\something\*` pattern.
     */
    if (base === '.') {
        return patternDepth - patternBaseDepth;
    }
    return patternDepth - patternBaseDepth - 1;
}
exports.getNaiveDepth = getNaiveDepth;
function getMaxNaivePatternsDepth(patterns) {
    return patterns.reduce((max, pattern) => {
        const depth = getNaiveDepth(pattern);
        return depth > max ? depth : max;
    }, 0);
}
exports.getMaxNaivePatternsDepth = getMaxNaivePatternsDepth;
function makeRe(pattern, options) {
    return micromatch.makeRe(pattern, options);
}
exports.makeRe = makeRe;
function convertPatternsToRe(patterns, options) {
    return patterns.map((pattern) => makeRe(pattern, options));
}
exports.convertPatternsToRe = convertPatternsToRe;
function matchAny(entry, patternsRe) {
    const filepath = entry.replace(/^\.[\\\/]/, '');
    return patternsRe.some((patternRe) => patternRe.test(filepath));
}
exports.matchAny = matchAny;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isGlob = __webpack_require__(65);
var pathPosixDirname = __webpack_require__(8).posix.dirname;
var isWin32 = __webpack_require__(17).platform() === 'win32';

var slash = '/';
var backslash = /\\/g;
var enclosure = /[\{\[].*[\/]*.*[\}\]]$/;
var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
var escaped = /\\([\*\?\|\[\]\(\)\{\}])/g;

module.exports = function globParent(str) {
  // flip windows path separators
  if (isWin32 && str.indexOf(slash) < 0) {
    str = str.replace(backslash, slash);
  }

  // special case for strings ending in enclosure containing path separator
  if (enclosure.test(str)) {
    str += slash;
  }

  // preserves full path in case of trailing path separator
  str += 'a';

  // remove path parts that are globby
  do {
    str = pathPosixDirname(str);
  } while (isGlob(str) || globby.test(str));

  // remove escape chars and return result
  return str.replace(escaped, '$1');
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isExtglob = __webpack_require__(66);
var chars = { '{': '}', '(': ')', '[': ']'};
var strictRegex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
var relaxedRegex = /\\(.)|(^!|[*?{}()[\]]|\(\?)/;

module.exports = function isGlob(str, options) {
  if (typeof str !== 'string' || str === '') {
    return false;
  }

  if (isExtglob(str)) {
    return true;
  }

  var regex = strictRegex;
  var match;

  // optionally relax regex
  if (options && options.strict === false) {
    regex = relaxedRegex;
  }

  while ((match = regex.exec(str))) {
    if (match[2]) return true;
    var idx = match.index + match[0].length;

    // if an open bracket/brace/paren is escaped,
    // set the index to the next closing character
    var open = match[1];
    var close = open ? chars[open] : null;
    if (open && close) {
      var n = str.indexOf(close, idx);
      if (n !== -1) {
        idx = n + 1;
      }
    }

    str = str.slice(idx);
  }
  return false;
};


/***/ }),
/* 66 */
/***/ (function(module, exports) {

/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

module.exports = function isExtglob(str) {
  if (typeof str !== 'string' || str === '') {
    return false;
  }

  var match;
  while ((match = /(\\).|([@?!+*]\(.*\))/g.exec(str))) {
    if (match[2]) return true;
    str = str.slice(match.index + match[0].length);
  }

  return false;
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const util = __webpack_require__(15);
const braces = __webpack_require__(68);
const picomatch = __webpack_require__(78);
const utils = __webpack_require__(81);
const isEmptyString = val => typeof val === 'string' && (val === '' || val === './');

/**
 * Returns an array of strings that match one or more glob patterns.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm(list, patterns[, options]);
 *
 * console.log(mm(['a.js', 'a.txt'], ['*.js']));
 * //=> [ 'a.js' ]
 * ```
 * @param {String|Array<string>} list List of strings to match.
 * @param {String|Array<string>} patterns One or more glob patterns to use for matching.
 * @param {Object} options See available [options](#options)
 * @return {Array} Returns an array of matches
 * @summary false
 * @api public
 */

const micromatch = (list, patterns, options) => {
  patterns = [].concat(patterns);
  list = [].concat(list);

  let omit = new Set();
  let keep = new Set();
  let items = new Set();
  let negatives = 0;

  let onResult = state => {
    items.add(state.output);
    if (options && options.onResult) {
      options.onResult(state);
    }
  };

  for (let i = 0; i < patterns.length; i++) {
    let isMatch = picomatch(String(patterns[i]), { ...options, onResult }, true);
    let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
    if (negated) negatives++;

    for (let item of list) {
      let matched = isMatch(item, true);

      let match = negated ? !matched.isMatch : matched.isMatch;
      if (!match) continue;

      if (negated) {
        omit.add(matched.output);
      } else {
        omit.delete(matched.output);
        keep.add(matched.output);
      }
    }
  }

  let result = negatives === patterns.length ? [...items] : [...keep];
  let matches = result.filter(item => !omit.has(item));

  if (options && matches.length === 0) {
    if (options.failglob === true) {
      throw new Error(`No matches found for "${patterns.join(', ')}"`);
    }

    if (options.nonull === true || options.nullglob === true) {
      return options.unescape ? patterns.map(p => p.replace(/\\/g, '')) : patterns;
    }
  }

  return matches;
};

/**
 * Backwards compatibility
 */

micromatch.match = micromatch;

/**
 * Returns a matcher function from the given glob `pattern` and `options`.
 * The returned function takes a string to match as its only argument and returns
 * true if the string is a match.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.matcher(pattern[, options]);
 *
 * const isMatch = mm.matcher('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @param {String} `pattern` Glob pattern
 * @param {Object} `options`
 * @return {Function} Returns a matcher function.
 * @api public
 */

micromatch.matcher = (pattern, options) => picomatch(pattern, options);

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.isMatch(string, patterns[, options]);
 *
 * console.log(mm.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(mm.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Backwards compatibility
 */

micromatch.any = micromatch.isMatch;

/**
 * Returns a list of strings that _**do not match any**_ of the given `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.not(list, patterns[, options]);
 *
 * console.log(mm.not(['a.a', 'b.b', 'c.c'], '*.a'));
 * //=> ['b.b', 'c.c']
 * ```
 * @param {Array} `list` Array of strings to match.
 * @param {String|Array} `patterns` One or more glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Array} Returns an array of strings that **do not match** the given patterns.
 * @api public
 */

micromatch.not = (list, patterns, options = {}) => {
  patterns = [].concat(patterns).map(String);
  let result = new Set();
  let items = [];

  let onResult = state => {
    if (options.onResult) options.onResult(state);
    items.push(state.output);
  };

  let matches = micromatch(list, patterns, { ...options, onResult });

  for (let item of items) {
    if (!matches.includes(item)) {
      result.add(item);
    }
  }
  return [...result];
};

/**
 * Returns true if the given `string` contains the given pattern. Similar
 * to [.isMatch](#isMatch) but the pattern can match any part of the string.
 *
 * ```js
 * var mm = require('micromatch');
 * // mm.contains(string, pattern[, options]);
 *
 * console.log(mm.contains('aa/bb/cc', '*b'));
 * //=> true
 * console.log(mm.contains('aa/bb/cc', '*d'));
 * //=> false
 * ```
 * @param {String} `str` The string to match.
 * @param {String|Array} `patterns` Glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if the patter matches any part of `str`.
 * @api public
 */

micromatch.contains = (str, pattern, options) => {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
  }

  if (Array.isArray(pattern)) {
    return pattern.some(p => micromatch.contains(str, p, options));
  }

  if (typeof pattern === 'string') {
    if (isEmptyString(str) || isEmptyString(pattern)) {
      return false;
    }

    if (str.includes(pattern) || (str.startsWith('./') && str.slice(2).includes(pattern))) {
      return true;
    }
  }

  return micromatch.isMatch(str, pattern, { ...options, contains: true });
};

/**
 * Filter the keys of the given object with the given `glob` pattern
 * and `options`. Does not attempt to match nested keys. If you need this feature,
 * use [glob-object][] instead.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.matchKeys(object, patterns[, options]);
 *
 * const obj = { aa: 'a', ab: 'b', ac: 'c' };
 * console.log(mm.matchKeys(obj, '*b'));
 * //=> { ab: 'b' }
 * ```
 * @param {Object} `object` The object with keys to filter.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Object} Returns an object with only keys that match the given patterns.
 * @api public
 */

micromatch.matchKeys = (obj, patterns, options) => {
  if (!utils.isObject(obj)) {
    throw new TypeError('Expected the first argument to be an object');
  }
  let keys = micromatch(Object.keys(obj), patterns, options);
  let res = {};
  for (let key of keys) res[key] = obj[key];
  return res;
};

/**
 * Returns true if some of the strings in the given `list` match any of the given glob `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.some(list, patterns[, options]);
 *
 * console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // true
 * console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.some = (list, patterns, options) => {
  let items = [].concat(list);

  for (let pattern of [].concat(patterns)) {
    let isMatch = picomatch(String(pattern), options);
    if (items.some(item => isMatch(item))) {
      return true;
    }
  }
  return false;
};

/**
 * Returns true if every string in the given `list` matches
 * any of the given glob `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.every(list, patterns[, options]);
 *
 * console.log(mm.every('foo.js', ['foo.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // false
 * console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param {String|Array} `list` The string or array of strings to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.every = (list, patterns, options) => {
  let items = [].concat(list);

  for (let pattern of [].concat(patterns)) {
    let isMatch = picomatch(String(pattern), options);
    if (!items.every(item => isMatch(item))) {
      return false;
    }
  }
  return true;
};

/**
 * Returns true if **all** of the given `patterns` match
 * the specified string.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.all(string, patterns[, options]);
 *
 * console.log(mm.all('foo.js', ['foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', '!foo.js']));
 * // false
 *
 * console.log(mm.all('foo.js', ['*.js', 'foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
 * // true
 * ```
 * @param {String|Array} `str` The string to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.all = (str, patterns, options) => {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
  }

  return [].concat(patterns).every(p => picomatch(p, options)(str));
};

/**
 * Returns an array of matches captured by `pattern` in `string, or `null` if the pattern did not match.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.capture(pattern, string[, options]);
 *
 * console.log(mm.capture('test/*.js', 'test/foo.js'));
 * //=> ['foo']
 * console.log(mm.capture('test/*.js', 'foo/bar.css'));
 * //=> null
 * ```
 * @param {String} `glob` Glob pattern to use for matching.
 * @param {String} `input` String to match
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns an array of captures if the input matches the glob pattern, otherwise `null`.
 * @api public
 */

micromatch.capture = (glob, input, options) => {
  let posix = utils.isWindows(options);
  let regex = picomatch.makeRe(String(glob), { ...options, capture: true });
  let match = regex.exec(posix ? utils.toPosixSlashes(input) : input);

  if (match) {
    return match.slice(1).map(v => v === void 0 ? '' : v);
  }
};

/**
 * Create a regular expression from the given glob `pattern`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.makeRe(pattern[, options]);
 *
 * console.log(mm.makeRe('*.js'));
 * //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
 * ```
 * @param {String} `pattern` A glob pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

micromatch.makeRe = (...args) => picomatch.makeRe(...args);

/**
 * Scan a glob pattern to separate the pattern into segments. Used
 * by the [split](#split) method.
 *
 * ```js
 * const mm = require('micromatch');
 * const state = mm.scan(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

micromatch.scan = (...args) => picomatch.scan(...args);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const mm = require('micromatch');
 * const state = mm(pattern[, options]);
 * ```
 * @param {String} `glob`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as regex source string.
 * @api public
 */

micromatch.parse = (patterns, options) => {
  let res = [];
  for (let pattern of [].concat(patterns || [])) {
    for (let str of braces(String(pattern), options)) {
      res.push(picomatch.parse(str, options));
    }
  }
  return res;
};

/**
 * Process the given brace `pattern`.
 *
 * ```js
 * const { braces } = require('micromatch');
 * console.log(braces('foo/{a,b,c}/bar'));
 * //=> [ 'foo/(a|b|c)/bar' ]
 *
 * console.log(braces('foo/{a,b,c}/bar', { expand: true }));
 * //=> [ 'foo/a/bar', 'foo/b/bar', 'foo/c/bar' ]
 * ```
 * @param {String} `pattern` String with brace pattern to process.
 * @param {Object} `options` Any [options](#options) to change how expansion is performed. See the [braces][] library for all available options.
 * @return {Array}
 * @api public
 */

micromatch.braces = (pattern, options) => {
  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
  if ((options && options.nobrace === true) || !/\{.*\}/.test(pattern)) {
    return [pattern];
  }
  return braces(pattern, options);
};

/**
 * Expand braces
 */

micromatch.braceExpand = (pattern, options) => {
  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
  return micromatch.braces(pattern, { ...options, expand: true });
};

/**
 * Expose micromatch
 */

module.exports = micromatch;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const stringify = __webpack_require__(69);
const compile = __webpack_require__(71);
const expand = __webpack_require__(75);
const parse = __webpack_require__(76);

/**
 * Expand the given pattern or create a regex-compatible string.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
 * console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

const braces = (input, options = {}) => {
  let output = [];

  if (Array.isArray(input)) {
    for (let pattern of input) {
      let result = braces.create(pattern, options);
      if (Array.isArray(result)) {
        output.push(...result);
      } else {
        output.push(result);
      }
    }
  } else {
    output = [].concat(braces.create(input, options));
  }

  if (options && options.expand === true && options.nodupes === true) {
    output = [...new Set(output)];
  }
  return output;
};

/**
 * Parse the given `str` with the given `options`.
 *
 * ```js
 * // braces.parse(pattern, [, options]);
 * const ast = braces.parse('a/{b,c}/d');
 * console.log(ast);
 * ```
 * @param {String} pattern Brace pattern to parse
 * @param {Object} options
 * @return {Object} Returns an AST
 * @api public
 */

braces.parse = (input, options = {}) => parse(input, options);

/**
 * Creates a braces string from an AST, or an AST node.
 *
 * ```js
 * const braces = require('braces');
 * let ast = braces.parse('foo/{a,b}/bar');
 * console.log(stringify(ast.nodes[2])); //=> '{a,b}'
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.stringify = (input, options = {}) => {
  if (typeof input === 'string') {
    return stringify(braces.parse(input, options), options);
  }
  return stringify(input, options);
};

/**
 * Compiles a brace pattern into a regex-compatible, optimized string.
 * This method is called by the main [braces](#braces) function by default.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.compile('a/{b,c}/d'));
 * //=> ['a/(b|c)/d']
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.compile = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options);
  }
  return compile(input, options);
};

/**
 * Expands a brace pattern into an array. This method is called by the
 * main [braces](#braces) function when `options.expand` is true. Before
 * using this method it's recommended that you read the [performance notes](#performance))
 * and advantages of using [.compile](#compile) instead.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.expand('a/{b,c}/d'));
 * //=> ['a/b/d', 'a/c/d'];
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.expand = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options);
  }

  let result = expand(input, options);

  // filter out empty strings if specified
  if (options.noempty === true) {
    result = result.filter(Boolean);
  }

  // filter out duplicates if specified
  if (options.nodupes === true) {
    result = [...new Set(result)];
  }

  return result;
};

/**
 * Processes a brace pattern and returns either an expanded array
 * (if `options.expand` is true), a highly optimized regex-compatible string.
 * This method is called by the main [braces](#braces) function.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
 * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.create = (input, options = {}) => {
  if (input === '' || input.length < 3) {
    return [input];
  }

 return options.expand !== true
    ? braces.compile(input, options)
    : braces.expand(input, options);
};

/**
 * Expose "braces"
 */

module.exports = braces;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const utils = __webpack_require__(70);

module.exports = (ast, options = {}) => {
  let stringify = (node, parent = {}) => {
    let invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let output = '';

    if (node.value) {
      if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
        return '\\' + node.value;
      }
      return node.value;
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += stringify(child);
      }
    }
    return output;
  };

  return stringify(ast);
};



/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.isInteger = num => {
  if (typeof num === 'number') {
    return Number.isInteger(num);
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isInteger(Number(num));
  }
  return false;
};

/**
 * Find a node of the given type
 */

exports.find = (node, type) => node.nodes.find(node => node.type === type);

/**
 * Find a node of the given type
 */

exports.exceedsLimit = (min, max, step = 1, limit) => {
  if (limit === false) return false;
  if (!exports.isInteger(min) || !exports.isInteger(max)) return false;
  return ((Number(max) - Number(min)) / Number(step)) >= limit;
};

/**
 * Escape the given node with '\\' before node.value
 */

exports.escapeNode = (block, n = 0, type) => {
  let node = block.nodes[n];
  if (!node) return;

  if ((type && node.type === type) || node.type === 'open' || node.type === 'close') {
    if (node.escaped !== true) {
      node.value = '\\' + node.value;
      node.escaped = true;
    }
  }
};

/**
 * Returns true if the given brace node should be enclosed in literal braces
 */

exports.encloseBrace = node => {
  if (node.type !== 'brace') return false;
  if ((node.commas >> 0 + node.ranges >> 0) === 0) {
    node.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a brace node is invalid.
 */

exports.isInvalidBrace = block => {
  if (block.type !== 'brace') return false;
  if (block.invalid === true || block.dollar) return true;
  if ((block.commas >> 0 + block.ranges >> 0) === 0) {
    block.invalid = true;
    return true;
  }
  if (block.open !== true || block.close !== true) {
    block.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a node is an open or close node
 */

exports.isOpenOrClose = node => {
  if (node.type === 'open' || node.type === 'close') {
    return true;
  }
  return node.open === true || node.close === true;
};

/**
 * Reduce an array of text nodes.
 */

exports.reduce = nodes => nodes.reduce((acc, node) => {
  if (node.type === 'text') acc.push(node.value);
  if (node.type === 'range') node.type = 'text';
  return acc;
}, []);

/**
 * Flatten an array
 */

exports.flatten = (...args) => {
  const result = [];
  const flat = arr => {
    for (let i = 0; i < arr.length; i++) {
      let ele = arr[i];
      Array.isArray(ele) ? flat(ele, result) : ele !== void 0 && result.push(ele);
    }
    return result;
  };
  flat(args);
  return result;
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fill = __webpack_require__(72);
const utils = __webpack_require__(70);

const compile = (ast, options = {}) => {
  let walk = (node, parent = {}) => {
    let invalidBlock = utils.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let invalid = invalidBlock === true || invalidNode === true;
    let prefix = options.escapeInvalid === true ? '\\' : '';
    let output = '';

    if (node.isOpen === true) {
      return prefix + node.value;
    }
    if (node.isClose === true) {
      return prefix + node.value;
    }

    if (node.type === 'open') {
      return invalid ? (prefix + node.value) : '(';
    }

    if (node.type === 'close') {
      return invalid ? (prefix + node.value) : ')';
    }

    if (node.type === 'comma') {
      return node.prev.type === 'comma' ? '' : (invalid ? node.value : '|');
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes && node.ranges > 0) {
      let args = utils.reduce(node.nodes);
      let range = fill(...args, { ...options, wrap: false, toRegex: true });

      if (range.length !== 0) {
        return args.length > 1 && range.length > 1 ? `(${range})` : range;
      }
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += walk(child, node);
      }
    }
    return output;
  };

  return walk(ast);
};

module.exports = compile;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */



const util = __webpack_require__(15);
const toRegexRange = __webpack_require__(73);

const isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);

const transform = toNumber => {
  return value => toNumber === true ? Number(value) : String(value);
};

const isValidValue = value => {
  return typeof value === 'number' || (typeof value === 'string' && value !== '');
};

const isNumber = num => Number.isInteger(+num);

const zeros = input => {
  let value = `${input}`;
  let index = -1;
  if (value[0] === '-') value = value.slice(1);
  if (value === '0') return false;
  while (value[++index] === '0');
  return index > 0;
};

const stringify = (start, end, options) => {
  if (typeof start === 'string' || typeof end === 'string') {
    return true;
  }
  return options.stringify === true;
};

const pad = (input, maxLength, toNumber) => {
  if (maxLength > 0) {
    let dash = input[0] === '-' ? '-' : '';
    if (dash) input = input.slice(1);
    input = (dash + input.padStart(dash ? maxLength - 1 : maxLength, '0'));
  }
  if (toNumber === false) {
    return String(input);
  }
  return input;
};

const toMaxLen = (input, maxLength) => {
  let negative = input[0] === '-' ? '-' : '';
  if (negative) {
    input = input.slice(1);
    maxLength--;
  }
  while (input.length < maxLength) input = '0' + input;
  return negative ? ('-' + input) : input;
};

const toSequence = (parts, options) => {
  parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);

  let prefix = options.capture ? '' : '?:';
  let positives = '';
  let negatives = '';
  let result;

  if (parts.positives.length) {
    positives = parts.positives.join('|');
  }

  if (parts.negatives.length) {
    negatives = `-(${prefix}${parts.negatives.join('|')})`;
  }

  if (positives && negatives) {
    result = `${positives}|${negatives}`;
  } else {
    result = positives || negatives;
  }

  if (options.wrap) {
    return `(${prefix}${result})`;
  }

  return result;
};

const toRange = (a, b, isNumbers, options) => {
  if (isNumbers) {
    return toRegexRange(a, b, { wrap: false, ...options });
  }

  let start = String.fromCharCode(a);
  if (a === b) return start;

  let stop = String.fromCharCode(b);
  return `[${start}-${stop}]`;
};

const toRegex = (start, end, options) => {
  if (Array.isArray(start)) {
    let wrap = options.wrap === true;
    let prefix = options.capture ? '' : '?:';
    return wrap ? `(${prefix}${start.join('|')})` : start.join('|');
  }
  return toRegexRange(start, end, options);
};

const rangeError = (...args) => {
  return new RangeError('Invalid range arguments: ' + util.inspect(...args));
};

const invalidRange = (start, end, options) => {
  if (options.strictRanges === true) throw rangeError([start, end]);
  return [];
};

const invalidStep = (step, options) => {
  if (options.strictRanges === true) {
    throw new TypeError(`Expected step "${step}" to be a number`);
  }
  return [];
};

const fillNumbers = (start, end, step = 1, options = {}) => {
  let a = Number(start);
  let b = Number(end);

  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    if (options.strictRanges === true) throw rangeError([start, end]);
    return [];
  }

  // fix negative zero
  if (a === 0) a = 0;
  if (b === 0) b = 0;

  let descending = a > b;
  let startString = String(start);
  let endString = String(end);
  let stepString = String(step);
  step = Math.max(Math.abs(step), 1);

  let padded = zeros(startString) || zeros(endString) || zeros(stepString);
  let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
  let toNumber = padded === false && stringify(start, end, options) === false;
  let format = options.transform || transform(toNumber);

  if (options.toRegex && step === 1) {
    return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
  }

  let parts = { negatives: [], positives: [] };
  let push = num => parts[num < 0 ? 'negatives' : 'positives'].push(Math.abs(num));
  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    if (options.toRegex === true && step > 1) {
      push(a);
    } else {
      range.push(pad(format(a, index), maxLen, toNumber));
    }
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return step > 1
      ? toSequence(parts, options)
      : toRegex(range, null, { wrap: false, ...options });
  }

  return range;
};

const fillLetters = (start, end, step = 1, options = {}) => {
  if ((!isNumber(start) && start.length > 1) || (!isNumber(end) && end.length > 1)) {
    return invalidRange(start, end, options);
  }


  let format = options.transform || (val => String.fromCharCode(val));
  let a = `${start}`.charCodeAt(0);
  let b = `${end}`.charCodeAt(0);

  let descending = a > b;
  let min = Math.min(a, b);
  let max = Math.max(a, b);

  if (options.toRegex && step === 1) {
    return toRange(min, max, false, options);
  }

  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    range.push(format(a, index));
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return toRegex(range, null, { wrap: false, options });
  }

  return range;
};

const fill = (start, end, step, options = {}) => {
  if (end == null && isValidValue(start)) {
    return [start];
  }

  if (!isValidValue(start) || !isValidValue(end)) {
    return invalidRange(start, end, options);
  }

  if (typeof step === 'function') {
    return fill(start, end, 1, { transform: step });
  }

  if (isObject(step)) {
    return fill(start, end, 0, step);
  }

  let opts = { ...options };
  if (opts.capture === true) opts.wrap = true;
  step = step || opts.step || 1;

  if (!isNumber(step)) {
    if (step != null && !isObject(step)) return invalidStep(step, opts);
    return fill(start, end, 1, step);
  }

  if (isNumber(start) && isNumber(end)) {
    return fillNumbers(start, end, step, opts);
  }

  return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
};

module.exports = fill;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * to-regex-range <https://github.com/micromatch/to-regex-range>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */



const isNumber = __webpack_require__(74);

const toRegexRange = (min, max, options) => {
  if (isNumber(min) === false) {
    throw new TypeError('toRegexRange: expected the first argument to be a number');
  }

  if (max === void 0 || min === max) {
    return String(min);
  }

  if (isNumber(max) === false) {
    throw new TypeError('toRegexRange: expected the second argument to be a number.');
  }

  let opts = { relaxZeros: true, ...options };
  if (typeof opts.strictZeros === 'boolean') {
    opts.relaxZeros = opts.strictZeros === false;
  }

  let relax = String(opts.relaxZeros);
  let shorthand = String(opts.shorthand);
  let capture = String(opts.capture);
  let wrap = String(opts.wrap);
  let cacheKey = min + ':' + max + '=' + relax + shorthand + capture + wrap;

  if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
    return toRegexRange.cache[cacheKey].result;
  }

  let a = Math.min(min, max);
  let b = Math.max(min, max);

  if (Math.abs(a - b) === 1) {
    let result = min + '|' + max;
    if (opts.capture) {
      return `(${result})`;
    }
    if (opts.wrap === false) {
      return result;
    }
    return `(?:${result})`;
  }

  let isPadded = hasPadding(min) || hasPadding(max);
  let state = { min, max, a, b };
  let positives = [];
  let negatives = [];

  if (isPadded) {
    state.isPadded = isPadded;
    state.maxLen = String(state.max).length;
  }

  if (a < 0) {
    let newMin = b < 0 ? Math.abs(b) : 1;
    negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
    a = state.a = 0;
  }

  if (b >= 0) {
    positives = splitToPatterns(a, b, state, opts);
  }

  state.negatives = negatives;
  state.positives = positives;
  state.result = collatePatterns(negatives, positives, opts);

  if (opts.capture === true) {
    state.result = `(${state.result})`;
  } else if (opts.wrap !== false && (positives.length + negatives.length) > 1) {
    state.result = `(?:${state.result})`;
  }

  toRegexRange.cache[cacheKey] = state;
  return state.result;
};

function collatePatterns(neg, pos, options) {
  let onlyNegative = filterPatterns(neg, pos, '-', false, options) || [];
  let onlyPositive = filterPatterns(pos, neg, '', false, options) || [];
  let intersected = filterPatterns(neg, pos, '-?', true, options) || [];
  let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
  return subpatterns.join('|');
}

function splitToRanges(min, max) {
  let nines = 1;
  let zeros = 1;

  let stop = countNines(min, nines);
  let stops = new Set([max]);

  while (min <= stop && stop <= max) {
    stops.add(stop);
    nines += 1;
    stop = countNines(min, nines);
  }

  stop = countZeros(max + 1, zeros) - 1;

  while (min < stop && stop <= max) {
    stops.add(stop);
    zeros += 1;
    stop = countZeros(max + 1, zeros) - 1;
  }

  stops = [...stops];
  stops.sort(compare);
  return stops;
}

/**
 * Convert a range to a regex pattern
 * @param {Number} `start`
 * @param {Number} `stop`
 * @return {String}
 */

function rangeToPattern(start, stop, options) {
  if (start === stop) {
    return { pattern: start, count: [], digits: 0 };
  }

  let zipped = zip(start, stop);
  let digits = zipped.length;
  let pattern = '';
  let count = 0;

  for (let i = 0; i < digits; i++) {
    let [startDigit, stopDigit] = zipped[i];

    if (startDigit === stopDigit) {
      pattern += startDigit;

    } else if (startDigit !== '0' || stopDigit !== '9') {
      pattern += toCharacterClass(startDigit, stopDigit, options);

    } else {
      count++;
    }
  }

  if (count) {
    pattern += options.shorthand === true ? '\\d' : '[0-9]';
  }

  return { pattern, count: [count], digits };
}

function splitToPatterns(min, max, tok, options) {
  let ranges = splitToRanges(min, max);
  let tokens = [];
  let start = min;
  let prev;

  for (let i = 0; i < ranges.length; i++) {
    let max = ranges[i];
    let obj = rangeToPattern(String(start), String(max), options);
    let zeros = '';

    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
      if (prev.count.length > 1) {
        prev.count.pop();
      }

      prev.count.push(obj.count[0]);
      prev.string = prev.pattern + toQuantifier(prev.count);
      start = max + 1;
      continue;
    }

    if (tok.isPadded) {
      zeros = padZeros(max, tok, options);
    }

    obj.string = zeros + obj.pattern + toQuantifier(obj.count);
    tokens.push(obj);
    start = max + 1;
    prev = obj;
  }

  return tokens;
}

function filterPatterns(arr, comparison, prefix, intersection, options) {
  let result = [];

  for (let ele of arr) {
    let { string } = ele;

    // only push if _both_ are negative...
    if (!intersection && !contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }

    // or _both_ are positive
    if (intersection && contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }
  }
  return result;
}

/**
 * Zip strings
 */

function zip(a, b) {
  let arr = [];
  for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
  return arr;
}

function compare(a, b) {
  return a > b ? 1 : b > a ? -1 : 0;
}

function contains(arr, key, val) {
  return arr.some(ele => ele[key] === val);
}

function countNines(min, len) {
  return Number(String(min).slice(0, -len) + '9'.repeat(len));
}

function countZeros(integer, zeros) {
  return integer - (integer % Math.pow(10, zeros));
}

function toQuantifier(digits) {
  let [start = 0, stop = ''] = digits;
  if (stop || start > 1) {
    return `{${start + (stop ? ',' + stop : '')}}`;
  }
  return '';
}

function toCharacterClass(a, b, options) {
  return `[${a}${(b - a === 1) ? '' : '-'}${b}]`;
}

function hasPadding(str) {
  return /^-?(0+)\d/.test(str);
}

function padZeros(value, tok, options) {
  if (!tok.isPadded) {
    return value;
  }

  let diff = Math.abs(tok.maxLen - String(value).length);
  let relax = options.relaxZeros !== false;

  switch (diff) {
    case 0:
      return '';
    case 1:
      return relax ? '0?' : '0';
    case 2:
      return relax ? '0{0,2}' : '00';
    default: {
      return relax ? `0{0,${diff}}` : `0{${diff}}`;
    }
  }
}

/**
 * Cache
 */

toRegexRange.cache = {};
toRegexRange.clearCache = () => (toRegexRange.cache = {});

/**
 * Expose `toRegexRange`
 */

module.exports = toRegexRange;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */



module.exports = function(num) {
  if (typeof num === 'number') {
    return num - num === 0;
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fill = __webpack_require__(72);
const stringify = __webpack_require__(69);
const utils = __webpack_require__(70);

const append = (queue = '', stash = '', enclose = false) => {
  let result = [];

  queue = [].concat(queue);
  stash = [].concat(stash);

  if (!stash.length) return queue;
  if (!queue.length) {
    return enclose ? utils.flatten(stash).map(ele => `{${ele}}`) : stash;
  }

  for (let item of queue) {
    if (Array.isArray(item)) {
      for (let value of item) {
        result.push(append(value, stash, enclose));
      }
    } else {
      for (let ele of stash) {
        if (enclose === true && typeof ele === 'string') ele = `{${ele}}`;
        result.push(Array.isArray(ele) ? append(item, ele, enclose) : (item + ele));
      }
    }
  }
  return utils.flatten(result);
};

const expand = (ast, options = {}) => {
  let rangeLimit = options.rangeLimit === void 0 ? 1000 : options.rangeLimit;

  let walk = (node, parent = {}) => {
    node.queue = [];

    let p = parent;
    let q = parent.queue;

    while (p.type !== 'brace' && p.type !== 'root' && p.parent) {
      p = p.parent;
      q = p.queue;
    }

    if (node.invalid || node.dollar) {
      q.push(append(q.pop(), stringify(node, options)));
      return;
    }

    if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
      q.push(append(q.pop(), ['{}']));
      return;
    }

    if (node.nodes && node.ranges > 0) {
      let args = utils.reduce(node.nodes);

      if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
        throw new RangeError('expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.');
      }

      let range = fill(...args, options);
      if (range.length === 0) {
        range = stringify(node, options);
      }

      q.push(append(q.pop(), range));
      node.nodes = [];
      return;
    }

    let enclose = utils.encloseBrace(node);
    let queue = node.queue;
    let block = node;

    while (block.type !== 'brace' && block.type !== 'root' && block.parent) {
      block = block.parent;
      queue = block.queue;
    }

    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i];

      if (child.type === 'comma' && node.type === 'brace') {
        if (i === 1) queue.push('');
        queue.push('');
        continue;
      }

      if (child.type === 'close') {
        q.push(append(q.pop(), queue, enclose));
        continue;
      }

      if (child.value && child.type !== 'open') {
        queue.push(append(queue.pop(), child.value));
        continue;
      }

      if (child.nodes) {
        walk(child, node);
      }
    }

    return queue;
  };

  return utils.flatten(walk(ast));
};

module.exports = expand;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const stringify = __webpack_require__(69);

/**
 * Constants
 */

const {
  MAX_LENGTH,
  CHAR_BACKSLASH, /* \ */
  CHAR_BACKTICK, /* ` */
  CHAR_COMMA, /* , */
  CHAR_DOT, /* . */
  CHAR_LEFT_PARENTHESES, /* ( */
  CHAR_RIGHT_PARENTHESES, /* ) */
  CHAR_LEFT_CURLY_BRACE, /* { */
  CHAR_RIGHT_CURLY_BRACE, /* } */
  CHAR_LEFT_SQUARE_BRACKET, /* [ */
  CHAR_RIGHT_SQUARE_BRACKET, /* ] */
  CHAR_DOUBLE_QUOTE, /* " */
  CHAR_SINGLE_QUOTE, /* ' */
  CHAR_NO_BREAK_SPACE,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE
} = __webpack_require__(77);

/**
 * parse
 */

const parse = (input, options = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  let opts = options || {};
  let max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  if (input.length > max) {
    throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
  }

  let ast = { type: 'root', input, nodes: [] };
  let stack = [ast];
  let block = ast;
  let prev = ast;
  let brackets = 0;
  let length = input.length;
  let index = 0;
  let depth = 0;
  let value;
  let memo = {};

  /**
   * Helpers
   */

  const advance = () => input[index++];
  const push = node => {
    if (node.type === 'text' && prev.type === 'dot') {
      prev.type = 'text';
    }

    if (prev && prev.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }

    block.nodes.push(node);
    node.parent = block;
    node.prev = prev;
    prev = node;
    return node;
  };

  push({ type: 'bos' });

  while (index < length) {
    block = stack[stack.length - 1];
    value = advance();

    /**
     * Invalid chars
     */

    if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
      continue;
    }

    /**
     * Escaped chars
     */

    if (value === CHAR_BACKSLASH) {
      push({ type: 'text', value: (options.keepEscaping ? value : '') + advance() });
      continue;
    }

    /**
     * Right square bracket (literal): ']'
     */

    if (value === CHAR_RIGHT_SQUARE_BRACKET) {
      push({ type: 'text', value: '\\' + value });
      continue;
    }

    /**
     * Left square bracket: '['
     */

    if (value === CHAR_LEFT_SQUARE_BRACKET) {
      brackets++;

      let closed = true;
      let next;

      while (index < length && (next = advance())) {
        value += next;

        if (next === CHAR_LEFT_SQUARE_BRACKET) {
          brackets++;
          continue;
        }

        if (next === CHAR_BACKSLASH) {
          value += advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          brackets--;

          if (brackets === 0) {
            break;
          }
        }
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Parentheses
     */

    if (value === CHAR_LEFT_PARENTHESES) {
      block = push({ type: 'paren', nodes: [] });
      stack.push(block);
      push({ type: 'text', value });
      continue;
    }

    if (value === CHAR_RIGHT_PARENTHESES) {
      if (block.type !== 'paren') {
        push({ type: 'text', value });
        continue;
      }
      block = stack.pop();
      push({ type: 'text', value });
      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Quotes: '|"|`
     */

    if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
      let open = value;
      let next;

      if (options.keepQuotes !== true) {
        value = '';
      }

      while (index < length && (next = advance())) {
        if (next === CHAR_BACKSLASH) {
          value += next + advance();
          continue;
        }

        if (next === open) {
          if (options.keepQuotes === true) value += next;
          break;
        }

        value += next;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Left curly brace: '{'
     */

    if (value === CHAR_LEFT_CURLY_BRACE) {
      depth++;

      let dollar = prev.value && prev.value.slice(-1) === '$' || block.dollar === true;
      let brace = {
        type: 'brace',
        open: true,
        close: false,
        dollar,
        depth,
        commas: 0,
        ranges: 0,
        nodes: []
      };

      block = push(brace);
      stack.push(block);
      push({ type: 'open', value });
      continue;
    }

    /**
     * Right curly brace: '}'
     */

    if (value === CHAR_RIGHT_CURLY_BRACE) {
      if (block.type !== 'brace') {
        push({ type: 'text', value });
        continue;
      }

      let type = 'close';
      block = stack.pop();
      block.close = true;

      push({ type, value });
      depth--;

      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Comma: ','
     */

    if (value === CHAR_COMMA && depth > 0) {
      if (block.ranges > 0) {
        block.ranges = 0;
        let open = block.nodes.shift();
        block.nodes = [open, { type: 'text', value: stringify(block) }];
      }

      push({ type: 'comma', value });
      block.commas++;
      continue;
    }

    /**
     * Dot: '.'
     */

    if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
      let siblings = block.nodes;

      if (depth === 0 || siblings.length === 0) {
        push({ type: 'text', value });
        continue;
      }

      if (prev.type === 'dot') {
        block.range = [];
        prev.value += value;
        prev.type = 'range';

        if (block.nodes.length !== 3 && block.nodes.length !== 5) {
          block.invalid = true;
          block.ranges = 0;
          prev.type = 'text';
          continue;
        }

        block.ranges++;
        block.args = [];
        continue;
      }

      if (prev.type === 'range') {
        siblings.pop();

        let before = siblings[siblings.length - 1];
        before.value += prev.value + value;
        prev = before;
        block.ranges--;
        continue;
      }

      push({ type: 'dot', value });
      continue;
    }

    /**
     * Text
     */

    push({ type: 'text', value });
  }

  // Mark imbalanced braces and brackets as invalid
  do {
    block = stack.pop();

    if (block.type !== 'root') {
      block.nodes.forEach(node => {
        if (!node.nodes) {
          if (node.type === 'open') node.isOpen = true;
          if (node.type === 'close') node.isClose = true;
          if (!node.nodes) node.type = 'text';
          node.invalid = true;
        }
      });

      // get the location of the block on parent.nodes (block's siblings)
      let parent = stack[stack.length - 1];
      let index = parent.nodes.indexOf(block);
      // replace the (invalid) block with it's nodes
      parent.nodes.splice(index, 1, ...block.nodes);
    }
  } while (stack.length > 0);

  push({ type: 'eos' });
  return ast;
};

module.exports = parse;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  MAX_LENGTH: 1024 * 64,

  // Digits
  CHAR_0: '0', /* 0 */
  CHAR_9: '9', /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 'A', /* A */
  CHAR_LOWERCASE_A: 'a', /* a */
  CHAR_UPPERCASE_Z: 'Z', /* Z */
  CHAR_LOWERCASE_Z: 'z', /* z */

  CHAR_LEFT_PARENTHESES: '(', /* ( */
  CHAR_RIGHT_PARENTHESES: ')', /* ) */

  CHAR_ASTERISK: '*', /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: '&', /* & */
  CHAR_AT: '@', /* @ */
  CHAR_BACKSLASH: '\\', /* \ */
  CHAR_BACKTICK: '`', /* ` */
  CHAR_CARRIAGE_RETURN: '\r', /* \r */
  CHAR_CIRCUMFLEX_ACCENT: '^', /* ^ */
  CHAR_COLON: ':', /* : */
  CHAR_COMMA: ',', /* , */
  CHAR_DOLLAR: '$', /* . */
  CHAR_DOT: '.', /* . */
  CHAR_DOUBLE_QUOTE: '"', /* " */
  CHAR_EQUAL: '=', /* = */
  CHAR_EXCLAMATION_MARK: '!', /* ! */
  CHAR_FORM_FEED: '\f', /* \f */
  CHAR_FORWARD_SLASH: '/', /* / */
  CHAR_HASH: '#', /* # */
  CHAR_HYPHEN_MINUS: '-', /* - */
  CHAR_LEFT_ANGLE_BRACKET: '<', /* < */
  CHAR_LEFT_CURLY_BRACE: '{', /* { */
  CHAR_LEFT_SQUARE_BRACKET: '[', /* [ */
  CHAR_LINE_FEED: '\n', /* \n */
  CHAR_NO_BREAK_SPACE: '\u00A0', /* \u00A0 */
  CHAR_PERCENT: '%', /* % */
  CHAR_PLUS: '+', /* + */
  CHAR_QUESTION_MARK: '?', /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: '>', /* > */
  CHAR_RIGHT_CURLY_BRACE: '}', /* } */
  CHAR_RIGHT_SQUARE_BRACKET: ']', /* ] */
  CHAR_SEMICOLON: ';', /* ; */
  CHAR_SINGLE_QUOTE: '\'', /* ' */
  CHAR_SPACE: ' ', /*   */
  CHAR_TAB: '\t', /* \t */
  CHAR_UNDERSCORE: '_', /* _ */
  CHAR_VERTICAL_LINE: '|', /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\uFEFF' /* \uFEFF */
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(79);


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(8);
const scan = __webpack_require__(80);
const parse = __webpack_require__(83);
const utils = __webpack_require__(81);

/**
 * Creates a matcher function from one or more glob patterns. The
 * returned function takes a string to match as its first argument,
 * and returns true if the string is a match. The returned matcher
 * function also takes a boolean as the second argument that, when true,
 * returns an object with additional information.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch(glob[, options]);
 *
 * const isMatch = picomatch('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @name picomatch
 * @param {String|Array} `globs` One or more glob patterns.
 * @param {Object=} `options`
 * @return {Function=} Returns a matcher function.
 * @api public
 */

const picomatch = (glob, options, returnState = false) => {
  if (Array.isArray(glob)) {
    let fns = glob.map(input => picomatch(input, options, returnState));
    return str => {
      for (let isMatch of fns) {
        let state = isMatch(str);
        if (state) return state;
      }
      return false;
    };
  }

  if (typeof glob !== 'string' || glob === '') {
    throw new TypeError('Expected pattern to be a non-empty string');
  }

  let opts = options || {};
  let posix = utils.isWindows(options);
  let regex = picomatch.makeRe(glob, options, false, true);
  let state = regex.state;
  delete regex.state;

  let isIgnored = () => false;
  if (opts.ignore) {
    let ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
  }

  const matcher = (input, returnObject = false) => {
    let { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
    let result = { glob, state, regex, posix, input, output, match, isMatch };

    if (typeof opts.onResult === 'function') {
      opts.onResult(result);
    }

    if (isMatch === false) {
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (isIgnored(input)) {
      if (typeof opts.onIgnore === 'function') {
        opts.onIgnore(result);
      }
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (typeof opts.onMatch === 'function') {
      opts.onMatch(result);
    }
    return returnObject ? result : true;
  };

  if (returnState) {
    matcher.state = state;
  }

  return matcher;
};

/**
 * Test `input` with the given `regex`. This is used by the main
 * `picomatch()` function to test the input string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.test(input, regex[, options]);
 *
 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp} `regex`
 * @return {Object} Returns an object with matching info.
 * @api public
 */

picomatch.test = (input, regex, options, { glob, posix } = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (input === '') {
    return { isMatch: false, output: '' };
  }

  let opts = options || {};
  let format = opts.format || (posix ? utils.toPosixSlashes : null);
  let match = input === glob;
  let output = (match && format) ? format(input) : input;

  if (match === false) {
    output = format ? format(input) : input;
    match = output === glob;
  }

  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output);
    }
  }

  return { isMatch: !!match, match, output };
};

/**
 * Match the basename of a filepath.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.matchBase(input, glob[, options]);
 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
 * @return {Boolean}
 * @api public
 */

picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
  let regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
  return regex.test(path.basename(input));
};

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.isMatch(string, patterns[, options]);
 *
 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String|Array} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const result = picomatch.parse(glob[, options]);
 * ```
 * @param {String} `glob`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
 * @api public
 */

picomatch.parse = (glob, options) => parse(glob, options);

/**
 * Scan a glob pattern to separate the pattern into segments.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.scan(input[, options]);
 *
 * const result = picomatch.scan('!./foo/*.js');
 * console.log(result);
 * // { prefix: '!./',
 * //   input: '!./foo/*.js',
 * //   base: 'foo',
 * //   glob: '*.js',
 * //   negated: true,
 * //   isGlob: true }
 * ```
 * @param {String} `input` Glob pattern to scan.
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

picomatch.scan = (input, options) => scan(input, options);

/**
 * Create a regular expression from a glob pattern.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.makeRe(input[, options]);
 *
 * console.log(picomatch.makeRe('*.js'));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `input` A glob pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

picomatch.makeRe = (input, options, returnOutput = false, returnState = false) => {
  if (!input || typeof input !== 'string') {
    throw new TypeError('Expected a non-empty string');
  }

  let opts = options || {};
  let prepend = opts.contains ? '' : '^';
  let append = opts.contains ? '' : '$';
  let state = { negated: false, fastpaths: true };
  let prefix = '';
  let output;

  if (input.startsWith('./')) {
    input = input.slice(2);
    prefix = state.prefix = './';
  }

  if (opts.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
    output = parse.fastpaths(input, options);
  }

  if (output === void 0) {
    state = picomatch.parse(input, options);
    state.prefix = prefix + (state.prefix || '');
    output = state.output;
  }

  if (returnOutput === true) {
    return output;
  }

  let source = `${prepend}(?:${output})${append}`;
  if (state && state.negated === true) {
    source = `^(?!${source}).*$`;
  }

  let regex = picomatch.toRegex(source, options);
  if (returnState === true) {
    regex.state = state;
  }

  return regex;
};

/**
 * Create a regular expression from the given regex source string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.toRegex(source[, options]);
 *
 * const { output } = picomatch.parse('*.js');
 * console.log(picomatch.toRegex(output));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `source` Regular expression source string.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

picomatch.toRegex = (source, options) => {
  try {
    let opts = options || {};
    return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
  } catch (err) {
    if (options && options.debug === true) throw err;
    return /$^/;
  }
};

/**
 * Picomatch constants.
 * @return {Object}
 */

picomatch.constants = __webpack_require__(82);

/**
 * Expose "picomatch"
 */

module.exports = picomatch;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const utils = __webpack_require__(81);

const {
  CHAR_ASTERISK,             /* * */
  CHAR_AT,                   /* @ */
  CHAR_BACKWARD_SLASH,       /* \ */
  CHAR_COMMA,                /* , */
  CHAR_DOT,                  /* . */
  CHAR_EXCLAMATION_MARK,     /* ! */
  CHAR_FORWARD_SLASH,        /* / */
  CHAR_LEFT_CURLY_BRACE,     /* { */
  CHAR_LEFT_PARENTHESES,     /* ( */
  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
  CHAR_PLUS,                 /* + */
  CHAR_QUESTION_MARK,        /* ? */
  CHAR_RIGHT_CURLY_BRACE,    /* } */
  CHAR_RIGHT_PARENTHESES,    /* ) */
  CHAR_RIGHT_SQUARE_BRACKET /* ] */
} = __webpack_require__(82);

const isPathSeparator = code => {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
};

/**
 * Quickly scans a glob pattern and returns an object with a handful of
 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
 * `glob` (the actual pattern), and `negated` (true if the path starts with `!`).
 *
 * ```js
 * const pm = require('picomatch');
 * console.log(pm.scan('foo/bar/*.js'));
 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an object with tokens and regex source string.
 * @api public
 */

module.exports = (input, options) => {
  let opts = options || {};
  let length = input.length - 1;
  let index = -1;
  let start = 0;
  let lastIndex = 0;
  let isGlob = false;
  let backslashes = false;
  let negated = false;
  let braces = 0;
  let prev;
  let code;

  let braceEscaped = false;

  let eos = () => index >= length;
  let advance = () => {
    prev = code;
    return input.charCodeAt(++index);
  };

  while (index < length) {
    code = advance();
    let next;

    if (code === CHAR_BACKWARD_SLASH) {
      backslashes = true;
      next = advance();

      if (next === CHAR_LEFT_CURLY_BRACE) {
        braceEscaped = true;
      }
      continue;
    }

    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
      braces++;

      while (!eos() && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = true;
          next = advance();
          continue;
        }

        if (next === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          continue;
        }

        if (!braceEscaped && next === CHAR_DOT && (next = advance()) === CHAR_DOT) {
          isGlob = true;
          break;
        }

        if (!braceEscaped && next === CHAR_COMMA) {
          isGlob = true;
          break;
        }

        if (next === CHAR_RIGHT_CURLY_BRACE) {
          braces--;
          if (braces === 0) {
            braceEscaped = false;
            break;
          }
        }
      }
    }

    if (code === CHAR_FORWARD_SLASH) {
      if (prev === CHAR_DOT && index === (start + 1)) {
        start += 2;
        continue;
      }

      lastIndex = index + 1;
      continue;
    }

    if (code === CHAR_ASTERISK) {
      isGlob = true;
      break;
    }

    if (code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK) {
      isGlob = true;
      break;
    }

    if (code === CHAR_LEFT_SQUARE_BRACKET) {
      while (!eos() && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = true;
          next = advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          isGlob = true;
          break;
        }
      }
    }

    let isExtglobChar = code === CHAR_PLUS
      || code === CHAR_AT
      || code === CHAR_EXCLAMATION_MARK;

    if (isExtglobChar && input.charCodeAt(index + 1) === CHAR_LEFT_PARENTHESES) {
      isGlob = true;
      break;
    }

    if (code === CHAR_EXCLAMATION_MARK && index === start) {
      negated = true;
      start++;
      continue;
    }

    if (code === CHAR_LEFT_PARENTHESES) {
      while (!eos() && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = true;
          next = advance();
          continue;
        }

        if (next === CHAR_RIGHT_PARENTHESES) {
          isGlob = true;
          break;
        }
      }
    }

    if (isGlob) {
      break;
    }
  }

  let prefix = '';
  let orig = input;
  let base = input;
  let glob = '';

  if (start > 0) {
    prefix = input.slice(0, start);
    input = input.slice(start);
    lastIndex -= start;
  }

  if (base && isGlob === true && lastIndex > 0) {
    base = input.slice(0, lastIndex);
    glob = input.slice(lastIndex);
  } else if (isGlob === true) {
    base = '';
    glob = input;
  } else {
    base = input;
  }

  if (base && base !== '' && base !== '/' && base !== input) {
    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
      base = base.slice(0, -1);
    }
  }

  if (opts.unescape === true) {
    if (glob) glob = utils.removeBackslashes(glob);

    if (base && backslashes === true) {
      base = utils.removeBackslashes(base);
    }
  }

  return { prefix, input: orig, base, glob, negated, isGlob };
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(8);
const win32 = process.platform === 'win32';
const {
  REGEX_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_GLOBAL,
  REGEX_REMOVE_BACKSLASH
} = __webpack_require__(82);

exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
exports.toPosixSlashes = str => str.replace(/\\/g, '/');

exports.removeBackslashes = str => {
  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
    return match === '\\' ? '' : match;
  });
}

exports.supportsLookbehinds = () => {
  let segs = process.version.slice(1).split('.');
  if (segs.length === 3 && +segs[0] >= 9 || (+segs[0] === 8 && +segs[1] >= 10)) {
    return true;
  }
  return false;
};

exports.isWindows = options => {
  if (options && typeof options.windows === 'boolean') {
    return options.windows;
  }
  return win32 === true || path.sep === '\\';
};

exports.escapeLast = (input, char, lastIdx) => {
  let idx = input.lastIndexOf(char, lastIdx);
  if (idx === -1) return input;
  if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
  return input.slice(0, idx) + '\\' + input.slice(idx);
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(8);
const WIN_SLASH = '\\\\/';
const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

/**
 * Posix glob regex
 */

const DOT_LITERAL = '\\.';
const PLUS_LITERAL = '\\+';
const QMARK_LITERAL = '\\?';
const SLASH_LITERAL = '\\/';
const ONE_CHAR = '(?=.)';
const QMARK = '[^/]';
const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
const NO_DOT = `(?!${DOT_LITERAL})`;
const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
const STAR = `${QMARK}*?`;

const POSIX_CHARS = {
  DOT_LITERAL,
  PLUS_LITERAL,
  QMARK_LITERAL,
  SLASH_LITERAL,
  ONE_CHAR,
  QMARK,
  END_ANCHOR,
  DOTS_SLASH,
  NO_DOT,
  NO_DOTS,
  NO_DOT_SLASH,
  NO_DOTS_SLASH,
  QMARK_NO_DOT,
  STAR,
  START_ANCHOR
};

/**
 * Windows glob regex
 */

const WINDOWS_CHARS = {
  ...POSIX_CHARS,

  SLASH_LITERAL: `[${WIN_SLASH}]`,
  QMARK: WIN_NO_SLASH,
  STAR: `${WIN_NO_SLASH}*?`,
  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
  NO_DOT: `(?!${DOT_LITERAL})`,
  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
};

/**
 * POSIX Bracket Regex
 */

const POSIX_REGEX_SOURCE = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

module.exports = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE,

  // regular expressions
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHAR: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

  // Replace globs with equivalent patterns to reduce parsing time.
  REPLACEMENTS: {
    '***': '*',
    '**/**': '**',
    '**/**/**': '**'
  },

  // Digits
  CHAR_0: 48, /* 0 */
  CHAR_9: 57, /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 65, /* A */
  CHAR_LOWERCASE_A: 97, /* a */
  CHAR_UPPERCASE_Z: 90, /* Z */
  CHAR_LOWERCASE_Z: 122, /* z */

  CHAR_LEFT_PARENTHESES: 40, /* ( */
  CHAR_RIGHT_PARENTHESES: 41, /* ) */

  CHAR_ASTERISK: 42, /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: 38, /* & */
  CHAR_AT: 64, /* @ */
  CHAR_BACKWARD_SLASH: 92, /* \ */
  CHAR_CARRIAGE_RETURN: 13, /* \r */
  CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
  CHAR_COLON: 58, /* : */
  CHAR_COMMA: 44, /* , */
  CHAR_DOT: 46, /* . */
  CHAR_DOUBLE_QUOTE: 34, /* " */
  CHAR_EQUAL: 61, /* = */
  CHAR_EXCLAMATION_MARK: 33, /* ! */
  CHAR_FORM_FEED: 12, /* \f */
  CHAR_FORWARD_SLASH: 47, /* / */
  CHAR_GRAVE_ACCENT: 96, /* ` */
  CHAR_HASH: 35, /* # */
  CHAR_HYPHEN_MINUS: 45, /* - */
  CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
  CHAR_LEFT_CURLY_BRACE: 123, /* { */
  CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
  CHAR_LINE_FEED: 10, /* \n */
  CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
  CHAR_PERCENT: 37, /* % */
  CHAR_PLUS: 43, /* + */
  CHAR_QUESTION_MARK: 63, /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
  CHAR_RIGHT_CURLY_BRACE: 125, /* } */
  CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
  CHAR_SEMICOLON: 59, /* ; */
  CHAR_SINGLE_QUOTE: 39, /* ' */
  CHAR_SPACE: 32, /*   */
  CHAR_TAB: 9, /* \t */
  CHAR_UNDERSCORE: 95, /* _ */
  CHAR_VERTICAL_LINE: 124, /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

  SEP: path.sep,

  /**
   * Create EXTGLOB_CHARS
   */

  extglobChars(chars) {
    return {
      '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
      '?': { type: 'qmark', open: '(?:', close: ')?' },
      '+': { type: 'plus', open: '(?:', close: ')+' },
      '*': { type: 'star', open: '(?:', close: ')*' },
      '@': { type: 'at', open: '(?:', close: ')' }
    };
  },

  /**
   * Create GLOB_CHARS
   */

  globChars(win32) {
    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const utils = __webpack_require__(81);
const constants = __webpack_require__(82);

/**
 * Constants
 */

const {
  MAX_LENGTH,
  POSIX_REGEX_SOURCE,
  REGEX_NON_SPECIAL_CHAR,
  REGEX_SPECIAL_CHARS_BACKREF,
  REPLACEMENTS
} = constants;

/**
 * Helpers
 */

const expandRange = (args, options) => {
  if (typeof options.expandRange === 'function') {
    return options.expandRange(...args, options);
  }

  args.sort();
  let value = `[${args.join('-')}]`;

  try {
    /* eslint-disable no-new */
    new RegExp(value);
  } catch (ex) {
    return args.map(v => utils.escapeRegex(v)).join('..');
  }

  return value;
};

const negate = state => {
  let count = 1;

  while (state.peek() === '!' && (state.peek(2) !== '(' || state.peek(3) === '?')) {
    state.advance();
    state.start++;
    count++;
  }

  if (count % 2 === 0) {
    return false;
  }

  state.negated = true;
  state.start++;
  return true;
};

/**
 * Create the message for a syntax error
 */

const syntaxError = (type, char) => {
  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};

/**
 * Parse the given input string.
 * @param {String} input
 * @param {Object} options
 * @return {Object}
 */

const parse = (input, options) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  input = REPLACEMENTS[input] || input;

  let opts = { ...options };
  let max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  let bos = { type: 'bos', value: '', output: opts.prepend || '' };
  let tokens = [bos];

  let capture = opts.capture ? '' : '?:';
  let win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const PLATFORM_CHARS = constants.globChars(win32);
  const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);

  const {
    DOT_LITERAL,
    PLUS_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  } = PLATFORM_CHARS;

  const globstar = (opts) => {
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  let nodot = opts.dot ? '' : NO_DOT;
  let star = opts.bash === true ? globstar(opts) : STAR;
  let qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;

  if (opts.capture) {
    star = `(${star})`;
  }

  // minimatch options support
  if (typeof opts.noext === 'boolean') {
    opts.noextglob = opts.noext;
  }

  let state = {
    index: -1,
    start: 0,
    consumed: '',
    output: '',
    backtrack: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    tokens
  };

  let extglobs = [];
  let stack = [];
  let prev = bos;
  let value;

  /**
   * Tokenizing helpers
   */

  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index];
  const append = token => {
    state.output += token.output != null ? token.output : token.value;
    state.consumed += token.value || '';
  };

  const increment = type => {
    state[type]++;
    stack.push(type);
  };

  const decrement = type => {
    state[type]--;
    stack.pop();
  };

  /**
   * Push tokens onto the tokens array. This helper speeds up
   * tokenizing by 1) helping us avoid backtracking as much as possible,
   * and 2) helping us avoid creating extra tokens when consecutive
   * characters are plain text. This improves performance and simplifies
   * lookbehinds.
   */

  const push = tok => {
    if (prev.type === 'globstar') {
      let isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
      let isExtglob = extglobs.length && (tok.type === 'pipe' || tok.type === 'paren');
      if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = 'star';
        prev.value = '*';
        prev.output = star;
        state.output += prev.output;
      }
    }

    if (extglobs.length && tok.type !== 'paren' && !EXTGLOB_CHARS[tok.value]) {
      extglobs[extglobs.length - 1].inner += tok.value;
    }

    if (tok.value || tok.output) append(tok);
    if (prev && prev.type === 'text' && tok.type === 'text') {
      prev.value += tok.value;
      return;
    }

    tok.prev = prev;
    tokens.push(tok);
    prev = tok;
  };

  const extglobOpen = (type, value) => {
    let token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    let output = (opts.capture ? '(' : '') + token.open;

    push({ type, value, output: state.output ? '' : ONE_CHAR });
    push({ type: 'paren', extglob: true, value: advance(), output });
    increment('parens');
    extglobs.push(token);
  };

  const extglobClose = token => {
    let output = token.close + (opts.capture ? ')' : '');

    if (token.type === 'negate') {
      let extglobStar = star;

      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
        extglobStar = globstar(opts);
      }

      if (extglobStar !== star || eos() || /^\)+$/.test(input.slice(state.index + 1))) {
        output = token.close = ')$))' + extglobStar;
      }

      if (token.prev.type === 'bos' && eos()) {
        state.negatedExtglob = true;
      }
    }

    push({ type: 'paren', extglob: true, value, output });
    decrement('parens');
  };

  if (opts.fastpaths !== false && !/(^[*!]|[/{[()\]}"])/.test(input)) {
    let backslashes = false;

    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
      if (first === '\\') {
        backslashes = true;
        return m;
      }

      if (first === '?') {
        if (esc) {
          return esc + first + (rest ? QMARK.repeat(rest.length) : '');
        }
        if (index === 0) {
          return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
        }
        return QMARK.repeat(chars.length);
      }

      if (first === '.') {
        return DOT_LITERAL.repeat(chars.length);
      }

      if (first === '*') {
        if (esc) {
          return esc + first + (rest ? star : '');
        }
        return star;
      }
      return esc ? m : '\\' + m;
    });

    if (backslashes === true) {
      if (opts.unescape === true) {
        output = output.replace(/\\/g, '');
      } else {
        output = output.replace(/\\+/g, m => {
          return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
        });
      }
    }

    state.output = output;
    return state;
  }

  /**
   * Tokenize input until we reach end-of-string
   */

  while (!eos()) {
    value = advance();

    if (value === '\u0000') {
      continue;
    }

    /**
     * Escaped characters
     */

    if (value === '\\') {
      let next = peek();

      if (next === '/' && opts.bash !== true) {
        continue;
      }

      if (next === '.' || next === ';') {
        continue;
      }

      if (!next) {
        value += '\\';
        push({ type: 'text', value });
        continue;
      }

      // collapse slashes to reduce potential for exploits
      let match = /^\\+/.exec(input.slice(state.index + 1));
      let slashes = 0;

      if (match && match[0].length > 2) {
        slashes = match[0].length;
        state.index += slashes;
        if (slashes % 2 !== 0) {
          value += '\\';
        }
      }

      if (opts.unescape === true) {
        value = advance() || '';
      } else {
        value += advance() || '';
      }

      if (state.brackets === 0) {
        push({ type: 'text', value });
        continue;
      }
    }

    /**
     * If we're inside a regex character class, continue
     * until we reach the closing bracket.
     */

    if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
      if (opts.posix !== false && value === ':') {
        let inner = prev.value.slice(1);
        if (inner.includes('[')) {
          prev.posix = true;

          if (inner.includes(':')) {
            let idx = prev.value.lastIndexOf('[');
            let pre = prev.value.slice(0, idx);
            let rest = prev.value.slice(idx + 2);
            let posix = POSIX_REGEX_SOURCE[rest];
            if (posix) {
              prev.value = pre + posix;
              state.backtrack = true;
              advance();

              if (!bos.output && tokens.indexOf(prev) === 1) {
                bos.output = ONE_CHAR;
              }
              continue;
            }
          }
        }
      }

      if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
        value = '\\' + value;
      }

      if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
        value = '\\' + value;
      }

      if (opts.posix === true && value === '!' && prev.value === '[') {
        value = '^';
      }

      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * If we're inside a quoted string, continue
     * until we reach the closing double quote.
     */

    if (state.quotes === 1 && value !== '"') {
      value = utils.escapeRegex(value);
      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * Double quotes
     */

    if (value === '"') {
      state.quotes = state.quotes === 1 ? 0 : 1;
      if (opts.keepQuotes === true) {
        push({ type: 'text', value });
      }
      continue;
    }

    /**
     * Parentheses
     */

    if (value === '(') {
      push({ type: 'paren', value });
      increment('parens');
      continue;
    }

    if (value === ')') {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError('opening', '('));
      }

      let extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }

      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
      decrement('parens');
      continue;
    }

    /**
     * Brackets
     */

    if (value === '[') {
      if (opts.nobracket === true || !input.slice(state.index + 1).includes(']')) {
        if (opts.nobracket !== true && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('closing', ']'));
        }

        value = '\\' + value;
      } else {
        increment('brackets');
      }

      push({ type: 'bracket', value });
      continue;
    }

    if (value === ']') {
      if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
        push({ type: 'text', value, output: '\\' + value });
        continue;
      }

      if (state.brackets === 0) {
        if (opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('opening', '['));
        }

        push({ type: 'text', value, output: '\\' + value });
        continue;
      }

      decrement('brackets');

      let prevValue = prev.value.slice(1);
      if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
        value = '/' + value;
      }

      prev.value += value;
      append({ value });

      // when literal brackets are explicitly disabled
      // assume we should match with a regex character class
      if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
        continue;
      }

      let escaped = utils.escapeRegex(prev.value);
      state.output = state.output.slice(0, -prev.value.length);

      // when literal brackets are explicitly enabled
      // assume we should escape the brackets to match literal characters
      if (opts.literalBrackets === true) {
        state.output += escaped;
        prev.value = escaped;
        continue;
      }

      // when the user specifies nothing, try to match both
      prev.value = `(${capture}${escaped}|${prev.value})`;
      state.output += prev.value;
      continue;
    }

    /**
     * Braces
     */

    if (value === '{' && opts.nobrace !== true) {
      push({ type: 'brace', value, output: '(' });
      increment('braces');
      continue;
    }

    if (value === '}') {
      if (opts.nobrace === true || state.braces === 0) {
        push({ type: 'text', value, output: '\\' + value });
        continue;
      }

      let output = ')';

      if (state.dots === true) {
        let arr = tokens.slice();
        let range = [];

        for (let i = arr.length - 1; i >= 0; i--) {
          tokens.pop();
          if (arr[i].type === 'brace') {
            break;
          }
          if (arr[i].type !== 'dots') {
            range.unshift(arr[i].value);
          }
        }

        output = expandRange(range, opts);
        state.backtrack = true;
      }

      push({ type: 'brace', value, output });
      decrement('braces');
      continue;
    }

    /**
     * Pipes
     */

    if (value === '|') {
      if (extglobs.length > 0) {
        extglobs[extglobs.length - 1].conditions++;
      }
      push({ type: 'text', value });
      continue;
    }

    /**
     * Commas
     */

    if (value === ',') {
      let output = value;

      if (state.braces > 0 && stack[stack.length - 1] === 'braces') {
        output = '|';
      }

      push({ type: 'comma', value, output });
      continue;
    }

    /**
     * Slashes
     */

    if (value === '/') {
      // if the beginning of the glob is "./", advance the start
      // to the current index, and don't add the "./" characters
      // to the state. This greatly simplifies lookbehinds when
      // checking for BOS characters like "!" and "." (not "./")
      if (prev.type === 'dot' && state.index === 1) {
        state.start = state.index + 1;
        state.consumed = '';
        state.output = '';
        tokens.pop();
        prev = bos; // reset "prev" to the first token
        continue;
      }

      push({ type: 'slash', value, output: SLASH_LITERAL });
      continue;
    }

    /**
     * Dots
     */

    if (value === '.') {
      if (state.braces > 0 && prev.type === 'dot') {
        if (prev.value === '.') prev.output = DOT_LITERAL;
        prev.type = 'dots';
        prev.output += value;
        prev.value += value;
        state.dots = true;
        continue;
      }

      push({ type: 'dot', value, output: DOT_LITERAL });
      continue;
    }

    /**
     * Question marks
     */

    if (value === '?') {
      if (prev && prev.type === 'paren') {
        let next = peek();
        let output = value;

        if (next === '<' && !utils.supportsLookbehinds()) {
          throw new Error('Node.js v10 or higher is required for regex lookbehinds');
        }

        if (prev.value === '(' && !/[!=<:]/.test(next) || (next === '<' && !/[!=]/.test(peek(2)))) {
          output = '\\' + value;
        }

        push({ type: 'text', value, output });
        continue;
      }

      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('qmark', value);
        continue;
      }

      if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
        push({ type: 'qmark', value, output: QMARK_NO_DOT });
        continue;
      }

      push({ type: 'qmark', value, output: QMARK });
      continue;
    }

    /**
     * Exclamation
     */

    if (value === '!') {
      if (opts.noextglob !== true && peek() === '(') {
        if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
          extglobOpen('negate', value);
          continue;
        }
      }

      if (opts.nonegate !== true && state.index === 0) {
        negate(state);
        continue;
      }
    }

    /**
     * Plus
     */

    if (value === '+') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('plus', value);
        continue;
      }

      if (prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) {
        let output = prev.extglob === true ? '\\' + value : value;
        push({ type: 'plus', value, output });
        continue;
      }

      // use regex behavior inside parens
      if (state.parens > 0 && opts.regex !== false) {
        push({ type: 'plus', value });
        continue;
      }

      push({ type: 'plus', value: PLUS_LITERAL });
      continue;
    }

    /**
     * Plain text
     */

    if (value === '@') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        push({ type: 'at', value, output: '' });
        continue;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Plain text
     */

    if (value !== '*') {
      if (value === '$' || value === '^') {
        value = '\\' + value;
      }

      let match = REGEX_NON_SPECIAL_CHAR.exec(input.slice(state.index + 1));
      if (match) {
        value += match[0];
        state.index += match[0].length;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Stars
     */

    if (prev && (prev.type === 'globstar' || prev.star === true)) {
      prev.type = 'star';
      prev.star = true;
      prev.value += value;
      prev.output = star;
      state.backtrack = true;
      state.consumed += value;
      continue;
    }

    if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
      extglobOpen('star', value);
      continue;
    }

    if (prev.type === 'star') {
      if (opts.noglobstar === true) {
        state.consumed += value;
        continue;
      }

      let prior = prev.prev;
      let before = prior.prev;
      let isStart = prior.type === 'slash' || prior.type === 'bos';
      let afterStar = before && (before.type === 'star' || before.type === 'globstar');

      if (opts.bash === true && (!isStart || (!eos() && peek() !== '/'))) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      let isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
      let isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      // strip consecutive `/**/`
      while (input.slice(state.index + 1, state.index + 4) === '/**') {
        let after = input[state.index + 4];
        if (after && after !== '/') {
          break;
        }
        state.consumed += '/**';
        state.index += 3;
      }

      if (prior.type === 'bos' && eos()) {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        state.consumed += value;
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = '(?:' + prior.output;

        prev.type = 'globstar';
        prev.output = globstar(opts) + '|$)';
        prev.value += value;

        state.output += prior.output + prev.output;
        state.consumed += value;
        continue;
      }

      let next = peek();
      if (prior.type === 'slash' && prior.prev.type !== 'bos' && next === '/') {
        let end = peek(2) !== void 0 ? '|$' : '';

        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = '(?:' + prior.output;

        prev.type = 'globstar';
        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
        prev.value += value;

        state.output += prior.output + prev.output;
        state.consumed += value + advance();

        push({ type: 'slash', value, output: '' });
        continue;
      }

      if (prior.type === 'bos' && next === '/') {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
        state.output = prev.output;
        state.consumed += value + advance();
        push({ type: 'slash', value, output: '' });
        continue;
      }

      // remove single star from output
      state.output = state.output.slice(0, -prev.output.length);

      // reset previous token to globstar
      prev.type = 'globstar';
      prev.output = globstar(opts);
      prev.value += value;

      // reset output with globstar
      state.output += prev.output;
      state.consumed += value;
      continue;
    }

    let token = { type: 'star', value, output: star };

    if (opts.bash === true) {
      token.output = '.*?';
      if (prev.type === 'bos' || prev.type === 'slash') {
        token.output = nodot + token.output;
      }
      push(token);
      continue;
    }

    if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
      token.output = value;
      push(token);
      continue;
    }

    if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
      if (prev.type === 'dot') {
        state.output += NO_DOT_SLASH;
        prev.output += NO_DOT_SLASH;

      } else if (opts.dot === true) {
        state.output += NO_DOTS_SLASH;
        prev.output += NO_DOTS_SLASH;

      } else {
        state.output += nodot;
        prev.output += nodot;
      }

      if (peek() !== '*') {
        state.output += ONE_CHAR;
        prev.output += ONE_CHAR;
      }
    }

    push(token);
  }

  while (state.brackets > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
    state.output = utils.escapeLast(state.output, '[');
    decrement('brackets');
  }

  while (state.parens > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
    state.output = utils.escapeLast(state.output, '(');
    decrement('parens');
  }

  while (state.braces > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
    state.output = utils.escapeLast(state.output, '{');
    decrement('braces');
  }

  if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
    push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
  }

  // rebuild the output if we had to backtrack at any point
  if (state.backtrack === true) {
    state.output = '';

    for (let token of state.tokens) {
      state.output += token.output != null ? token.output : token.value;

      if (token.suffix) {
        state.output += token.suffix;
      }
    }
  }

  return state;
};

/**
 * Fast paths for creating regular expressions for common glob patterns.
 * This can significantly speed up processing and has very little downside
 * impact when none of the fast paths match.
 */

parse.fastpaths = (input, options) => {
  let opts = { ...options };
  let max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  input = REPLACEMENTS[input] || input;
  let win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const {
    DOT_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOTS_SLASH,
    STAR,
    START_ANCHOR
  } = constants.globChars(win32);

  let capture = opts.capture ? '' : '?:';
  let star = opts.bash === true ? '.*?' : STAR;
  let nodot = opts.dot ? NO_DOTS : NO_DOT;
  let slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;

  if (opts.capture) {
    star = `(${star})`;
  }

  const globstar = (opts) => {
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const create = str => {
    switch (str) {
      case '*':
        return `${nodot}${ONE_CHAR}${star}`;

      case '.*':
        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*.*':
        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*/*':
        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

      case '**':
        return nodot + globstar(opts);

      case '**/*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

      case '**/*.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '**/.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

      default: {
        let match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match) return;

        let source = create(match[1], options);
        if (!source) return;

        return source + DOT_LITERAL + match[2];
      }
    }
  };

  let output = create(input);
  if (output && opts.strictSlashes !== true) {
    output += `${SLASH_LITERAL}?`;
  }

  return output;
};

module.exports = parse;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const merge2 = __webpack_require__(37);
function merge(streams) {
    const mergedStream = merge2(streams);
    streams.forEach((stream) => {
        stream.once('error', (err) => mergedStream.emit('error', err));
    });
    return mergedStream;
}
exports.merge = merge;


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(86);
const provider_1 = __webpack_require__(118);
class ProviderAsync extends provider_1.default {
    constructor() {
        super(...arguments);
        this._reader = new stream_1.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = [];
        return new Promise((resolve, reject) => {
            const stream = this.api(root, task, options);
            stream.once('error', reject);
            stream.on('data', (entry) => entries.push(options.transform(entry)));
            stream.once('end', () => resolve(entries));
        });
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
    }
}
exports.default = ProviderAsync;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(38);
const fsStat = __webpack_require__(87);
const fsWalk = __webpack_require__(92);
const reader_1 = __webpack_require__(117);
class ReaderStream extends reader_1.default {
    constructor() {
        super(...arguments);
        this._walkStream = fsWalk.walkStream;
        this._stat = fsStat.stat;
    }
    dynamic(root, options) {
        return this._walkStream(root, options);
    }
    static(patterns, options) {
        const filepaths = patterns.map(this._getFullEntryPath, this);
        const stream = new stream_1.PassThrough({ objectMode: true });
        stream._write = (index, _enc, done) => {
            return this._getEntry(filepaths[index], patterns[index], options)
                .then((entry) => {
                if (entry !== null && options.entryFilter(entry)) {
                    stream.push(entry);
                }
                if (index === filepaths.length - 1) {
                    stream.end();
                }
                done();
            })
                .catch(done);
        };
        for (let i = 0; i < filepaths.length; i++) {
            stream.write(i);
        }
        return stream;
    }
    _getEntry(filepath, pattern, options) {
        return this._getStat(filepath)
            .then((stats) => this._makeEntry(stats, pattern))
            .catch((error) => {
            if (options.errorFilter(error)) {
                return null;
            }
            throw error;
        });
    }
    _getStat(filepath) {
        return new Promise((resolve, reject) => {
            this._stat(filepath, this._fsStatSettings, (error, stats) => {
                error ? reject(error) : resolve(stats);
            });
        });
    }
}
exports.default = ReaderStream;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async = __webpack_require__(88);
const sync = __webpack_require__(89);
const settings_1 = __webpack_require__(90);
exports.Settings = settings_1.default;
function stat(path, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        return async.read(path, getSettings(), optionsOrSettingsOrCallback);
    }
    async.read(path, getSettings(optionsOrSettingsOrCallback), callback);
}
exports.stat = stat;
function statSync(path, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    return sync.read(path, settings);
}
exports.statSync = statSync;
function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
}


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function read(path, settings, callback) {
    settings.fs.lstat(path, (lstatError, lstat) => {
        if (lstatError) {
            return callFailureCallback(callback, lstatError);
        }
        if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
            return callSuccessCallback(callback, lstat);
        }
        settings.fs.stat(path, (statError, stat) => {
            if (statError) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    return callFailureCallback(callback, statError);
                }
                return callSuccessCallback(callback, lstat);
            }
            if (settings.markSymbolicLink) {
                stat.isSymbolicLink = () => true;
            }
            callSuccessCallback(callback, stat);
        });
    });
}
exports.read = read;
function callFailureCallback(callback, error) {
    callback(error);
}
function callSuccessCallback(callback, result) {
    callback(null, result);
}


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function read(path, settings) {
    const lstat = settings.fs.lstatSync(path);
    if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
        return lstat;
    }
    try {
        const stat = settings.fs.statSync(path);
        if (settings.markSymbolicLink) {
            stat.isSymbolicLink = () => true;
        }
        return stat;
    }
    catch (error) {
        if (!settings.throwErrorOnBrokenSymbolicLink) {
            return lstat;
        }
        throw error;
    }
}
exports.read = read;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(91);
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
        this.fs = fs.createFileSystemAdapter(this._options.fs);
        this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
}
exports.default = Settings;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(6);
exports.FILE_SYSTEM_ADAPTER = {
    lstat: fs.lstat,
    stat: fs.stat,
    lstatSync: fs.lstatSync,
    statSync: fs.statSync
};
function createFileSystemAdapter(fsMethods) {
    if (!fsMethods) {
        return exports.FILE_SYSTEM_ADAPTER;
    }
    return Object.assign({}, exports.FILE_SYSTEM_ADAPTER, fsMethods);
}
exports.createFileSystemAdapter = createFileSystemAdapter;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = __webpack_require__(93);
const stream_1 = __webpack_require__(113);
const sync_1 = __webpack_require__(114);
const settings_1 = __webpack_require__(116);
exports.Settings = settings_1.default;
function walk(dir, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        return new async_1.default(dir, getSettings()).read(optionsOrSettingsOrCallback);
    }
    new async_1.default(dir, getSettings(optionsOrSettingsOrCallback)).read(callback);
}
exports.walk = walk;
function walkSync(dir, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    const provider = new sync_1.default(dir, settings);
    return provider.read();
}
exports.walkSync = walkSync;
function walkStream(dir, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    const provider = new stream_1.default(dir, settings);
    return provider.read();
}
exports.walkStream = walkStream;
function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
}


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = __webpack_require__(94);
class AsyncProvider {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._storage = new Set();
    }
    read(callback) {
        this._reader.onError((error) => {
            callFailureCallback(callback, error);
        });
        this._reader.onEntry((entry) => {
            this._storage.add(entry);
        });
        this._reader.onEnd(() => {
            callSuccessCallback(callback, Array.from(this._storage));
        });
        this._reader.read();
    }
}
exports.default = AsyncProvider;
function callFailureCallback(callback, error) {
    callback(error);
}
function callSuccessCallback(callback, entries) {
    callback(null, entries);
}


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __webpack_require__(48);
const fsScandir = __webpack_require__(95);
const fastq = __webpack_require__(109);
const common = __webpack_require__(111);
const reader_1 = __webpack_require__(112);
class AsyncReader extends reader_1.default {
    constructor(_root, _settings) {
        super(_root, _settings);
        this._settings = _settings;
        this._scandir = fsScandir.scandir;
        this._emitter = new events_1.EventEmitter();
        this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
        this._isFatalError = false;
        this._isDestroyed = false;
        this._queue.drain = () => {
            if (!this._isFatalError) {
                this._emitter.emit('end');
            }
        };
    }
    read() {
        this._isFatalError = false;
        this._isDestroyed = false;
        setImmediate(() => {
            this._pushToQueue(this._root, this._settings.basePath);
        });
        return this._emitter;
    }
    destroy() {
        if (this._isDestroyed) {
            throw new Error('The reader is already destroyed');
        }
        this._isDestroyed = true;
        this._queue.killAndDrain();
    }
    onEntry(callback) {
        this._emitter.on('entry', callback);
    }
    onError(callback) {
        this._emitter.once('error', callback);
    }
    onEnd(callback) {
        this._emitter.once('end', callback);
    }
    _pushToQueue(dir, base) {
        const queueItem = { dir, base };
        this._queue.push(queueItem, (error) => {
            if (error) {
                this._handleError(error);
            }
        });
    }
    _worker(item, done) {
        this._scandir(item.dir, this._settings.fsScandirSettings, (error, entries) => {
            if (error) {
                return done(error, undefined);
            }
            for (const entry of entries) {
                this._handleEntry(entry, item.base);
            }
            done(null, undefined);
        });
    }
    _handleError(error) {
        if (!common.isFatalError(this._settings, error)) {
            return;
        }
        this._isFatalError = true;
        this._isDestroyed = true;
        this._emitter.emit('error', error);
    }
    _handleEntry(entry, base) {
        if (this._isDestroyed || this._isFatalError) {
            return;
        }
        const fullpath = entry.path;
        if (base !== undefined) {
            entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
            this._emitEntry(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
            this._pushToQueue(fullpath, entry.path);
        }
    }
    _emitEntry(entry) {
        this._emitter.emit('entry', entry);
    }
}
exports.default = AsyncReader;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async = __webpack_require__(96);
const sync = __webpack_require__(106);
const settings_1 = __webpack_require__(107);
exports.Settings = settings_1.default;
function scandir(path, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        return async.read(path, getSettings(), optionsOrSettingsOrCallback);
    }
    async.read(path, getSettings(optionsOrSettingsOrCallback), callback);
}
exports.scandir = scandir;
function scandirSync(path, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    return sync.read(path, settings);
}
exports.scandirSync = scandirSync;
function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
}


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsStat = __webpack_require__(97);
const rpl = __webpack_require__(102);
const constants_1 = __webpack_require__(103);
const utils = __webpack_require__(104);
function read(dir, settings, callback) {
    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(dir, settings, callback);
    }
    return readdir(dir, settings, callback);
}
exports.read = read;
function readdirWithFileTypes(dir, settings, callback) {
    settings.fs.readdir(dir, { withFileTypes: true }, (readdirError, dirents) => {
        if (readdirError) {
            return callFailureCallback(callback, readdirError);
        }
        const entries = dirents.map((dirent) => ({
            dirent,
            name: dirent.name,
            path: `${dir}${settings.pathSegmentSeparator}${dirent.name}`
        }));
        if (!settings.followSymbolicLinks) {
            return callSuccessCallback(callback, entries);
        }
        const tasks = entries.map((entry) => makeRplTaskEntry(entry, settings));
        rpl(tasks, (rplError, rplEntries) => {
            if (rplError) {
                return callFailureCallback(callback, rplError);
            }
            callSuccessCallback(callback, rplEntries);
        });
    });
}
exports.readdirWithFileTypes = readdirWithFileTypes;
function makeRplTaskEntry(entry, settings) {
    return (done) => {
        if (!entry.dirent.isSymbolicLink()) {
            return done(null, entry);
        }
        settings.fs.stat(entry.path, (statError, stats) => {
            if (statError) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    return done(statError);
                }
                return done(null, entry);
            }
            entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
            return done(null, entry);
        });
    };
}
function readdir(dir, settings, callback) {
    settings.fs.readdir(dir, (readdirError, names) => {
        if (readdirError) {
            return callFailureCallback(callback, readdirError);
        }
        const filepaths = names.map((name) => `${dir}${settings.pathSegmentSeparator}${name}`);
        const tasks = filepaths.map((filepath) => {
            return (done) => fsStat.stat(filepath, settings.fsStatSettings, done);
        });
        rpl(tasks, (rplError, results) => {
            if (rplError) {
                return callFailureCallback(callback, rplError);
            }
            const entries = [];
            for (let index = 0; index < names.length; index++) {
                const name = names[index];
                const stats = results[index];
                const entry = {
                    name,
                    path: filepaths[index],
                    dirent: utils.fs.createDirentFromStats(name, stats)
                };
                if (settings.stats) {
                    entry.stats = stats;
                }
                entries.push(entry);
            }
            callSuccessCallback(callback, entries);
        });
    });
}
exports.readdir = readdir;
function callFailureCallback(callback, error) {
    callback(error);
}
function callSuccessCallback(callback, result) {
    callback(null, result);
}


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async = __webpack_require__(98);
const sync = __webpack_require__(99);
const settings_1 = __webpack_require__(100);
exports.Settings = settings_1.default;
function stat(path, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        return async.read(path, getSettings(), optionsOrSettingsOrCallback);
    }
    async.read(path, getSettings(optionsOrSettingsOrCallback), callback);
}
exports.stat = stat;
function statSync(path, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    return sync.read(path, settings);
}
exports.statSync = statSync;
function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
}


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function read(path, settings, callback) {
    settings.fs.lstat(path, (lstatError, lstat) => {
        if (lstatError) {
            return callFailureCallback(callback, lstatError);
        }
        if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
            return callSuccessCallback(callback, lstat);
        }
        settings.fs.stat(path, (statError, stat) => {
            if (statError) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    return callFailureCallback(callback, statError);
                }
                return callSuccessCallback(callback, lstat);
            }
            if (settings.markSymbolicLink) {
                stat.isSymbolicLink = () => true;
            }
            callSuccessCallback(callback, stat);
        });
    });
}
exports.read = read;
function callFailureCallback(callback, error) {
    callback(error);
}
function callSuccessCallback(callback, result) {
    callback(null, result);
}


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function read(path, settings) {
    const lstat = settings.fs.lstatSync(path);
    if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
        return lstat;
    }
    try {
        const stat = settings.fs.statSync(path);
        if (settings.markSymbolicLink) {
            stat.isSymbolicLink = () => true;
        }
        return stat;
    }
    catch (error) {
        if (!settings.throwErrorOnBrokenSymbolicLink) {
            return lstat;
        }
        throw error;
    }
}
exports.read = read;


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(101);
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
        this.fs = fs.createFileSystemAdapter(this._options.fs);
        this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
}
exports.default = Settings;


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(6);
exports.FILE_SYSTEM_ADAPTER = {
    lstat: fs.lstat,
    stat: fs.stat,
    lstatSync: fs.lstatSync,
    statSync: fs.statSync
};
function createFileSystemAdapter(fsMethods) {
    if (!fsMethods) {
        return exports.FILE_SYSTEM_ADAPTER;
    }
    return Object.assign({}, exports.FILE_SYSTEM_ADAPTER, fsMethods);
}
exports.createFileSystemAdapter = createFileSystemAdapter;


/***/ }),
/* 102 */
/***/ (function(module, exports) {

module.exports = runParallel

function runParallel (tasks, cb) {
  var results, pending, keys
  var isSync = true

  if (Array.isArray(tasks)) {
    results = []
    pending = tasks.length
  } else {
    keys = Object.keys(tasks)
    results = {}
    pending = keys.length
  }

  function done (err) {
    function end () {
      if (cb) cb(err, results)
      cb = null
    }
    if (isSync) process.nextTick(end)
    else end()
  }

  function each (i, err, result) {
    results[i] = result
    if (--pending === 0 || err) {
      done(err)
    }
  }

  if (!pending) {
    // empty
    done(null)
  } else if (keys) {
    // object
    keys.forEach(function (key) {
      tasks[key](function (err, result) { each(key, err, result) })
    })
  } else {
    // array
    tasks.forEach(function (task, i) {
      task(function (err, result) { each(i, err, result) })
    })
  }

  isSync = false
}


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const NODE_PROCESS_VERSION_PARTS = process.versions.node.split('.');
const MAJOR_VERSION = parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
const MINOR_VERSION = parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
/**
 * IS `true` for Node.js 10.10 and greater.
 */
exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = MAJOR_VERSION > 10 || (MAJOR_VERSION === 10 && MINOR_VERSION >= 10);


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(105);
exports.fs = fs;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class DirentFromStats {
    constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
    }
}
function createDirentFromStats(name, stats) {
    return new DirentFromStats(name, stats);
}
exports.createDirentFromStats = createDirentFromStats;


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsStat = __webpack_require__(97);
const constants_1 = __webpack_require__(103);
const utils = __webpack_require__(104);
function read(dir, settings) {
    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(dir, settings);
    }
    return readdir(dir, settings);
}
exports.read = read;
function readdirWithFileTypes(dir, settings) {
    const dirents = settings.fs.readdirSync(dir, { withFileTypes: true });
    return dirents.map((dirent) => {
        const entry = {
            dirent,
            name: dirent.name,
            path: `${dir}${settings.pathSegmentSeparator}${dirent.name}`
        };
        if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) {
            try {
                const stats = settings.fs.statSync(entry.path);
                entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
            }
            catch (error) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    throw error;
                }
            }
        }
        return entry;
    });
}
exports.readdirWithFileTypes = readdirWithFileTypes;
function readdir(dir, settings) {
    const names = settings.fs.readdirSync(dir);
    return names.map((name) => {
        const entryPath = `${dir}${settings.pathSegmentSeparator}${name}`;
        const stats = fsStat.statSync(entryPath, settings.fsStatSettings);
        const entry = {
            name,
            path: entryPath,
            dirent: utils.fs.createDirentFromStats(name, stats)
        };
        if (settings.stats) {
            entry.stats = stats;
        }
        return entry;
    });
}
exports.readdir = readdir;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(8);
const fsStat = __webpack_require__(97);
const fs = __webpack_require__(108);
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
        this.fs = fs.createFileSystemAdapter(this._options.fs);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path.sep);
        this.stats = this._getValue(this._options.stats, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
        this.fsStatSettings = new fsStat.Settings({
            followSymbolicLink: this.followSymbolicLinks,
            fs: this.fs,
            throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
        });
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
}
exports.default = Settings;


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(6);
exports.FILE_SYSTEM_ADAPTER = {
    lstat: fs.lstat,
    stat: fs.stat,
    lstatSync: fs.lstatSync,
    statSync: fs.statSync,
    readdir: fs.readdir,
    readdirSync: fs.readdirSync
};
function createFileSystemAdapter(fsMethods) {
    if (!fsMethods) {
        return exports.FILE_SYSTEM_ADAPTER;
    }
    return Object.assign({}, exports.FILE_SYSTEM_ADAPTER, fsMethods);
}
exports.createFileSystemAdapter = createFileSystemAdapter;


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var reusify = __webpack_require__(110)

function fastqueue (context, worker, concurrency) {
  if (typeof context === 'function') {
    concurrency = worker
    worker = context
    context = null
  }

  var cache = reusify(Task)
  var queueHead = null
  var queueTail = null
  var _running = 0

  var self = {
    push: push,
    drain: noop,
    saturated: noop,
    pause: pause,
    paused: false,
    concurrency: concurrency,
    running: running,
    resume: resume,
    idle: idle,
    length: length,
    unshift: unshift,
    empty: noop,
    kill: kill,
    killAndDrain: killAndDrain
  }

  return self

  function running () {
    return _running
  }

  function pause () {
    self.paused = true
  }

  function length () {
    var current = queueHead
    var counter = 0

    while (current) {
      current = current.next
      counter++
    }

    return counter
  }

  function resume () {
    if (!self.paused) return
    self.paused = false
    for (var i = 0; i < self.concurrency; i++) {
      _running++
      release()
    }
  }

  function idle () {
    return _running === 0 && self.length() === 0
  }

  function push (value, done) {
    var current = cache.get()

    current.context = context
    current.release = release
    current.value = value
    current.callback = done || noop

    if (_running === self.concurrency || self.paused) {
      if (queueTail) {
        queueTail.next = current
        queueTail = current
      } else {
        queueHead = current
        queueTail = current
        self.saturated()
      }
    } else {
      _running++
      worker.call(context, current.value, current.worked)
    }
  }

  function unshift (value, done) {
    var current = cache.get()

    current.context = context
    current.release = release
    current.value = value
    current.callback = done || noop

    if (_running === self.concurrency || self.paused) {
      if (queueHead) {
        current.next = queueHead
        queueHead = current
      } else {
        queueHead = current
        queueTail = current
        self.saturated()
      }
    } else {
      _running++
      worker.call(context, current.value, current.worked)
    }
  }

  function release (holder) {
    if (holder) {
      cache.release(holder)
    }
    var next = queueHead
    if (next) {
      if (!self.paused) {
        if (queueTail === queueHead) {
          queueTail = null
        }
        queueHead = next.next
        next.next = null
        worker.call(context, next.value, next.worked)
        if (queueTail === null) {
          self.empty()
        }
      } else {
        _running--
      }
    } else if (--_running === 0) {
      self.drain()
    }
  }

  function kill () {
    queueHead = null
    queueTail = null
    self.drain = noop
  }

  function killAndDrain () {
    queueHead = null
    queueTail = null
    self.drain()
    self.drain = noop
  }
}

function noop () {}

function Task () {
  this.value = null
  this.callback = noop
  this.next = null
  this.release = noop
  this.context = null

  var self = this

  this.worked = function worked (err, result) {
    var callback = self.callback
    self.value = null
    self.callback = noop
    callback.call(self.context, err, result)
    self.release(self)
  }
}

module.exports = fastqueue


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function reusify (Constructor) {
  var head = new Constructor()
  var tail = head

  function get () {
    var current = head

    if (current.next) {
      head = current.next
    } else {
      head = new Constructor()
      tail = head
    }

    current.next = null

    return current
  }

  function release (obj) {
    tail.next = obj
    tail = obj
  }

  return {
    get: get,
    release: release
  }
}

module.exports = reusify


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isFatalError(settings, error) {
    if (settings.errorFilter === null) {
        return true;
    }
    return !settings.errorFilter(error);
}
exports.isFatalError = isFatalError;
function isAppliedFilter(filter, value) {
    return filter === null || filter(value);
}
exports.isAppliedFilter = isAppliedFilter;
function replacePathSegmentSeparator(filepath, separator) {
    return filepath.split(/[\\\/]/).join(separator);
}
exports.replacePathSegmentSeparator = replacePathSegmentSeparator;
function joinPathSegments(a, b, separator) {
    if (a === '') {
        return b;
    }
    return a + separator + b;
}
exports.joinPathSegments = joinPathSegments;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common = __webpack_require__(111);
class Reader {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
    }
}
exports.default = Reader;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(38);
const async_1 = __webpack_require__(94);
class StreamProvider {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._stream = new stream_1.Readable({
            objectMode: true,
            read: () => { },
            destroy: this._reader.destroy.bind(this._reader)
        });
    }
    read() {
        this._reader.onError((error) => {
            this._stream.emit('error', error);
        });
        this._reader.onEntry((entry) => {
            this._stream.push(entry);
        });
        this._reader.onEnd(() => {
            this._stream.push(null);
        });
        this._reader.read();
        return this._stream;
    }
}
exports.default = StreamProvider;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const sync_1 = __webpack_require__(115);
class SyncProvider {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new sync_1.default(this._root, this._settings);
    }
    read() {
        return this._reader.read();
    }
}
exports.default = SyncProvider;


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsScandir = __webpack_require__(95);
const common = __webpack_require__(111);
const reader_1 = __webpack_require__(112);
class SyncReader extends reader_1.default {
    constructor() {
        super(...arguments);
        this._scandir = fsScandir.scandirSync;
        this._storage = new Set();
        this._queue = new Set();
    }
    read() {
        this._pushToQueue(this._root, this._settings.basePath);
        this._handleQueue();
        return Array.from(this._storage);
    }
    _pushToQueue(dir, base) {
        this._queue.add({ dir, base });
    }
    _handleQueue() {
        for (const item of this._queue.values()) {
            this._handleDirectory(item.dir, item.base);
        }
    }
    _handleDirectory(dir, base) {
        try {
            const entries = this._scandir(dir, this._settings.fsScandirSettings);
            for (const entry of entries) {
                this._handleEntry(entry, base);
            }
        }
        catch (error) {
            this._handleError(error);
        }
    }
    _handleError(error) {
        if (!common.isFatalError(this._settings, error)) {
            return;
        }
        throw error;
    }
    _handleEntry(entry, base) {
        const fullpath = entry.path;
        if (base !== undefined) {
            entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
            this._pushToStorage(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
            this._pushToQueue(fullpath, entry.path);
        }
    }
    _pushToStorage(entry) {
        this._storage.add(entry);
    }
}
exports.default = SyncReader;


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(8);
const fsScandir = __webpack_require__(95);
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.basePath = this._getValue(this._options.basePath, undefined);
        this.concurrency = this._getValue(this._options.concurrency, Infinity);
        this.deepFilter = this._getValue(this._options.deepFilter, null);
        this.entryFilter = this._getValue(this._options.entryFilter, null);
        this.errorFilter = this._getValue(this._options.errorFilter, null);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path.sep);
        this.fsScandirSettings = new fsScandir.Settings({
            followSymbolicLinks: this._options.followSymbolicLinks,
            fs: this._options.fs,
            pathSegmentSeparator: this._options.pathSegmentSeparator,
            stats: this._options.stats,
            throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
        });
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
}
exports.default = Settings;


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(8);
const fsStat = __webpack_require__(87);
const utils = __webpack_require__(58);
class Reader {
    constructor(_settings) {
        this._settings = _settings;
        this._fsStatSettings = new fsStat.Settings({
            followSymbolicLink: this._settings.followSymbolicLinks,
            fs: this._settings.fs,
            throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
        });
    }
    _getFullEntryPath(filepath) {
        return path.resolve(this._settings.cwd, filepath);
    }
    _makeEntry(stats, pattern) {
        const entry = {
            name: pattern,
            path: pattern,
            dirent: utils.fs.createDirentFromStats(pattern, stats)
        };
        if (this._settings.stats) {
            entry.stats = stats;
        }
        return entry;
    }
    _isFatalError(error) {
        return !utils.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
    }
}
exports.default = Reader;


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(8);
const deep_1 = __webpack_require__(119);
const entry_1 = __webpack_require__(120);
const error_1 = __webpack_require__(121);
const entry_2 = __webpack_require__(122);
class Provider {
    constructor(_settings) {
        this._settings = _settings;
        this.errorFilter = new error_1.default(this._settings);
        this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
        this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
        this.entryTransformer = new entry_2.default(this._settings);
    }
    _getRootDirectory(task) {
        return path.resolve(this._settings.cwd, task.base);
    }
    _getReaderOptions(task) {
        const basePath = task.base === '.' ? '' : task.base;
        return {
            basePath,
            pathSegmentSeparator: '/',
            concurrency: this._settings.concurrency,
            deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
            entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
            errorFilter: this.errorFilter.getFilter(),
            followSymbolicLinks: this._settings.followSymbolicLinks,
            fs: this._settings.fs,
            stats: this._settings.stats,
            throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
            transform: this.entryTransformer.getTransformer()
        };
    }
    _getMicromatchOptions() {
        return {
            dot: this._settings.dot,
            matchBase: this._settings.baseNameMatch,
            nobrace: !this._settings.braceExpansion,
            nocase: !this._settings.caseSensitiveMatch,
            noext: !this._settings.extglob,
            noglobstar: !this._settings.globstar,
            posix: true
        };
    }
}
exports.default = Provider;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(58);
class DeepFilter {
    constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
    }
    getFilter(basePath, positive, negative) {
        const maxPatternDepth = this._getMaxPatternDepth(positive);
        const negativeRe = this._getNegativePatternsRe(negative);
        return (entry) => this._filter(basePath, entry, negativeRe, maxPatternDepth);
    }
    _getMaxPatternDepth(patterns) {
        const globstar = patterns.some(utils.pattern.hasGlobStar);
        return globstar ? Infinity : utils.pattern.getMaxNaivePatternsDepth(patterns);
    }
    _getNegativePatternsRe(patterns) {
        const affectDepthOfReadingPatterns = patterns.filter(utils.pattern.isAffectDepthOfReadingPattern);
        return utils.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
    }
    _filter(basePath, entry, negativeRe, maxPatternDepth) {
        const depth = this._getEntryDepth(basePath, entry.path);
        if (this._isSkippedByDeep(depth)) {
            return false;
        }
        if (this._isSkippedByMaxPatternDepth(depth, maxPatternDepth)) {
            return false;
        }
        if (this._isSkippedSymbolicLink(entry)) {
            return false;
        }
        if (this._isSkippedDotDirectory(entry)) {
            return false;
        }
        return this._isSkippedByNegativePatterns(entry, negativeRe);
    }
    _getEntryDepth(basePath, entryPath) {
        const basePathDepth = basePath.split('/').length;
        const entryPathDepth = entryPath.split('/').length;
        return entryPathDepth - (basePath === '' ? 0 : basePathDepth);
    }
    _isSkippedByDeep(entryDepth) {
        return entryDepth >= this._settings.deep;
    }
    _isSkippedByMaxPatternDepth(entryDepth, maxPatternDepth) {
        return !this._settings.baseNameMatch && maxPatternDepth !== Infinity && entryDepth > maxPatternDepth;
    }
    _isSkippedSymbolicLink(entry) {
        return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
    }
    _isSkippedDotDirectory(entry) {
        return !this._settings.dot && entry.name.startsWith('.');
    }
    _isSkippedByNegativePatterns(entry, negativeRe) {
        return !utils.pattern.matchAny(entry.path, negativeRe);
    }
}
exports.default = DeepFilter;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(58);
class EntryFilter {
    constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this.index = new Map();
    }
    getFilter(positive, negative) {
        const positiveRe = utils.pattern.convertPatternsToRe(positive, this._micromatchOptions);
        const negativeRe = utils.pattern.convertPatternsToRe(negative, this._micromatchOptions);
        return (entry) => this._filter(entry, positiveRe, negativeRe);
    }
    _filter(entry, positiveRe, negativeRe) {
        if (this._settings.unique) {
            if (this._isDuplicateEntry(entry)) {
                return false;
            }
            this._createIndexRecord(entry);
        }
        if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) {
            return false;
        }
        if (this._isSkippedByAbsoluteNegativePatterns(entry, negativeRe)) {
            return false;
        }
        const filepath = this._settings.baseNameMatch ? entry.name : entry.path;
        return this._isMatchToPatterns(filepath, positiveRe) && !this._isMatchToPatterns(entry.path, negativeRe);
    }
    _isDuplicateEntry(entry) {
        return this.index.has(entry.path);
    }
    _createIndexRecord(entry) {
        this.index.set(entry.path, undefined);
    }
    _onlyFileFilter(entry) {
        return this._settings.onlyFiles && !entry.dirent.isFile();
    }
    _onlyDirectoryFilter(entry) {
        return this._settings.onlyDirectories && !entry.dirent.isDirectory();
    }
    _isSkippedByAbsoluteNegativePatterns(entry, negativeRe) {
        if (!this._settings.absolute) {
            return false;
        }
        const fullpath = utils.path.makeAbsolute(this._settings.cwd, entry.path);
        return this._isMatchToPatterns(fullpath, negativeRe);
    }
    _isMatchToPatterns(filepath, patternsRe) {
        return utils.pattern.matchAny(filepath, patternsRe);
    }
}
exports.default = EntryFilter;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(58);
class ErrorFilter {
    constructor(_settings) {
        this._settings = _settings;
    }
    getFilter() {
        return (error) => this._isNonFatalError(error);
    }
    _isNonFatalError(error) {
        return utils.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
    }
}
exports.default = ErrorFilter;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(58);
class EntryTransformer {
    constructor(_settings) {
        this._settings = _settings;
    }
    getTransformer() {
        return (entry) => this._transform(entry);
    }
    _transform(entry) {
        let filepath = entry.path;
        if (this._settings.absolute) {
            filepath = utils.path.makeAbsolute(this._settings.cwd, filepath);
            filepath = utils.path.unixify(filepath);
        }
        if (this._settings.markDirectories && entry.dirent.isDirectory()) {
            filepath += '/';
        }
        if (!this._settings.objectMode) {
            return filepath;
        }
        return Object.assign({}, entry, { path: filepath });
    }
}
exports.default = EntryTransformer;


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(38);
const stream_2 = __webpack_require__(86);
const provider_1 = __webpack_require__(118);
class ProviderStream extends provider_1.default {
    constructor() {
        super(...arguments);
        this._reader = new stream_2.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const source = this.api(root, task, options);
        const dest = new stream_1.Readable({ objectMode: true, read: () => { } });
        source
            .once('error', (error) => dest.emit('error', error))
            .on('data', (entry) => dest.emit('data', options.transform(entry)))
            .once('end', () => dest.emit('end'));
        return dest;
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
    }
}
exports.default = ProviderStream;


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const sync_1 = __webpack_require__(125);
const provider_1 = __webpack_require__(118);
class ProviderSync extends provider_1.default {
    constructor() {
        super(...arguments);
        this._reader = new sync_1.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = this.api(root, task, options);
        return entries.map(options.transform);
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
    }
}
exports.default = ProviderSync;


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsStat = __webpack_require__(87);
const fsWalk = __webpack_require__(92);
const reader_1 = __webpack_require__(117);
class ReaderSync extends reader_1.default {
    constructor() {
        super(...arguments);
        this._walkSync = fsWalk.walkSync;
        this._statSync = fsStat.statSync;
    }
    dynamic(root, options) {
        return this._walkSync(root, options);
    }
    static(patterns, options) {
        const entries = [];
        for (const pattern of patterns) {
            const filepath = this._getFullEntryPath(pattern);
            const entry = this._getEntry(filepath, pattern, options);
            if (entry === null || !options.entryFilter(entry)) {
                continue;
            }
            entries.push(entry);
        }
        return entries;
    }
    _getEntry(filepath, pattern, options) {
        try {
            const stats = this._getStat(filepath);
            return this._makeEntry(stats, pattern);
        }
        catch (error) {
            if (options.errorFilter(error)) {
                return null;
            }
            throw error;
        }
    }
    _getStat(filepath) {
        return this._statSync(filepath, this._fsStatSettings);
    }
}
exports.default = ReaderSync;


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(6);
const os = __webpack_require__(17);
const CPU_COUNT = os.cpus().length;
exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
    lstat: fs.lstat,
    lstatSync: fs.lstatSync,
    stat: fs.stat,
    statSync: fs.statSync,
    readdir: fs.readdir,
    readdirSync: fs.readdirSync
};
// tslint:enable no-redundant-jsdoc
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.absolute = this._getValue(this._options.absolute, false);
        this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
        this.braceExpansion = this._getValue(this._options.braceExpansion, true);
        this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
        this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
        this.cwd = this._getValue(this._options.cwd, process.cwd());
        this.deep = this._getValue(this._options.deep, Infinity);
        this.dot = this._getValue(this._options.dot, false);
        this.extglob = this._getValue(this._options.extglob, true);
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
        this.fs = this._getFileSystemMethods(this._options.fs);
        this.globstar = this._getValue(this._options.globstar, true);
        this.ignore = this._getValue(this._options.ignore, []);
        this.markDirectories = this._getValue(this._options.markDirectories, false);
        this.objectMode = this._getValue(this._options.objectMode, false);
        this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
        this.onlyFiles = this._getValue(this._options.onlyFiles, true);
        this.stats = this._getValue(this._options.stats, false);
        this.suppressErrors = this._getValue(this._options.suppressErrors, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
        this.unique = this._getValue(this._options.unique, true);
        if (this.onlyDirectories) {
            this.onlyFiles = false;
        }
        if (this.stats) {
            this.objectMode = true;
        }
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
    _getFileSystemMethods(methods = {}) {
        return Object.assign({}, exports.DEFAULT_FILE_SYSTEM_ADAPTER, methods);
    }
}
exports.default = Settings;


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const path = __webpack_require__(8);
const pathType = __webpack_require__(128);

const getExtensions = extensions => extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0];

const getPath = (filepath, cwd) => {
	const pth = filepath[0] === '!' ? filepath.slice(1) : filepath;
	return path.isAbsolute(pth) ? pth : path.join(cwd, pth);
};

const addExtensions = (file, extensions) => {
	if (path.extname(file)) {
		return `**/${file}`;
	}

	return `**/${file}.${getExtensions(extensions)}`;
};

const getGlob = (directory, options) => {
	if (options.files && !Array.isArray(options.files)) {
		throw new TypeError(`Expected \`files\` to be of type \`Array\` but received type \`${typeof options.files}\``);
	}

	if (options.extensions && !Array.isArray(options.extensions)) {
		throw new TypeError(`Expected \`extensions\` to be of type \`Array\` but received type \`${typeof options.extensions}\``);
	}

	if (options.files && options.extensions) {
		return options.files.map(x => path.posix.join(directory, addExtensions(x, options.extensions)));
	}

	if (options.files) {
		return options.files.map(x => path.posix.join(directory, `**/${x}`));
	}

	if (options.extensions) {
		return [path.posix.join(directory, `**/*.${getExtensions(options.extensions)}`)];
	}

	return [path.posix.join(directory, '**')];
};

module.exports = async (input, options) => {
	options = {
		cwd: process.cwd(),
		...options
	};

	if (typeof options.cwd !== 'string') {
		throw new TypeError(`Expected \`cwd\` to be of type \`string\` but received type \`${typeof options.cwd}\``);
	}

	const globs = await Promise.all([].concat(input).map(async x => {
		const isDirectory = await pathType.isDirectory(getPath(x, options.cwd));
		return isDirectory ? getGlob(x, options) : x;
	}));

	return [].concat.apply([], globs); // eslint-disable-line prefer-spread
};

module.exports.sync = (input, options) => {
	options = {
		cwd: process.cwd(),
		...options
	};

	if (typeof options.cwd !== 'string') {
		throw new TypeError(`Expected \`cwd\` to be of type \`string\` but received type \`${typeof options.cwd}\``);
	}

	const globs = [].concat(input).map(x => pathType.isDirectorySync(getPath(x, options.cwd)) ? getGlob(x, options) : x);

	return [].concat.apply([], globs); // eslint-disable-line prefer-spread
};


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const {promisify} = __webpack_require__(15);
const fs = __webpack_require__(6);

async function isType(fsStatType, statsMethodName, filePath) {
	if (typeof filePath !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof filePath}`);
	}

	try {
		const stats = await promisify(fs[fsStatType])(filePath);
		return stats[statsMethodName]();
	} catch (error) {
		if (error.code === 'ENOENT') {
			return false;
		}

		throw error;
	}
}

function isTypeSync(fsStatType, statsMethodName, filePath) {
	if (typeof filePath !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof filePath}`);
	}

	try {
		return fs[fsStatType](filePath)[statsMethodName]();
	} catch (error) {
		if (error.code === 'ENOENT') {
			return false;
		}

		throw error;
	}
}

exports.isFile = isType.bind(null, 'stat', 'isFile');
exports.isDirectory = isType.bind(null, 'stat', 'isDirectory');
exports.isSymlink = isType.bind(null, 'lstat', 'isSymbolicLink');
exports.isFileSync = isTypeSync.bind(null, 'statSync', 'isFile');
exports.isDirectorySync = isTypeSync.bind(null, 'statSync', 'isDirectory');
exports.isSymlinkSync = isTypeSync.bind(null, 'lstatSync', 'isSymbolicLink');


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const {promisify} = __webpack_require__(15);
const fs = __webpack_require__(6);
const path = __webpack_require__(8);
const fastGlob = __webpack_require__(56);
const gitIgnore = __webpack_require__(130);
const slash = __webpack_require__(131);

const DEFAULT_IGNORE = [
	'**/node_modules/**',
	'**/flow-typed/**',
	'**/coverage/**',
	'**/.git'
];

const readFileP = promisify(fs.readFile);

const mapGitIgnorePatternTo = base => ignore => {
	if (ignore.startsWith('!')) {
		return '!' + path.posix.join(base, ignore.slice(1));
	}

	return path.posix.join(base, ignore);
};

const parseGitIgnore = (content, options) => {
	const base = slash(path.relative(options.cwd, path.dirname(options.fileName)));

	return content
		.split(/\r?\n/)
		.filter(Boolean)
		.filter(line => !line.startsWith('#'))
		.map(mapGitIgnorePatternTo(base));
};

const reduceIgnore = files => {
	return files.reduce((ignores, file) => {
		ignores.add(parseGitIgnore(file.content, {
			cwd: file.cwd,
			fileName: file.filePath
		}));
		return ignores;
	}, gitIgnore());
};

const ensureAbsolutePathForCwd = (cwd, p) => {
	if (path.isAbsolute(p)) {
		if (p.startsWith(cwd)) {
			return p;
		}

		throw new Error(`Path ${p} is not in cwd ${cwd}`);
	}

	return path.join(cwd, p);
};

const getIsIgnoredPredecate = (ignores, cwd) => {
	return p => ignores.ignores(slash(path.relative(cwd, ensureAbsolutePathForCwd(cwd, p))));
};

const getFile = async (file, cwd) => {
	const filePath = path.join(cwd, file);
	const content = await readFileP(filePath, 'utf8');

	return {
		cwd,
		filePath,
		content
	};
};

const getFileSync = (file, cwd) => {
	const filePath = path.join(cwd, file);
	const content = fs.readFileSync(filePath, 'utf8');

	return {
		cwd,
		filePath,
		content
	};
};

const normalizeOptions = ({
	ignore = [],
	cwd = process.cwd()
} = {}) => {
	return {ignore, cwd};
};

module.exports = async options => {
	options = normalizeOptions(options);

	const paths = await fastGlob('**/.gitignore', {
		ignore: DEFAULT_IGNORE.concat(options.ignore),
		cwd: options.cwd
	});

	const files = await Promise.all(paths.map(file => getFile(file, options.cwd)));
	const ignores = reduceIgnore(files);

	return getIsIgnoredPredecate(ignores, options.cwd);
};

module.exports.sync = options => {
	options = normalizeOptions(options);

	const paths = fastGlob.sync('**/.gitignore', {
		ignore: DEFAULT_IGNORE.concat(options.ignore),
		cwd: options.cwd
	});

	const files = paths.map(file => getFileSync(file, options.cwd));
	const ignores = reduceIgnore(files);

	return getIsIgnoredPredecate(ignores, options.cwd);
};


/***/ }),
/* 130 */
/***/ (function(module, exports) {

// A simple implementation of make-array
function makeArray (subject) {
  return Array.isArray(subject)
    ? subject
    : [subject]
}

const REGEX_TEST_BLANK_LINE = /^\s+$/
const REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/
const REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/
const REGEX_SPLITALL_CRLF = /\r?\n/g
// /foo,
// ./foo,
// ../foo,
// .
// ..
const REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/

const SLASH = '/'
const KEY_IGNORE = typeof Symbol !== 'undefined'
  ? Symbol.for('node-ignore')
  /* istanbul ignore next */
  : 'node-ignore'

const define = (object, key, value) =>
  Object.defineProperty(object, key, {value})

const REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g

// Sanitize the range of a regular expression
// The cases are complicated, see test cases for details
const sanitizeRange = range => range.replace(
  REGEX_REGEXP_RANGE,
  (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0)
    ? match
    // Invalid range (out of order) which is ok for gitignore rules but
    //   fatal for JavaScript regular expression, so eliminate it.
    : ''
)

// > If the pattern ends with a slash,
// > it is removed for the purpose of the following description,
// > but it would only find a match with a directory.
// > In other words, foo/ will match a directory foo and paths underneath it,
// > but will not match a regular file or a symbolic link foo
// >  (this is consistent with the way how pathspec works in general in Git).
// '`foo/`' will not match regular file '`foo`' or symbolic link '`foo`'
// -> ignore-rules will not deal with it, because it costs extra `fs.stat` call
//      you could use option `mark: true` with `glob`

// '`foo/`' should not continue with the '`..`'
const DEFAULT_REPLACER_PREFIX = [

  // > Trailing spaces are ignored unless they are quoted with backslash ("\")
  [
    // (a\ ) -> (a )
    // (a  ) -> (a)
    // (a \ ) -> (a  )
    /\\?\s+$/,
    match => match.indexOf('\\') === 0
      ? ' '
      : ''
  ],

  // replace (\ ) with ' '
  [
    /\\\s/g,
    () => ' '
  ],

  // Escape metacharacters
  // which is written down by users but means special for regular expressions.

  // > There are 12 characters with special meanings:
  // > - the backslash \,
  // > - the caret ^,
  // > - the dollar sign $,
  // > - the period or dot .,
  // > - the vertical bar or pipe symbol |,
  // > - the question mark ?,
  // > - the asterisk or star *,
  // > - the plus sign +,
  // > - the opening parenthesis (,
  // > - the closing parenthesis ),
  // > - and the opening square bracket [,
  // > - the opening curly brace {,
  // > These special characters are often called "metacharacters".
  [
    /[\\^$.|*+(){]/g,
    match => `\\${match}`
  ],

  [
    // > [abc] matches any character inside the brackets
    // >    (in this case a, b, or c);
    /\[([^\]/]*)($|\])/g,
    (match, p1, p2) => p2 === ']'
      ? `[${sanitizeRange(p1)}]`
      : `\\${match}`
  ],

  [
    // > a question mark (?) matches a single character
    /(?!\\)\?/g,
    () => '[^/]'
  ],

  // leading slash
  [

    // > A leading slash matches the beginning of the pathname.
    // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
    // A leading slash matches the beginning of the pathname
    /^\//,
    () => '^'
  ],

  // replace special metacharacter slash after the leading slash
  [
    /\//g,
    () => '\\/'
  ],

  [
    // > A leading "**" followed by a slash means match in all directories.
    // > For example, "**/foo" matches file or directory "foo" anywhere,
    // > the same as pattern "foo".
    // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
    // >   under directory "foo".
    // Notice that the '*'s have been replaced as '\\*'
    /^\^*\\\*\\\*\\\//,

    // '**/foo' <-> 'foo'
    () => '^(?:.*\\/)?'
  ]
]

const DEFAULT_REPLACER_SUFFIX = [
  // starting
  [
    // there will be no leading '/'
    //   (which has been replaced by section "leading slash")
    // If starts with '**', adding a '^' to the regular expression also works
    /^(?=[^^])/,
    function startingReplacer () {
      return !/\/(?!$)/.test(this)
        // > If the pattern does not contain a slash /,
        // >   Git treats it as a shell glob pattern
        // Actually, if there is only a trailing slash,
        //   git also treats it as a shell glob pattern
        ? '(?:^|\\/)'

        // > Otherwise, Git treats the pattern as a shell glob suitable for
        // >   consumption by fnmatch(3)
        : '^'
    }
  ],

  // two globstars
  [
    // Use lookahead assertions so that we could match more than one `'/**'`
    /\\\/\\\*\\\*(?=\\\/|$)/g,

    // Zero, one or several directories
    // should not use '*', or it will be replaced by the next replacer

    // Check if it is not the last `'/**'`
    (_, index, str) => index + 6 < str.length

      // case: /**/
      // > A slash followed by two consecutive asterisks then a slash matches
      // >   zero or more directories.
      // > For example, "a/**/b" matches "a/b", "a/x/b", "a/x/y/b" and so on.
      // '/**/'
      ? '(?:\\/[^\\/]+)*'

      // case: /**
      // > A trailing `"/**"` matches everything inside.

      // #21: everything inside but it should not include the current folder
      : '\\/.+'
  ],

  // intermediate wildcards
  [
    // Never replace escaped '*'
    // ignore rule '\*' will match the path '*'

    // 'abc.*/' -> go
    // 'abc.*'  -> skip this rule
    /(^|[^\\]+)\\\*(?=.+)/g,

    // '*.js' matches '.js'
    // '*.js' doesn't match 'abc'
    (_, p1) => `${p1}[^\\/]*`
  ],

  // trailing wildcard
  [
    /(\^|\\\/)?\\\*$/,
    (_, p1) => {
      const prefix = p1
        // '\^':
        // '/*' does not match ''
        // '/*' does not match everything

        // '\\\/':
        // 'abc/*' does not match 'abc/'
        ? `${p1}[^/]+`

        // 'a*' matches 'a'
        // 'a*' matches 'aa'
        : '[^/]*'

      return `${prefix}(?=$|\\/$)`
    }
  ],

  [
    // unescape
    /\\\\\\/g,
    () => '\\'
  ]
]

const POSITIVE_REPLACERS = [
  ...DEFAULT_REPLACER_PREFIX,

  // 'f'
  // matches
  // - /f(end)
  // - /f/
  // - (start)f(end)
  // - (start)f/
  // doesn't match
  // - oof
  // - foo
  // pseudo:
  // -> (^|/)f(/|$)

  // ending
  [
    // 'js' will not match 'js.'
    // 'ab' will not match 'abc'
    /(?:[^*/])$/,

    // 'js*' will not match 'a.js'
    // 'js/' will not match 'a.js'
    // 'js' will match 'a.js' and 'a.js/'
    match => `${match}(?=$|\\/)`
  ],

  ...DEFAULT_REPLACER_SUFFIX
]

const NEGATIVE_REPLACERS = [
  ...DEFAULT_REPLACER_PREFIX,

  // #24, #38
  // The MISSING rule of [gitignore docs](https://git-scm.com/docs/gitignore)
  // A negative pattern without a trailing wildcard should not
  // re-include the things inside that directory.

  // eg:
  // ['node_modules/*', '!node_modules']
  // should ignore `node_modules/a.js`
  [
    /(?:[^*])$/,
    match => `${match}(?=$|\\/$)`
  ],

  ...DEFAULT_REPLACER_SUFFIX
]

// A simple cache, because an ignore rule only has only one certain meaning
const regexCache = Object.create(null)

// @param {pattern}
const makeRegex = (pattern, negative, ignorecase) => {
  const r = regexCache[pattern]
  if (r) {
    return r
  }

  const replacers = negative
    ? NEGATIVE_REPLACERS
    : POSITIVE_REPLACERS

  const source = replacers.reduce(
    (prev, current) => prev.replace(current[0], current[1].bind(pattern)),
    pattern
  )

  return regexCache[pattern] = ignorecase
    ? new RegExp(source, 'i')
    : new RegExp(source)
}

const isString = subject => typeof subject === 'string'

// > A blank line matches no files, so it can serve as a separator for readability.
const checkPattern = pattern => pattern
  && isString(pattern)
  && !REGEX_TEST_BLANK_LINE.test(pattern)

  // > A line starting with # serves as a comment.
  && pattern.indexOf('#') !== 0

const splitPattern = pattern => pattern.split(REGEX_SPLITALL_CRLF)

class IgnoreRule {
  constructor (
    origin,
    pattern,
    negative,
    regex
  ) {
    this.origin = origin
    this.pattern = pattern
    this.negative = negative
    this.regex = regex
  }
}

const createRule = (pattern, ignorecase) => {
  const origin = pattern
  let negative = false

  // > An optional prefix "!" which negates the pattern;
  if (pattern.indexOf('!') === 0) {
    negative = true
    pattern = pattern.substr(1)
  }

  pattern = pattern
  // > Put a backslash ("\") in front of the first "!" for patterns that
  // >   begin with a literal "!", for example, `"\!important!.txt"`.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, '!')
  // > Put a backslash ("\") in front of the first hash for patterns that
  // >   begin with a hash.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, '#')

  const regex = makeRegex(pattern, negative, ignorecase)

  return new IgnoreRule(
    origin,
    pattern,
    negative,
    regex
  )
}

const throwError = (message, Ctor) => {
  throw new Ctor(message)
}

const checkPath = (path, originalPath, doThrow) => {
  if (!isString(path)) {
    return doThrow(
      `path must be a string, but got \`${originalPath}\``,
      TypeError
    )
  }

  // We don't know if we should ignore '', so throw
  if (!path) {
    return doThrow(`path must not be empty`, TypeError)
  }

  // Check if it is a relative path
  if (checkPath.isNotRelative(path)) {
    const r = '`path.relative()`d'
    return doThrow(
      `path should be a ${r} string, but got "${originalPath}"`,
      RangeError
    )
  }

  return true
}

const isNotRelative = path => REGEX_TEST_INVALID_PATH.test(path)

checkPath.isNotRelative = isNotRelative
checkPath.convert = p => p

class Ignore {
  constructor ({
    ignorecase = true
  } = {}) {
    this._rules = []
    this._ignorecase = ignorecase
    define(this, KEY_IGNORE, true)
    this._initCache()
  }

  _initCache () {
    this._ignoreCache = Object.create(null)
    this._testCache = Object.create(null)
  }

  _addPattern (pattern) {
    // #32
    if (pattern && pattern[KEY_IGNORE]) {
      this._rules = this._rules.concat(pattern._rules)
      this._added = true
      return
    }

    if (checkPattern(pattern)) {
      const rule = createRule(pattern, this._ignorecase)
      this._added = true
      this._rules.push(rule)
    }
  }

  // @param {Array<string> | string | Ignore} pattern
  add (pattern) {
    this._added = false

    makeArray(
      isString(pattern)
        ? splitPattern(pattern)
        : pattern
    ).forEach(this._addPattern, this)

    // Some rules have just added to the ignore,
    // making the behavior changed.
    if (this._added) {
      this._initCache()
    }

    return this
  }

  // legacy
  addPattern (pattern) {
    return this.add(pattern)
  }

  //          |           ignored : unignored
  // negative |   0:0   |   0:1   |   1:0   |   1:1
  // -------- | ------- | ------- | ------- | --------
  //     0    |  TEST   |  TEST   |  SKIP   |    X
  //     1    |  TESTIF |  SKIP   |  TEST   |    X

  // - SKIP: always skip
  // - TEST: always test
  // - TESTIF: only test if checkUnignored
  // - X: that never happen

  // @param {boolean} whether should check if the path is unignored,
  //   setting `checkUnignored` to `false` could reduce additional
  //   path matching.

  // @returns {TestResult} true if a file is ignored
  _testOne (path, checkUnignored) {
    let ignored = false
    let unignored = false

    this._rules.forEach(rule => {
      const {negative} = rule
      if (
        unignored === negative && ignored !== unignored
        || negative && !ignored && !unignored && !checkUnignored
      ) {
        return
      }

      const matched = rule.regex.test(path)

      if (matched) {
        ignored = !negative
        unignored = negative
      }
    })

    return {
      ignored,
      unignored
    }
  }

  // @returns {TestResult}
  _test (originalPath, cache, checkUnignored, slices) {
    const path = originalPath
      // Supports nullable path
      && checkPath.convert(originalPath)

    checkPath(path, originalPath, throwError)

    return this._t(path, cache, checkUnignored, slices)
  }

  _t (path, cache, checkUnignored, slices) {
    if (path in cache) {
      return cache[path]
    }

    if (!slices) {
      // path/to/a.js
      // ['path', 'to', 'a.js']
      slices = path.split(SLASH)
    }

    slices.pop()

    // If the path has no parent directory, just test it
    if (!slices.length) {
      return cache[path] = this._testOne(path, checkUnignored)
    }

    const parent = this._t(
      slices.join(SLASH) + SLASH,
      cache,
      checkUnignored,
      slices
    )

    // If the path contains a parent directory, check the parent first
    return cache[path] = parent.ignored
      // > It is not possible to re-include a file if a parent directory of
      // >   that file is excluded.
      ? parent
      : this._testOne(path, checkUnignored)
  }

  ignores (path) {
    return this._test(path, this._ignoreCache, false).ignored
  }

  createFilter () {
    return path => !this.ignores(path)
  }

  filter (paths) {
    return makeArray(paths).filter(this.createFilter())
  }

  // @returns {TestResult}
  test (path) {
    return this._test(path, this._testCache, true)
  }
}

const factory = options => new Ignore(options)

const returnFalse = () => false

const isPathValid = path =>
  checkPath(path && checkPath.convert(path), path, returnFalse)

factory.isPathValid = isPathValid

// Fixes typescript
factory.default = factory

module.exports = factory

// Windows
// --------------------------------------------------------------
/* istanbul ignore if  */
if (
  // Detect `process` so that it can run in browsers.
  typeof process !== 'undefined'
  && (
    process.env && process.env.IGNORE_TEST_WIN32
    || process.platform === 'win32'
  )
) {
  /* eslint no-control-regex: "off" */
  const makePosix = str => /^\\\\\?\\/.test(str)
  || /["<>|\u0000-\u001F]+/u.test(str)
    ? str
    : str.replace(/\\/g, '/')

  checkPath.convert = makePosix

  // 'C:\\foo'     <- 'C:\\foo' has been converted to 'C:/'
  // 'd:\\foo'
  const REGIX_IS_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i
  checkPath.isNotRelative = path =>
    REGIX_IS_WINDOWS_PATH_ABSOLUTE.test(path)
    || isNotRelative(path)
}


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = path => {
	const isExtendedLengthPath = /^\\\\\?\\/.test(path);
	const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex

	if (isExtendedLengthPath || hasNonAscii) {
		return path;
	}

	return path.replace(/\\/g, '/');
};


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const {Transform} = __webpack_require__(38);

class ObjectTransform extends Transform {
	constructor() {
		super({
			objectMode: true
		});
	}
}

class FilterStream extends ObjectTransform {
	constructor(filter) {
		super();
		this._filter = filter;
	}

	_transform(data, encoding, callback) {
		if (this._filter(data)) {
			this.push(data);
		}

		callback();
	}
}

class UniqueStream extends ObjectTransform {
	constructor() {
		super();
		this._pushed = new Set();
	}

	_transform(data, encoding, callback) {
		if (!this._pushed.has(data)) {
			this.push(data);
			this._pushed.add(data);
		}

		callback();
	}
}

module.exports = {
	FilterStream,
	UniqueStream
};


/***/ })
/******/ ]);
//# sourceMappingURL=extension.js.map