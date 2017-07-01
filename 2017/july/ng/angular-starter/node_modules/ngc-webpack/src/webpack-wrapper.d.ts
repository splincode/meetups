import { NgcWebpackPlugin } from './plugin';
export interface ExternalAssetsSource {
    externalAssets: any;
}
export declare class WebpackWrapper {
    compiler: any;
    plugin: NgcWebpackPlugin;
    aotResources: any;
    private hasPlugin;
    private _externalAssetsSource;
    private constructor(compiler);
    externalAssetsSource: ExternalAssetsSource;
    emitOnCompilationSuccess(): void;
    emitOnCompilationError(err: Error): void;
    resourcePathTransformer(path: string): string;
    resourceTransformer(path: string, source: string): string | Promise<string>;
    readFileTransformer(path: string, source: string): string;
    static fromConfig(webpackConfig: string | any): WebpackWrapper;
    static fromCompiler(compiler: any): WebpackWrapper;
}
