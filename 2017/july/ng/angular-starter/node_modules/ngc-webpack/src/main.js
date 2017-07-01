#!/usr/bin/env node
"use strict";
require('ts-node/register');
require("reflect-metadata");
var compiler_1 = require("@angular/compiler");
var compiler_cli_1 = require("@angular/compiler-cli");
var webpack_wrapper_1 = require("./webpack-wrapper");
var webpack_chain_module_resolution_host_adapter_1 = require("./webpack-chain-module-resolution-host-adapter");
function codeGenFactory(webpackWrapper) {
    return function (ngOptions, cliOptions, program, host) {
        var hostContext = new webpack_chain_module_resolution_host_adapter_1.WebpackChainModuleResolutionHostAdapter(host, webpackWrapper);
        return compiler_cli_1.CodeGenerator.create(ngOptions, cliOptions, program, host, hostContext).codegen();
    };
}
function runInternal(project, cliOptions, webpack) {
    return compiler_cli_1.main(project, cliOptions, codeGenFactory(webpack))
        .then(function () { return webpack.emitOnCompilationSuccess(); })
        .catch(function (e) {
        webpack.emitOnCompilationError(e);
        throw e;
    });
}
exports.runInternal = runInternal;
exports.run = runInternal;
function main(args, consoleError) {
    if (consoleError === void 0) { consoleError = console.error; }
    exports.run = (function () {
        return consoleError('NgcWebpackPlugin is configured for integrated compilation while the compiler executed from the command line, this is not valid. Integrated compilation cancelled.');
    });
    var project = args.p || args.project || '.';
    var cliOptions = new compiler_cli_1.NgcCliOptions(args);
    var webpack = webpack_wrapper_1.WebpackWrapper.fromConfig(args.webpack);
    return runInternal(project, cliOptions, webpack)
        .then(function () { return 0; })
        .catch(function (e) {
        if (e instanceof compiler_cli_1.UserError || e instanceof compiler_1.SyntaxError) {
            consoleError(e.message);
            return Promise.resolve(1);
        }
        else {
            consoleError(e.stack);
            consoleError('Compilation failed');
            return Promise.resolve(1);
        }
    });
}
exports.main = main;
function isCli() {
    return require.main === module;
}
exports.isCli = isCli;
// CLI entry point
if (isCli()) {
    var args = require('minimist')(process.argv.slice(2));
    main(args).then(function (exitCode) { return process.exit(exitCode); });
}
//# sourceMappingURL=main.js.map