import * as vscode from "vscode";
import { ValidaAdvpl } from "analise-advpl";

export class FileCache{
    file: vscode.Uri;
    content: string;
    validaAdvpl: ValidaAdvpl;
}