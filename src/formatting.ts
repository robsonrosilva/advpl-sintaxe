import {
  DocumentFormattingEditProvider,
  TextDocument,
  FormattingOptions,
  CancellationToken,
  ProviderResult,
  TextEdit,
  DocumentRangeFormattingEditProvider,
  Range,
  Position,
  workspace
} from 'vscode';
import { FormattingRules, RuleMatch, getStructsNoIdent, StructureRule } from './formmatingRules';

let sqlFormatterPlus = require("sql-formatter-plus");

// Regras de estruturas que não sofrem identação interna
let structsNoIdent: string[] = getStructsNoIdent();

class Formatting implements DocumentFormattingEditProvider {
  lineContinue: boolean = false;

  provideDocumentFormattingEdits(
    document: TextDocument,
    options: FormattingOptions,
    token: CancellationToken
  ): ProviderResult<TextEdit[]> {
    const formatter: RangeFormatting = new RangeFormatting();
    // define o range como todo o documento
    const range: Range = new Range(
      new Position(0, 0),
      new Position(document.lineCount - 1, 0)
    );
    return formatter.provideDocumentRangeFormattingEdits(
      document,
      range,
      options,
      token
    );
  }
}

class RangeFormatting implements DocumentRangeFormattingEditProvider {
  lineContinue: boolean = false;
  provideDocumentRangeFormattingEdits(
    document: TextDocument,
    range: Range,
    options: FormattingOptions,
    token: CancellationToken
  ): ProviderResult<TextEdit[]> {
    let noQueryFormatter: boolean = workspace
      .getConfiguration('advpl-sintaxe')
      .get('noQueryFormatter');
    let queryLanguage: string = workspace
      .getConfiguration('advpl-sintaxe')
      .get('queryLanguage');

    queryLanguage = queryLanguage ? queryLanguage : 'sql';

    let cont: number = 0;
    let query: { expression: string, range: Range };
    const tab: string = options.insertSpaces
      ? ' '.repeat(options.tabSize)
      : '\t';
    // define comom está a identação quando é identação range
    if (range.start.line > 0) {
      let stringStart = document
        .lineAt(range.start.line)
        .text.replace(/(^\s*)(.*)/, '$1');
      while (stringStart.search(tab) >= 0) {
        cont++;
        stringStart = stringStart.replace(tab, '');
      }
    }
    const formattingRules = new FormattingRules();

    let result: TextEdit[] = [];
    const lc = range.end.line;
    const rulesIgnored: StructureRule[] = formattingRules
      .getStructures()
      .filter(rule => {
        return structsNoIdent.indexOf(rule.id) !== -1;
      });

    for (let nl = range.start.line; nl <= lc; nl++) {
      // check operation Cancel
      if (token.isCancellationRequested) {
        console.log('cancelado');
        return [];
      }

      const line = document.lineAt(nl);
      const text = line.text.trimRight();
      let lastRule: RuleMatch =
        formattingRules.openStructures[
        formattingRules.openStructures.length - 1
        ];
      let foundIgnore: StructureRule[] = rulesIgnored.filter(rule => {
        return lastRule && lastRule.rule && rule.id === lastRule.rule.id;
      });
      // dentro do BeginSql não mexe na identação
      if (foundIgnore.length > 0 && !text.match(foundIgnore[0].end)) {
        // verifica se está em query
        if (!noQueryFormatter && foundIgnore[0].id === 'beginsql (alias)?') {
          if (!query || query.expression.length === 0) {
            query = { expression: '', range: line.range };
          }
          query.expression += ' ' + text.replace('//', '--REPLACE--') + '\n';
          // define o range que será substituído
          // usando o range inicial da primeira linha 
          // e o atual da ultima linha com a query
          query.range = new Range(query.range.start, line.range.end);
        } else {
          result.push(TextEdit.replace(line.range, text));
        }
      } else {
        if (
          !line.isEmptyOrWhitespace &&
          !this.lineContinue &&
          formattingRules.match(text, cont)
        ) {
          let ruleMatch: RuleMatch | null = formattingRules.getLastMatch();

          if (ruleMatch) {
            if (ruleMatch.decrement) {
              cont = ruleMatch.initialPosition;
              // trata query
              if (!noQueryFormatter && ruleMatch.rule.id === 'beginsql (alias)?') {
                let queryResult: string = sqlFormatterPlus.format(query.expression, { indent: tab, language: queryLanguage });

                // volta comentários
                queryResult = queryResult.replace(/\-\-REPLACE\-\-/img, '//');
                // adiciona tabulações no início de cada linha
                queryResult = tab.repeat(cont + 1) + queryResult.replace(/\n/img, '\n' + tab.repeat(cont + 1));
                // Remove os espaçamentos dentro das expressões %%
                queryResult = queryResult.replace(/(\%)(\s+)(table|temp-table|exp|xfilial|order)(\s)*(:)((\w|\+|\-|\\|\*|\(|\)|\[|\]|\-|\>|\_|\s|\,|\n|\"|\')*)(\s+)(\%)/img, '$1$3$5$6$9');
                // Como coloca quebras de linhas no orderby por conta da vírgula removo
                queryResult = queryResult.replace(/(\%order:\w*)(\,\n\s*)(\w\%)/img, '$1,$3');
                // Ajusta os sem expressões
                queryResult = queryResult.replace(/(\%)(\s+)(notDel|noparser)(\s+)(\%)/img, '$1$3$5');
                //quebra de linha depois do no parser
                queryResult = queryResult.replace(/((\s*)\%noparser\%)\s/img, '$1\n\n$2');
                // remove espaços entre ->
                queryResult = queryResult.replace(/\s*\-\>\s*/img, '->');
                // remove espaços antes de colchetes 
                queryResult = queryResult.replace(/\s*\[\s*/img, '[');
                // remove espaços antes de , + - \ * dentro de %
                while (queryResult.match(/(\%.*)(\s+)(\,|\+|\-|\\|\*)(\s*)(.*\%)/img)) {
                  queryResult = queryResult.replace(/(\%.*)(\s+)(\,|\+|\-|\\|\*)(\s*)(.*\%)/img, '$1$3$5');
                }
                // remove espaços depois de , + - \ * dentro de %
                while (queryResult.match(/(\%.*)(\s*)(\,|\+|\-|\\|\*)(\s+)(.*\%)/img)) {
                  queryResult = queryResult.replace(/(\%.*)(\s*)(\,|\+|\-|\\|\*)(\s+)(.*\%)/img, '$1$3$5');
                }

                // Ajustes visuais de query alinhamento de Between em uma linha
                queryResult = queryResult.replace(/(^\s*.*between\s*.*)\n\s*(and\s.*)/img, '$1 $2');

                // Quebra linha no ON do JOIN
                queryResult = queryResult.replace(/(^(\s*)(.*join\s*.*|\)\s\w*\s))(on)/img, '$1\n$2$4');
                // Quebra linha no THEN do CASE
                queryResult = queryResult.replace(/(^(\s*)when.*)\n*\s*(then.*)/img, '$1\n$2' + tab + '$3');
                // Remove uma das tabulações dos Join's e ON
                if (queryResult.match(/^\s*(\w*\sjoin|on)\s/img)) {
                  let queryLines: string[] = queryResult.split('\n');
                  queryResult = '';
                  queryLines.forEach((line) => {
                    if (line.match(/^\s*(\w*\sjoin|on)\s/img)) {
                      queryResult += line.replace(tab, '') + '\n'; // remove uma tabulação
                    } else {
                      queryResult += line + '\n';
                    }
                  });
                }

                result.push(TextEdit.replace(query.range, queryResult.trimEnd()));

                query = { expression: '', range: undefined };
              }
            }
          }

          if (ruleMatch.incrementDouble) {
            cont += 1;
          }

          const newLine: string = text.replace(/(\s*)?/, tab.repeat(cont));
          result.push(TextEdit.replace(line.range, newLine));
          this.lineContinue =
            newLine
              .split('//')[0]
              .trim()
              .endsWith(';') && rulesIgnored.indexOf(ruleMatch.rule) === -1;

          if (ruleMatch) {
            if (ruleMatch.increment || ruleMatch.incrementDouble) {
              cont++;
            }
          }
        } else {
          let newLine: string = '';
          if (!line.isEmptyOrWhitespace) {
            newLine = text
              .replace(/(\s*)?/, tab.repeat(cont) + (this.lineContinue ? tab : ''))
              .trimRight();
          }
          result.push(TextEdit.replace(line.range, newLine));
          this.lineContinue = newLine
            .split('//')[0]
            .trim()
            .endsWith(';');
        }
      }
    }
    console.log('fim');
    return result;
  }
}

const formatter = new Formatting();
const rangeFormatter = new RangeFormatting();

export function formattingEditProvider() {
  return formatter;
}

export function rangeFormattingEditProvider() {
  return rangeFormatter;
}
