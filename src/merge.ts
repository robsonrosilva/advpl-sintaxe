import { workspace, window, extensions } from 'vscode';
import * as i18n from 'i18n';

export interface IExecutionResult<T extends string | Buffer> {
    exitCode: number;
    stdout: T;
    stderr: string;
}

export class MergeAdvpl {
    public branchTeste: string;
    public branchHomol: string;
    public branchProdu: string;
    public branchesControladas: string[];
    public repository: any;
    private branchOrigem: string;
    constructor() {
        //Busca Configurações do Settings
        this.branchTeste = workspace
            .getConfiguration('advpl-sintaxe')
            .get('branchTeste') as string;
        if (!this.branchTeste) {
            window.showErrorMessage(localize('merge.noBranch'));
            return;
        }
        this.branchHomol = workspace
            .getConfiguration('advpl-sintaxe')
            .get('branchHomologacao') as string;
        if (!this.branchHomol) {
            window.showErrorMessage(localize('merge.noBranch'));
            return;
        }
        this.branchProdu = workspace
            .getConfiguration('advpl-sintaxe')
            .get('branchProducao') as string;
        if (!this.branchProdu) {
            window.showErrorMessage(localize('merge.noBranch'));
            return;
        }
        this.branchesControladas = [];
        this.branchesControladas.push(
            this.branchHomol.toUpperCase()
        );
        this.branchesControladas.push(
            this.branchTeste.toUpperCase()
        );
        this.branchesControladas.push(
            this.branchProdu.toUpperCase()
        );
        this.repository = this.getRepository();
    }

    public merge(branchDestino: string) {
        this.branchOrigem = this.repository.headLabel;
        // guarda objeto this
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const objeto: MergeAdvpl = this;
        return new Promise(
            (resolve, reject) => {
                // Verifica se a branch que mandou é uma das controladas
                if (objeto.branchesControladas.includes(this.branchOrigem.toUpperCase())) {
                    return reject(localize('merge.noBranchMerge'));
                }

                // Atualiza branch Corrente com a Release
                objeto.atualiza().catch((erro: string) => {
                    return reject(erro);
                }).then(() => {
                    // efetua o push da branche
                    this.run(
                        ['push', '--set-upstream', 'origin', this.repository.headLabel]
                    ).catch((erro) => {
                        return reject(localize('merge.pushError') + '\n' + erro.stderr);
                    }
                    ).then(() => {
                        // efetua os merges
                        this.mergeGit(this.branchTeste).then(() => {
                            if ([this.branchHomol, this.branchProdu].includes(branchDestino)) {
                                this.mergeGit(this.branchHomol).then(() => {
                                    if (this.branchProdu === branchDestino) {
                                        this.mergeGit(this.branchProdu).then((tag: string) => {
                                            window.showInformationMessage(
                                                localize('merge.mergeFinish') +
                                                this.branchOrigem + ' -> ' +
                                                branchDestino + '(' + tag + ')'
                                            );
                                            resolve();
                                        }).catch((erro) => {
                                            return reject(localize('merge.mergeError') + '\n' + erro.stderr);
                                        }
                                        );
                                    } else {
                                        window.showInformationMessage(
                                            localize('merge.mergeFinish') +
                                            this.branchOrigem +
                                            ' -> ' +
                                            branchDestino
                                        );
                                        resolve();
                                    }
                                }).catch((erro) => {
                                    return reject(localize('merge.mergeError') + '\n' + erro.stderr);
                                }
                                );
                            } else {
                                window.showInformationMessage(
                                    localize('merge.mergeFinish') +
                                    this.branchOrigem +
                                    ' -> ' +
                                    branchDestino
                                );
                                resolve();
                            }
                        }).catch((erro) => {
                            return reject(localize('merge.mergeError') + '\n' + erro.stderr);
                        }
                        );
                    });
                });
            }
        );
    }

    // efetua um check out na branch de homologação, faz o pull dela, 
    // faz um checkout para a branch corrente e um merge ne com a homologação
    public atualiza() {
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
                            return resolve(localize('merge.atualizacaoFinish'));
                        }).catch((erro) => {
                            return reject(localize('merge.mergeError') + '\n' + erro.stderr);
                        });
                    }).catch((erro) => {
                        return reject(localize('merge.checkoutError') + '\n' + erro.stderr);
                    });
                }).catch((erro) => {
                    return reject(localize('merge.pullError') + '\n' + erro.stderr);
                });
            }).catch((erro) => {
                return reject(localize('merge.checkoutError') + '\n' + erro.stderr);
            });
        });
    }

    // limpa as branches mergeadas com a master
    public limpaBranches() {
        return new Promise((resolve, reject) => {
            // Atualiza todas as branches remotas
            this.run(['fetch', '-v', 'origin']).then(() => {
                // baixa todas as tags
                this.run(['pull', '--tags']).then(() => {
                    // apaga os remotes que foram mergeados com a master
                    this.run(['remote', 'prune', 'origin']).then(() => {
                        // lista os branches mergeados com a master
                        this.run(['branch', '--merged', 'master']).then((ret: IExecutionResult<string>) => {
                            const branches = ret.stdout.split("\n");

                            branches.forEach((branche: string) => {
                                // nem tenta excluir se for a branche selecionada ou se for branche controlada
                                if (branche.substring(0, 1) !== '*' &&
                                    !this.branchesControladas.includes(branche.substring(2).toUpperCase()) &&
                                    branche !== '') {
                                    branche = branche.substring(2);
                                    this.run(['branch', '-d', branche]);
                                }
                            });
                            resolve(localize('merge.cleanFinish'));
                        }).catch((erro) => {
                            return reject(localize('merge.mergedError') + '\n' + erro.stderr);
                        });
                    }).catch((erro) => {
                        return reject(localize('merge.remotePruneError') + '\n' + erro.stderr);
                    });
                }).catch((erro) => {
                    return reject(localize('merge.pullError') + '\n' + erro.stderr);
                });
            }).catch((erro) => {
                return reject(localize('merge.pullError') + '\n' + erro.stderr);
            });
        });
    }

    // Executa um push com tags
    private pushAll() {
        const promises: Promise<any>[] = [];
        promises.push(this.run(['push', '--tags']));
        promises.push(this.run(['push', '--set-upstream', 'origin', this.repository.headLabel]));
        return Promise.all(promises);
    }

    private getNextTag(): string {
        let aUltimaTag = [0, 0, 0];
        let commit;
        //Verifica ultima tag
        this.repository.refs.forEach((item: any) => {
            //verifica se Ã© TAG
            if (item.type === 2) {
                //Verifica se Ã© padrÃ£o de numeraÃ§Ã£o
                const aNiveis = item.name.split('.');
                if (aNiveis.length === 3) {
                    const aTag = [
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
        } else {
            aUltimaTag[2]++;
        }
        return String(aUltimaTag[0]) +
            '.' +
            String(aUltimaTag[1]) +
            '.' +
            String(aUltimaTag[2]);
    }

    private mergeGit(destino: string) {
        return new Promise((resolve, reject) => {
            // vai para a branche de release
            this.repository.checkout(destino).then(() => {
                // efetua o pull da branch de release
                this.run(['pull']).then(() => {
                    // se for um merge para a branch de produção sempre envia a release
                    const branch: string = destino === this.branchProdu ? this.branchHomol : this.branchOrigem;

                    // efetua o merge
                    this.run(['merge', '--no-ff', branch]).then(() => {
                        if (destino === this.branchProdu) {
                            const tag: string = this.getNextTag();
                            this.repository.tag(tag, '').then(() => {
                                this.pushAll().then(() => {
                                    resolve(tag);
                                }).catch((erro) => {
                                    return reject(localize('merge.pushError') + '\n' + erro.stderr);
                                });
                            }).catch((erro) => {
                                return reject(localize('merge.checkoutError') + '\n' + erro.stderr);
                            });
                        } else {
                            this.repository.push().then(() => {
                                resolve();
                            }).catch((erro) => {
                                return reject(localize('merge.pushError') + '\n' + erro.stderr);
                            });
                        }
                    }).catch((erro) => {
                        return reject(localize('merge.mergeError') + '\n' + erro.stderr);
                    });
                }).catch((erro) => {
                    return reject(localize('merge.pullError') + '\n' + erro.stderr);
                });
            }).catch((erro) => {
                return reject(localize('merge.checkoutError') + '\n' + erro.stderr);
            });
        });
    }

    // Executa um comando livre no GIT
    private run(args: string[]) {
        return this.repository.repository.git.exec(this.repository.root, args, {});
    }

    private getRepository() {
        const git = extensions.getExtension('vscode.git');
        if (git) {
            if (git.isActive) {
                let repository;
                // se houver mais de um repositório git aberto e se houver um editor
                if (
                    git.exports._model.repositories.length > 1 &&
                    window.activeTextEditor
                ) {
                    repository = git.exports._model.getRepository(
                        window.activeTextEditor.document.uri
                    );
                } else if (git.exports._model.repositories.length === 1) {
                    repository = git.exports._model.repositories[0];
                } else {
                    repository = git.exports._model.getRepository(workspace.rootPath);
                }
                // set resource groups
                if (!repository) {
                    window.showErrorMessage(localize('merge.noRepository'));
                    return;
                }

                // set resource groups
                if (
                    repository.mergeGroup.resourceStates.length !== 0 ||
                    repository.indexGroup.resourceStates.length !== 0 ||
                    repository.workingTreeGroup.resourceStates.length !== 0
                ) {
                    window.showErrorMessage(localize('merge.noCommited'));
                    return;
                }

                return repository;
            }
        }
    }
}

function localize(key: string) {
    const vscodeOptions = JSON.parse(
        process.env.VSCODE_NLS_CONFIG
    ).locale.toLowerCase();
    const locales = ['en', 'pt-br'];
    i18n.configure({
        locales: locales,
        directory: __dirname + '\\locales'
    });
    i18n.setLocale(locales.indexOf(vscodeOptions) + 1 ? vscodeOptions : 'en');
    return i18n.__(key);
}
