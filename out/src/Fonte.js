"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipos;
(function (Tipos) {
    Tipos[Tipos["Function"] = 0] = "Function";
    Tipos[Tipos["User Function"] = 1] = "User Function";
    Tipos[Tipos["Class"] = 2] = "Class";
})(Tipos = exports.Tipos || (exports.Tipos = {}));
class Fonte {
    constructor(fonte) {
        this.fonte = fonte;
        this.funcoes = [];
    }
    addFunction(tipo, nome, linha) {
        this.funcoes.push(new Funcao(tipo, nome, linha));
    }
}
exports.Fonte = Fonte;
class Funcao {
    constructor(tipo, nome, linha) {
        this.tipo = tipo;
        this.nome = nome;
        this.linha = linha;
    }
}
exports.Funcao = Funcao;

//# sourceMappingURL=Fonte.js.map
