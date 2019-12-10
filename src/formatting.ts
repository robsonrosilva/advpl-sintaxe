import { DocumentFormattingEditProvider, TextDocument, FormattingOptions, CancellationToken, ProviderResult, TextEdit, DocumentRangeFormattingEditProvider } from 'vscode';
import { FormattingRules, RuleMatch } from './formmatingRules';
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import { isUndefined } from 'util';

class Formatting implements DocumentFormattingEditProvider {
	lineContinue: boolean = false;
	// Regras de estruturas que não sofrem identação interna
	structsNoIdent: string[] = ['beginsql (alias)?','Comentários'];

	provideDocumentFormattingEdits(document: TextDocument,
		options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]> {

		const formattingRules = new FormattingRules();
		const tab: string = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';
		let identBlock: string = "";
		let cont: number = 0;

		let result: TextEdit[] = [];
		const lc = document.lineCount;
		const rulesIgnored: any[] = formattingRules.getClosedStructures().filter(
			(rule) => { return this.structsNoIdent.indexOf(rule.id) !== -1; }
		);

		for (let nl = 0; nl < lc; nl++) {
			const line = document.lineAt(nl);
			let lastRule: string = formattingRules.openStructures[formattingRules.openStructures.length - 1];
			let foundIgnore: any[] = rulesIgnored.filter((rule) => { return rule.id === lastRule;});
			// dentro do BeginSql não mexe na identação
			if ((foundIgnore.length > 0 && !line.text.match(foundIgnore[0].end))) {
				result.push(TextEdit.replace(line.range, line.text.trimRight()));
			}else{
				if ((!line.isEmptyOrWhitespace) && (formattingRules.match(line.text))) {
					let ruleMatch: RuleMatch | null = formattingRules.getLastMatch();

					if (ruleMatch) {
						if (ruleMatch.decrement) {
							cont = cont < 1 ? 0 : cont - 1;
							identBlock = tab.repeat(cont);
						}
					}

					const newLine: string = line.text.replace(/(\s*)?/, identBlock + (this.lineContinue ? tab : "")).trimRight();
					result.push(TextEdit.replace(line.range, newLine));
					this.lineContinue = newLine.endsWith(';');

					if (ruleMatch) {
						if (ruleMatch.increment) {
							cont++;
							identBlock = tab.repeat(cont);
						}
					}
				} else {
					let newLine: string = '';
					if (!line.isEmptyOrWhitespace) {
						newLine = line.text.replace(/(\s*)?/, identBlock + (this.lineContinue ? tab : "")).trimRight();
					}
					result.push(TextEdit.replace(line.range, newLine));
					this.lineContinue = newLine.endsWith(';');
				}
			}
		}

		return result;
	}
}

class RangeFormatting implements DocumentRangeFormattingEditProvider {

	provideDocumentRangeFormattingEdits(document: TextDocument, range: import("vscode").Range, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]> {
		throw new Error("Method not implemented.");
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

export async function advplResourceFormatting(resources: string[], localize) {
	const targetResources: string[] = getResourceList(resources);

	if (targetResources.length === 0) {
		vscode.window.showInformationMessage(localize('formatting.notFound',"Nenhum recurso localizado."));
	} else {
		vscode.window.showInformationMessage(localize('formatting.start',"Formatação em lote iniciada."));

		let lc = await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Formatação",
			cancellable: true
		}, (progress, token) => {
			let lineCount = 0;

			token.onCancellationRequested(() => {
				vscode.window.showWarningMessage(localize('formatting.cancel',"Formatação de recursos cancelada."));
			});
			const total = targetResources.length;
			const increment: number = 100 / total;

			targetResources.forEach((resource: string, index) => {
				const uri: vscode.Uri = vscode.Uri.file(resource);

				vscode.workspace.openTextDocument(uri).then(async (document: TextDocument) => {
					if (document.languageId === "advpl") {
						lineCount += document.lineCount;

						let cfg = vscode.workspace.getConfiguration("[advpl]");
						let _insertSpaces: boolean | undefined = cfg.get("editor.insertSpaces");
						let _tabSize: number | undefined = cfg.get("editor.tabSize");

						if (isUndefined(_insertSpaces)) {
							cfg = vscode.workspace.getConfiguration();
							_insertSpaces = cfg.get("editor.insertSpaces");
						}

						if (isUndefined(_tabSize)) {
							cfg = vscode.workspace.getConfiguration();
							_tabSize = cfg.get("editor.tabSize");
						}

						const options: FormattingOptions = {
							insertSpaces: _insertSpaces ? _insertSpaces : false,
							tabSize: _tabSize ? _tabSize : 4
						};

						const providerResult: ProviderResult<TextEdit[]> = formatter.provideDocumentFormattingEdits(document, options, token);
						if (Array.isArray(providerResult)) {
							progress.report({ increment: increment * index, message: `${uri.toString(false)} (${index + 1}/${total})` });

							const wsEdit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
							wsEdit.set(uri, providerResult);
							await vscode.workspace.applyEdit(wsEdit).then((value: boolean) => {
							}, (reason) => {
									vscode.window.showErrorMessage(localize('formatting.error',`Formatação(erro): ${reason}`));
								console.log(reason);
							});
						}
					}
				});
			});

			const p = new Promise(resolve => {
				setTimeout(() => {
					resolve(lineCount);
				}, 5000);
			});

			return p;
		});
		vscode.window.showInformationMessage(localize('formatting.finish',`Formatação finalizada. Foram processadas ${lc} linhas em ${targetResources.length} arquivos.`));
	}
}

function getResourceList(resources: string[]): string[] {
	const resultList: string[] = [];

	resources.forEach((resourcePath: string) => {
		const fi: fs.Stats = fs.lstatSync(resourcePath);
		if (fi.isDirectory()) {
			let filenames = fs.readdirSync(resourcePath).map<string>((filename: string) => {
				return path.join(resourcePath, filename);
			});
			resultList.push(...getResourceList(filenames));
		} else {
			resultList.push(resourcePath);
		}
	});

	return resultList;
}
