import { isNull } from "util";

export interface Rule {
    id: string;
    options?: {
        ident: boolean;
        linesBefore: Number;
        linesAfter: Number;
        linesSameBlock: Number;
    };
}

export interface ClosedStructureRule extends Rule {
    begin: RegExp;
    middle?: RegExp;
    end: RegExp;
}

export interface OpenStructureRule extends Rule {
    expression: RegExp;
}


export interface RuleMatch {
    rule: Rule;
    increment: boolean;
    decrement: boolean;
}

export class FormattingRules {
    lastMatch: RuleMatch | null = null;
    insideOpenStructure: boolean = false;
    openStructures: string[] = [];

    private instanceOfClosedStructureRule(object: any): object is ClosedStructureRule {
        return 'begin' in object;
    }

    public match(line: string): boolean {
        let lastRule: string = this.openStructures[this.openStructures.length - 1];
        if (line.trim().length === 0) {
            return false;
        }

        let finddedRule: any = null;

        this.getRules().every((rule: Rule) => {

            if (this.instanceOfClosedStructureRule(rule)) {
                if (line.match(rule.begin)) {
                    finddedRule = { rule: rule, increment: true, decrement: false };
                    this.openStructures.push(rule.id);
                } else if ((rule.middle) && (line.match(rule.middle))) {
                    finddedRule = { rule: rule, increment: true, decrement: true };
                } else if (line.match(rule.end) && lastRule === rule.id) {
                    finddedRule = { rule: rule, increment: false, decrement: true };
                    this.openStructures.pop();
                }
            }

            return isNull(finddedRule);
        });

        if (!isNull(finddedRule)) {
            this.lastMatch = finddedRule;
            return true;
        }

        return false;
    }

    public getLastMatch(): RuleMatch | null {
        return this.lastMatch;
    }

    public getRules(): Rule[] {
        return [...this.getClosedStructures(), ...this.getCustomStructures()];
    }

    private getCustomStructures(): Rule[] {
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

    public getClosedStructures(): ClosedStructureRule[] {
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