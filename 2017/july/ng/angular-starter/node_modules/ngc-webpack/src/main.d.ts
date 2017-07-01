import 'reflect-metadata';
import { NgcCliOptions } from '@angular/compiler-cli';
import { WebpackWrapper } from './webpack-wrapper';
export declare function runInternal(project: string, cliOptions: NgcCliOptions, webpack: WebpackWrapper): Promise<any>;
export declare let run: typeof runInternal;
export declare function main(args: any, consoleError?: (s: string) => void): Promise<any>;
export declare function isCli(): boolean;
