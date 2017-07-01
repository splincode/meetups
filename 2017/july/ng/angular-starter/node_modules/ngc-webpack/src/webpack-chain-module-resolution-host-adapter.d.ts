import { ModuleResolutionHost } from 'typescript';
import { ModuleResolutionHostAdapter } from '@angular/compiler-cli';
import { WebpackWrapper, ExternalAssetsSource } from './webpack-wrapper';
export declare class WebpackChainModuleResolutionHostAdapter extends ModuleResolutionHostAdapter implements ExternalAssetsSource {
    webpackWrapper: WebpackWrapper;
    private _loader;
    constructor(host: ModuleResolutionHost, webpackWrapper: WebpackWrapper);
    readonly externalAssets: any;
    readFile(path: string): string;
    readResource(path: string): Promise<string>;
}
