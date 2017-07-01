import { ResourceLoader } from '@angular/compiler';
export declare class WebpackResourceLoader implements ResourceLoader {
    private _parentCompilation;
    private collectAssets;
    private _context;
    private _uniqueId;
    private emittedFiles;
    constructor(_parentCompilation: any, collectAssets?: boolean);
    private _compile(filePath, content);
    private _evaluate(fileName, source);
    get(filePath: string): Promise<string>;
    getExternalAssets(): any;
}
