import { WebpackWrapper } from "./webpack-wrapper";
import { NgcWebpackPluginOptions } from './plugin-options';
export declare class NgcWebpackPlugin {
    options: NgcWebpackPluginOptions;
    compiler: any;
    webpackWrapper: WebpackWrapper;
    private aotPass;
    private debug;
    constructor(options?: NgcWebpackPluginOptions);
    apply(compiler: any): void;
    emit(compilation: any, next: (err?: Error) => any): void;
    run(next: (err?: Error) => any): void;
    beforeResolve(result: any, callback: (err: Error | null, result) => void): void;
    afterResolve(result: any, callback: (err: Error | null, result) => void): void;
}
