"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const formmatingRules_1 = require("./formmatingRules");
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

//# sourceMappingURL=formatting.js.map
