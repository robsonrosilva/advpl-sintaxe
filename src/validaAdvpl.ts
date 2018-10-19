import * as vscode from 'vscode';
import * as fileSystem from 'fs';

//Cria um colection para os erros ADVPL
const collection = vscode.languages.createDiagnosticCollection('advpl');

async function vscodeFindFilesSync() {
    return vscode.workspace.findFiles('**/*.*', '**/*.json');
}

export class ValidaAdvpl {
    public comentFontPad: any;
    public error: number;
    public warning: number;
    public information: number;
    public hint: number;
    public versao: string;

    constructor() {
        this.comentFontPad = vscode.workspace.getConfiguration("advpl-sintax").get("comentFontPad");

        this.error = 0;
        this.warning = 0;
        this.information = 0;
        this.hint = 0;
        this.versao = "";
        let extensao = vscode.extensions.getExtension("robsonrosilva.advpl-sintax-poupex");
        if (extensao) {
            this.versao = extensao.packageJSON.version;
        }
        //Se não está preenchido seta com valor padrão
        if (!this.comentFontPad) {
            this.comentFontPad = [];
            this.comentFontPad.push('\\/\\*\\/\\/' + '\\#'.repeat(89));
            this.comentFontPad.push('Projeto\\ \\:');
            this.comentFontPad.push('Modulo\\ \\ \\:');
            this.comentFontPad.push('Fonte\\ \\ \\ \\:');
            this.comentFontPad.push('Objetivo\\:');
            this.comentFontPad.push('\\*\\/\\/\\/' + '\\#'.repeat(89));
        }
    }
    public async validaProjeto(nGeradas: number = 0, tags: string[] = [], fileContent: string = '', branchAtual: string = '', objetoMerge: any) {
        let tag = tags[nGeradas];
        let fileLog = vscode.workspace.rootPath + "/AnaliseProjeto.csv";
        //guarda objeto this
        let objeto = this;
        objeto.error = 0;
        objeto.warning = 0;
        objeto.information = 0;
        objeto.hint = 0;
        //percorre todos os fontes do Workspace e valida se for ADVPL
        let advplExtensions = ['prw', 'prx', 'prg', 'apw', 'apl', 'tlpp'];
        let files = await vscodeFindFilesSync();
        files.forEach((file: vscode.Uri) => {
            let re = /(?:\.([^.]+))?$/;
            let extensao = re.exec(file.fsPath);
            if (extensao && advplExtensions.indexOf(extensao[1].toLowerCase()) !== -1) {
                let conteudo = fileSystem.readFileSync(file.fsPath, "latin1");
                if (conteudo) {
                    objeto.validacao(conteudo, file);
                }
            }
            //Se for o último arquivo verifica se deve gravar no arquivo LOG
            if (!fileContent && file === files[files.length - 1]) {
                vscode.window.showInformationMessage('Fim da Análise do Projeto!');
            } else if (fileContent && file === files[files.length - 1]) {
                fileContent = fileContent.replace(
                    tag + "\t\t\t\t\n",
                    objeto.padTag(tag, tags) + "\t" +
                    objeto.error + "\t" +
                    objeto.warning + "\t" +
                    objeto.information + "\t" +
                    objeto.hint + "\t" +
                    objeto.versao
                    + "\n");

                fileSystem.writeFile(fileLog, fileContent, (err) => {
                    console.log("Gerou TAG " + tag + " ERRO " + err);
                    nGeradas++;
                    if (tags[nGeradas]) {
                        objetoMerge.geraRelatorio(nGeradas, tags, fileContent, branchAtual);
                    }
                });
            }
        });
    }

    public validaFonte(editor: any) {
        //guarda objeto this
        let objeto = this;
        if (editor) {
            //verifica se a linguagem é ADVPL
            if (editor.document.languageId === "advpl") {
                objeto.validacao(editor.document.getText(), editor.document.uri);
            }
        }
    }

    protected padTag(tag: String, tags: any) {
        //Padroniza TAGS
        let nNivel1 = 0;
        let nNivel2 = 0;
        let nNivel3 = 0;
        tags.forEach((tagAtu: string) => {
            let aNiveis = tagAtu.split('.');
            nNivel1 = Math.max(aNiveis[0].length, nNivel1);
            nNivel2 = Math.max(aNiveis[1].length, nNivel2);
            nNivel3 = Math.max(aNiveis[2].length, nNivel3);
        });

        let aNiveis = tag.split('.');
        if (aNiveis[0].length < nNivel1) {
            let length = nNivel1 - aNiveis[0].toString().length + 1;
            aNiveis[0] = Array(length).join('0') + aNiveis[0];
        }
        if (aNiveis[1].length < nNivel2) {
            let length = nNivel2 - aNiveis[1].toString().length + 1;
            aNiveis[1] = Array(length).join('0') + aNiveis[1];
        }
        if (aNiveis[2].length < nNivel3) {
            let length = nNivel3 - aNiveis[2].toString().length + 1;
            aNiveis[2] = Array(length).join('0') + aNiveis[2];
        }
        return aNiveis[0] + "." + aNiveis[1] + "." + aNiveis[2];
    }

    protected validacao(texto: String, uri: vscode.Uri) {
        //guarda objeto this
        let objeto = this;
        //Busca Configurações do Settings
        let ownerDb = vscode.workspace.getConfiguration("advpl-sintax").get("ownerDb") as Array<string>;
        if (!ownerDb) {
            ownerDb = ['PROTHEUS'];
        }
        let empresas = vscode.workspace.getConfiguration("advpl-sintax").get("empresas") as Array<string>;
        if (!empresas) {
            empresas = ['01', '02'];
        }

        let linhas = texto.split("\n");
        let aErros = Array();
        //Pega as linhas do documento ativo e separa o array por linha
        //Limpa as mensagens do colection
        collection.delete(uri);

        let includes = new Array();
        let comentFuncoes = new Array();
        let funcoes = new Array();
        let prepareEnvionment = new Array();
        let cBeginSql = false;
        let FromQuery = false;
        let JoinQuery = false;
        let cSelect = false;
        let ProtheusDoc = false;
        //Percorre todas as linhas
        for (var key in linhas) {
            //seta linha atual em caixa alta e ignorando comentários e linha
            let linha = linhas[key].toLocaleUpperCase().split("//")[0];
            //se estiver no PotheusDoc vê se está fechando
            if (ProtheusDoc && linha.search("\\/\\*\\/") !== -1) {
                ProtheusDoc = false;
            }
            //verifica se é protheusDoc
            if (linha.search("\\/\\*\\/\\{PROTHEUS\\.DOC\\}") !== -1) {
                ProtheusDoc = true;
                //reseta todas as ariáveis de controle pois se entrou em ProtheusDoc está fora de qualquer função
                cBeginSql = false;
                FromQuery = false;
                JoinQuery = false;
                cSelect = false;
                //verifica se é um comentário de função e adiciona no array
                comentFuncoes.push(
                    [linha.trim().replace("/*/{PROTHEUS.DOC}", "").trim().toLocaleUpperCase(), key]
                );
            }
            //se não estiver dentro do Protheus DOC valida linha
            if (!ProtheusDoc) {
                //verifica se é função e adiciona no array
                if (linha.search("STATIC\\ FUNCTION\\ ") !== -1 ||
                    linha.search("USER\\ FUNCTION\\ ") !== -1) {
                    //reseta todas as ariáveis de controle pois está fora de qualquer função
                    cBeginSql = false;
                    FromQuery = false;
                    JoinQuery = false;
                    cSelect = false;
                    //verifica se é um função e adiciona no array
                    funcoes.push(
                        [linha.trim().split(" ")[2].split("(")[0], key]
                    );
                }
                //Verifica se é CLASSE ou WEBSERVICE 
                if (linha.search("METHOD\\ .*?CLASS") !== -1 ||
                    linha.search("CLASS\\ ") !== -1 ||
                    linha.search("WSMETHOD.*?WSSERVICE") !== -1 ||
                    linha.search("WSSERVICE\\ ") !== -1) {
                    //reseta todas as ariáveis de controle pois está fora de qualquer função
                    cBeginSql = false;
                    FromQuery = false;
                    JoinQuery = false;
                    cSelect = false;
                    //verifica se é um função e adiciona no array
                    funcoes.push(
                        [linha.trim().split(" ")[1].split("(")[0], key]
                    );
                }
                //Verifica se adicionou o include TOTVS.CH
                if (linha.search("#INCLUDE") !== -1) {
                    //REMOVE as aspas a palavra #include e os espacos e tabulações
                    includes.push(
                        {
                            include: linha.replace(/#INCLUDE/g, "").replace(/\t/g, "").replace(/\'/g, "").replace(/\"/g, "").trim(),
                            linha: parseInt(key)
                        }
                    );
                }
                if (linha.search("BEGINSQL\\ ") !== -1) {
                    cBeginSql = true;
                }
                if (linha.search("PREPARE\\ ENVIRONMENT\\ ") !== -1) {
                    prepareEnvionment.push(parseInt(key));
                }
                if (linha.match("SELECT\\ ") ||
                    linha.match("DELETE\\ ") ||
                    linha.match("UPDATE\\ ")) {
                    cSelect = true;
                }
                if (!cBeginSql &&
                    linha.search("SELECT\\ ") !== -1 &&
                    linha.search("TCSQLEXEC\\(") === -1) {

                    aErros.push(
                        new vscode.Diagnostic(
                            new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                            'Uso INDEVIDO de Query sem o Embedded SQL.! \n Utilizar: BeginSQL … EndSQL.',
                            vscode.DiagnosticSeverity.Warning)
                    );
                    objeto.warning++;
                }
                if (linha.search("DELETE\\ FROM") !== -1) {
                    aErros.push(
                        new vscode.Diagnostic(
                            new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                            'Uso não permitido uso de DELETE FROM.! ',
                            vscode.DiagnosticSeverity.Warning)
                    );
                    objeto.warning++;
                }
                if (linha.search("\\<\\<\\<\\<\\<\\<\\<\\ HEAD") !== -1) {
                    //Verifica linha onde terminou o conflito
                    let nFim = key;
                    for (var key2 in linhas) {
                        if (linhas[key2].search("\\>\\>\\>\\>\\>\\>\\>") !== -1 && nFim === key && key2 > key) {
                            nFim = key2;
                        }
                    }
                    aErros.push(
                        new vscode.Diagnostic(
                            new vscode.Range(parseInt(key), 0, parseInt(nFim), 0),
                            'Existem conflitos de merge, avalie antes de continuar! ',
                            vscode.DiagnosticSeverity.Error)
                    );
                    objeto.error++;
                }
                if (linha.search("SELECT\\ ") !== -1 && linha.search("\\ \\*\\ ") !== -1) {
                    aErros.push(
                        new vscode.Diagnostic(
                            new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                            'Uso não permitido uso de SELECT com asterisco \n "*".! ',
                            vscode.DiagnosticSeverity.Warning)
                    );
                    objeto.warning++;
                }
                if (linha.search("CHR\\(13\\)") !== -1 && linha.search("CHR\\(10\\)") !== -1) {
                    aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                        'É recomendado o uso da expressão CRLF.',
                        vscode.DiagnosticSeverity.Warning)
                    );
                    objeto.warning++;
                }
                if (cSelect && linha.search("FROM") !== -1) {
                    FromQuery = true;
                }
                if (cSelect && FromQuery && linha.search("JOIN") !== -1) {
                    JoinQuery = true;
                }
                if (linha.search("ENDSQL") !== -1 ||
                    linha.search("WHERE") !== -1 ||
                    linha.search("TCQUERY") !== -1) {
                    FromQuery = false;
                    cSelect = false;
                }
                //Implementação para aceitar vários bancos de dados
                ownerDb.forEach(banco => {
                    if (cSelect && FromQuery && linha.search(banco) !== -1) {
                        aErros.push(
                            new vscode.Diagnostic(
                                new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                                'Uso não permitido uso do SHEMA ' + banco + ' em Query. ',
                                vscode.DiagnosticSeverity.Error)
                        );
                        objeto.error++;
                    }
                });
                if (cSelect && (FromQuery || JoinQuery || linha.search("SET") !== -1) &&
                    linha.search("exp:cTable") === -1) {
                    //procura códigos de empresas nas queryes 
                    empresas.forEach(empresa => {
                        //para melhorar a análise vou quebrar a string por espaços 
                        //e removendo as quebras de linhas, vou varrer os itens do array e verificar o tamanho 
                        //e o código da empresa chumbado
                        let palavras = linha.replace(/\r/g, "").replace(/\t/g, "").split(" ");
                        palavras.forEach(palavra => {
                            if (palavra.search(empresa + "0") !== -1 && palavra.length === 6) {
                                aErros.push(
                                    new vscode.Diagnostic(
                                        new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                                        'PROIBIDO Fixar tabela na Query. ',
                                        vscode.DiagnosticSeverity.Error)
                                );
                                objeto.error++;
                            }
                        });
                    });
                }
                if (cSelect && JoinQuery && linha.search("ON") !== -1) {
                    JoinQuery = false;
                }
                if (linha.search("CONOUT") !== -1) {
                    aErros.push(
                        new vscode.Diagnostic(
                            new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                            'Uso não permitido uso do Conout. => Utilizar a API de Log padrão (FWLogMsg).',
                            vscode.DiagnosticSeverity.Warning)
                    );
                    objeto.warning++;
                }
                //recomendação para melhorar identificação de problemas em queryes
                if (
                    (
                        linha.match("SELECT\\ ") ||
                        linha.match("DELETE\\ ") ||
                        linha.match("UPDATE\\ ") ||
                        linha.match("JOIN\\ ")
                    ) && (
                        linha.match("FROM\\ ") ||
                        linha.match("ON\\ ") ||
                        linha.match("WHERE\\ ")
                    ) &&
                    linha.search("TCSQLEXEC\\(") === -1
                ) {
                    //verifica o caracter anterior tem que ser ou ESPACO ou ' ou " ou nada
                    let itens1 = ["FROM", "ON", "WHERE"];
                    let addErro = false;
                    itens1.forEach(item => {
                        addErro = addErro || linha.search("\\'" + item) !== -1;
                        addErro = addErro || linha.search('\\"' + item) !== -1;
                        addErro = addErro || linha.search("\\ " + item) !== -1;
                    });

                    if (addErro) {
                        aErros.push(
                            new vscode.Diagnostic(
                                new vscode.Range(parseInt(key), 0, parseInt(key), 0),
                                'Para melhorar a análise dessa query coloque em linhas diferentes as clausulas' +
                                ' SELECT, DELETE, UPDATE, JOIN, FROM, ON, WHERE.',
                                vscode.DiagnosticSeverity.Information)
                        );
                        objeto.information++;
                    }
                }
            }
        }

        //Validação de padrão de comentáris de fontes
        let comentariosFonte = true;
        for (var _i = 0; _i < objeto.comentFontPad.length; _i++) {
            let cExpressao = objeto.comentFontPad[_i] as string;
            let linha = linhas[_i] as string;
            comentariosFonte = comentariosFonte && linha.search(cExpressao) !== -1;
        }

        if (!comentariosFonte) {
            aErros.push(
                new vscode.Diagnostic(new vscode.Range(0, 0, 0, 0),
                    'Verifique os padrões de comentários de fontes! => Use o autocomplete docFuncaoPoupex.',
                    vscode.DiagnosticSeverity.Information)
            );
            objeto.information++;
        }

        //Validação funções sem comentários
        funcoes.forEach(funcao => {
            let achou = false;
            comentFuncoes.forEach(comentario => {
                achou = achou || comentario[0] === funcao[0];
            });

            if (!achou) {
                aErros.push(new vscode.Diagnostic(
                    new vscode.Range(parseInt(funcao[1]), 0, parseInt(funcao[1]), 0),
                    'Função, Classe, Método ou WebService não comentado!',
                    vscode.DiagnosticSeverity.Warning)
                );
                objeto.warning++;
            }
        });
        //Validação comentários sem funções
        comentFuncoes.forEach(comentario => {
            let achou = false;
            funcoes.forEach(funcao => {
                achou = achou || comentario[0] === funcao[0];
            });

            if (!achou) {
                aErros.push(new vscode.Diagnostic(
                    new vscode.Range(parseInt(comentario[1]), 0, parseInt(comentario[1]), 0),
                    'Comentário de função sem função!',
                    vscode.DiagnosticSeverity.Warning)
                );
                objeto.warning++;
            }
        });

        if (!includes.indexOf((x: any) => x.include === "TOTVS.CH")) {
            aErros.push(new vscode.Diagnostic(new vscode.Range(0, 0, 0, 0),
                'Falta o include TOTVS.CH !',
                vscode.DiagnosticSeverity.Warning)
            );
            objeto.warning++;
        }

        let tbiconn: any = includes[includes.findIndex(
            function (x: any) {
                return x.include === "TBICONN.CH";
            }
        )];

        if (!tbiconn) {
            prepareEnvionment.forEach(numeroLinha => {
                aErros.push(new vscode.Diagnostic(new vscode.Range(numeroLinha, 0, numeroLinha, 0),
                    'Falta o include TBICONN.CH para o PREPARE ENVIRONMENT!',
                    vscode.DiagnosticSeverity.Error)
                );
                objeto.error++;
            });
        }

        if (tbiconn && prepareEnvionment.length === 0) {
            aErros.push(new vscode.Diagnostic(new vscode.Range(tbiconn.linha, 0, tbiconn.linha, 0),
                'Include TBICONN.CH desnecessário, não há PREPARE ENVIRONMENT!',
                vscode.DiagnosticSeverity.Warning)
            );
            objeto.warning++;
        }

        //Busca includes duplicados
        includes.forEach((include: any) => {
            //Verifica se o include é obsoleto
            if (
                include.include === "PROTHEUS.CH" ||
                include.include === "RWMAKE.CH"
            ) {
                aErros.push(new vscode.Diagnostic(new vscode.Range(include.linha, 0, include.linha, 0),
                    'O include ' + include.include + ' é obsoleto, o mesmo foi substituído pelo TOTVS.CH!',
                    vscode.DiagnosticSeverity.Warning)
                );
                objeto.warning++;
            }

            //Verifica se há o mesmo include em uma linha diferente do mesmo fonte
            if (
                includes.findIndex(
                    function (x: any) {
                        return x.include === include.include && x.linha !== include.linha;
                    }
                ) !== -1
            ) {
                aErros.push(new vscode.Diagnostic(new vscode.Range(include.linha, 0, include.linha, 0),
                    'Include ' + include.include + ' em duplicidade!',
                    vscode.DiagnosticSeverity.Warning)
                );
                objeto.warning++;
            }
        });

        collection.set(uri, aErros);
    }
}