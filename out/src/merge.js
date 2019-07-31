"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
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
    let i18n = require('i18n');
    let locales = ['en', 'pt-br'];
    i18n.configure({
        locales: locales,
        directory: __dirname + '\\locales'
    });
    i18n.setLocale(locales.indexOf(vscodeOptions) + 1 ? vscodeOptions : 'en');
    return i18n.__(key);
}

//# sourceMappingURL=Merge.js.map
