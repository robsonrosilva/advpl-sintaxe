"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const fileSystem = require("fs");
class Cache {
    constructor(fileCache) {
        this.fileCache = fileCache;
        this.tmpFolder = os.tmpdir();
        this.fileCache = this.fileCache.replace(/\\/g, '').replace(/\:/g, '').replace(/\//g, '') + '.cache';
        let content;
        try {
            if (!fileSystem.existsSync(this.tmpFolder + '\\' + this.fileCache)) {
                fileSystem.writeFileSync(this.tmpFolder + '\\' + this.fileCache, '', { mode: 0o755 });
            }
            content = fileSystem.readFileSync(this.tmpFolder + '\\' + this.fileCache, "utf8");
        }
        catch (err) {
            // An error occurred
            console.error(err);
        }
        if (content) {
            this.filesInCache = JSON.parse(content);
        }
        else {
            this.filesInCache = [];
        }
    }
    //adiciona o item e grava em cache
    addFile(file) {
        // Faz uma cópia do objeto pois como uso sempre o mesmo evito maiores problemas
        file.validaAdvpl = JSON.parse(JSON.stringify(file.validaAdvpl));
        this.filesInCache.push(file);
        try {
            fileSystem.writeFileSync(this.tmpFolder + '\\' + this.fileCache, JSON.stringify(this.filesInCache), { flag: 'w' });
        }
        catch (err) {
            // An error occurred
            console.error(err);
        }
    }
    //remove o item e grava em cache
    delFile(fsPath) {
        this.filesInCache = this.filesInCache.filter(_file => _file.file.fsPath !== fsPath);
        try {
            fileSystem.writeFileSync(this.tmpFolder + '\\' + this.fileCache, JSON.stringify(this.filesInCache), { flag: 'w' });
        }
        catch (err) {
            // An error occurred
            console.error(err);
        }
    }
}
exports.Cache = Cache;

//# sourceMappingURL=Cache.js.map
