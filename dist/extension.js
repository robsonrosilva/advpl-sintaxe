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
const merge_1 = __webpack_require__(2);
const analise_advpl_1 = __webpack_require__(34);
const ItemProject_1 = __webpack_require__(41);
const formatting_1 = __webpack_require__(136);
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
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Ativando ' + new Date());
        vscode_1.window.showInformationMessage(localize('extension.activeMessage', 'Active ADVPL Validation!'));
        vscode_1.workspace.onDidChangeTextDocument(validaFonte);
        vscode_1.workspace.onDidOpenTextDocument(validaFonte);
        vscode_1.workspace.onDidSaveTextDocument(validaFonte);
        vscode_1.window.onDidChangeTextEditorSelection(validaAdvpl);
        //Adiciona comando de envia para Validação
        context.subscriptions.push(vscode_1.commands.registerCommand('advpl-sintaxe.gitValidacao', () => {
            let mergeAdvpl = new merge_1.MergeAdvpl();
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
            let mergeAdvpl = new merge_1.MergeAdvpl();
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
            let mergeAdvpl = new merge_1.MergeAdvpl();
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
            let mergeAdvpl = new merge_1.MergeAdvpl();
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
        vscode_1.languages.registerDocumentFormattingEditProvider('advpl', formatting_1.formattingEditProvider());
        vscode_1.languages.registerDocumentRangeFormattingEditProvider('advpl', formatting_1.rangeFormattingEditProvider());
        //Adiciona comando de limeza de branches
        context.subscriptions.push(vscode_1.commands.registerCommand('advpl-sintaxe.cleanBranches', () => {
            let mergeAdvpl = new merge_1.MergeAdvpl();
            let branchAtual = mergeAdvpl.repository.headLabel;
            mergeAdvpl.limpaBranches().then((message) => {
                vscode_1.window.showInformationMessage(message);
            }).catch((erro) => {
                vscode_1.window.showErrorMessage(erro);
            });
        }));
        if (vscode_1.workspace.getConfiguration('advpl-sintaxe').get('validaProjeto') !== false) {
            validaProjeto();
        }
        else {
            validaFonte(vscode_1.window.activeTextEditor);
        }
        console.log('Fim ' + new Date());
    });
}
exports.activate = activate;
function validaFonte(editor) {
    return new Promise(() => {
        let time = vscode_1.workspace.getConfiguration('advpl-sintaxe').get('tempoValidacao');
        let document;
        if (!time || time === 0) {
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
                            return getUri(e.fonte.fonte).fsPath;
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
    return new Promise(() => {
        // prepara o objeto de validação
        let validaPrj = new analise_advpl_1.ValidaProjeto(validaAdvpl.comentFontPad, vscodeOptions);
        validaPrj.empresas = validaAdvpl.empresas;
        validaPrj.ownerDb = validaAdvpl.ownerDb;
        validaPrj.local = vscodeOptions;
        let pastas = [];
        let workspaceFolders = vscode_1.workspace['workspaceFolders'];
        workspaceFolders.forEach((path) => {
            pastas.push(path.uri.fsPath);
        });
        validaPrj.validaProjeto(pastas).then((objProjeto) => {
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

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(1);
class MergeAdvpl {
    constructor() {
        //Busca Configurações do Settings
        this.branchTeste = vscode_1.workspace
            .getConfiguration('advpl-sintaxe')
            .get('branchTeste');
        if (!this.branchTeste) {
            vscode_1.window.showErrorMessage(localize('merge.noBranch'));
            return;
        }
        this.branchHomol = vscode_1.workspace
            .getConfiguration('advpl-sintaxe')
            .get('branchHomologacao');
        if (!this.branchHomol) {
            vscode_1.window.showErrorMessage(localize('merge.noBranch'));
            return;
        }
        this.branchProdu = vscode_1.workspace
            .getConfiguration('advpl-sintaxe')
            .get('branchProducao');
        if (!this.branchProdu) {
            vscode_1.window.showErrorMessage(localize('merge.noBranch'));
            return;
        }
        this.branchesControladas = Array();
        this.branchesControladas.push(this.branchHomol.toUpperCase());
        this.branchesControladas.push(this.branchTeste.toUpperCase());
        this.branchesControladas.push(this.branchProdu.toUpperCase());
        this.repository = this.getRepository();
    }
    merge(branchDestino) {
        this.branchOrigem = this.repository.headLabel;
        // guarda objeto this
        let objeto = this;
        return new Promise((resolve, reject) => {
            // Verifica se a branch que mandou é uma das controladas
            if (objeto.branchesControladas.includes(this.branchOrigem.toUpperCase())) {
                reject(localize('merge.noBranchMerge'));
            }
            // Atualiza branch Corrente com a Release
            objeto.atualiza().catch((erro) => {
                console.log(erro);
                reject(erro);
            }).then(() => {
                // efetua o push da branche
                this.run(['push', '--set-upstream', 'origin', this.repository.headLabel]).catch((erro) => {
                    console.log(erro);
                    reject(localize('merge.pushError') + '\n' + erro.stderr);
                }).then(() => {
                    // efetua os merges
                    this.mergeGit(this.branchTeste).then(() => {
                        if ([this.branchHomol, this.branchProdu].includes(branchDestino)) {
                            this.mergeGit(this.branchHomol).then(() => {
                                if (this.branchProdu === branchDestino) {
                                    this.mergeGit(this.branchProdu).then((tag) => {
                                        vscode_1.window.showInformationMessage(localize('merge.mergeFinish') +
                                            this.branchOrigem + ' -> ' +
                                            branchDestino + '(' + tag + ')');
                                        resolve();
                                    }).catch((erro) => {
                                        console.log(erro);
                                        reject(localize('merge.mergeError') + '\n' + erro.stderr);
                                    });
                                }
                                else {
                                    vscode_1.window.showInformationMessage(localize('merge.mergeFinish') +
                                        this.branchOrigem +
                                        ' -> ' +
                                        branchDestino);
                                    resolve();
                                }
                            }).catch((erro) => {
                                console.log(erro);
                                reject(localize('merge.mergeError') + '\n' + erro.stderr);
                            });
                        }
                        else {
                            vscode_1.window.showInformationMessage(localize('merge.mergeFinish') +
                                this.branchOrigem +
                                ' -> ' +
                                branchDestino);
                            resolve();
                        }
                    }).catch((erro) => {
                        console.log(erro);
                        reject(localize('merge.mergeError') + '\n' + erro.stderr);
                    });
                });
            });
        });
    }
    // efetua um check out na branch de homologação, faz o pull dela, 
    // faz um checkout para a branch corrente e um merge ne com a homologação
    atualiza() {
        // se não estiver com a branch origem definida define ela
        this.branchOrigem = this.branchOrigem ? this.branchOrigem : this.repository.headLabel;
        return new Promise((resolve, reject) => {
            // vai para a branche de release
            this.repository.checkout(this.branchHomol).then(() => {
                // efetua o pull da branch de release
                this.repository.pull().then(() => {
                    // vai para a branche de que estava
                    this.repository.checkout(this.branchOrigem).then(() => {
                        // efetua o merge
                        this.run(['merge', '--no-ff', this.branchHomol]).then(() => {
                            resolve(localize('merge.atualizacaoFinish'));
                        }).catch((erro) => {
                            console.log(erro);
                            reject(localize('merge.mergeError') + '\n' + erro.stderr);
                        });
                    }).catch((erro) => {
                        console.log(erro);
                        reject(localize('merge.checkoutError') + '\n' + erro.stderr);
                    });
                }).catch((erro) => {
                    console.log(erro);
                    reject(localize('merge.pullError') + '\n' + erro.stderr);
                });
            }).catch((erro) => {
                console.log(erro);
                reject(localize('merge.checkoutError') + '\n' + erro.stderr);
            });
        });
    }
    // limpa as branches mergeadas com a master
    limpaBranches() {
        return new Promise((resolve, reject) => {
            // Atualiza todas as branches remotas
            this.run(['fetch', '-v', 'origin']).then(() => {
                // baixa todas as tags
                this.run(['pull', '--tags']).then(() => {
                    // apaga os remotes que foram mergeados com a master
                    this.run(['remote', 'prune', 'origin']).then(() => {
                        // lista os branches mergeados com a master
                        this.run(['branch', '--merged', 'master']).then((ret) => {
                            let branches = ret.stdout.split("\n");
                            branches.forEach((branche) => {
                                // nem tenta excluir se for a branche selecionada ou se for branche controlada
                                if (branche.substring(0, 1) !== '*' &&
                                    !this.branchesControladas.includes(branche.substring(2).toUpperCase()) &&
                                    branche !== '') {
                                    branche = branche.substring(2);
                                    this.run(['branch', '-d', branche]);
                                }
                            });
                            console.log(ret);
                            resolve(localize('merge.cleanFinish'));
                        }).catch((erro) => {
                            console.log(erro);
                            reject(localize('merge.mergedError') + '\n' + erro.stderr);
                        });
                    }).catch((erro) => {
                        console.log(erro);
                        reject(localize('merge.remotePruneError') + '\n' + erro.stderr);
                    });
                }).catch((erro) => {
                    console.log(erro);
                    reject(localize('merge.pullError') + '\n' + erro.stderr);
                });
            }).catch((erro) => {
                console.log(erro);
                reject(localize('merge.pullError') + '\n' + erro.stderr);
            });
        });
    }
    // Executa um push com tags
    pushAll() {
        let promises = [];
        promises.push(this.run(['push', '--tags']));
        promises.push(this.run(['push', '--set-upstream', 'origin', this.repository.headLabel]));
        return Promise.all(promises);
    }
    getNextTag() {
        let aUltimaTag = [0, 0, 0];
        let commit;
        //Verifica ultima tag
        this.repository.refs.forEach((item) => {
            //verifica se Ã© TAG
            if (item.type === 2) {
                //Verifica se Ã© padrÃ£o de numeraÃ§Ã£o
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
        return String(aUltimaTag[0]) +
            '.' +
            String(aUltimaTag[1]) +
            '.' +
            String(aUltimaTag[2]);
    }
    mergeGit(destino) {
        return new Promise((resolve, reject) => {
            // vai para a branche de release
            this.repository.checkout(destino).then(() => {
                // efetua o pull da branch de release
                this.run(['pull']).then(() => {
                    // se for um merge para a branch de produção sempre envia a release
                    let branch = destino === this.branchProdu ? this.branchHomol : this.branchOrigem;
                    // efetua o merge
                    this.run(['merge', '--no-ff', branch]).then(() => {
                        if (destino === this.branchProdu) {
                            let tag = this.getNextTag();
                            this.repository.tag(tag, '').then(() => {
                                this.pushAll().then(() => {
                                    resolve(tag);
                                }).catch((erro) => {
                                    console.log(erro);
                                    reject(localize('merge.pushError') + '\n' + erro.stderr);
                                });
                            }).catch((erro) => {
                                console.log(erro);
                                reject(localize('merge.checkoutError') + '\n' + erro.stderr);
                            });
                        }
                        else {
                            this.repository.push().then(() => {
                                resolve();
                            }).catch((erro) => {
                                console.log(erro);
                                reject(localize('merge.pushError') + '\n' + erro.stderr);
                            });
                        }
                    }).catch((erro) => {
                        console.log(erro);
                        reject(localize('merge.mergeError') + '\n' + erro.stderr);
                    });
                }).catch((erro) => {
                    console.log(erro);
                    reject(localize('merge.pullError') + '\n' + erro.stderr);
                });
            }).catch((erro) => {
                console.log(erro);
                reject(localize('merge.checkoutError') + '\n' + erro.stderr);
            });
        });
    }
    // Executa um comando livre no GIT
    run(args) {
        return this.repository.repository.git.exec(this.repository.root, args, {});
    }
    getRepository() {
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
                    repository = git.exports._model.getRepository(vscode_1.workspace.rootPath);
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
}
exports.MergeAdvpl = MergeAdvpl;
function localize(key) {
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
  Mustache = __webpack_require__(17),
  Messageformat = __webpack_require__(18),
  MakePlural = __webpack_require__(32),
  parseInterval = __webpack_require__(33).default;


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
    preserveLegacyCase,
    objectNotation,
    prefix,
    queryParameter,
    register,
    updateFiles,
    syncFiles;

  // public exports
  var i18n = {};

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

    preserveLegacyCase = (typeof opt.preserveLegacyCase === 'undefined') ?
      true : opt.preserveLegacyCase;

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

      // @see https://messageformat.github.io/messageformat/MessageFormat#disablePluralKeyChecks__anchor
      mf.disablePluralKeyChecks();
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
        p = MakePlural[lc[0] || targetLocale];
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
      if (register && register.global) {
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
          request.language = urlObj.query[queryParameter];

          if (preserveLegacyCase) {
            request.language = request.language.toLowerCase();
          }

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
      if (accessor() == null) {
        mutator({
          'one': defaultSingular || singular,
          'other': defaultPlural || plural
        });
        write(locale);
      }
    }

    if (accessor() == null) {
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
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process !== 'undefined' && process.type === 'renderer') {
  module.exports = __webpack_require__(10);
} else {
  module.exports = __webpack_require__(13);
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(11);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
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

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

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
    return window.localStorage;
  } catch (e) {}
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(12);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


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
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
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
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
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
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var tty = __webpack_require__(14);
var util = __webpack_require__(15);

/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(11);
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

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * The file descriptor to write the `debug()` calls to.
 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
 *
 *   $ DEBUG_FD=3 node script.js 3>debug.log
 */

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

if (1 !== fd && 2 !== fd) {
  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()
}

var stream = 1 === fd ? process.stdout :
             2 === fd ? process.stderr :
             createWritableStdioStream(fd);

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = new Date().toUTCString()
      + ' ' + name + ' ' + args[0];
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to `stream`.
 */

function log() {
  return stream.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
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
 * Copied from `node/src/node.js`.
 *
 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
 */

function createWritableStdioStream (fd) {
  var stream;
  var tty_wrap = process.binding('tty_wrap');

  // Note stream._type is used for test-module-load-list.js

  switch (tty_wrap.guessHandleType(fd)) {
    case 'TTY':
      stream = new tty.WriteStream(fd);
      stream._type = 'tty';

      // Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    case 'FILE':
      var fs = __webpack_require__(6);
      stream = new fs.SyncWriteStream(fd, { autoClose: false });
      stream._type = 'fs';
      break;

    case 'PIPE':
    case 'TCP':
      var net = __webpack_require__(16);
      stream = new net.Socket({
        fd: fd,
        readable: false,
        writable: true
      });

      // FIXME Should probably have an option in net.Socket to create a
      // stream from an existing fd which is writable only. But for now
      // we'll just add this hack and set the `readable` member to false.
      // Test: ./node test/fixtures/echo.js < /etc/passwd
      stream.readable = false;
      stream.read = null;
      stream._type = 'pipe';

      // FIXME Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    default:
      // Probably an error on in uv_guess_handle()
      throw new Error('Implement me. Unknown stream file type!');
  }

  // For supporting legacy API we put the FD here.
  stream.fd = fd;

  stream._isStdio = true;

  return stream;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());


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
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 17 */
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
   *
   * Tokens for partials also contain two more elements: 1) a string value of
   * indendation prior to that tag and 2) the index of that tag on that line -
   * eg a value of 2 indicates the partial is the third tag on this line.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];
    var lineHasNonSpace = false;
    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?
    var indentation = '';  // Tracks indentation for tags that use it
    var tagIndex = 0;      // Stores a count of number of tags encountered on a line

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
            indentation += chr;
          } else {
            nonSpace = true;
            lineHasNonSpace = true;
            indentation += ' ';
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n') {
            stripSpace();
            indentation = '';
            tagIndex = 0;
            lineHasNonSpace = false;
          }
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

      if (type == '>') {
        token = [ type, value, start, scanner.pos, indentation, tagIndex, lineHasNonSpace ];
      } else {
        token = [ type, value, start, scanner.pos ];
      }
      tagIndex++;
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

    stripSpace();

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

  Writer.prototype.indentPartial = function indentPartial (partial, indentation, lineHasNonSpace) {
    var filteredIndentation = indentation.replace(/[^ \t]/g, '');
    var partialByNl = partial.split('\n');
    for (var i = 0; i < partialByNl.length; i++) {
      if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) {
        partialByNl[i] = filteredIndentation + partialByNl[i];
      }
    }
    return partialByNl.join('\n');
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials, tags) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null) {
      var lineHasNonSpace = token[6];
      var tagIndex = token[5];
      var indentation = token[4];
      var indentedValue = value;
      if (tagIndex == 0 && indentation) {
        indentedValue = this.indentPartial(value, indentation, lineHasNonSpace);
      }
      return this.renderTokens(this.parse(indentedValue, tags), context, partials, indentedValue);
    }
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
  mustache.version = '3.1.0';
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(19).default;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _messageformatFormatters = _interopRequireDefault(__webpack_require__(20));

var _compiler = _interopRequireDefault(__webpack_require__(25));

var _utils = __webpack_require__(27);

var _plurals = __webpack_require__(28);

var _runtime = _interopRequireDefault(__webpack_require__(31));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MessageFormat {
  /**
   * The default locale
   *
   * Used by the constructor when no `locale` has been set to initialise the value
   * of its instance counterpart, `MessageFormat#defaultLocale`.
   *
   * @memberof MessageFormat
   * @default 'en'
   */

  /** Escape special characaters
   *
   *  Surround the characters `{` and `}` in the input string with 'quotes'.
   *  This will allow those characters to not be considered as MessageFormat
   *  control characters.
   *
   * @memberof MessageFormat
   * @param {string} str - The input string
   * @param {boolean} [octothorpe=false] - Include `#` in the escaped characters
   * @returns {string} The escaped string
   */
  static escape(str, octothorpe) {
    const esc = octothorpe ? /[#{}]/g : /[{}]/g;
    return String(str).replace(esc, "'$&'");
  }

  /**
   * Create a new MessageFormat compiler
   *
   * If set, the `locale` parameter limits the compiler to use a subset of the 204
   * languages' pluralisation rules made available by the Unicode CLDR.
   *
   * Leaving `locale` undefined or using an array of strings will create a
   * MessageFormat instance with multi-language support. To select which to use,
   * use the second parameter of `{@link MessageFormat#compile compile()}`, or use
   * message keys corresponding to your locales. The default locale will be the
   * first entry of the array, or `{@link MessageFormat.defaultLocale defaultLocale}`
   * if not set.
   *
   * A string `locale` will create a single-locale MessageFormat instance.
   *
   * Using an object `locale` with all properties of type `function` allows for
   * the use of custom or externally defined pluralisation rules; in this case
   *
   * @class MessageFormat
   * @classdesc MessageFormat-to-JavaScript compiler
   * @param {string|string[]|Object} [locale] - The locale(s) to use
   * @param {Object} [options] - Compiler options
   * @param {boolean} [options.biDiSupport=false] - Add Unicode control
   *   characters to all input parts to preserve the integrity of the output
   *   when mixing LTR and RTL text
   * @param {Object} [options.customFormatters] - Map of custom formatting
   *   functions to include. See the {@tutorial guide} for more details.
   * @param {boolean} [options.pluralKeyChecks=true] - Validate plural and
   *   selectordinal case keys according to the current locale
   * @param {boolean} [options.strictNumberSign=false] - Allow `#` only directly
   *   within a plural or selectordinal case, rather than in any inner select
   *   case as well.
   *
   * ```
   * import MessageFormat from 'messageformat'
   * ```
   */
  constructor(locale, options) {
    this.options = Object.assign({
      biDiSupport: false,
      customFormatters: null,
      pluralKeyChecks: true,
      strictNumberSign: false
    }, options);
    this.pluralFuncs = {};

    if (typeof locale === 'string') {
      this.pluralFuncs[locale] = (0, _plurals.getPlural)(locale, this.options);
      this.defaultLocale = locale;
    } else if (Array.isArray(locale)) {
      locale.forEach(lc => {
        this.pluralFuncs[lc] = (0, _plurals.getPlural)(lc, this.options);
      });
      this.defaultLocale = locale[0];
    } else {
      if (locale) {
        const lcKeys = Object.keys(locale);

        for (let i = 0; i < lcKeys.length; ++i) {
          const lc = lcKeys[i];

          if (typeof locale[lc] !== 'function') {
            const errMsg = 'Expected function value for locale ' + String(lc);
            throw new Error(errMsg);
          }

          this.pluralFuncs[lc] = locale[lc];
          if (!this.defaultLocale) this.defaultLocale = lc;
        }
      }

      if (this.defaultLocale) {
        this.hasCustomPluralFuncs = true;
      } else {
        this.defaultLocale = MessageFormat.defaultLocale;
        this.hasCustomPluralFuncs = false;
      }
    }

    this.fmt = Object.assign({}, this.options.customFormatters);
    this.runtime = new _runtime.default(this);
  }
  /**
   * Add custom formatter functions to this MessageFormat instance. See the
   * {@tutorial guide} for more details.
   *
   * The general syntax for calling a formatting function in MessageFormat is
   * `{var, fn[, arg]}`, where `var` is the variable that will be set by the
   * user code, `fn` determines the formatting function, and `arg` is an
   * optional string argument.
   *
   * In JavaScript, each formatting function is called with three parameters;
   * the variable value `v`, the current locale `lc`, and `arg` as a string, or
   * undefined if not set. `arg` will be trimmed of surrounding whitespace.
   * Formatting functions should not have side effects.
   *
   * @memberof MessageFormat
   * @instance
   * @param {Object.<string,function>} fmt - A map of formatting functions
   * @returns {MessageFormat} The MessageFormat instance, to allow for chaining
   *
   * @example
   * const mf = new MessageFormat('en-GB')
   * mf.addFormatters({
   *   upcase: function(v) { return v.toUpperCase() },
   *   locale: function(v, lc) { return lc },
   *   prop: function(v, lc, p) { return v[p] }
   * })
   * const messages = mf.compile({
   *   describe: 'This is {VAR, upcase}.',
   *   locale: 'The current locale is {_, locale}.',
   *   answer: 'Answer: {obj, prop, a}'
   * }
   *
   * messages.describe({ VAR: 'big' })        // 'This is BIG.'
   * messages.locale({})                      // 'The current locale is en-GB.'
   * messages.answer({ obj: {q: 3, a: 42} })  // 'Answer: 42'
   */


  addFormatters(fmt) {
    const fmtKeys = Object.keys(fmt);

    for (let i = 0; i < fmtKeys.length; ++i) {
      const name = fmtKeys[i];
      this.fmt[name] = fmt[name];
    }

    return this;
  }
  /**
   * Disable the validation of plural & selectordinal keys
   *
   * Previous versions of messageformat allowed the use of plural &
   * selectordinal statements with any keys; now we throw an error when a
   * statement uses a non-numerical key that will never be matched as a
   * pluralization category for the current locale.
   *
   * Use this method to disable the validation and allow usage as previously.
   * To re-enable, you'll need to create a new MessageFormat instance.
   *
   * @memberof MessageFormat
   * @instance
   * @returns {MessageFormat} The MessageFormat instance, to allow for chaining
   *
   * @example
   * const mf = new MessageFormat('en')
   * const msg = '{X, plural, zero{no answers} one{an answer} other{# answers}}'
   *
   * mf.compile(msg)
   * // Error: Invalid key `zero` for argument `X`. Valid plural keys for this
   * //        locale are `one`, `other`, and explicit keys like `=0`.
   *
   * mf.disablePluralKeyChecks()
   * mf.compile(msg)({ X: 0 })  // '0 answers'
   */


  disablePluralKeyChecks() {
    this.options.pluralKeyChecks = false;

    for (const lc in this.pluralFuncs) {
      const pf = this.pluralFuncs[lc];

      if (pf) {
        pf.cardinal = [];
        pf.ordinal = [];
      }
    }

    return this;
  }
  /**
   * Enable or disable the addition of Unicode control characters to all input
   * to preserve the integrity of the output when mixing LTR and RTL text.
   *
   * @see http://cldr.unicode.org/development/development-process/design-proposals/bidi-handling-of-structured-text
   *
   * @memberof MessageFormat
   * @instance
   * @param {boolean} [enable=true]
   * @returns {MessageFormat} The MessageFormat instance, to allow for chaining
   *
   * @example
   * // upper case stands for RTL characters, output is shown as rendered
   * const mf = new MessageFormat('en')
   *
   * mf.compile('{0} >> {1} >> {2}')(['first', 'SECOND', 'THIRD'])
   *   // 'first >> THIRD << SECOND'
   *
   * mf.setBiDiSupport(true)
   * mf.compile('{0} >> {1} >> {2}')(['first', 'SECOND', 'THIRD'])
   *   // 'first >> SECOND >> THIRD'
   */


  setBiDiSupport(enable) {
    this.options.biDiSupport = !!enable || typeof enable == 'undefined';
    return this;
  }
  /**
   * According to the ICU MessageFormat spec, a `#` character directly inside a
   * `plural` or `selectordinal` statement should be replaced by the number
   * matching the surrounding statement. By default, messageformat will replace
   * `#` signs with the value of the nearest surrounding `plural` or
   * `selectordinal` statement.
   *
   * Set this to true to follow the stricter ICU MessageFormat spec, and to
   * throw a runtime error if `#` is used with non-numeric input.
   *
   * @memberof MessageFormat
   * @instance
   * @param {boolean} [enable=true]
   * @returns {MessageFormat} The MessageFormat instance, to allow for chaining
   *
   * @example
   * const mf = new MessageFormat('en')
   * const src = {
   *   cookie: '#: {X, plural, =0{no cookies} one{a cookie} other{# cookies}}',
   *   pastry: `{X, plural,
   *     one {{P, select, cookie{a cookie} other{a pie}}}
   *     other {{P, select, cookie{# cookies} other{# pies}}}
   *   }`
   * }
   * let messages = mf.compile(src)
   *
   * messages.cookie({ X: 3 })            // '#: 3 cookies'
   * messages.pastry({ X: 3, P: 'pie' })  // '3 pies'
   *
   * mf.setStrictNumberSign(true)
   * messages = mf.compile(src)
   * messages.pastry({ X: 3, P: 'pie' })  // '# pies'
   */


  setStrictNumberSign(enable) {
    this.options.strictNumberSign = !!enable || typeof enable == 'undefined';
    this.runtime.setStrictNumber(this.options.strictNumberSign);
    return this;
  }
  /**
   * Compile messages into storable functions
   *
   * If `messages` is a single string including ICU MessageFormat declarations,
   * the result of `compile()` is a function taking a single Object parameter
   * `d` representing each of the input's defined variables.
   *
   * If `messages` is a hierarchical structure of such strings, the output of
   * `compile()` will match that structure, with each string replaced by its
   * corresponding JavaScript function.
   *
   * If the input `messages` -- and therefore the output -- of `compile()` is an
   * object, the output object will have a `toString(global)` method that may be
   * used to store or cache the compiled functions to disk, for later inclusion
   * in any JS environment, without a local MessageFormat instance required. If
   * its `global` parameter is null or undefined, the result is an ES6 module
   * with a default export. If `global` is a string containing `.`, the result
   * will be a script setting its value. Otherwise, the output defaults to an UMD
   * pattern that sets the value of `global` if used outside of AMD and CommonJS
   * loaders.
   *
   * If `locale` is not set, it will default to
   * `{@link MessageFormat.defaultLocale defaultLocale}`; using a key at any
   * depth of `messages` that is a declared locale will set its child elements to
   * use that locale.
   *
   * If `locale` is set, it is used for all messages, ignoring any otherwise
   * matching locale keys. If the constructor declared any locales, `locale`
   * needs to be one of them.
   *
   * If `compile()` is called with a `messages` object on a MessageFormat
   * instance that does not specify any locales, it will match keys to *all* 204
   * available locales. This is really useful if you want your messages to be
   * completely determined by your data, but may provide surprising results if
   * your input includes any 2-3 letter strings that are not locale identifiers.
   *
   * @memberof MessageFormat
   * @instance
   * @param {string|Object} messages - The input message(s) to be compiled, in ICU MessageFormat
   * @param {string} [locale] - A locale to use for the messages
   * @returns {function|Object} The first match found for the given locale(s)
   *
   * @example
   * const mf = new MessageFormat('en')
   * const msg = mf.compile('A {TYPE} example.')
   *
   * msg({ TYPE: 'simple' })  // 'A simple example.'
   *
   * @example
   * const mf = new MessageFormat(['en', 'fi'])
   * const messages = mf.compile({
   *   en: { a: 'A {TYPE} example.',
   *         b: 'This is the {COUNT, selectordinal, one{#st} two{#nd} few{#rd} other{#th}} example.' },
   *   fi: { a: '{TYPE} esimerkki.',
   *         b: 'Tämä on {COUNT, selectordinal, other{#.}} esimerkki.' }
   * })
   *
   * messages.en.b({ COUNT: 2 })  // 'This is the 2nd example.'
   * messages.fi.b({ COUNT: 2 })  // 'Tämä on 2. esimerkki.'
   *
   * @example
   * const fs = require('fs')
   * const mf = new MessageFormat('en')
   * const msgSet = {
   *   a: 'A {TYPE} example.',
   *   b: 'This has {COUNT, plural, one{one member} other{# members}}.',
   *   c: 'We have {P, number, percent} code coverage.'
   * }
   * const msgStr = mf.compile(msgSet).toString('module.exports')
   * fs.writeFileSync('messages.js', msgStr)
   *
   * ...
   *
   * const messages = require('./messages')
   *
   * messages.a({ TYPE: 'more complex' })  // 'A more complex example.'
   * messages.b({ COUNT: 3 })              // 'This has 3 members.'
   */


  compile(messages, locale) {
    function _stringify(obj, level) {
      if (!level) level = 0;
      if (typeof obj != 'object') return obj;
      let indent = '';

      for (let i = 0; i < level; ++i) indent += '  ';

      const o = [];

      for (const k in obj) {
        const v = _stringify(obj[k], level + 1);

        o.push(`\n${indent}  ${(0, _utils.propname)(k)}: ${v}`);
      }

      return `{${o.join(',')}\n${indent}}`;
    }

    let pf = {};

    if (Object.keys(this.pluralFuncs).length === 0) {
      if (locale) {
        const pfn0 = (0, _plurals.getPlural)(locale, this.options);

        if (!pfn0) {
          const lcs = JSON.stringify(locale);
          throw new Error(`Locale ${lcs} not found!`);
        }

        pf[locale] = pfn0;
      } else {
        locale = this.defaultLocale;
        pf = (0, _plurals.getAllPlurals)(this.options);
      }
    } else if (locale) {
      const pfn1 = this.pluralFuncs[locale];

      if (!pfn1) {
        const lcs = JSON.stringify(locale);
        const pfs = JSON.stringify(this.pluralFuncs);
        throw new Error(`Locale ${lcs} not found in ${pfs}!`);
      }

      pf[locale] = pfn1;
    } else {
      locale = this.defaultLocale;
      pf = this.pluralFuncs;
    }

    const compiler = new _compiler.default(this);
    const obj = compiler.compile(messages, locale, pf);

    if (typeof messages != 'object') {
      const fn = new Function('number, plural, select, fmt', (0, _utils.funcname)(locale), 'return ' + obj);
      const rt = this.runtime;
      return fn(rt.number, rt.plural, rt.select, this.fmt, pf[locale]);
    }

    const rtStr = this.runtime.toString(pf, compiler) + '\n';

    const objStr = _stringify(obj);

    const result = new Function(rtStr + 'return ' + objStr)(); // eslint-disable-next-line no-prototype-builtins

    if (result.hasOwnProperty('toString')) throw new Error('The top-level message key `toString` is reserved');

    result.toString = function (global) {
      if (!global || global === 'export default') {
        return rtStr + 'export default ' + objStr;
      } else if (global.indexOf('.') > -1) {
        return rtStr + global + ' = ' + objStr;
      } else {
        return rtStr + ['(function (root, G) {', '  if (typeof define === "function" && define.amd) { define(G); }', '  else if (typeof exports === "object") { module.exports = G; }', '  else { ' + (0, _utils.propname)(global, 'root') + ' = G; }', '})(this, ' + objStr + ');'].join('\n');
      }
    };

    return result;
  }

}

exports.default = MessageFormat;
MessageFormat.defaultLocale = 'en';
MessageFormat.formatters = _messageformatFormatters.default;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @classdesc
 * Default number formatting functions in the style of ICU's
 * {@link http://icu-project.org/apiref/icu4j/com/ibm/icu/text/MessageFormat.html simpleArg syntax}
 * implemented using the
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl Intl}
 * object defined by ECMA-402.
 *
 * In MessageFormat source, a formatter function is called with the syntax
 * `{var, name, arg}`, where `var` is a variable, `name` is the formatter name
 * (by default, either `date`, `duration`, `number` or `time`; `spellout` and
 * `ordinal` are not supported by default), and `arg` is an optional string
 * argument.
 *
 * In JavaScript, a formatter is a function called with three parameters:
 *   - The **`value`** of the variable; this can be of any user-defined type
 *   - The current **`locale`** code
 *   - The trimmed **`arg`** string value, or `null` if not set
 *
 * As formatter functions may be used in a precompiled context, they should not
 * refer to any variables that are not defined by the function parameters or
 * within the function body. To add your own formatter, either add it to the
 * static `MessageFormat.formatters` object, or use
 * {@link MessageFormat#addFormatters} to add it to a MessageFormat instance.
 *
 * @class Formatters
 * @hideconstructor
 */

module.exports = {
  date: __webpack_require__(21),
  duration: __webpack_require__(22),
  number: __webpack_require__(23),
  time: __webpack_require__(24)
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

/* eslint-disable no-fallthrough */

/** Represent a date as a short/default/long/full string
 *
 * The input value needs to be in a form that the
 * {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date Date object}
 * can process using its single-argument form, `new Date(value)`.
 *
 * @memberof Formatters
 * @param {number|string} value - Either a Unix epoch time in milliseconds, or a string value representing a date
 * @param {string} [type='default'] - One of `'short'`, `'default'`, `'long'` , or `full`
 *
 * @example
 * var mf = new MessageFormat(['en', 'fi']);
 *
 * mf.compile('Today is {T, date}')({ T: Date.now() })
 * // 'Today is Feb 21, 2016'
 *
 * mf.compile('Tänään on {T, date}', 'fi')({ T: Date.now() })
 * // 'Tänään on 21. helmikuuta 2016'
 *
 * mf.compile('Unix time started on {T, date, full}')({ T: 0 })
 * // 'Unix time started on Thursday, January 1, 1970'
 *
 * var cf = mf.compile('{sys} became operational on {d0, date, short}');
 * cf({ sys: 'HAL 9000', d0: '12 January 1999' })
 * // 'HAL 9000 became operational on 1/12/1999'
 */
function date(v, lc, p) {
  var o = { day: 'numeric', month: 'short', year: 'numeric' };
  switch (p) {
    case 'full':
      o.weekday = 'long';
    case 'long':
      o.month = 'long';
      break;
    case 'short':
      o.month = 'numeric';
  }
  return new Date(v).toLocaleDateString(lc, o);
}

module.exports = function() {
  return date;
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

/**
 * Represent a duration in seconds as a string
 *
 * Input should be a finite number; output will include one or two `:`
 * separators, and match the pattern `hhhh:mm:ss`, possibly with a leading `-`
 * for negative values and a trailing `.sss` part for non-integer input
 *
 * @memberof Formatters
 * @param {number|string} value - A finite number, or its string representation
 *
 * @example
 * var mf = new MessageFormat();
 *
 * mf.compile('It has been {D, duration}')({ D: 123 })
 * // 'It has been 2:03'
 *
 * mf.compile('Countdown: {D, duration}')({ D: -151200.42 })
 * // 'Countdown: -42:00:00.420'
 */
function duration(value) {
  if (!isFinite(value)) return String(value);
  var sign = '';
  if (value < 0) {
    sign = '-';
    value = Math.abs(value);
  } else {
    value = Number(value);
  }
  var sec = value % 60;
  var parts = [Math.round(sec) === sec ? sec : sec.toFixed(3)];
  if (value < 60) {
    parts.unshift(0); // at least one : is required
  } else {
    value = Math.round((value - parts[0]) / 60);
    parts.unshift(value % 60); // minutes
    if (value >= 60) {
      value = Math.round((value - parts[0]) / 60);
      parts.unshift(value); // hours
    }
  }
  var first = parts.shift();
  return (
    sign +
    first +
    ':' +
    parts
      .map(function(n) {
        return n < 10 ? '0' + String(n) : String(n);
      })
      .join(':')
  );
}

module.exports = function() {
  return duration;
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

/* global CURRENCY, Intl */

/** Represent a number as an integer, percent or currency value
 *
 *  Available in MessageFormat strings as `{VAR, number, integer|percent|currency}`.
 *  Internally, calls Intl.NumberFormat with appropriate parameters. `currency` will
 *  default to USD; to change, set `MessageFormat#currency` to the appropriate
 *  three-letter currency code, or use the `currency:EUR` form of the argument.
 *
 * @memberof Formatters
 * @param {number} value - The value to operate on
 * @param {string} type - One of `'integer'`, `'percent'` , `'currency'`, or `/currency:[A-Z]{3}/`
 *
 * @example
 * var mf = new MessageFormat('en');
 * mf.currency = 'EUR';  // needs to be set before first compile() call
 *
 * mf.compile('{N} is almost {N, number, integer}')({ N: 3.14 })
 * // '3.14 is almost 3'
 *
 * mf.compile('{P, number, percent} complete')({ P: 0.99 })
 * // '99% complete'
 *
 * mf.compile('The total is {V, number, currency}.')({ V: 5.5 })
 * // 'The total is €5.50.'
 *
 * mf.compile('The total is {V, number, currency:GBP}.')({ V: 5.5 })
 * // 'The total is £5.50.'
 */

function number(value, lc, arg) {
  var a = (arg && arg.split(':')) || [];
  var opt = {
    integer: { maximumFractionDigits: 0 },
    percent: { style: 'percent' },
    currency: {
      style: 'currency',
      currency: (a[1] && a[1].trim()) || CURRENCY,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  };
  return new Intl.NumberFormat(lc, opt[a[0]] || {}).format(value);
}

module.exports = function(mf) {
  var parts = number
    .toString()
    .replace('CURRENCY', JSON.stringify(mf.currency || 'USD'))
    .match(/\(([^)]*)\)[^{]*{([\s\S]*)}/);
  return new Function(parts[1], parts[2]);
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

/** Represent a time as a short/default/long string
 *
 * The input value needs to be in a form that the
 * {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date Date object}
 * can process using its single-argument form, `new Date(value)`.
 *
 * @memberof Formatters
 * @param {number|string} value - Either a Unix epoch time in milliseconds, or a string value representing a date
 * @param {string} [type='default'] - One of `'short'`, `'default'`, `'long'` , or `full`
 *
 * @example
 * var mf = new MessageFormat(['en', 'fi']);
 *
 * mf.compile('The time is now {T, time}')({ T: Date.now() })
 * // 'The time is now 11:26:35 PM'
 *
 * mf.compile('Kello on nyt {T, time}', 'fi')({ T: Date.now() })
 * // 'Kello on nyt 23.26.35'
 *
 * var cf = mf.compile('The Eagle landed at {T, time, full} on {T, date, full}');
 * cf({ T: '1969-07-20 20:17:40 UTC' })
 * // 'The Eagle landed at 10:17:40 PM GMT+2 on Sunday, July 20, 1969'
 */
function time(v, lc, p) {
  var o = { second: 'numeric', minute: 'numeric', hour: 'numeric' };
  switch (p) {
    case 'full':
    case 'long':
      o.timeZoneName = 'short';
      break;
    case 'short':
      delete o.second;
  }
  return new Date(v).toLocaleTimeString(lc, o);
}

module.exports = function() {
  return time;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _messageformatParser = __webpack_require__(26);

var _utils = __webpack_require__(27);

/** @private */
class Compiler {
  /** Creates a new message compiler. Called internally from {@link MessageFormat#compile}.
   *
   * @private
   * @param {MessageFormat} mf - A MessageFormat instance
   * @property {object} locales - The locale identifiers that are used by the compiled functions
   * @property {object} runtime - Names of the core runtime functions that are used by the compiled functions
   * @property {object} formatters - The formatter functions that are used by the compiled functions
   */
  constructor(mf) {
    this.mf = mf;
    this.lc = null;
    this.locales = {};
    this.runtime = {};
    this.formatters = {};
  }
  /** Recursively compile a string or a tree of strings to JavaScript function sources
   *
   *  If `src` is an object with a key that is also present in `plurals`, the key
   *  in question will be used as the locale identifier for its value. To disable
   *  the compile-time checks for plural & selectordinal keys while maintaining
   *  multi-locale support, use falsy values in `plurals`.
   *
   * @private
   * @param {string|object} src - the source for which the JS code should be generated
   * @param {string} lc - the default locale
   * @param {object} plurals - a map of pluralization keys for all available locales
   */


  compile(src, lc, plurals) {
    if (typeof src != 'object') {
      this.lc = lc;
      const pc = plurals[lc] || {
        cardinal: [],
        ordinal: []
      };
      pc.strict = !!this.mf.options.strictNumberSign;
      const r = (0, _messageformatParser.parse)(src, pc).map(token => this.token(token));
      return `function(d) { return ${r.join(' + ') || '""'}; }`;
    } else {
      const result = {};

      for (var key in src) {
        // eslint-disable-next-line no-prototype-builtins
        var lcKey = plurals.hasOwnProperty(key) ? key : lc;
        result[key] = this.compile(src[key], lcKey, plurals);
      }

      return result;
    }
  }
  /** @private */


  cases(token, plural) {
    let needOther = token.type === 'select' || !this.mf.hasCustomPluralFuncs;
    const r = token.cases.map(({
      key,
      tokens
    }) => {
      if (key === 'other') needOther = false;
      const s = tokens.map(tok => this.token(tok, plural));
      return (0, _utils.propname)(key) + ': ' + (s.join(' + ') || '""');
    });
    if (needOther) throw new Error("No 'other' form found in " + JSON.stringify(token));
    return `{ ${r.join(', ')} }`;
  }
  /** @private */


  token(token, plural) {
    if (typeof token == 'string') return JSON.stringify(token);
    let fn;
    let args = [(0, _utils.propname)(token.arg, 'd')];

    switch (token.type) {
      case 'argument':
        return this.mf.options.biDiSupport ? (0, _utils.biDiMarkText)(args[0], this.lc) : args[0];

      case 'select':
        fn = 'select';
        if (plural && this.mf.options.strictNumberSign) plural = null;
        args.push(this.cases(token, plural));
        this.runtime.select = true;
        break;

      case 'selectordinal':
        fn = 'plural';
        args.push(0, (0, _utils.funcname)(this.lc), this.cases(token, token), 1);
        this.locales[this.lc] = true;
        this.runtime.plural = true;
        break;

      case 'plural':
        fn = 'plural';
        args.push(token.offset || 0, (0, _utils.funcname)(this.lc), this.cases(token, token));
        this.locales[this.lc] = true;
        this.runtime.plural = true;
        break;

      case 'function':
        if (!(token.key in this.mf.fmt) && token.key in this.mf.constructor.formatters) {
          const fmt = this.mf.constructor.formatters[token.key];
          this.mf.fmt[token.key] = fmt(this.mf);
        }

        if (!this.mf.fmt[token.key]) throw new Error(`Formatting function ${JSON.stringify(token.key)} not found!`);
        args.push(JSON.stringify(this.lc));

        if (token.param) {
          if (plural && this.mf.options.strictNumberSign) plural = null;
          const s = token.param.tokens.map(tok => this.token(tok, plural));
          args.push('(' + (s.join(' + ') || '""') + ').trim()');
        }

        fn = (0, _utils.propname)(token.key, 'fmt');
        this.formatters[token.key] = true;
        break;

      case 'octothorpe':
        if (!plural) return '"#"';
        fn = 'number';
        args = [(0, _utils.propname)(plural.arg, 'd'), JSON.stringify(plural.arg)];
        if (plural.offset) args.push(plural.offset);
        this.runtime.number = true;
        break;
    }

    if (!fn) throw new Error('Parser error for token ' + JSON.stringify(token));
    return `${fn}(${args.join(', ')})`;
  }

}

exports.default = Compiler;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * Generated by PEG.js 0.10.0.
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

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function(expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array
              ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
              : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function(expectation) {
          return "any character";
        },

        end: function(expectation) {
          return "end of input";
        },

        other: function(expectation) {
          return expectation.description;
        }
      };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g,  '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g,  '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
        i, j;

    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i]);
    }

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== void 0 ? options : {};

  var peg$FAILED = {},

      peg$startRuleFunctions = { start: peg$parsestart },
      peg$startRuleFunction  = peg$parsestart,

      peg$c0 = "#",
      peg$c1 = peg$literalExpectation("#", false),
      peg$c2 = function() { return inPlural[0]; },
      peg$c3 = function() { return { type: 'octothorpe' }; },
      peg$c4 = function(str) { return str.join(''); },
      peg$c5 = "{",
      peg$c6 = peg$literalExpectation("{", false),
      peg$c7 = "}",
      peg$c8 = peg$literalExpectation("}", false),
      peg$c9 = function(arg) {
          return {
            type: 'argument',
            arg: arg
          };
        },
      peg$c10 = ",",
      peg$c11 = peg$literalExpectation(",", false),
      peg$c12 = "select",
      peg$c13 = peg$literalExpectation("select", false),
      peg$c14 = function(arg, m) { if (options.strict) { inPlural.unshift(false); } return m; },
      peg$c15 = function(arg, cases) {
          if (options.strict) inPlural.shift()
          return {
            type: 'select',
            arg: arg,
            cases: cases
          };
        },
      peg$c16 = "plural",
      peg$c17 = peg$literalExpectation("plural", false),
      peg$c18 = "selectordinal",
      peg$c19 = peg$literalExpectation("selectordinal", false),
      peg$c20 = function(arg, m) { inPlural.unshift(true); return m; },
      peg$c21 = function(arg, type, offset, cases) {
          var ls = ((type === 'selectordinal') ? options.ordinal : options.cardinal)
                   || ['zero', 'one', 'two', 'few', 'many', 'other'];
          if (ls && ls.length) cases.forEach(function(c) {
            if (isNaN(c.key) && ls.indexOf(c.key) < 0) throw new Error(
              'Invalid key `' + c.key + '` for argument `' + arg + '`.' +
              ' Valid ' + type + ' keys for this locale are `' + ls.join('`, `') +
              '`, and explicit keys like `=0`.');
          });
          inPlural.shift()
          return {
            type: type,
            arg: arg,
            offset: offset || 0,
            cases: cases
          };
        },
      peg$c22 = function(arg, key, param) {
          return {
            type: 'function',
            arg: arg,
            key: key,
            param: param
          };
        },
      peg$c23 = peg$otherExpectation("identifier"),
      peg$c24 = /^[^\t-\r \x85\u200E\u200F\u2028\u2029!-\/:-@[-\^`{-~\xA1-\xA7\xA9\xAB\xAC\xAE\xB0\xB1\xB6\xBB\xBF\xD7\xF7\u2010-\u2027\u2030-\u203E\u2041-\u2053\u2055-\u205E\u2190-\u245F\u2500-\u2775\u2794-\u2BFF\u2E00-\u2E7F\u3001-\u3003\u3008-\u3020\u3030\uFD3E\uFD3F\uFE45\uFE46]/,
      peg$c25 = peg$classExpectation([["\t", "\r"], " ", "\x85", "\u200E", "\u200F", "\u2028", "\u2029", ["!", "/"], [":", "@"], ["[", "^"], "`", ["{", "~"], ["\xA1", "\xA7"], "\xA9", "\xAB", "\xAC", "\xAE", "\xB0", "\xB1", "\xB6", "\xBB", "\xBF", "\xD7", "\xF7", ["\u2010", "\u2027"], ["\u2030", "\u203E"], ["\u2041", "\u2053"], ["\u2055", "\u205E"], ["\u2190", "\u245F"], ["\u2500", "\u2775"], ["\u2794", "\u2BFF"], ["\u2E00", "\u2E7F"], ["\u3001", "\u3003"], ["\u3008", "\u3020"], "\u3030", "\uFD3E", "\uFD3F", "\uFE45", "\uFE46"], true, false),
      peg$c26 = function(key, tokens) { return { key: key, tokens: tokens }; },
      peg$c27 = function(tokens) { return tokens; },
      peg$c28 = peg$otherExpectation("plural offset"),
      peg$c29 = "offset",
      peg$c30 = peg$literalExpectation("offset", false),
      peg$c31 = ":",
      peg$c32 = peg$literalExpectation(":", false),
      peg$c33 = function(d) { return d; },
      peg$c34 = "=",
      peg$c35 = peg$literalExpectation("=", false),
      peg$c36 = "number",
      peg$c37 = peg$literalExpectation("number", false),
      peg$c38 = "date",
      peg$c39 = peg$literalExpectation("date", false),
      peg$c40 = "time",
      peg$c41 = peg$literalExpectation("time", false),
      peg$c42 = "spellout",
      peg$c43 = peg$literalExpectation("spellout", false),
      peg$c44 = "ordinal",
      peg$c45 = peg$literalExpectation("ordinal", false),
      peg$c46 = "duration",
      peg$c47 = peg$literalExpectation("duration", false),
      peg$c48 = function(key) {
            if (options.strict || /^\d/.test(key)) return false
            switch (key.toLowerCase()) {
              case 'select':
              case 'plural':
              case 'selectordinal':
                return false
              default:
                return true
            }
          },
      peg$c49 = function(key) { return key },
      peg$c50 = function(tokens) { return !options.strict },
      peg$c51 = function(tokens) { return { tokens: tokens } },
      peg$c52 = function(parts) { return { tokens: [parts.join('')] } },
      peg$c53 = peg$otherExpectation("a valid (strict) function parameter"),
      peg$c54 = /^[^'{}]/,
      peg$c55 = peg$classExpectation(["'", "{", "}"], true, false),
      peg$c56 = function(p) { return p.join('') },
      peg$c57 = "'",
      peg$c58 = peg$literalExpectation("'", false),
      peg$c59 = function(quoted) { return quoted },
      peg$c60 = function(p) { return '{' + p.join('') + '}' },
      peg$c61 = peg$otherExpectation("doubled apostrophe"),
      peg$c62 = "''",
      peg$c63 = peg$literalExpectation("''", false),
      peg$c64 = function() { return "'"; },
      peg$c65 = /^[^']/,
      peg$c66 = peg$classExpectation(["'"], true, false),
      peg$c67 = "'{",
      peg$c68 = peg$literalExpectation("'{", false),
      peg$c69 = function(str) { return '\u007B'+str.join(''); },
      peg$c70 = "'}",
      peg$c71 = peg$literalExpectation("'}", false),
      peg$c72 = function(str) { return '\u007D'+str.join(''); },
      peg$c73 = peg$otherExpectation("escaped string"),
      peg$c74 = "'#",
      peg$c75 = peg$literalExpectation("'#", false),
      peg$c76 = function(str) { return "#"+str.join(''); },
      peg$c77 = function(quotedOcto) { return quotedOcto[0]; },
      peg$c78 = peg$otherExpectation("plain char"),
      peg$c79 = /^[^{}#\0-\x08\x0E-\x1F\x7F]/,
      peg$c80 = peg$classExpectation(["{", "}", "#", ["\0", "\b"], ["\x0E", "\x1F"], "\x7F"], true, false),
      peg$c81 = function(octo) { return !inPlural[0]; },
      peg$c82 = function(octo) { return octo; },
      peg$c83 = peg$otherExpectation("integer"),
      peg$c84 = /^[0-9]/,
      peg$c85 = peg$classExpectation([["0", "9"]], false, false),
      peg$c86 = peg$otherExpectation("white space"),
      peg$c87 = /^[\t-\r \x85\u200E\u200F\u2028\u2029]/,
      peg$c88 = peg$classExpectation([["\t", "\r"], " ", "\x85", "\u200E", "\u200F", "\u2028", "\u2029"], false, false),

      peg$currPos          = 0,
      peg$savedPos         = 0,
      peg$posDetailsCache  = [{ line: 1, column: 1 }],
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

  function expected(description, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos], p;

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
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
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

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$parsestart() {
    var s0, s1;

    s0 = [];
    s1 = peg$parsetoken();
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      s1 = peg$parsetoken();
    }

    return s0;
  }

  function peg$parsetoken() {
    var s0, s1, s2;

    s0 = peg$parseargument();
    if (s0 === peg$FAILED) {
      s0 = peg$parseselect();
      if (s0 === peg$FAILED) {
        s0 = peg$parseplural();
        if (s0 === peg$FAILED) {
          s0 = peg$parsefunction();
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 35) {
              s1 = peg$c0;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c1); }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = peg$currPos;
              s2 = peg$c2();
              if (s2) {
                s2 = void 0;
              } else {
                s2 = peg$FAILED;
              }
              if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c3();
                s0 = s1;
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
                s1 = peg$c4(s1);
              }
              s0 = s1;
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseargument() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 123) {
      s1 = peg$c5;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c6); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseid();
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 125) {
              s5 = peg$c7;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c8); }
            }
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c9(s3);
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

  function peg$parseselect() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 123) {
      s1 = peg$c5;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c6); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseid();
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s5 = peg$c10;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c11); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$currPos;
                if (input.substr(peg$currPos, 6) === peg$c12) {
                  s8 = peg$c12;
                  peg$currPos += 6;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c13); }
                }
                if (s8 !== peg$FAILED) {
                  peg$savedPos = s7;
                  s8 = peg$c14(s3, s8);
                }
                s7 = s8;
                if (s7 !== peg$FAILED) {
                  s8 = peg$parse_();
                  if (s8 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 44) {
                      s9 = peg$c10;
                      peg$currPos++;
                    } else {
                      s9 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c11); }
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parse_();
                      if (s10 !== peg$FAILED) {
                        s11 = [];
                        s12 = peg$parseselectCase();
                        if (s12 !== peg$FAILED) {
                          while (s12 !== peg$FAILED) {
                            s11.push(s12);
                            s12 = peg$parseselectCase();
                          }
                        } else {
                          s11 = peg$FAILED;
                        }
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parse_();
                          if (s12 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 125) {
                              s13 = peg$c7;
                              peg$currPos++;
                            } else {
                              s13 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c8); }
                            }
                            if (s13 !== peg$FAILED) {
                              peg$savedPos = s0;
                              s1 = peg$c15(s3, s11);
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

  function peg$parseplural() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 123) {
      s1 = peg$c5;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c6); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseid();
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s5 = peg$c10;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c11); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$currPos;
                if (input.substr(peg$currPos, 6) === peg$c16) {
                  s8 = peg$c16;
                  peg$currPos += 6;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c17); }
                }
                if (s8 === peg$FAILED) {
                  if (input.substr(peg$currPos, 13) === peg$c18) {
                    s8 = peg$c18;
                    peg$currPos += 13;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c19); }
                  }
                }
                if (s8 !== peg$FAILED) {
                  peg$savedPos = s7;
                  s8 = peg$c20(s3, s8);
                }
                s7 = s8;
                if (s7 !== peg$FAILED) {
                  s8 = peg$parse_();
                  if (s8 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 44) {
                      s9 = peg$c10;
                      peg$currPos++;
                    } else {
                      s9 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c11); }
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parse_();
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parseoffset();
                        if (s11 === peg$FAILED) {
                          s11 = null;
                        }
                        if (s11 !== peg$FAILED) {
                          s12 = [];
                          s13 = peg$parsepluralCase();
                          if (s13 !== peg$FAILED) {
                            while (s13 !== peg$FAILED) {
                              s12.push(s13);
                              s13 = peg$parsepluralCase();
                            }
                          } else {
                            s12 = peg$FAILED;
                          }
                          if (s12 !== peg$FAILED) {
                            s13 = peg$parse_();
                            if (s13 !== peg$FAILED) {
                              if (input.charCodeAt(peg$currPos) === 125) {
                                s14 = peg$c7;
                                peg$currPos++;
                              } else {
                                s14 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c8); }
                              }
                              if (s14 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c21(s3, s7, s11, s12);
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

  function peg$parsefunction() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 123) {
      s1 = peg$c5;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c6); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseid();
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s5 = peg$c10;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c11); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parsefunctionKey();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parse_();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parsefunctionParam();
                    if (s9 === peg$FAILED) {
                      s9 = null;
                    }
                    if (s9 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 125) {
                        s10 = peg$c7;
                        peg$currPos++;
                      } else {
                        s10 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c8); }
                      }
                      if (s10 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c22(s3, s7, s9);
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

  function peg$parseid() {
    var s0, s1, s2;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    if (peg$c24.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c25); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c24.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c25); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c23); }
    }

    return s0;
  }

  function peg$parseselectCase() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$parse_();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseid();
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsecaseTokens();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s2, s4);
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

    return s0;
  }

  function peg$parsepluralCase() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$parse_();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsepluralKey();
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsecaseTokens();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s2, s4);
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

    return s0;
  }

  function peg$parsecaseTokens() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 123) {
      s1 = peg$c5;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c6); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = peg$parse_();
      if (s3 !== peg$FAILED) {
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 123) {
          s5 = peg$c5;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c6); }
        }
        peg$silentFails--;
        if (s5 !== peg$FAILED) {
          peg$currPos = s4;
          s4 = void 0;
        } else {
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          s3 = [s3, s4];
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$parsetoken();
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parsetoken();
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 125) {
              s5 = peg$c7;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c8); }
            }
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c27(s3);
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

  function peg$parseoffset() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = peg$parse_();
    if (s1 !== peg$FAILED) {
      if (input.substr(peg$currPos, 6) === peg$c29) {
        s2 = peg$c29;
        peg$currPos += 6;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c30); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 58) {
            s4 = peg$c31;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c32); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsedigits();
              if (s6 !== peg$FAILED) {
                s7 = peg$parse_();
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c33(s6);
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
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c28); }
    }

    return s0;
  }

  function peg$parsepluralKey() {
    var s0, s1, s2;

    s0 = peg$parseid();
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 61) {
        s1 = peg$c34;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c35); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsedigits();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c33(s2);
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

  function peg$parsefunctionKey() {
    var s0, s1, s2, s3, s4, s5;

    if (input.substr(peg$currPos, 6) === peg$c36) {
      s0 = peg$c36;
      peg$currPos += 6;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c37); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 4) === peg$c38) {
        s0 = peg$c38;
        peg$currPos += 4;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c39); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c40) {
          s0 = peg$c40;
          peg$currPos += 4;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c41); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 8) === peg$c42) {
            s0 = peg$c42;
            peg$currPos += 8;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c43); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 7) === peg$c44) {
              s0 = peg$c44;
              peg$currPos += 7;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c45); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 8) === peg$c46) {
                s0 = peg$c46;
                peg$currPos += 8;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c47); }
              }
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$currPos;
                peg$silentFails++;
                if (input.substr(peg$currPos, 6) === peg$c12) {
                  s2 = peg$c12;
                  peg$currPos += 6;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c13); }
                }
                peg$silentFails--;
                if (s2 === peg$FAILED) {
                  s1 = void 0;
                } else {
                  peg$currPos = s1;
                  s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                  s2 = peg$currPos;
                  peg$silentFails++;
                  if (input.substr(peg$currPos, 6) === peg$c16) {
                    s3 = peg$c16;
                    peg$currPos += 6;
                  } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c17); }
                  }
                  peg$silentFails--;
                  if (s3 === peg$FAILED) {
                    s2 = void 0;
                  } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                  }
                  if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    peg$silentFails++;
                    if (input.substr(peg$currPos, 13) === peg$c18) {
                      s4 = peg$c18;
                      peg$currPos += 13;
                    } else {
                      s4 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c19); }
                    }
                    peg$silentFails--;
                    if (s4 === peg$FAILED) {
                      s3 = void 0;
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                    if (s3 !== peg$FAILED) {
                      s4 = peg$parseid();
                      if (s4 !== peg$FAILED) {
                        peg$savedPos = peg$currPos;
                        s5 = peg$c48(s4);
                        if (s5) {
                          s5 = void 0;
                        } else {
                          s5 = peg$FAILED;
                        }
                        if (s5 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c49(s4);
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
    }

    return s0;
  }

  function peg$parsefunctionParam() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$parse_();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 44) {
        s2 = peg$c10;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c11); }
      }
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$parsetoken();
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parsetoken();
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = peg$currPos;
          s4 = peg$c50(s3);
          if (s4) {
            s4 = void 0;
          } else {
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c51(s3);
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
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 44) {
          s2 = peg$c10;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c11); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsestrictFunctionParamPart();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsestrictFunctionParamPart();
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c52(s3);
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

    return s0;
  }

  function peg$parsestrictFunctionParamPart() {
    var s0, s1, s2, s3;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    if (peg$c54.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c55); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c54.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c55); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c56(s1);
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$parsedoubleapos();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 39) {
          s1 = peg$c57;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c58); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseinapos();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 39) {
              s3 = peg$c57;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c58); }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c59(s2);
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
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 123) {
            s1 = peg$c5;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c6); }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parsestrictFunctionParamPart();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsestrictFunctionParamPart();
            }
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 125) {
                s3 = peg$c7;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c8); }
              }
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c60(s2);
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
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c53); }
    }

    return s0;
  }

  function peg$parsedoubleapos() {
    var s0, s1;

    peg$silentFails++;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c62) {
      s1 = peg$c62;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c63); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c64();
    }
    s0 = s1;
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c61); }
    }

    return s0;
  }

  function peg$parseinapos() {
    var s0, s1, s2;

    s0 = peg$parsedoubleapos();
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = [];
      if (peg$c65.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c66); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c65.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c66); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c4(s1);
      }
      s0 = s1;
    }

    return s0;
  }

  function peg$parsequotedCurly() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c67) {
      s1 = peg$c67;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c68); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseinapos();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parseinapos();
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 39) {
          s3 = peg$c57;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c58); }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c69(s2);
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
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c70) {
        s1 = peg$c70;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c71); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseinapos();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseinapos();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 39) {
            s3 = peg$c57;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c58); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c72(s2);
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

    return s0;
  }

  function peg$parsequoted() {
    var s0, s1, s2, s3, s4, s5;

    peg$silentFails++;
    s0 = peg$parsequotedCurly();
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c74) {
        s3 = peg$c74;
        peg$currPos += 2;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c75); }
      }
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$parseinapos();
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parseinapos();
        }
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 39) {
            s5 = peg$c57;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c58); }
          }
          if (s5 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c76(s4);
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = peg$currPos;
        s3 = peg$c2();
        if (s3) {
          s3 = void 0;
        } else {
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c77(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 39) {
          s0 = peg$c57;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c58); }
        }
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c73); }
    }

    return s0;
  }

  function peg$parseplainChar() {
    var s0, s1;

    peg$silentFails++;
    if (peg$c79.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c80); }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c78); }
    }

    return s0;
  }

  function peg$parsechar() {
    var s0, s1, s2;

    s0 = peg$parsedoubleapos();
    if (s0 === peg$FAILED) {
      s0 = peg$parsequoted();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 35) {
          s1 = peg$c0;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c1); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = peg$currPos;
          s2 = peg$c81(s1);
          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c82(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$parseplainChar();
        }
      }
    }

    return s0;
  }

  function peg$parsedigits() {
    var s0, s1, s2;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    if (peg$c84.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c85); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c84.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c85); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c83); }
    }

    return s0;
  }

  function peg$parse_() {
    var s0, s1, s2;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    if (peg$c87.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c88); }
    }
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      if (peg$c87.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c88); }
      }
    }
    if (s1 !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c86); }
    }

    return s0;
  }


    var inPlural = [false];


  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

module.exports = {
  SyntaxError: peg$SyntaxError,
  parse:       peg$parse
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propname = propname;
exports.funcname = funcname;
exports.biDiMarkText = biDiMarkText;
const reservedES3 = {
  break: true,
  continue: true,
  delete: true,
  else: true,
  for: true,
  function: true,
  if: true,
  in: true,
  new: true,
  return: true,
  this: true,
  typeof: true,
  var: true,
  void: true,
  while: true,
  with: true,
  case: true,
  catch: true,
  default: true,
  do: true,
  finally: true,
  instanceof: true,
  switch: true,
  throw: true,
  try: true
};
const reservedES5 = {
  // in addition to reservedES3
  debugger: true,
  class: true,
  enum: true,
  extends: true,
  super: true,
  const: true,
  export: true,
  import: true,
  null: true,
  true: true,
  false: true,
  implements: true,
  let: true,
  private: true,
  public: true,
  yield: true,
  interface: true,
  package: true,
  protected: true,
  static: true
};
/**
 * Utility function for quoting an Object's key value if required
 *
 * Quotes the key if it contains invalid characters or is an
 * ECMAScript 3rd Edition reserved word (for IE8).
 *
 * @private
 */

function propname(key, obj) {
  if (/^[A-Z_$][0-9A-Z_$]*$/i.test(key) && !reservedES3[key]) {
    return obj ? `${obj}.${key}` : key;
  } else {
    const jkey = JSON.stringify(key);
    return obj ? obj + `[${jkey}]` : jkey;
  }
}
/**
 * Utility function for escaping a function name if required
 *
 * @private
 */


function funcname(key) {
  const fn = key.trim().replace(/\W+/g, '_');
  return reservedES3[fn] || reservedES5[fn] || /^\d/.test(fn) ? '_' + fn : fn;
}

const rtlLanguages = ['ar', 'ckb', 'fa', 'he', 'ks($|[^bfh])', 'lrc', 'mzn', 'pa-Arab', 'ps', 'ug', 'ur', 'uz-Arab', 'yi'];
const rtlRegExp = new RegExp('^' + rtlLanguages.join('|^'));
/**
 * Utility formatter function for enforcing Bidi Structured Text by using UCC
 *
 * List inlined from data extracted from CLDR v27 & v28
 * To verify/recreate, use the following:
 *
 *    git clone https://github.com/unicode-cldr/cldr-misc-full.git
 *    cd cldr-misc-full/main/
 *    grep characterOrder -r . | tr '"/' '\t' | cut -f2,6 | grep -C4 right-to-left
 *
 * @private
 */

function biDiMarkText(text, locale) {
  const isLocaleRTL = rtlRegExp.test(locale);
  const mark = JSON.stringify(isLocaleRTL ? '\u200F' : '\u200E');
  return `${mark} + ${text} + ${mark}`;
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPlural = getPlural;
exports.getAllPlurals = getAllPlurals;

var _pluralCategories = _interopRequireDefault(__webpack_require__(29));

var _plurals = _interopRequireDefault(__webpack_require__(30));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class
 * @private
 * @hideconstructor
 * @classdesc Utility getter/wrapper for pluralization functions from
 * {@link http://github.com/eemeli/make-plural.js make-plural}
 */
function wrapPluralFunc(lc, pf, pluralKeyChecks) {
  var fn = function () {
    return pf.apply(this, arguments);
  };

  fn.toString = () => pf.toString();

  if (pluralKeyChecks) {
    const pc = _pluralCategories.default[lc] || {};
    fn.cardinal = pc.cardinal;
    fn.ordinal = pc.ordinal;
  } else {
    fn.cardinal = [];
    fn.ordinal = [];
  }

  return fn;
}

function getPlural(locale, {
  pluralKeyChecks
}) {
  for (let lc = String(locale); lc; lc = lc.replace(/[-_]?[^-_]*$/, '')) {
    const pf = _plurals.default[lc];
    if (pf) return wrapPluralFunc(lc, pf, pluralKeyChecks);
  }

  throw new Error('Localisation function not found for locale ' + JSON.stringify(locale));
}

function getAllPlurals({
  pluralKeyChecks
}) {
  const locales = {};
  const keys = Object.keys(_plurals.default);

  for (let i = 0; i < keys.length; ++i) {
    const lc = keys[i];
    locales[lc] = wrapPluralFunc(lc, _plurals.default[lc], pluralKeyChecks);
  }

  return locales;
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var _cc = [
  {cardinal:["other"],ordinal:["other"]},
  {cardinal:["one","other"],ordinal:["other"]},
  {cardinal:["one","other"],ordinal:["one","other"]},
  {cardinal:["one","two","other"],ordinal:["other"]}
];

(function (root, pluralCategories) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (pluralCategories),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, {
af: _cc[1],
ak: _cc[1],
am: _cc[1],
ar: {cardinal:["zero","one","two","few","many","other"],ordinal:["other"]},
ars: {cardinal:["zero","one","two","few","many","other"],ordinal:["other"]},
as: {cardinal:["one","other"],ordinal:["one","two","few","many","other"]},
asa: _cc[1],
ast: _cc[1],
az: {cardinal:["one","other"],ordinal:["one","few","many","other"]},
be: {cardinal:["one","few","many","other"],ordinal:["few","other"]},
bem: _cc[1],
bez: _cc[1],
bg: _cc[1],
bh: _cc[1],
bm: _cc[0],
bn: {cardinal:["one","other"],ordinal:["one","two","few","many","other"]},
bo: _cc[0],
br: {cardinal:["one","two","few","many","other"],ordinal:["other"]},
brx: _cc[1],
bs: {cardinal:["one","few","other"],ordinal:["other"]},
ca: {cardinal:["one","other"],ordinal:["one","two","few","other"]},
ce: _cc[1],
cgg: _cc[1],
chr: _cc[1],
ckb: _cc[1],
cs: {cardinal:["one","few","many","other"],ordinal:["other"]},
cy: {cardinal:["zero","one","two","few","many","other"],ordinal:["zero","one","two","few","many","other"]},
da: _cc[1],
de: _cc[1],
dsb: {cardinal:["one","two","few","other"],ordinal:["other"]},
dv: _cc[1],
dz: _cc[0],
ee: _cc[1],
el: _cc[1],
en: {cardinal:["one","other"],ordinal:["one","two","few","other"]},
eo: _cc[1],
es: _cc[1],
et: _cc[1],
eu: _cc[1],
fa: _cc[1],
ff: _cc[1],
fi: _cc[1],
fil: _cc[2],
fo: _cc[1],
fr: _cc[2],
fur: _cc[1],
fy: _cc[1],
ga: {cardinal:["one","two","few","many","other"],ordinal:["one","other"]},
gd: {cardinal:["one","two","few","other"],ordinal:["one","two","few","other"]},
gl: _cc[1],
gsw: _cc[1],
gu: {cardinal:["one","other"],ordinal:["one","two","few","many","other"]},
guw: _cc[1],
gv: {cardinal:["one","two","few","many","other"],ordinal:["other"]},
ha: _cc[1],
haw: _cc[1],
he: {cardinal:["one","two","many","other"],ordinal:["other"]},
hi: {cardinal:["one","other"],ordinal:["one","two","few","many","other"]},
hr: {cardinal:["one","few","other"],ordinal:["other"]},
hsb: {cardinal:["one","two","few","other"],ordinal:["other"]},
hu: _cc[2],
hy: _cc[2],
ia: _cc[1],
id: _cc[0],
ig: _cc[0],
ii: _cc[0],
"in": _cc[0],
io: _cc[1],
is: _cc[1],
it: {cardinal:["one","other"],ordinal:["many","other"]},
iu: _cc[3],
iw: {cardinal:["one","two","many","other"],ordinal:["other"]},
ja: _cc[0],
jbo: _cc[0],
jgo: _cc[1],
ji: _cc[1],
jmc: _cc[1],
jv: _cc[0],
jw: _cc[0],
ka: {cardinal:["one","other"],ordinal:["one","many","other"]},
kab: _cc[1],
kaj: _cc[1],
kcg: _cc[1],
kde: _cc[0],
kea: _cc[0],
kk: {cardinal:["one","other"],ordinal:["many","other"]},
kkj: _cc[1],
kl: _cc[1],
km: _cc[0],
kn: _cc[1],
ko: _cc[0],
ks: _cc[1],
ksb: _cc[1],
ksh: {cardinal:["zero","one","other"],ordinal:["other"]},
ku: _cc[1],
kw: _cc[3],
ky: _cc[1],
lag: {cardinal:["zero","one","other"],ordinal:["other"]},
lb: _cc[1],
lg: _cc[1],
lkt: _cc[0],
ln: _cc[1],
lo: {cardinal:["other"],ordinal:["one","other"]},
lt: {cardinal:["one","few","many","other"],ordinal:["other"]},
lv: {cardinal:["zero","one","other"],ordinal:["other"]},
mas: _cc[1],
mg: _cc[1],
mgo: _cc[1],
mk: {cardinal:["one","other"],ordinal:["one","two","many","other"]},
ml: _cc[1],
mn: _cc[1],
mo: {cardinal:["one","few","other"],ordinal:["one","other"]},
mr: {cardinal:["one","other"],ordinal:["one","two","few","other"]},
ms: {cardinal:["other"],ordinal:["one","other"]},
mt: {cardinal:["one","few","many","other"],ordinal:["other"]},
my: _cc[0],
nah: _cc[1],
naq: _cc[3],
nb: _cc[1],
nd: _cc[1],
ne: _cc[2],
nl: _cc[1],
nn: _cc[1],
nnh: _cc[1],
no: _cc[1],
nqo: _cc[0],
nr: _cc[1],
nso: _cc[1],
ny: _cc[1],
nyn: _cc[1],
om: _cc[1],
or: {cardinal:["one","other"],ordinal:["one","two","few","many","other"]},
os: _cc[1],
pa: _cc[1],
pap: _cc[1],
pl: {cardinal:["one","few","many","other"],ordinal:["other"]},
prg: {cardinal:["zero","one","other"],ordinal:["other"]},
ps: _cc[1],
pt: _cc[1],
"pt-PT": _cc[1],
rm: _cc[1],
ro: {cardinal:["one","few","other"],ordinal:["one","other"]},
rof: _cc[1],
root: _cc[0],
ru: {cardinal:["one","few","many","other"],ordinal:["other"]},
rwk: _cc[1],
sah: _cc[0],
saq: _cc[1],
sc: {cardinal:["one","other"],ordinal:["many","other"]},
scn: {cardinal:["one","other"],ordinal:["many","other"]},
sd: _cc[1],
sdh: _cc[1],
se: _cc[3],
seh: _cc[1],
ses: _cc[0],
sg: _cc[0],
sh: {cardinal:["one","few","other"],ordinal:["other"]},
shi: {cardinal:["one","few","other"],ordinal:["other"]},
si: _cc[1],
sk: {cardinal:["one","few","many","other"],ordinal:["other"]},
sl: {cardinal:["one","two","few","other"],ordinal:["other"]},
sma: _cc[3],
smi: _cc[3],
smj: _cc[3],
smn: _cc[3],
sms: _cc[3],
sn: _cc[1],
so: _cc[1],
sq: {cardinal:["one","other"],ordinal:["one","many","other"]},
sr: {cardinal:["one","few","other"],ordinal:["other"]},
ss: _cc[1],
ssy: _cc[1],
st: _cc[1],
sv: _cc[2],
sw: _cc[1],
syr: _cc[1],
ta: _cc[1],
te: _cc[1],
teo: _cc[1],
th: _cc[0],
ti: _cc[1],
tig: _cc[1],
tk: {cardinal:["one","other"],ordinal:["few","other"]},
tl: _cc[2],
tn: _cc[1],
to: _cc[0],
tr: _cc[1],
ts: _cc[1],
tzm: _cc[1],
ug: _cc[1],
uk: {cardinal:["one","few","many","other"],ordinal:["few","other"]},
ur: _cc[1],
uz: _cc[1],
ve: _cc[1],
vi: {cardinal:["other"],ordinal:["one","other"]},
vo: _cc[1],
vun: _cc[1],
wa: _cc[1],
wae: _cc[1],
wo: _cc[0],
xh: _cc[1],
xog: _cc[1],
yi: _cc[1],
yo: _cc[0],
yue: _cc[0],
zh: _cc[0],
zu: _cc[1]
}));


/***/ }),
/* 30 */
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
af: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

ak: function(n, ord
) {
  if (ord) return 'other';
  return ((n == 0
          || n == 1)) ? 'one' : 'other';
},

am: function(n, ord
) {
  if (ord) return 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

ar: function(n, ord
) {
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

ars: function(n, ord
) {
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

as: function(n, ord
) {
  if (ord) return ((n == 1 || n == 5 || n == 7 || n == 8 || n == 9
          || n == 10)) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

asa: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

ast: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

az: function(n, ord
) {
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

be: function(n, ord
) {
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

bem: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

bez: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

bg: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

bh: function(n, ord
) {
  if (ord) return 'other';
  return ((n == 0
          || n == 1)) ? 'one' : 'other';
},

bm: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

bn: function(n, ord
) {
  if (ord) return ((n == 1 || n == 5 || n == 7 || n == 8 || n == 9
          || n == 10)) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

bo: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

br: function(n, ord
) {
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

brx: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

bs: function(n, ord
) {
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

ca: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return ((n == 1
          || n == 3)) ? 'one'
      : (n == 2) ? 'two'
      : (n == 4) ? 'few'
      : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

ce: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

cgg: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

chr: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

ckb: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

cs: function(n, ord
) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one'
      : ((i >= 2 && i <= 4) && v0) ? 'few'
      : (!v0) ? 'many'
      : 'other';
},

cy: function(n, ord
) {
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

da: function(n, ord
) {
  var s = String(n).split('.'), i = s[0], t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return (n == 1 || !t0 && (i == 0
          || i == 1)) ? 'one' : 'other';
},

de: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

dsb: function(n, ord
) {
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

dv: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

dz: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

ee: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

el: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

en: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return (n10 == 1 && n100 != 11) ? 'one'
      : (n10 == 2 && n100 != 12) ? 'two'
      : (n10 == 3 && n100 != 13) ? 'few'
      : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

eo: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

es: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

et: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

eu: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

fa: function(n, ord
) {
  if (ord) return 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

ff: function(n, ord
) {
  if (ord) return 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
},

fi: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

fil: function(n, ord
) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1],
      i10 = i.slice(-1), f10 = f.slice(-1);
  if (ord) return (n == 1) ? 'one' : 'other';
  return (v0 && (i == 1 || i == 2 || i == 3)
          || v0 && i10 != 4 && i10 != 6 && i10 != 9
          || !v0 && f10 != 4 && f10 != 6 && f10 != 9) ? 'one' : 'other';
},

fo: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

fr: function(n, ord
) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
},

fur: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

fy: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

ga: function(n, ord
) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : ((t0 && n >= 3 && n <= 6)) ? 'few'
      : ((t0 && n >= 7 && n <= 10)) ? 'many'
      : 'other';
},

gd: function(n, ord
) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return ((n == 1
          || n == 11)) ? 'one'
      : ((n == 2
          || n == 12)) ? 'two'
      : ((n == 3
          || n == 13)) ? 'few'
      : 'other';
  return ((n == 1
          || n == 11)) ? 'one'
      : ((n == 2
          || n == 12)) ? 'two'
      : (((t0 && n >= 3 && n <= 10)
          || (t0 && n >= 13 && n <= 19))) ? 'few'
      : 'other';
},

gl: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

gsw: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

gu: function(n, ord
) {
  if (ord) return (n == 1) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

guw: function(n, ord
) {
  if (ord) return 'other';
  return ((n == 0
          || n == 1)) ? 'one' : 'other';
},

gv: function(n, ord
) {
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

ha: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

haw: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

he: function(n, ord
) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1);
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one'
      : (i == 2 && v0) ? 'two'
      : (v0 && (n < 0
          || n > 10) && t0 && n10 == 0) ? 'many'
      : 'other';
},

hi: function(n, ord
) {
  if (ord) return (n == 1) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

hr: function(n, ord
) {
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

hsb: function(n, ord
) {
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

hu: function(n, ord
) {
  if (ord) return ((n == 1
          || n == 5)) ? 'one' : 'other';
  return (n == 1) ? 'one' : 'other';
},

hy: function(n, ord
) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
},

ia: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

id: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

ig: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

ii: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

"in": function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

io: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

is: function(n, ord
) {
  var s = String(n).split('.'), i = s[0], t0 = Number(s[0]) == n,
      i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return 'other';
  return (t0 && i10 == 1 && i100 != 11
          || !t0) ? 'one' : 'other';
},

it: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return ((n == 11 || n == 8 || n == 80
          || n == 800)) ? 'many' : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

iu: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

iw: function(n, ord
) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1);
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one'
      : (i == 2 && v0) ? 'two'
      : (v0 && (n < 0
          || n > 10) && t0 && n10 == 0) ? 'many'
      : 'other';
},

ja: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

jbo: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

jgo: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

ji: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

jmc: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

jv: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

jw: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

ka: function(n, ord
) {
  var s = String(n).split('.'), i = s[0], i100 = i.slice(-2);
  if (ord) return (i == 1) ? 'one'
      : (i == 0 || ((i100 >= 2 && i100 <= 20) || i100 == 40 || i100 == 60
          || i100 == 80)) ? 'many'
      : 'other';
  return (n == 1) ? 'one' : 'other';
},

kab: function(n, ord
) {
  if (ord) return 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
},

kaj: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

kcg: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

kde: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

kea: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

kk: function(n, ord
) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1);
  if (ord) return (n10 == 6 || n10 == 9
          || t0 && n10 == 0 && n != 0) ? 'many' : 'other';
  return (n == 1) ? 'one' : 'other';
},

kkj: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

kl: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

km: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

kn: function(n, ord
) {
  if (ord) return 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

ko: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

ks: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

ksb: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

ksh: function(n, ord
) {
  if (ord) return 'other';
  return (n == 0) ? 'zero'
      : (n == 1) ? 'one'
      : 'other';
},

ku: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

kw: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

ky: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

lag: function(n, ord
) {
  var s = String(n).split('.'), i = s[0];
  if (ord) return 'other';
  return (n == 0) ? 'zero'
      : ((i == 0
          || i == 1) && n != 0) ? 'one'
      : 'other';
},

lb: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

lg: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

lkt: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

ln: function(n, ord
) {
  if (ord) return 'other';
  return ((n == 0
          || n == 1)) ? 'one' : 'other';
},

lo: function(n, ord
) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return 'other';
},

lt: function(n, ord
) {
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

lv: function(n, ord
) {
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

mas: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

mg: function(n, ord
) {
  if (ord) return 'other';
  return ((n == 0
          || n == 1)) ? 'one' : 'other';
},

mgo: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

mk: function(n, ord
) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1],
      i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return (i10 == 1 && i100 != 11) ? 'one'
      : (i10 == 2 && i100 != 12) ? 'two'
      : ((i10 == 7
          || i10 == 8) && i100 != 17 && i100 != 18) ? 'many'
      : 'other';
  return (v0 && i10 == 1 && i100 != 11
          || f10 == 1 && f100 != 11) ? 'one' : 'other';
},

ml: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

mn: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

mo: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
      n100 = t0 && s[0].slice(-2);
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n == 1 && v0) ? 'one'
      : (!v0 || n == 0
          || n != 1 && (n100 >= 1 && n100 <= 19)) ? 'few'
      : 'other';
},

mr: function(n, ord
) {
  if (ord) return (n == 1) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
},

ms: function(n, ord
) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return 'other';
},

mt: function(n, ord
) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n,
      n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 0
          || (n100 >= 2 && n100 <= 10)) ? 'few'
      : ((n100 >= 11 && n100 <= 19)) ? 'many'
      : 'other';
},

my: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

nah: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

naq: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

nb: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

nd: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

ne: function(n, ord
) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return ((t0 && n >= 1 && n <= 4)) ? 'one' : 'other';
  return (n == 1) ? 'one' : 'other';
},

nl: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

nn: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

nnh: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

no: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

nqo: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

nr: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

nso: function(n, ord
) {
  if (ord) return 'other';
  return ((n == 0
          || n == 1)) ? 'one' : 'other';
},

ny: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

nyn: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

om: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

or: function(n, ord
) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return ((n == 1 || n == 5
          || (t0 && n >= 7 && n <= 9))) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
  return (n == 1) ? 'one' : 'other';
},

os: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

pa: function(n, ord
) {
  if (ord) return 'other';
  return ((n == 0
          || n == 1)) ? 'one' : 'other';
},

pap: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

pl: function(n, ord
) {
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

prg: function(n, ord
) {
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

ps: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

pt: function(n, ord
) {
  var s = String(n).split('.'), i = s[0];
  if (ord) return 'other';
  return ((i == 0
          || i == 1)) ? 'one' : 'other';
},

"pt-PT": function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

rm: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

ro: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
      n100 = t0 && s[0].slice(-2);
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n == 1 && v0) ? 'one'
      : (!v0 || n == 0
          || n != 1 && (n100 >= 1 && n100 <= 19)) ? 'few'
      : 'other';
},

rof: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

root: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

ru: function(n, ord
) {
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

rwk: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

sah: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

saq: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

sc: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return ((n == 11 || n == 8 || n == 80
          || n == 800)) ? 'many' : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

scn: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return ((n == 11 || n == 8 || n == 80
          || n == 800)) ? 'many' : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

sd: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

sdh: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

se: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

seh: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

ses: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

sg: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

sh: function(n, ord
) {
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

shi: function(n, ord
) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return (n >= 0 && n <= 1) ? 'one'
      : ((t0 && n >= 2 && n <= 10)) ? 'few'
      : 'other';
},

si: function(n, ord
) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '';
  if (ord) return 'other';
  return ((n == 0 || n == 1)
          || i == 0 && f == 1) ? 'one' : 'other';
},

sk: function(n, ord
) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one'
      : ((i >= 2 && i <= 4) && v0) ? 'few'
      : (!v0) ? 'many'
      : 'other';
},

sl: function(n, ord
) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i100 = i.slice(-2);
  if (ord) return 'other';
  return (v0 && i100 == 1) ? 'one'
      : (v0 && i100 == 2) ? 'two'
      : (v0 && (i100 == 3 || i100 == 4)
          || !v0) ? 'few'
      : 'other';
},

sma: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

smi: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

smj: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

smn: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

sms: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
},

sn: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

so: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

sq: function(n, ord
) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return (n == 1) ? 'one'
      : (n10 == 4 && n100 != 14) ? 'many'
      : 'other';
  return (n == 1) ? 'one' : 'other';
},

sr: function(n, ord
) {
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

ss: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

ssy: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

st: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

sv: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return ((n10 == 1
          || n10 == 2) && n100 != 11 && n100 != 12) ? 'one' : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

sw: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

syr: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

ta: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

te: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

teo: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

th: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

ti: function(n, ord
) {
  if (ord) return 'other';
  return ((n == 0
          || n == 1)) ? 'one' : 'other';
},

tig: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

tk: function(n, ord
) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1);
  if (ord) return ((n10 == 6 || n10 == 9)
          || n == 10) ? 'few' : 'other';
  return (n == 1) ? 'one' : 'other';
},

tl: function(n, ord
) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1],
      i10 = i.slice(-1), f10 = f.slice(-1);
  if (ord) return (n == 1) ? 'one' : 'other';
  return (v0 && (i == 1 || i == 2 || i == 3)
          || v0 && i10 != 4 && i10 != 6 && i10 != 9
          || !v0 && f10 != 4 && f10 != 6 && f10 != 9) ? 'one' : 'other';
},

tn: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

to: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

tr: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

ts: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

tzm: function(n, ord
) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return ((n == 0 || n == 1)
          || (t0 && n >= 11 && n <= 99)) ? 'one' : 'other';
},

ug: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

uk: function(n, ord
) {
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

ur: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

uz: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

ve: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

vi: function(n, ord
) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return 'other';
},

vo: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

vun: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

wa: function(n, ord
) {
  if (ord) return 'other';
  return ((n == 0
          || n == 1)) ? 'one' : 'other';
},

wae: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

wo: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

xh: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

xog: function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
},

yi: function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
},

yo: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

yue: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

zh: function(n, ord
) {
  if (ord) return 'other';
  return 'other';
},

zu: function(n, ord
) {
  if (ord) return 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
}
}));


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = __webpack_require__(27);

/** A set of utility functions that are called by the compiled Javascript
 *  functions, these are included locally in the output of {@link
 *  MessageFormat#compile compile()}.
 *
 * @class
 * @private
 * @param {MessageFormat} mf - A MessageFormat instance
 */
class Runtime {
  /** Utility function for `#` in plural rules
   *
   *  Will throw an Error if `value` has a non-numeric value and `offset` is
   *  non-zero or {@link MessageFormat#setStrictNumberSign} is set.
   *
   * @function Runtime#number
   * @param {number} value - The value to operate on
   * @param {string} name - The name of the argument, used for error reporting
   * @param {number} [offset=0] - An optional offset, set by the surrounding context
   * @returns {number|string} The result of applying the offset to the input value
   */

  /** @private */
  constructor(mf) {
    this.plural = function (value, offset, lcfunc, data, isOrdinal) {
      if ({}.hasOwnProperty.call(data, value)) return data[value];
      if (offset) value -= offset;
      var key = lcfunc(value, isOrdinal);
      return key in data ? data[key] : data.other;
    };

    this.select = function (value, data) {
      return {}.hasOwnProperty.call(data, value) ? data[value] : data.other;
    };

    this.mf = mf;
    this.setStrictNumber(mf.options.strictNumberSign);
  }
  /** Utility function for `{N, plural|selectordinal, ...}`
   *
   * @param {number} value - The key to use to find a pluralization rule
   * @param {number} offset - An offset to apply to `value`
   * @param {function} lcfunc - A locale function from `pluralFuncs`
   * @param {Object.<string,string>} data - The object from which results are looked up
   * @param {?boolean} isOrdinal - If true, use ordinal rather than cardinal rules
   * @returns {string} The result of the pluralization
   */


  /** Set how strictly the {@link number} method parses its input.
   *
   *  According to the ICU MessageFormat spec, `#` can only be used to replace a
   *  number input of a `plural` statement. By default, messageformat does not
   *  throw a runtime error if you use non-numeric argument with a `plural` rule,
   *  unless rule also includes a non-zero `offset`.
   *
   *  This is called by {@link MessageFormat#setStrictNumberSign} to follow the
   *  stricter ICU MessageFormat spec.
   *
   * @private
   * @param {boolean} [enable=false]
   */
  setStrictNumber(enable) {
    this.number = enable ? Runtime.strictNumber : Runtime.defaultNumber;
  }
  /** @private */


  toString(pluralFuncs, compiler) {
    function _stringify(o, level) {
      if (typeof o != 'object') {
        const funcStr = o.toString().replace(/^(function )\w*/, '$1');
        const funcIndent = /([ \t]*)\S.*$/.exec(funcStr);
        return funcIndent ? funcStr.replace(new RegExp('^' + funcIndent[1], 'mg'), '') : funcStr;
      }

      const s = [];

      for (let i in o) {
        const v = _stringify(o[i], level + 1);

        s.push(level === 0 ? `var ${i} = ${v};\n` : `${(0, _utils.propname)(i)}: ${v}`);
      }

      if (level === 0) return s.join('');
      if (s.length === 0) return '{}';
      let indent = '  ';

      while (--level) indent += '  ';

      const oc = s.join(',\n').replace(/^/gm, indent);
      return `{\n${oc}\n}`;
    }

    const obj = {};
    const lcKeys = Object.keys(compiler.locales);

    for (let i = 0; i < lcKeys.length; ++i) {
      const lc = lcKeys[i];
      obj[(0, _utils.funcname)(lc)] = pluralFuncs[lc];
    }

    const rtKeys = Object.keys(compiler.runtime);

    for (let i = 0; i < rtKeys.length; ++i) {
      const fn = rtKeys[i];
      obj[fn] = this[fn];
    }

    const fmtKeys = Object.keys(compiler.formatters);

    if (fmtKeys.length > 0) {
      obj.fmt = {};

      for (let i = 0; i < fmtKeys.length; ++i) {
        const fk = fmtKeys[i];
        obj.fmt[fk] = this.mf.fmt[fk];
      }
    }

    return _stringify(obj, 0);
  }

}

exports.default = Runtime;

Runtime.defaultNumber = function (value, name, offset) {
  if (!offset) return value;
  if (isNaN(value)) throw new Error("Can't apply offset:" + offset + ' to argument `' + name + '` with non-numerical value ' + JSON.stringify(value) + '.');
  return value - offset;
};

Runtime.strictNumber = function (value, name, offset) {
  if (isNaN(value)) throw new Error('Argument `' + name + '` has non-numerical value ' + JSON.stringify(value) + '.');
  return value - (offset || 0);
};

/***/ }),
/* 32 */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_in", function() { return _in; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "af", function() { return af; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ak", function() { return ak; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "am", function() { return am; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "an", function() { return an; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ar", function() { return ar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ars", function() { return ars; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "as", function() { return as; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "asa", function() { return asa; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ast", function() { return ast; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "az", function() { return az; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "be", function() { return be; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bem", function() { return bem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bez", function() { return bez; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bg", function() { return bg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bho", function() { return bho; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bm", function() { return bm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bn", function() { return bn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bo", function() { return bo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "br", function() { return br; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "brx", function() { return brx; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bs", function() { return bs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ca", function() { return ca; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ce", function() { return ce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ceb", function() { return ceb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cgg", function() { return cgg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "chr", function() { return chr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ckb", function() { return ckb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cs", function() { return cs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cy", function() { return cy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "da", function() { return da; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "de", function() { return de; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dsb", function() { return dsb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dv", function() { return dv; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dz", function() { return dz; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ee", function() { return ee; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "el", function() { return el; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "en", function() { return en; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eo", function() { return eo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "es", function() { return es; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "et", function() { return et; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eu", function() { return eu; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fa", function() { return fa; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ff", function() { return ff; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fi", function() { return fi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fil", function() { return fil; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fo", function() { return fo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fr", function() { return fr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fur", function() { return fur; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fy", function() { return fy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ga", function() { return ga; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gd", function() { return gd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gl", function() { return gl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gsw", function() { return gsw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gu", function() { return gu; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "guw", function() { return guw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gv", function() { return gv; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ha", function() { return ha; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "haw", function() { return haw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "he", function() { return he; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hi", function() { return hi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hr", function() { return hr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hsb", function() { return hsb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hu", function() { return hu; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hy", function() { return hy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ia", function() { return ia; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "id", function() { return id; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ig", function() { return ig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ii", function() { return ii; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "io", function() { return io; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "is", function() { return is; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "it", function() { return it; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iu", function() { return iu; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iw", function() { return iw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ja", function() { return ja; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jbo", function() { return jbo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jgo", function() { return jgo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ji", function() { return ji; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jmc", function() { return jmc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jv", function() { return jv; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jw", function() { return jw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ka", function() { return ka; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kab", function() { return kab; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kaj", function() { return kaj; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kcg", function() { return kcg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kde", function() { return kde; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kea", function() { return kea; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kk", function() { return kk; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kkj", function() { return kkj; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kl", function() { return kl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "km", function() { return km; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kn", function() { return kn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ko", function() { return ko; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ks", function() { return ks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ksb", function() { return ksb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ksh", function() { return ksh; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ku", function() { return ku; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kw", function() { return kw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ky", function() { return ky; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lag", function() { return lag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lb", function() { return lb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lg", function() { return lg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lkt", function() { return lkt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ln", function() { return ln; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lo", function() { return lo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lt", function() { return lt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lv", function() { return lv; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mas", function() { return mas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mg", function() { return mg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mgo", function() { return mgo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mk", function() { return mk; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ml", function() { return ml; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mn", function() { return mn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mo", function() { return mo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mr", function() { return mr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ms", function() { return ms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mt", function() { return mt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "my", function() { return my; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nah", function() { return nah; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "naq", function() { return naq; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nb", function() { return nb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nd", function() { return nd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ne", function() { return ne; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nl", function() { return nl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nn", function() { return nn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nnh", function() { return nnh; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "no", function() { return no; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nqo", function() { return nqo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nr", function() { return nr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nso", function() { return nso; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ny", function() { return ny; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nyn", function() { return nyn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "om", function() { return om; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "or", function() { return or; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "os", function() { return os; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "osa", function() { return osa; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pa", function() { return pa; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pap", function() { return pap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pl", function() { return pl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prg", function() { return prg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ps", function() { return ps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pt", function() { return pt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pt_PT", function() { return pt_PT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rm", function() { return rm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ro", function() { return ro; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rof", function() { return rof; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "root", function() { return root; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ru", function() { return ru; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rwk", function() { return rwk; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sah", function() { return sah; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saq", function() { return saq; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sc", function() { return sc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scn", function() { return scn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sd", function() { return sd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sdh", function() { return sdh; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "se", function() { return se; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "seh", function() { return seh; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ses", function() { return ses; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sg", function() { return sg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sh", function() { return sh; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shi", function() { return shi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "si", function() { return si; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sk", function() { return sk; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sl", function() { return sl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sma", function() { return sma; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "smi", function() { return smi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "smj", function() { return smj; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "smn", function() { return smn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sms", function() { return sms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sn", function() { return sn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "so", function() { return so; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sq", function() { return sq; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sr", function() { return sr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ss", function() { return ss; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ssy", function() { return ssy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "st", function() { return st; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "su", function() { return su; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sv", function() { return sv; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sw", function() { return sw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "syr", function() { return syr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ta", function() { return ta; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "te", function() { return te; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "teo", function() { return teo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "th", function() { return th; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ti", function() { return ti; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tig", function() { return tig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tk", function() { return tk; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tl", function() { return tl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tn", function() { return tn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "to", function() { return to; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tr", function() { return tr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ts", function() { return ts; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tzm", function() { return tzm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ug", function() { return ug; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uk", function() { return uk; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ur", function() { return ur; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uz", function() { return uz; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ve", function() { return ve; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vi", function() { return vi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vo", function() { return vo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vun", function() { return vun; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wa", function() { return wa; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wae", function() { return wae; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wo", function() { return wo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xh", function() { return xh; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xog", function() { return xog; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "yi", function() { return yi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "yo", function() { return yo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "yue", function() { return yue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zh", function() { return zh; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zu", function() { return zu; });
function a(n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
}
function b(n, ord) {
  if (ord) return 'other';
  return ((n == 0
          || n == 1)) ? 'one' : 'other';
}
function c(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}
function d(n, ord) {
  if (ord) return 'other';
  return 'other';
}
function e(n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : 'other';
}

const _in = d;
const af = a;
const ak = b;
function am(n, ord) {
  if (ord) return 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
}
const an = a;
function ar(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return (n == 0) ? 'zero'
      : (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : ((n100 >= 3 && n100 <= 10)) ? 'few'
      : ((n100 >= 11 && n100 <= 99)) ? 'many'
      : 'other';
}
function ars(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return (n == 0) ? 'zero'
      : (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : ((n100 >= 3 && n100 <= 10)) ? 'few'
      : ((n100 >= 11 && n100 <= 99)) ? 'many'
      : 'other';
}
function as(n, ord) {
  if (ord) return ((n == 1 || n == 5 || n == 7 || n == 8 || n == 9
          || n == 10)) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
}
const asa = a;
const ast = c;
function az(n, ord) {
  var s = String(n).split('.'), i = s[0], i10 = i.slice(-1), i100 = i.slice(-2), i1000 = i.slice(-3);
  if (ord) return ((i10 == 1 || i10 == 2 || i10 == 5 || i10 == 7 || i10 == 8) || (i100 == 20 || i100 == 50
          || i100 == 70
          || i100 == 80)) ? 'one'
      : ((i10 == 3 || i10 == 4) || (i1000 == 100 || i1000 == 200 || i1000 == 300 || i1000 == 400 || i1000 == 500
          || i1000 == 600 || i1000 == 700 || i1000 == 800
          || i1000 == 900)) ? 'few'
      : (i == 0 || i10 == 6 || (i100 == 40 || i100 == 60
          || i100 == 90)) ? 'many'
      : 'other';
  return (n == 1) ? 'one' : 'other';
}
function be(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return ((n10 == 2
          || n10 == 3) && n100 != 12 && n100 != 13) ? 'few' : 'other';
  return (n10 == 1 && n100 != 11) ? 'one'
      : ((n10 >= 2 && n10 <= 4) && (n100 < 12
          || n100 > 14)) ? 'few'
      : (t0 && n10 == 0 || (n10 >= 5 && n10 <= 9)
          || (n100 >= 11 && n100 <= 14)) ? 'many'
      : 'other';
}
const bem = a;
const bez = a;
const bg = a;
const bho = b;
const bm = d;
function bn(n, ord) {
  if (ord) return ((n == 1 || n == 5 || n == 7 || n == 8 || n == 9
          || n == 10)) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
}
const bo = d;
function br(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2),
      n1000000 = t0 && s[0].slice(-6);
  if (ord) return 'other';
  return (n10 == 1 && n100 != 11 && n100 != 71 && n100 != 91) ? 'one'
      : (n10 == 2 && n100 != 12 && n100 != 72 && n100 != 92) ? 'two'
      : (((n10 == 3 || n10 == 4) || n10 == 9) && (n100 < 10 || n100 > 19) && (n100 < 70 || n100 > 79) && (n100 < 90
          || n100 > 99)) ? 'few'
      : (n != 0 && t0 && n1000000 == 0) ? 'many'
      : 'other';
}
const brx = a;
function bs(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2),
      f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return (v0 && i10 == 1 && i100 != 11
          || f10 == 1 && f100 != 11) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) || (f10 >= 2 && f10 <= 4) && (f100 < 12
          || f100 > 14)) ? 'few'
      : 'other';
}
function ca(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return ((n == 1
          || n == 3)) ? 'one'
      : (n == 2) ? 'two'
      : (n == 4) ? 'few'
      : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}
const ce = a;
function ceb(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), f10 = f.slice(-1);
  if (ord) return 'other';
  return (v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9
          || !v0 && f10 != 4 && f10 != 6 && f10 != 9) ? 'one' : 'other';
}
const cgg = a;
const chr = a;
const ckb = a;
function cs(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one'
      : ((i >= 2 && i <= 4) && v0) ? 'few'
      : (!v0) ? 'many'
      : 'other';
}
function cy(n, ord) {
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
}
function da(n, ord) {
  var s = String(n).split('.'), i = s[0], t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return (n == 1 || !t0 && (i == 0
          || i == 1)) ? 'one' : 'other';
}
const de = c;
function dsb(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i100 = i.slice(-2), f100 = f.slice(-2);
  if (ord) return 'other';
  return (v0 && i100 == 1
          || f100 == 1) ? 'one'
      : (v0 && i100 == 2
          || f100 == 2) ? 'two'
      : (v0 && (i100 == 3 || i100 == 4) || (f100 == 3
          || f100 == 4)) ? 'few'
      : 'other';
}
const dv = a;
const dz = d;
const ee = a;
const el = a;
function en(n, ord) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1),
      n100 = t0 && s[0].slice(-2);
  if (ord) return (n10 == 1 && n100 != 11) ? 'one'
      : (n10 == 2 && n100 != 12) ? 'two'
      : (n10 == 3 && n100 != 13) ? 'few'
      : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}
const eo = a;
const es = a;
const et = c;
const eu = a;
function fa(n, ord) {
  if (ord) return 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
}
function ff(n, ord) {
  if (ord) return 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
}
const fi = c;
function fil(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), f10 = f.slice(-1);
  if (ord) return (n == 1) ? 'one' : 'other';
  return (v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9
          || !v0 && f10 != 4 && f10 != 6 && f10 != 9) ? 'one' : 'other';
}
const fo = a;
function fr(n, ord) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
}
const fur = a;
const fy = c;
function ga(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n == 1) ? 'one'
      : (n == 2) ? 'two'
      : ((t0 && n >= 3 && n <= 6)) ? 'few'
      : ((t0 && n >= 7 && n <= 10)) ? 'many'
      : 'other';
}
function gd(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return ((n == 1
          || n == 11)) ? 'one'
      : ((n == 2
          || n == 12)) ? 'two'
      : ((n == 3
          || n == 13)) ? 'few'
      : 'other';
  return ((n == 1
          || n == 11)) ? 'one'
      : ((n == 2
          || n == 12)) ? 'two'
      : (((t0 && n >= 3 && n <= 10)
          || (t0 && n >= 13 && n <= 19))) ? 'few'
      : 'other';
}
const gl = c;
const gsw = a;
function gu(n, ord) {
  if (ord) return (n == 1) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
}
const guw = b;
function gv(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return 'other';
  return (v0 && i10 == 1) ? 'one'
      : (v0 && i10 == 2) ? 'two'
      : (v0 && (i100 == 0 || i100 == 20 || i100 == 40 || i100 == 60
          || i100 == 80)) ? 'few'
      : (!v0) ? 'many'
      : 'other';
}
const ha = a;
const haw = a;
function he(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one'
      : (i == 2 && v0) ? 'two'
      : (v0 && (n < 0
          || n > 10) && t0 && n10 == 0) ? 'many'
      : 'other';
}
function hi(n, ord) {
  if (ord) return (n == 1) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
}
function hr(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2),
      f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return (v0 && i10 == 1 && i100 != 11
          || f10 == 1 && f100 != 11) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) || (f10 >= 2 && f10 <= 4) && (f100 < 12
          || f100 > 14)) ? 'few'
      : 'other';
}
function hsb(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i100 = i.slice(-2), f100 = f.slice(-2);
  if (ord) return 'other';
  return (v0 && i100 == 1
          || f100 == 1) ? 'one'
      : (v0 && i100 == 2
          || f100 == 2) ? 'two'
      : (v0 && (i100 == 3 || i100 == 4) || (f100 == 3
          || f100 == 4)) ? 'few'
      : 'other';
}
function hu(n, ord) {
  if (ord) return ((n == 1
          || n == 5)) ? 'one' : 'other';
  return (n == 1) ? 'one' : 'other';
}
function hy(n, ord) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
}
const ia = c;
const id = d;
const ig = d;
const ii = d;
const io = c;
function is(n, ord) {
  var s = String(n).split('.'), i = s[0], t0 = Number(s[0]) == n, i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return 'other';
  return (t0 && i10 == 1 && i100 != 11
          || !t0) ? 'one' : 'other';
}
function it(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return ((n == 11 || n == 8 || n == 80
          || n == 800)) ? 'many' : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}
const iu = e;
function iw(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one'
      : (i == 2 && v0) ? 'two'
      : (v0 && (n < 0
          || n > 10) && t0 && n10 == 0) ? 'many'
      : 'other';
}
const ja = d;
const jbo = d;
const jgo = a;
const ji = c;
const jmc = a;
const jv = d;
const jw = d;
function ka(n, ord) {
  var s = String(n).split('.'), i = s[0], i100 = i.slice(-2);
  if (ord) return (i == 1) ? 'one'
      : (i == 0 || ((i100 >= 2 && i100 <= 20) || i100 == 40 || i100 == 60
          || i100 == 80)) ? 'many'
      : 'other';
  return (n == 1) ? 'one' : 'other';
}
function kab(n, ord) {
  if (ord) return 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
}
const kaj = a;
const kcg = a;
const kde = d;
const kea = d;
function kk(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
  if (ord) return (n10 == 6 || n10 == 9
          || t0 && n10 == 0 && n != 0) ? 'many' : 'other';
  return (n == 1) ? 'one' : 'other';
}
const kkj = a;
const kl = a;
const km = d;
function kn(n, ord) {
  if (ord) return 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
}
const ko = d;
const ks = a;
const ksb = a;
function ksh(n, ord) {
  if (ord) return 'other';
  return (n == 0) ? 'zero'
      : (n == 1) ? 'one'
      : 'other';
}
const ku = a;
function kw(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2), n1000 = t0 && s[0].slice(-3),
      n100000 = t0 && s[0].slice(-5), n1000000 = t0 && s[0].slice(-6);
  if (ord) return ((t0 && n >= 1 && n <= 4) || ((n100 >= 1 && n100 <= 4) || (n100 >= 21 && n100 <= 24)
          || (n100 >= 41 && n100 <= 44) || (n100 >= 61 && n100 <= 64)
          || (n100 >= 81 && n100 <= 84))) ? 'one'
      : (n == 5
          || n100 == 5) ? 'many'
      : 'other';
  return (n == 0) ? 'zero'
      : (n == 1) ? 'one'
      : ((n100 == 2 || n100 == 22 || n100 == 42 || n100 == 62 || n100 == 82)
          || t0 && n1000 == 0 && ((n100000 >= 1000 && n100000 <= 20000) || n100000 == 40000 || n100000 == 60000
          || n100000 == 80000)
          || n != 0 && n1000000 == 100000) ? 'two'
      : ((n100 == 3 || n100 == 23 || n100 == 43 || n100 == 63
          || n100 == 83)) ? 'few'
      : (n != 1 && (n100 == 1 || n100 == 21 || n100 == 41 || n100 == 61
          || n100 == 81)) ? 'many'
      : 'other';
}
const ky = a;
function lag(n, ord) {
  var s = String(n).split('.'), i = s[0];
  if (ord) return 'other';
  return (n == 0) ? 'zero'
      : ((i == 0
          || i == 1) && n != 0) ? 'one'
      : 'other';
}
const lb = a;
const lg = a;
const lkt = d;
const ln = b;
function lo(n, ord) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return 'other';
}
function lt(n, ord) {
  var s = String(n).split('.'), f = s[1] || '', t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1),
      n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return (n10 == 1 && (n100 < 11
          || n100 > 19)) ? 'one'
      : ((n10 >= 2 && n10 <= 9) && (n100 < 11
          || n100 > 19)) ? 'few'
      : (f != 0) ? 'many'
      : 'other';
}
function lv(n, ord) {
  var s = String(n).split('.'), f = s[1] || '', v = f.length, t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1),
      n100 = t0 && s[0].slice(-2), f100 = f.slice(-2), f10 = f.slice(-1);
  if (ord) return 'other';
  return (t0 && n10 == 0 || (n100 >= 11 && n100 <= 19)
          || v == 2 && (f100 >= 11 && f100 <= 19)) ? 'zero'
      : (n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11
          || v != 2 && f10 == 1) ? 'one'
      : 'other';
}
const mas = a;
const mg = b;
const mgo = a;
function mk(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2),
      f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return (i10 == 1 && i100 != 11) ? 'one'
      : (i10 == 2 && i100 != 12) ? 'two'
      : ((i10 == 7
          || i10 == 8) && i100 != 17 && i100 != 18) ? 'many'
      : 'other';
  return (v0 && i10 == 1 && i100 != 11
          || f10 == 1 && f100 != 11) ? 'one' : 'other';
}
const ml = a;
const mn = a;
function mo(n, ord) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n == 1 && v0) ? 'one'
      : (!v0 || n == 0
          || (n100 >= 2 && n100 <= 19)) ? 'few'
      : 'other';
}
function mr(n, ord) {
  if (ord) return (n == 1) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : 'other';
  return (n == 1) ? 'one' : 'other';
}
function ms(n, ord) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return 'other';
}
function mt(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return (n == 1) ? 'one'
      : (n == 0
          || (n100 >= 2 && n100 <= 10)) ? 'few'
      : ((n100 >= 11 && n100 <= 19)) ? 'many'
      : 'other';
}
const my = d;
const nah = a;
const naq = e;
const nb = a;
const nd = a;
function ne(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return ((t0 && n >= 1 && n <= 4)) ? 'one' : 'other';
  return (n == 1) ? 'one' : 'other';
}
const nl = c;
const nn = a;
const nnh = a;
const no = a;
const nqo = d;
const nr = a;
const nso = b;
const ny = a;
const nyn = a;
const om = a;
function or(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return ((n == 1 || n == 5
          || (t0 && n >= 7 && n <= 9))) ? 'one'
      : ((n == 2
          || n == 3)) ? 'two'
      : (n == 4) ? 'few'
      : (n == 6) ? 'many'
      : 'other';
  return (n == 1) ? 'one' : 'other';
}
const os = a;
const osa = d;
const pa = b;
const pap = a;
function pl(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12
          || i100 > 14)) ? 'few'
      : (v0 && i != 1 && (i10 == 0 || i10 == 1) || v0 && (i10 >= 5 && i10 <= 9)
          || v0 && (i100 >= 12 && i100 <= 14)) ? 'many'
      : 'other';
}
function prg(n, ord) {
  var s = String(n).split('.'), f = s[1] || '', v = f.length, t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1),
      n100 = t0 && s[0].slice(-2), f100 = f.slice(-2), f10 = f.slice(-1);
  if (ord) return 'other';
  return (t0 && n10 == 0 || (n100 >= 11 && n100 <= 19)
          || v == 2 && (f100 >= 11 && f100 <= 19)) ? 'zero'
      : (n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11
          || v != 2 && f10 == 1) ? 'one'
      : 'other';
}
const ps = a;
function pt(n, ord) {
  var s = String(n).split('.'), i = s[0];
  if (ord) return 'other';
  return ((i == 0
          || i == 1)) ? 'one' : 'other';
}
const pt_PT = c;
const rm = a;
function ro(n, ord) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n == 1 && v0) ? 'one'
      : (!v0 || n == 0
          || (n100 >= 2 && n100 <= 19)) ? 'few'
      : 'other';
}
const rof = a;
const root = d;
function ru(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return 'other';
  return (v0 && i10 == 1 && i100 != 11) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12
          || i100 > 14)) ? 'few'
      : (v0 && i10 == 0 || v0 && (i10 >= 5 && i10 <= 9)
          || v0 && (i100 >= 11 && i100 <= 14)) ? 'many'
      : 'other';
}
const rwk = a;
const sah = d;
const saq = a;
function sc(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return ((n == 11 || n == 8 || n == 80
          || n == 800)) ? 'many' : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}
function scn(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return ((n == 11 || n == 8 || n == 80
          || n == 800)) ? 'many' : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}
const sd = a;
const sdh = a;
const se = e;
const seh = a;
const ses = d;
const sg = d;
function sh(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2),
      f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return (v0 && i10 == 1 && i100 != 11
          || f10 == 1 && f100 != 11) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) || (f10 >= 2 && f10 <= 4) && (f100 < 12
          || f100 > 14)) ? 'few'
      : 'other';
}
function shi(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return (n >= 0 && n <= 1) ? 'one'
      : ((t0 && n >= 2 && n <= 10)) ? 'few'
      : 'other';
}
function si(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '';
  if (ord) return 'other';
  return ((n == 0 || n == 1)
          || i == 0 && f == 1) ? 'one' : 'other';
}
function sk(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one'
      : ((i >= 2 && i <= 4) && v0) ? 'few'
      : (!v0) ? 'many'
      : 'other';
}
function sl(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i100 = i.slice(-2);
  if (ord) return 'other';
  return (v0 && i100 == 1) ? 'one'
      : (v0 && i100 == 2) ? 'two'
      : (v0 && (i100 == 3 || i100 == 4)
          || !v0) ? 'few'
      : 'other';
}
const sma = e;
const smi = e;
const smj = e;
const smn = e;
const sms = e;
const sn = a;
const so = a;
function sq(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return (n == 1) ? 'one'
      : (n10 == 4 && n100 != 14) ? 'many'
      : 'other';
  return (n == 1) ? 'one' : 'other';
}
function sr(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2),
      f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return (v0 && i10 == 1 && i100 != 11
          || f10 == 1 && f100 != 11) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) || (f10 >= 2 && f10 <= 4) && (f100 < 12
          || f100 > 14)) ? 'few'
      : 'other';
}
const ss = a;
const ssy = a;
const st = a;
const su = d;
function sv(n, ord) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1),
      n100 = t0 && s[0].slice(-2);
  if (ord) return ((n10 == 1
          || n10 == 2) && n100 != 11 && n100 != 12) ? 'one' : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}
const sw = c;
const syr = a;
const ta = a;
const te = a;
const teo = a;
const th = d;
const ti = b;
const tig = a;
function tk(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
  if (ord) return ((n10 == 6 || n10 == 9)
          || n == 10) ? 'few' : 'other';
  return (n == 1) ? 'one' : 'other';
}
function tl(n, ord) {
  var s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), f10 = f.slice(-1);
  if (ord) return (n == 1) ? 'one' : 'other';
  return (v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9
          || !v0 && f10 != 4 && f10 != 6 && f10 != 9) ? 'one' : 'other';
}
const tn = a;
const to = d;
const tr = a;
const ts = a;
function tzm(n, ord) {
  var s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return ((n == 0 || n == 1)
          || (t0 && n >= 11 && n <= 99)) ? 'one' : 'other';
}
const ug = a;
function uk(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1),
      n100 = t0 && s[0].slice(-2), i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return (n10 == 3 && n100 != 13) ? 'few' : 'other';
  return (v0 && i10 == 1 && i100 != 11) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12
          || i100 > 14)) ? 'few'
      : (v0 && i10 == 0 || v0 && (i10 >= 5 && i10 <= 9)
          || v0 && (i100 >= 11 && i100 <= 14)) ? 'many'
      : 'other';
}
const ur = c;
const uz = a;
const ve = a;
function vi(n, ord) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return 'other';
}
const vo = a;
const vun = a;
const wa = b;
const wae = a;
const wo = d;
const xh = a;
const xog = a;
const yi = c;
const yo = d;
const yue = d;
const zh = d;
function zu(n, ord) {
  if (ord) return 'other';
  return (n >= 0 && n <= 1) ? 'one' : 'other';
}


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var patternParts = {
    value: '[-+]?(?:Infinity|[[0-9]*\\.?\\d*(?:[eE][-+]?\\d+)?)',
    leftBrace: '[\\(\\]\\[]',
    delimeter: ',',
    rightBrace: '[\\)\\]\\[]',
};
var PATTERN = new RegExp("(" + patternParts.leftBrace + ")" +
    ("(" + patternParts.value + ")?") +
    ("(" + patternParts.delimeter + ")?") +
    ("(" + patternParts.value + ")?") +
    ("(" + patternParts.rightBrace + ")"));
function execPattern(str) {
    var match = PATTERN.exec(str);
    if (!match) {
        return null;
    }
    var _ = match[0], leftBrace = match[1], fromValue = match[2], delimeter = match[3], toValue = match[4], rightBrace = match[5];
    return {
        leftBrace: leftBrace,
        fromValue: fromValue,
        delimeter: delimeter,
        toValue: toValue,
        rightBrace: rightBrace,
    };
}
function parse(str) {
    var match = execPattern(str);
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
                    match.fromValue !== undefined ?
                        +match.fromValue :
                        NaN),
            included: match.rightBrace === ']'
        }
    };
}
function check(interval) {
    if (interval.from.value === interval.to.value) {
        return interval.from.included && interval.to.included;
    }
    return Math.min(interval.from.value, interval.to.value) === interval.from.value;
}
function entry(str) {
    var interval = parse(str);
    if (!interval || !check(interval)) {
        return null;
    }
    return interval;
}
exports.default = entry;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(35));
__export(__webpack_require__(36));
__export(__webpack_require__(38));
__export(__webpack_require__(37));
__export(__webpack_require__(40));
//# sourceMappingURL=index.js.map

/***/ }),
/* 35 */
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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const include_1 = __webpack_require__(37);
const Erro_1 = __webpack_require__(38);
const fonte_1 = __webpack_require__(35);
const package_json_1 = __webpack_require__(39);
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
                            firstWord === 'WSSERVICE\\ ') {
                            //reseta todas as ariáveis de controle pois está fora de qualquer função
                            cBeginSql = false;
                            FromQuery = false;
                            JoinQuery = false;
                            cSelect = false;
                            //verifica se é um função e adiciona no array
                            try {
                                funcoes.push([
                                    linhaClean
                                        .trim()
                                        .split(' ')[1]
                                        .split('(')[0],
                                    key
                                ]);
                            }
                            catch (_a) {
                                console.log('Erro na captura de função da linha ');
                                console.log(linhaClean);
                            }
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
                        for (var idb = 0; idb < objeto.ownerDb.length; idb++) {
                            let banco = objeto.ownerDb[idb];
                            if (cSelect && FromQuery && linha.search(banco) !== -1) {
                                objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.noSchema', objeto.local) +
                                    banco +
                                    traduz('validaAdvpl.inQuery', objeto.local), Erro_1.Severity.Error));
                            }
                        }
                        if (cSelect &&
                            (FromQuery || JoinQuery || linha.search('SET') !== -1) &&
                            linha.search('exp:cTable') === -1) {
                            //procura códigos de empresas nas queryes
                            for (var idb = 0; idb < objeto.empresas.length; idb++) {
                                let empresa = objeto.empresas[idb];
                                //para melhorar a análise vou quebrar a string por espaços
                                //e removendo as quebras de linhas, vou varrer os itens do array e verificar o tamanho
                                //e o código da empresa chumbado
                                let palavras = linha
                                    .replace(/\r/g, '')
                                    .replace(/\t/g, '')
                                    .split(' ');
                                for (var idb2 = 0; idb2 < palavras.length; idb2++) {
                                    let palavra = palavras[idb2];
                                    if (palavra.search(empresa + '0') !== -1 &&
                                        palavra.length === 6) {
                                        objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.tableFixed', objeto.local), Erro_1.Severity.Error));
                                    }
                                }
                            }
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
                        let posicaoDic = (' ' + linhaClean).search(/(,| |\t|\>|\()+X+(1|2|3|5|6|7|9|A|B|D|G)+\_/gim);
                        if (!cBeginSql &&
                            posicaoDic !== -1 &&
                            (' ' + linhaClean)
                                .substring(posicaoDic + 1)
                                .split(' ')[0]
                                .split('\t')[0]
                                .search(/\(/) === -1) {
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
                            for (var idx3 = 0; idx3 < itens1.length; idx3++) {
                                let item = itens1[idx3];
                                addErro = addErro || linha.search("\\'" + item) !== -1;
                                addErro = addErro || linha.search('\\"' + item) !== -1;
                                addErro = addErro || linha.search('\\ ' + item) !== -1;
                            }
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
                for (var idx = 0; idx < funcoes.length; idx++) {
                    let funcao = funcoes[idx];
                    let achou = false;
                    for (var idx4 = 0; idx4 < comentFuncoes.length; idx4++) {
                        let comentario = comentFuncoes[idx4];
                        achou = achou || comentario[0] === funcao[0];
                    }
                    if (!achou) {
                        objeto.aErros.push(new Erro_1.Erro(parseInt(funcao[1]), parseInt(funcao[1]), traduz('validaAdvpl.functionNoCommented', objeto.local), Erro_1.Severity.Warning));
                    }
                }
                //Validação comentários sem funções
                for (var idx = 0; idx < comentFuncoes.length; idx++) {
                    let comentario = comentFuncoes[idx];
                    let achou = false;
                    for (var idx4 = 0; idx4 < funcoes.length; idx4++) {
                        let funcao = funcoes[idx4];
                        achou = achou || comentario[0] === funcao[0];
                    }
                    if (!achou) {
                        objeto.aErros.push(new Erro_1.Erro(parseInt(comentario[1]), parseInt(comentario[1]), traduz('validaAdvpl.CommentNoFunction', objeto.local), Erro_1.Severity.Warning));
                    }
                }
                //Validador de includes
                let oInclude = new include_1.Include(objeto.local);
                oInclude.valida(objeto, conteudoSComentario);
                //Conta os erros por tipo e totaliza no objeto
                objeto.hint = 0;
                objeto.information = 0;
                objeto.warning = 0;
                objeto.error = 0;
                for (var idx = 0; idx < objeto.aErros.length; idx++) {
                    let erro = objeto.aErros[idx];
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
                }
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
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Erro_1 = __webpack_require__(38);
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
/* 38 */
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
/* 39 */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"analise-advpl\",\"version\":\"5.0.6\",\"description\":\"Extension of ADVPL code analysis.\",\"types\":\"lib/index.d.ts\",\"main\":\"lib/index.js\",\"scripts\":{\"compile\":\"tsc -p ./\",\"prepare\":\"npm run compile\",\"test\":\"npm run compile && mocha \\\"./test/validaadvpl.js\\\"\"},\"keywords\":[],\"author\":\"Robson Rogério Silva\",\"license\":\"ISC\",\"dependencies\":{\"@types/node\":\"^10.14.14\",\"asserts\":\"^4.0.2\",\"chai\":\"^4.2.0\",\"file-system\":\"^2.2.2\",\"globby\":\"^10.0.1\",\"i18n\":\"^0.8.3\",\"mocha\":\"^5.2.0\"},\"devDependencies\":{\"typescript\":\"^3.5.3\",\"vscode\":\"^1.1.36\"}}");

/***/ }),
/* 40 */
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
const Erro_1 = __webpack_require__(38);
const fonte_1 = __webpack_require__(35);
const ItemProject_1 = __webpack_require__(41);
const globby = __importStar(__webpack_require__(42));
const fileSystem = __importStar(__webpack_require__(6));
const validaAdvpl_1 = __webpack_require__(36);
const package_json_1 = __webpack_require__(39);
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
    validaProjeto(pathsProject) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                this.projeto = [];
                let startTime = new Date();
                if (this.log) {
                    console.log(startTime);
                    console.log('Analise de Projeto');
                }
                // valida arquivos
                let promisses;
                promisses = yield this.criaPromises(pathsProject);
                Promise.all(promisses).then((validacoes) => {
                    for (var idx = 0; idx < validacoes.length; idx++) {
                        let validacao = validacoes[idx];
                        let itemProjeto = new ItemProject_1.ItemModel();
                        itemProjeto.content = validacao.conteudoFonte;
                        itemProjeto.errors = validacao.aErros;
                        itemProjeto.fonte = validacao.fonte;
                        this.projeto.push(itemProjeto);
                    }
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
    criaPromises(pathsProject) {
        return __awaiter(this, void 0, void 0, function* () {
            let promisses = [];
            // monta expressão para buscar arquivos
            let globexp = [];
            for (var i = 0; i < this.advplExtensions.length; i++) {
                globexp.push(`**/*.${this.advplExtensions[i]}`);
            }
            for (var i = 0; i < pathsProject.length; i++) {
                let pathProject = pathsProject[i];
                // busca arquivos na pasta
                let files = yield globby.sync(globexp, {
                    cwd: pathProject,
                    caseSensitiveMatch: false
                });
                for (var j = 0; j < files.length; j++) {
                    let fileName = files[j];
                    let valida = new validaAdvpl_1.ValidaAdvpl(this.comentFontPad, this.local, this.log);
                    valida.ownerDb = this.ownerDb;
                    valida.empresas = this.empresas;
                    if (this.log) {
                        console.log('Arquivo: ' + fileName);
                    }
                    let conteudo = fileSystem.readFileSync(pathsProject + '\\' + fileName, 'latin1');
                    promisses.push(valida.validacao(conteudo, pathsProject + '\\' + fileName));
                }
            }
            return promisses;
        });
    }
    verificaDuplicados() {
        return new Promise((resolve) => {
            let startTime = new Date();
            console.log('Start Duplicados');
            let listaFuncoes = [];
            let funcoesDuplicadas = [];
            let listaArquivos = [];
            let arquivosDuplicados = [];
            for (var idx = 0; idx < this.projeto.length; idx++) {
                let item = this.projeto[idx];
                let fonte = item.fonte;
                //verifica se o fonte ainda existe
                try {
                    fileSystem.statSync(fonte.fonte);
                    for (var idx2 = 0; idx2 < fonte.funcoes.length; idx2++) {
                        let funcao = fonte.funcoes[idx2];
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
                    }
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
            }
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
            for (var idx = 0; idx < this.projeto.length; idx++) {
                let item = this.projeto[idx];
                let fonte = item.fonte;
                for (var idx2 = 0; idx2 < fonte.funcoes.length; idx2++) {
                    let funcao = fonte.funcoes[idx2];
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
                }
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
            }
            if (this.log) {
                let errosContagem = this.contaErros();
                console.log(`\t${errosContagem.errors} Errors`);
                console.log(`\t${errosContagem.warnings} Warnings`);
                console.log(`\t${errosContagem.information} Informations`);
                console.log(`\t${errosContagem.hint} Hints`);
            }
            if (this.log) {
                // calcula tempo gasto
                let endTime = new Date();
                let timeDiff = endTime - startTime; //in ms
                // strip the ms
                timeDiff /= 1000;
                // get seconds
                let seconds = Math.round(timeDiff);
                console.log('Terminou! (' + seconds + ' segundos) Duplicados');
            }
            resolve();
        });
    }
    contaErros() {
        let erros = { errors: 0, warnings: 0, information: 0, hint: 0 };
        for (var idx = 0; idx < this.projeto.length; idx++) {
            let item = this.projeto[idx];
            for (var idx2 = 0; idx2 < item.errors.length; idx2++) {
                let erro = item.errors[idx2];
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
            }
        }
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
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ItemModel {
}
exports.ItemModel = ItemModel;
//# sourceMappingURL=ItemProject.js.map

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const fs = __webpack_require__(6);
const arrayUnion = __webpack_require__(43);
const merge2 = __webpack_require__(44);
const glob = __webpack_require__(46);
const fastGlob = __webpack_require__(63);
const dirGlob = __webpack_require__(130);
const gitignore = __webpack_require__(132);
const {FilterStream, UniqueStream} = __webpack_require__(135);

const DEFAULT_FILTER = () => false;

const isNegative = pattern => pattern[0] === '!';

const assertPatternsInput = patterns => {
	if (!patterns.every(pattern => typeof pattern === 'string')) {
		throw new TypeError('Patterns must be a string or an array of strings');
	}
};

const checkCwdOption = (options = {}) => {
	if (!options.cwd) {
		return;
	}

	let stat;
	try {
		stat = fs.statSync(options.cwd);
	} catch (_) {
		return;
	}

	if (!stat.isDirectory()) {
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
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (...arguments_) => {
	return [...new Set([].concat(...arguments_))];
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * merge2
 * https://github.com/teambition/merge2
 *
 * Copyright (c) 2014-2016 Teambition
 * Licensed under the MIT license.
 */
const Stream = __webpack_require__(45)
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
/* 45 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 46 */
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
var rp = __webpack_require__(47)
var minimatch = __webpack_require__(49)
var Minimatch = minimatch.Minimatch
var inherits = __webpack_require__(53)
var EE = __webpack_require__(55).EventEmitter
var path = __webpack_require__(8)
var assert = __webpack_require__(56)
var isAbsolute = __webpack_require__(57)
var globSync = __webpack_require__(58)
var common = __webpack_require__(59)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __webpack_require__(60)
var util = __webpack_require__(15)
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __webpack_require__(62)

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
/* 47 */
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
var old = __webpack_require__(48)

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
/* 48 */
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
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __webpack_require__(8)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __webpack_require__(50)

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
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var concatMap = __webpack_require__(51);
var balanced = __webpack_require__(52);

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
/* 51 */
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
/* 52 */
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
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

try {
  var util = __webpack_require__(15);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __webpack_require__(54);
}


/***/ }),
/* 54 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 57 */
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
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = globSync
globSync.GlobSync = GlobSync

var fs = __webpack_require__(6)
var rp = __webpack_require__(47)
var minimatch = __webpack_require__(49)
var Minimatch = minimatch.Minimatch
var Glob = __webpack_require__(46).Glob
var util = __webpack_require__(15)
var path = __webpack_require__(8)
var assert = __webpack_require__(56)
var isAbsolute = __webpack_require__(57)
var common = __webpack_require__(59)
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
/* 59 */
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
var minimatch = __webpack_require__(49)
var isAbsolute = __webpack_require__(57)
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
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var wrappy = __webpack_require__(61)
var reqs = Object.create(null)
var once = __webpack_require__(62)

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
/* 61 */
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
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var wrappy = __webpack_require__(61)
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
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const taskManager = __webpack_require__(64);
const async_1 = __webpack_require__(93);
const stream_1 = __webpack_require__(126);
const sync_1 = __webpack_require__(127);
const settings_1 = __webpack_require__(129);
const utils = __webpack_require__(65);
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
// https://github.com/typescript-eslint/typescript-eslint/issues/60
// eslint-disable-next-line no-redeclare
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
    function isDynamicPattern(source, options) {
        assertPatternsInput(source);
        const settings = new settings_1.default(options);
        return utils.pattern.isDynamicPattern(source, settings);
    }
    FastGlob.isDynamicPattern = isDynamicPattern;
    function escapePath(source) {
        assertPatternsInput(source);
        return utils.path.escape(source);
    }
    FastGlob.escapePath = escapePath;
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
    return typeof source === 'string';
}
module.exports = FastGlob;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(65);
function generate(patterns, settings) {
    const positivePatterns = getPositivePatterns(patterns);
    const negativePatterns = getNegativePatternsAsPositive(patterns, settings.ignore);
    const staticPatterns = positivePatterns.filter((pattern) => utils.pattern.isStaticPattern(pattern, settings));
    const dynamicPatterns = positivePatterns.filter((pattern) => utils.pattern.isDynamicPattern(pattern, settings));
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
    const group = {};
    return patterns.reduce((collection, pattern) => {
        const base = utils.pattern.getBaseDirectory(pattern);
        if (base in collection) {
            collection[base].push(pattern);
        }
        else {
            collection[base] = [pattern];
        }
        return collection;
    }, group);
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
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const array = __webpack_require__(66);
exports.array = array;
const errno = __webpack_require__(67);
exports.errno = errno;
const fs = __webpack_require__(68);
exports.fs = fs;
const path = __webpack_require__(69);
exports.path = path;
const pattern = __webpack_require__(70);
exports.pattern = pattern;
const stream = __webpack_require__(92);
exports.stream = stream;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function flatten(items) {
    return items.reduce((collection, item) => [].concat(collection, item), []);
}
exports.flatten = flatten;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isEnoentCodeError(error) {
    return error.code === 'ENOENT';
}
exports.isEnoentCodeError = isEnoentCodeError;


/***/ }),
/* 68 */
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
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(8);
const UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([*?|(){}[\]]|^!|[@+!](?=\())/g;
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
function escape(pattern) {
    return pattern.replace(UNESCAPED_GLOB_SYMBOLS_RE, '\\$2');
}
exports.escape = escape;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(8);
const globParent = __webpack_require__(71);
const micromatch = __webpack_require__(75);
const GLOBSTAR = '**';
const ESCAPE_SYMBOL = '\\';
const COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
const REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[.*]/;
const REGEX_GROUP_SYMBOLS_RE = /(?:^|[^@!*?+])\(.*\|.*\)/;
const GLOB_EXTENSION_SYMBOLS_RE = /[@!*?+]\(.*\)/;
const BRACE_EXPANSIONS_SYMBOLS_RE = /{.*(?:,|\.\.).*}/;
function isStaticPattern(pattern, options = {}) {
    return !isDynamicPattern(pattern, options);
}
exports.isStaticPattern = isStaticPattern;
function isDynamicPattern(pattern, options = {}) {
    /**
     * When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
     * filepath directly (without read directory).
     */
    if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) {
        return true;
    }
    if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) {
        return true;
    }
    if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) {
        return true;
    }
    if (options.braceExpansion !== false && BRACE_EXPANSIONS_SYMBOLS_RE.test(pattern)) {
        return true;
    }
    return false;
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
    return globParent(pattern, { flipBackslashes: false });
}
exports.getBaseDirectory = getBaseDirectory;
function hasGlobStar(pattern) {
    return pattern.includes(GLOBSTAR);
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
    const filepath = entry.replace(/^\.[\\/]/, '');
    return patternsRe.some((patternRe) => patternRe.test(filepath));
}
exports.matchAny = matchAny;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isGlob = __webpack_require__(72);
var pathPosixDirname = __webpack_require__(8).posix.dirname;
var isWin32 = __webpack_require__(74).platform() === 'win32';

var slash = '/';
var backslash = /\\/g;
var enclosure = /[\{\[].*[\/]*.*[\}\]]$/;
var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
var escaped = /\\([\*\?\|\[\]\(\)\{\}])/g;

/**
 * @param {string} str
 * @param {Object} opts
 * @param {boolean} [opts.flipBackslashes=true]
 */
module.exports = function globParent(str, opts) {
  var options = Object.assign({ flipBackslashes: true }, opts);

  // flip windows path separators
  if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
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
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isExtglob = __webpack_require__(73);
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
/* 73 */
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
/* 74 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const util = __webpack_require__(15);
const braces = __webpack_require__(76);
const picomatch = __webpack_require__(86);
const utils = __webpack_require__(89);
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
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const stringify = __webpack_require__(77);
const compile = __webpack_require__(79);
const expand = __webpack_require__(83);
const parse = __webpack_require__(84);

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
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const utils = __webpack_require__(78);

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
/* 78 */
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
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fill = __webpack_require__(80);
const utils = __webpack_require__(78);

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
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */



const util = __webpack_require__(15);
const toRegexRange = __webpack_require__(81);

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
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * to-regex-range <https://github.com/micromatch/to-regex-range>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */



const isNumber = __webpack_require__(82);

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
/* 82 */
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
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fill = __webpack_require__(80);
const stringify = __webpack_require__(77);
const utils = __webpack_require__(78);

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
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const stringify = __webpack_require__(77);

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
} = __webpack_require__(85);

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
/* 85 */
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
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(87);


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(8);
const scan = __webpack_require__(88);
const parse = __webpack_require__(91);
const utils = __webpack_require__(89);
const constants = __webpack_require__(90);

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
    const fns = glob.map(input => picomatch(input, options, returnState));
    return str => {
      for (const isMatch of fns) {
        const state = isMatch(str);
        if (state) return state;
      }
      return false;
    };
  }

  if (typeof glob !== 'string' || glob === '') {
    throw new TypeError('Expected pattern to be a non-empty string');
  }

  const opts = options || {};
  const posix = utils.isWindows(options);
  const regex = picomatch.makeRe(glob, options, false, true);
  const state = regex.state;
  delete regex.state;

  let isIgnored = () => false;
  if (opts.ignore) {
    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
  }

  const matcher = (input, returnObject = false) => {
    const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
    const result = { glob, state, regex, posix, input, output, match, isMatch };

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

  const opts = options || {};
  const format = opts.format || (posix ? utils.toPosixSlashes : null);
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
  const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
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

  const opts = options || {};
  const prepend = opts.contains ? '' : '^';
  const append = opts.contains ? '' : '$';
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

  const regex = picomatch.toRegex(source, options);
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
    const opts = options || {};
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

picomatch.constants = constants;

/**
 * Expose "picomatch"
 */

module.exports = picomatch;


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const utils = __webpack_require__(89);
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
  CHAR_RIGHT_SQUARE_BRACKET  /* ] */
} = __webpack_require__(90);

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
  const opts = options || {};
  const length = input.length - 1;
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

  const eos = () => index >= length;
  const advance = () => {
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

    const isExtglobChar = code === CHAR_PLUS
      || code === CHAR_AT
      || code === CHAR_EXCLAMATION_MARK;

    if (isExtglobChar && input.charCodeAt(index + 1) === CHAR_LEFT_PARENTHESES) {
      isGlob = true;
      break;
    }

    if (!opts.nonegate && code === CHAR_EXCLAMATION_MARK && index === start) {
      negated = true;
      start++;
      continue;
    }

    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
      while (!eos() && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = true;
          code = advance();
          continue;
        }

        if (code === CHAR_RIGHT_PARENTHESES) {
          isGlob = true;
          break;
        }
      }
    }

    if (isGlob) {
      break;
    }
  }

  if (opts.noext === true) {
    isGlob = false;
  }

  let prefix = '';
  const orig = input;
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
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(8);
const win32 = process.platform === 'win32';
const {
  REGEX_BACKSLASH,
  REGEX_REMOVE_BACKSLASH,
  REGEX_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_GLOBAL
} = __webpack_require__(90);

exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
exports.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, '/');

exports.removeBackslashes = str => {
  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
    return match === '\\' ? '' : match;
  });
};

exports.supportsLookbehinds = () => {
  const segs = process.version.slice(1).split('.').map(Number);
  if (segs.length === 3 && segs[0] >= 9 || (segs[0] === 8 && segs[1] >= 10)) {
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
  const idx = input.lastIndexOf(char, lastIdx);
  if (idx === -1) return input;
  if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
  return input.slice(0, idx) + '\\' + input.slice(idx);
};

exports.removePrefix = (input, state = {}) => {
  let output = input;
  if (output.startsWith('./')) {
    output = output.slice(2);
    state.prefix = './';
  }
  return output;
};

exports.wrapOutput = (input, state = {}, options = {}) => {
  const prepend = options.contains ? '' : '^';
  const append = options.contains ? '' : '$';

  let output = `${prepend}(?:${input})${append}`;
  if (state.negated === true) {
    output = `(?:^(?!${output}).*$)`;
  }
  return output;
};


/***/ }),
/* 90 */
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
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
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
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const constants = __webpack_require__(90);
const utils = __webpack_require__(89);

/**
 * Constants
 */

const {
  MAX_LENGTH,
  POSIX_REGEX_SOURCE,
  REGEX_NON_SPECIAL_CHARS,
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
  const value = `[${args.join('-')}]`;

  try {
    /* eslint-disable-next-line no-new */
    new RegExp(value);
  } catch (ex) {
    return args.map(v => utils.escapeRegex(v)).join('..');
  }

  return value;
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

  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;

  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  const bos = { type: 'bos', value: '', output: opts.prepend || '' };
  const tokens = [bos];

  const capture = opts.capture ? '' : '?:';
  const win32 = utils.isWindows(options);

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

  const nodot = opts.dot ? '' : NO_DOT;
  const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
  let star = opts.bash === true ? globstar(opts) : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  // minimatch options support
  if (typeof opts.noext === 'boolean') {
    opts.noextglob = opts.noext;
  }

  const state = {
    input,
    index: -1,
    start: 0,
    dot: opts.dot === true,
    consumed: '',
    output: '',
    prefix: '',
    backtrack: false,
    negated: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    tokens
  };

  input = utils.removePrefix(input, state);
  len = input.length;

  const extglobs = [];
  const stack = [];
  let prev = bos;
  let value;

  /**
   * Tokenizing helpers
   */

  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index];
  const remaining = () => input.slice(state.index + 1);
  const consume = (value = '', num = 0) => {
    state.consumed += value;
    state.index += num;
  };
  const append = token => {
    state.output += token.output != null ? token.output : token.value;
    consume(token.value);
  };

  const negate = () => {
    let count = 1;

    while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
      advance();
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
      const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
      const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));

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
    const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    const output = (opts.capture ? '(' : '') + token.open;

    increment('parens');
    push({ type, value, output: state.output ? '' : ONE_CHAR });
    push({ type: 'paren', extglob: true, value: advance(), output });
    extglobs.push(token);
  };

  const extglobClose = token => {
    let output = token.close + (opts.capture ? ')' : '');

    if (token.type === 'negate') {
      let extglobStar = star;

      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
        extglobStar = globstar(opts);
      }

      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
        output = token.close = ')$))' + extglobStar;
      }

      if (token.prev.type === 'bos' && eos()) {
        state.negatedExtglob = true;
      }
    }

    push({ type: 'paren', extglob: true, value, output });
    decrement('parens');
  };

  /**
   * Fast paths
   */

  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
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

    if (output === input && opts.contains === true) {
      state.output = input;
      return state;
    }

    state.output = utils.wrapOutput(output, state, options);
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
      const next = peek();

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
      const match = /^\\+/.exec(remaining());
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
        const inner = prev.value.slice(1);
        if (inner.includes('[')) {
          prev.posix = true;

          if (inner.includes(':')) {
            const idx = prev.value.lastIndexOf('[');
            const pre = prev.value.slice(0, idx);
            const rest = prev.value.slice(idx + 2);
            const posix = POSIX_REGEX_SOURCE[rest];
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
      increment('parens');
      push({ type: 'paren', value });
      continue;
    }

    if (value === ')') {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError('opening', '('));
      }

      const extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }

      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
      decrement('parens');
      continue;
    }

    /**
     * Square brackets
     */

    if (value === '[') {
      if (opts.nobracket === true || !remaining().includes(']')) {
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

      const prevValue = prev.value.slice(1);
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

      const escaped = utils.escapeRegex(prev.value);
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
      increment('braces');
      push({ type: 'brace', value, output: '(' });
      continue;
    }

    if (value === '}') {
      if (opts.nobrace === true || state.braces === 0) {
        push({ type: 'text', value, output: value });
        continue;
      }

      let output = ')';

      if (state.dots === true) {
        const arr = tokens.slice();
        const range = [];

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
      if (prev.type === 'dot' && state.index === state.start + 1) {
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

      if ((state.braces + state.parens) === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
        push({ type: 'text', value, output: DOT_LITERAL });
        continue;
      }

      push({ type: 'dot', value, output: DOT_LITERAL });
      continue;
    }

    /**
     * Question marks
     */

    if (value === '?') {
      const isGroup = prev && prev.value === '(';
      if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('qmark', value);
        continue;
      }

      if (prev && prev.type === 'paren') {
        const next = peek();
        let output = value;

        if (next === '<' && !utils.supportsLookbehinds()) {
          throw new Error('Node.js v10 or higher is required for regex lookbehinds');
        }

        if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
          output = '\\' + value;
        }

        push({ type: 'text', value, output });
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

      if ((prev && prev.value === '(') || opts.regex === false) {
        push({ type: 'plus', value, output: PLUS_LITERAL });
        continue;
      }

      if ((prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) || state.parens > 0) {
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
        push({ type: 'at', extglob: true, value, output: '' });
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

      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
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
      consume(value);
      continue;
    }

    let rest = remaining();
    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
      extglobOpen('star', value);
      continue;
    }

    if (prev.type === 'star') {
      if (opts.noglobstar === true) {
        consume(value);
        continue;
      }

      const prior = prev.prev;
      const before = prior.prev;
      const isStart = prior.type === 'slash' || prior.type === 'bos';
      const afterStar = before && (before.type === 'star' || before.type === 'globstar');

      if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
      const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      // strip consecutive `/**/`
      while (rest.slice(0, 3) === '/**') {
        const after = input[state.index + 4];
        if (after && after !== '/') {
          break;
        }
        rest = rest.slice(3);
        consume('/**', 3);
      }

      if (prior.type === 'bos' && eos()) {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = '(?:' + prior.output;

        prev.type = 'globstar';
        prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
        prev.value += value;

        state.output += prior.output + prev.output;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
        const end = rest[1] !== void 0 ? '|$' : '';

        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = '(?:' + prior.output;

        prev.type = 'globstar';
        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
        prev.value += value;

        state.output += prior.output + prev.output;
        consume(value + advance());

        push({ type: 'slash', value, output: '' });
        continue;
      }

      if (prior.type === 'bos' && rest[0] === '/') {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
        state.output = prev.output;
        consume(value + advance());
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
      consume(value);
      continue;
    }

    const token = { type: 'star', value, output: star };

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

    for (const token of state.tokens) {
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
  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  const len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  input = REPLACEMENTS[input] || input;
  const win32 = utils.isWindows(options);

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

  const nodot = opts.dot ? NO_DOTS : NO_DOT;
  const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
  const capture = opts.capture ? '' : '?:';
  const state = { negated: false, prefix: '' };
  let star = opts.bash === true ? '.*?' : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  const globstar = (opts) => {
    if (opts.noglobstar === true) return star;
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
        const match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match) return;

        const source = create(match[1], options);
        if (!source) return;

        return source + DOT_LITERAL + match[2];
      }
    }
  };

  const output = utils.removePrefix(input, state);
  let source = create(output);

  if (source && opts.strictSlashes !== true) {
    source += `${SLASH_LITERAL}?`;
  }

  return source;
};

module.exports = parse;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const merge2 = __webpack_require__(44);
function merge(streams) {
    const mergedStream = merge2(streams);
    streams.forEach((stream) => {
        stream.once('error', (error) => mergedStream.emit('error', error));
    });
    mergedStream.once('close', () => propagateCloseEventToSources(streams));
    mergedStream.once('end', () => propagateCloseEventToSources(streams));
    return mergedStream;
}
exports.merge = merge;
function propagateCloseEventToSources(streams) {
    streams.forEach((stream) => stream.emit('close'));
}


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(94);
const provider_1 = __webpack_require__(121);
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
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(45);
const fsStat = __webpack_require__(95);
const fsWalk = __webpack_require__(100);
const reader_1 = __webpack_require__(120);
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
                return error === null ? resolve(stats) : reject(error);
            });
        });
    }
}
exports.default = ReaderStream;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async = __webpack_require__(96);
const sync = __webpack_require__(97);
const settings_1 = __webpack_require__(98);
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
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function read(path, settings, callback) {
    settings.fs.lstat(path, (lstatError, lstat) => {
        if (lstatError !== null) {
            return callFailureCallback(callback, lstatError);
        }
        if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
            return callSuccessCallback(callback, lstat);
        }
        settings.fs.stat(path, (statError, stat) => {
            if (statError !== null) {
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
/* 97 */
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
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(99);
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
/* 99 */
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
    if (fsMethods === undefined) {
        return exports.FILE_SYSTEM_ADAPTER;
    }
    return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
}
exports.createFileSystemAdapter = createFileSystemAdapter;


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = __webpack_require__(101);
const stream_1 = __webpack_require__(116);
const sync_1 = __webpack_require__(117);
const settings_1 = __webpack_require__(119);
exports.Settings = settings_1.default;
function walk(directory, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        return new async_1.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
    }
    new async_1.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
}
exports.walk = walk;
function walkSync(directory, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    const provider = new sync_1.default(directory, settings);
    return provider.read();
}
exports.walkSync = walkSync;
function walkStream(directory, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    const provider = new stream_1.default(directory, settings);
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
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = __webpack_require__(102);
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
            callSuccessCallback(callback, [...this._storage]);
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
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __webpack_require__(55);
const fsScandir = __webpack_require__(103);
const fastq = __webpack_require__(112);
const common = __webpack_require__(114);
const reader_1 = __webpack_require__(115);
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
    _pushToQueue(directory, base) {
        const queueItem = { directory, base };
        this._queue.push(queueItem, (error) => {
            if (error !== null) {
                this._handleError(error);
            }
        });
    }
    _worker(item, done) {
        this._scandir(item.directory, this._settings.fsScandirSettings, (error, entries) => {
            if (error !== null) {
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
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async = __webpack_require__(104);
const sync = __webpack_require__(109);
const settings_1 = __webpack_require__(110);
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
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsStat = __webpack_require__(95);
const rpl = __webpack_require__(105);
const constants_1 = __webpack_require__(106);
const utils = __webpack_require__(107);
function read(directory, settings, callback) {
    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(directory, settings, callback);
    }
    return readdir(directory, settings, callback);
}
exports.read = read;
function readdirWithFileTypes(directory, settings, callback) {
    settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
        if (readdirError !== null) {
            return callFailureCallback(callback, readdirError);
        }
        const entries = dirents.map((dirent) => ({
            dirent,
            name: dirent.name,
            path: `${directory}${settings.pathSegmentSeparator}${dirent.name}`
        }));
        if (!settings.followSymbolicLinks) {
            return callSuccessCallback(callback, entries);
        }
        const tasks = entries.map((entry) => makeRplTaskEntry(entry, settings));
        rpl(tasks, (rplError, rplEntries) => {
            if (rplError !== null) {
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
            if (statError !== null) {
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
function readdir(directory, settings, callback) {
    settings.fs.readdir(directory, (readdirError, names) => {
        if (readdirError !== null) {
            return callFailureCallback(callback, readdirError);
        }
        const filepaths = names.map((name) => `${directory}${settings.pathSegmentSeparator}${name}`);
        const tasks = filepaths.map((filepath) => {
            return (done) => fsStat.stat(filepath, settings.fsStatSettings, done);
        });
        rpl(tasks, (rplError, results) => {
            if (rplError !== null) {
                return callFailureCallback(callback, rplError);
            }
            const entries = [];
            names.forEach((name, index) => {
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
            });
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
/* 105 */
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
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const NODE_PROCESS_VERSION_PARTS = process.versions.node.split('.');
const MAJOR_VERSION = parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
const MINOR_VERSION = parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
const SUPPORTED_MAJOR_VERSION = 10;
const SUPPORTED_MINOR_VERSION = 10;
const IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
const IS_MATCHED_BY_MAJOR_AND_MINOR = MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
/**
 * IS `true` for Node.js 10.10 and greater.
 */
exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(108);
exports.fs = fs;


/***/ }),
/* 108 */
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
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsStat = __webpack_require__(95);
const constants_1 = __webpack_require__(106);
const utils = __webpack_require__(107);
function read(directory, settings) {
    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(directory, settings);
    }
    return readdir(directory, settings);
}
exports.read = read;
function readdirWithFileTypes(directory, settings) {
    const dirents = settings.fs.readdirSync(directory, { withFileTypes: true });
    return dirents.map((dirent) => {
        const entry = {
            dirent,
            name: dirent.name,
            path: `${directory}${settings.pathSegmentSeparator}${dirent.name}`
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
function readdir(directory, settings) {
    const names = settings.fs.readdirSync(directory);
    return names.map((name) => {
        const entryPath = `${directory}${settings.pathSegmentSeparator}${name}`;
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
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(8);
const fsStat = __webpack_require__(95);
const fs = __webpack_require__(111);
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
/* 111 */
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
    if (fsMethods === undefined) {
        return exports.FILE_SYSTEM_ADAPTER;
    }
    return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
}
exports.createFileSystemAdapter = createFileSystemAdapter;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var reusify = __webpack_require__(113)

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
/* 113 */
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
/* 114 */
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
    return filepath.split(/[\\/]/).join(separator);
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
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common = __webpack_require__(114);
class Reader {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
    }
}
exports.default = Reader;


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(45);
const async_1 = __webpack_require__(102);
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
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const sync_1 = __webpack_require__(118);
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
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsScandir = __webpack_require__(103);
const common = __webpack_require__(114);
const reader_1 = __webpack_require__(115);
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
        return [...this._storage];
    }
    _pushToQueue(directory, base) {
        this._queue.add({ directory, base });
    }
    _handleQueue() {
        for (const item of this._queue.values()) {
            this._handleDirectory(item.directory, item.base);
        }
    }
    _handleDirectory(directory, base) {
        try {
            const entries = this._scandir(directory, this._settings.fsScandirSettings);
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
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(8);
const fsScandir = __webpack_require__(103);
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
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(8);
const fsStat = __webpack_require__(95);
const utils = __webpack_require__(65);
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
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(8);
const deep_1 = __webpack_require__(122);
const entry_1 = __webpack_require__(123);
const error_1 = __webpack_require__(124);
const entry_2 = __webpack_require__(125);
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
            posix: true,
            strictSlashes: false
        };
    }
}
exports.default = Provider;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(65);
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
    _isSkippedByNegativePatterns(entry, negativeRe) {
        return !utils.pattern.matchAny(entry.path, negativeRe);
    }
}
exports.default = DeepFilter;


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(65);
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
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(65);
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
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(65);
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
        return Object.assign(Object.assign({}, entry), { path: filepath });
    }
}
exports.default = EntryTransformer;


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(45);
const stream_2 = __webpack_require__(94);
const provider_1 = __webpack_require__(121);
class ProviderStream extends provider_1.default {
    constructor() {
        super(...arguments);
        this._reader = new stream_2.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const source = this.api(root, task, options);
        const destination = new stream_1.Readable({ objectMode: true, read: () => { } });
        source
            .once('error', (error) => destination.emit('error', error))
            .on('data', (entry) => destination.emit('data', options.transform(entry)))
            .once('end', () => destination.emit('end'));
        destination
            .once('close', () => source.destroy());
        return destination;
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
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const sync_1 = __webpack_require__(128);
const provider_1 = __webpack_require__(121);
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
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsStat = __webpack_require__(95);
const fsWalk = __webpack_require__(100);
const reader_1 = __webpack_require__(120);
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
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(6);
const os = __webpack_require__(74);
const CPU_COUNT = os.cpus().length;
exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
    lstat: fs.lstat,
    lstatSync: fs.lstatSync,
    stat: fs.stat,
    statSync: fs.statSync,
    readdir: fs.readdir,
    readdirSync: fs.readdirSync
};
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
        return Object.assign(Object.assign({}, exports.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
    }
}
exports.default = Settings;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const path = __webpack_require__(8);
const pathType = __webpack_require__(131);

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
/* 131 */
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
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const {promisify} = __webpack_require__(15);
const fs = __webpack_require__(6);
const path = __webpack_require__(8);
const fastGlob = __webpack_require__(63);
const gitIgnore = __webpack_require__(133);
const slash = __webpack_require__(134);

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
/* 133 */
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
const REPLACERS = [

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
  ],

  // ending
  [
    // 'js' will not match 'js.'
    // 'ab' will not match 'abc'
    /(?:[^*])$/,

    // WTF!
    // https://git-scm.com/docs/gitignore
    // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
    // which re-fixes #24, #38

    // > If there is a separator at the end of the pattern then the pattern
    // > will only match directories, otherwise the pattern can match both
    // > files and directories.

    // 'js*' will not match 'a.js'
    // 'js/' will not match 'a.js'
    // 'js' will match 'a.js' and 'a.js/'
    match => /\/$/.test(match)
      // foo/ will not match 'foo'
      ? `${match}$`
      // foo matches 'foo' and 'foo/'
      : `${match}(?=$|\\/$)`
  ],

  // starting
  [
    // there will be no leading '/'
    //   (which has been replaced by section "leading slash")
    // If starts with '**', adding a '^' to the regular expression also works
    /^(?=[^^])/,
    function startingReplacer () {
      // If has a slash `/` at the beginning or middle
      return !/\/(?!$)/.test(this)
        // > Prior to 2.22.1
        // > If the pattern does not contain a slash /,
        // >   Git treats it as a shell glob pattern
        // Actually, if there is only a trailing slash,
        //   git also treats it as a shell glob pattern

        // After 2.22.1 (compatible but clearer)
        // > If there is a separator at the beginning or middle (or both)
        // > of the pattern, then the pattern is relative to the directory
        // > level of the particular .gitignore file itself.
        // > Otherwise the pattern may also match at any level below
        // > the .gitignore level.
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

// A simple cache, because an ignore rule only has only one certain meaning
const regexCache = Object.create(null)

// @param {pattern}
const makeRegex = (pattern, negative, ignorecase) => {
  const r = regexCache[pattern]
  if (r) {
    return r
  }

  // const replacers = negative
  //   ? NEGATIVE_REPLACERS
  //   : POSITIVE_REPLACERS

  const source = REPLACERS.reduce(
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
/* 134 */
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
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const {Transform} = __webpack_require__(45);

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


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(1);
const formmatingRules_1 = __webpack_require__(137);
class Formatting {
    constructor() {
        this.lineContinue = false;
        // Regras de estruturas que não sofrem identação interna
        this.structsNoIdent = ['beginsql (alias)?', 'Comentários'];
    }
    provideDocumentFormattingEdits(document, options, token) {
        const formattingRules = new formmatingRules_1.FormattingRules();
        const tab = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';
        let identBlock = "";
        let cont = 0;
        let result = [];
        const lc = document.lineCount;
        const rulesIgnored = formattingRules.getClosedStructures().filter((rule) => { return this.structsNoIdent.indexOf(rule.id) !== -1; });
        for (let nl = 0; nl < lc; nl++) {
            const line = document.lineAt(nl);
            let lastRule = formattingRules.openStructures[formattingRules.openStructures.length - 1];
            let foundIgnore = rulesIgnored.filter((rule) => { return rule.id === lastRule; });
            // dentro do BeginSql não mexe na identação
            if ((foundIgnore.length > 0 && !line.text.match(foundIgnore[0].end))) {
                result.push(vscode_1.TextEdit.replace(line.range, line.text.trimRight()));
            }
            else {
                if ((!line.isEmptyOrWhitespace) && (formattingRules.match(line.text))) {
                    let ruleMatch = formattingRules.getLastMatch();
                    if (ruleMatch) {
                        if (ruleMatch.decrement) {
                            cont = cont < 1 ? 0 : cont - 1;
                            identBlock = tab.repeat(cont);
                        }
                    }
                    const newLine = line.text.replace(/(\s*)?/, identBlock + (this.lineContinue ? tab : "")).trimRight();
                    result.push(vscode_1.TextEdit.replace(line.range, newLine));
                    this.lineContinue = newLine.endsWith(';');
                    if (ruleMatch) {
                        if (ruleMatch.increment) {
                            cont++;
                            identBlock = tab.repeat(cont);
                        }
                    }
                }
                else {
                    let newLine = '';
                    if (!line.isEmptyOrWhitespace) {
                        newLine = line.text.replace(/(\s*)?/, identBlock + (this.lineContinue ? tab : "")).trimRight();
                    }
                    result.push(vscode_1.TextEdit.replace(line.range, newLine));
                    this.lineContinue = newLine.endsWith(';');
                }
            }
        }
        return result;
    }
}
class RangeFormatting {
    provideDocumentRangeFormattingEdits(document, range, options, token) {
        throw new Error("Method not implemented.");
    }
}
const formatter = new Formatting();
const rangeFormatter = new RangeFormatting();
function formattingEditProvider() {
    return formatter;
}
exports.formattingEditProvider = formattingEditProvider;
function rangeFormattingEditProvider() {
    return rangeFormatter;
}
exports.rangeFormattingEditProvider = rangeFormattingEditProvider;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __webpack_require__(15);
class FormattingRules {
    constructor() {
        this.lastMatch = null;
        this.insideOpenStructure = false;
        this.openStructures = [];
    }
    instanceOfClosedStructureRule(object) {
        return 'begin' in object;
    }
    match(line) {
        let lastRule = this.openStructures[this.openStructures.length - 1];
        if (line.trim().length === 0) {
            return false;
        }
        let finddedRule = null;
        this.getRules().every((rule) => {
            if (this.instanceOfClosedStructureRule(rule)) {
                if (line.match(rule.begin)) {
                    finddedRule = { rule: rule, increment: true, decrement: false };
                    this.openStructures.push(rule.id);
                }
                else if ((rule.middle) && (line.match(rule.middle))) {
                    finddedRule = { rule: rule, increment: true, decrement: true };
                }
                else if (line.match(rule.end) && lastRule === rule.id) {
                    finddedRule = { rule: rule, increment: false, decrement: true };
                    this.openStructures.pop();
                }
            }
            return util_1.isNull(finddedRule);
        });
        if (!util_1.isNull(finddedRule)) {
            this.lastMatch = finddedRule;
            return true;
        }
        return false;
    }
    getLastMatch() {
        return this.lastMatch;
    }
    getRules() {
        return [...this.getClosedStructures(), ...this.getCustomStructures()];
    }
    getCustomStructures() {
        return [];
    }
    // marcadores regexp utilizados
    // (\s+) = um ou mais whitespaces
    // (\w+) = uma ou mais letras/digitos => palavra
    // (constante) = constante (palavra chave)
    // (.*) =  qualquer coisa
    // ? = 0 ou mais ocorrências
    // ^ = inicio da linha
    // /i = ignorar caixa
    getClosedStructures() {
        return [
            {
                id: 'function',
                begin: /^(\s*)((\w+)(\s+))?(function)(\s+)(\w+)/i,
                end: /^(\s*)(return)/i
            },
            {
                id: 'method',
                begin: /^(\s*)(method)(\s+)(\w+)(\s*)(.*)(\s+)(class)(\s+)(\w+)/i,
                end: /^(\s*)(return)/i
            },
            {
                id: 'method rest',
                begin: /^(\s*)(wsmethod)(\s+)(\w+)(\s*)(.*)(\s+)(wsservice)(\s+)(\w+)/i,
                end: /^(\s*)(return)/i
            },
            {
                id: '#ifdef/#ifndef',
                begin: /^(\s*)(#)(\s*)(ifdef|ifndef)/i,
                middle: /^(\s*)(#)(\s*)(else)/i,
                end: /^(\s*)(#)(\s*)(endif)/i
            },
            {
                id: 'begin report query',
                begin: /^(\s*)(begin)(\s+)(report)(\s+)(query)/i,
                end: /^(\s*)(end)(\s+)(report)(\s+)(query)/i,
            },
            {
                id: 'begin transaction',
                begin: /^(\s*)(begin)(\s+)(transaction)/i,
                end: /^(\s*)(end)(\s+)(transaction)?/i,
            },
            {
                id: 'beginsql (alias)?',
                begin: /^(\s*)(beginsql)(\s+)(\w+)/i,
                end: /^(\s*)(endsql)$/i,
            },
            {
                id: 'do case',
                begin: /^(\s*)(do)(\s+)(case)/i,
                middle: /^(\s*)(case|otherwise)/i,
                end: /^(\s*)(end)(\s*)(case)$/i
            },
            {
                id: 'try..catch',
                begin: /^(\s*)(try)/i,
                middle: /^(\s*)(catch)/i,
                end: /^(\s*)(end)(\s*)(try)?/i
            },
            {
                id: 'class',
                begin: /^(\s*)(class)(\s+)(\w+)/i,
                end: /^(\s*)(end)(\s*)(class)?/i
            },
            {
                id: 'endwsclient',
                begin: /^(\s*)(wsclient)(\s+)(\w+)/i,
                end: /^(\s*)(endwsclient)/i
            },
            {
                id: 'for',
                begin: /^(\s*)(for)(\s+)(\w+)/i,
                end: /^(\s*)(next)(\s*)/i
            },
            {
                id: 'if',
                begin: /^(\s*)+(if)+(\t|\ |\(|;|\/\*)+/i,
                middle: /^(\s*)((else)|(elseif))+(\t|\ |\(|;|\/\*|$)+/i,
                end: /^(\s*)(end)(if)?$/i,
            },
            {
                id: 'structure',
                begin: /^(\s*)(structure)/i,
                end: /^(\s*)(end)(\s*)(structure)/i
            },
            {
                id: 'while',
                begin: /^(\s*)(do)?(\s*)(while)/i,
                end: /^(\s*)(end)(do)?$/i
            },
            {
                id: 'wsrestful',
                begin: /^(\s*)(wsrestful)/i,
                end: /^(\s*)(end)(\s*)(wsrestful)/i
            },
            {
                id: 'wsservice',
                begin: /^(\s*)(wsservice)/i,
                end: /^(\s*)(end)(\s*)(wsservice)/i
            },
            {
                id: 'wsstruct',
                begin: /^(\s*)(wsstruct)/i,
                end: /^(\s*)(end)(\s*)(wsstruct)/i
            },
            {
                id: 'begin sequence',
                begin: /^(\s*)(begin)(\s*)(sequence)/i,
                middle: /^(\s*)(recover)(\s*)(sequence)/i,
                end: /^(\s*)(end)(\s*)(sequence)?$/i
            },
            {
                id: 'Protheus Doc',
                begin: /^(\s*)(\/\*\/(.*)?\{Protheus.doc\}(.*)?)/i,
                end: /(\*\/)/i
            },
            {
                id: 'Comentários',
                begin: /^(\s*)(\/\*)/i,
                end: /(\*\/)/i
            }
        ];
    }
}
exports.FormattingRules = FormattingRules;


/***/ })
/******/ ]);
//# sourceMappingURL=extension.js.map