/// <reference types="webpack" />
import * as webpack from 'webpack';
export declare type Compiler = webpack.compiler.Compiler;
export declare type Stats = webpack.compiler.Stats;
export declare function resolveConfig(config: any): any;
export declare function runWebpack(config: any): {
    compiler: Compiler;
    done: Promise<Stats>;
};
