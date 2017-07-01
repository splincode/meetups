"use strict";
var Path = require("path");
var compiler_cli_1 = require("@angular/compiler-cli");
var main_1 = require("./main");
var webpack_wrapper_1 = require("./webpack-wrapper");
var webpack_resource_loader_1 = require("./webpack-resource-loader");
var NgcWebpackPlugin = (function () {
    function NgcWebpackPlugin(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        this.debug = true;
        if (!options.hasOwnProperty('disabled')) {
            options.disabled = false;
        }
    }
    NgcWebpackPlugin.prototype.apply = function (compiler) {
        var _this = this;
        if (this.options.disabled === true)
            return;
        this.compiler = compiler;
        this.webpackWrapper = webpack_wrapper_1.WebpackWrapper.fromCompiler(this.compiler);
        // if not from cli and no config file then we never have AOT pass...
        this.aotPass = !main_1.isCli() && !this.options.tsConfig ? false : true;
        compiler.plugin('run', function (compiler, next) { return _this.run(next); });
        compiler.plugin('watch-run', function (compiler, next) { return _this.run(next); });
        compiler.plugin('emit', function (compilation, next) { return _this.emit(compilation, next); });
        compiler.plugin("normal-module-factory", function (nmf) {
            nmf.plugin('before-resolve', function (result, callback) { return _this.beforeResolve(result, callback); });
            nmf.plugin('after-resolve', function (result, callback) { return _this.afterResolve(result, callback); });
        });
    };
    NgcWebpackPlugin.prototype.emit = function (compilation, next) {
        if (!!this.options.resourceOverride && this.webpackWrapper.externalAssetsSource) {
            var externalAssets_1 = this.webpackWrapper.externalAssetsSource.externalAssets || {};
            Object.keys(externalAssets_1).forEach(function (k) { return compilation.assets[k] = externalAssets_1[k]; });
        }
        next();
    };
    NgcWebpackPlugin.prototype.run = function (next) {
        var _this = this;
        if (this.options.tsConfig) {
            if (this.debug) {
                console.log('Starting compilation using the angular compiler.');
            }
            var p = void 0;
            if (typeof this.options.beforeRun === 'function') {
                var loader = new webpack_resource_loader_1.WebpackResourceLoader(this.webpackWrapper.compiler.createCompilation(), !!this.options.resourceOverride);
                p = this.options.beforeRun(loader);
            }
            else {
                p = Promise.resolve();
            }
            p.then(function () { return main_1.run(_this.options.tsConfig, new compiler_cli_1.NgcCliOptions(_this.options.cliOptions || {}), _this.webpackWrapper); })
                .then(function () { return undefined; }) // ensure the last then get's undefined if no error.
                .catch(function (err) { return err; })
                .then(function (err) {
                if (_this.debug) {
                    console.log('Angular compilation done, starting webpack bundling.');
                }
                _this.aotPass = false;
                next(err);
            });
        }
        else {
            next();
        }
    };
    NgcWebpackPlugin.prototype.beforeResolve = function (result, callback) {
        if (!this.aotPass && this.options.resourceOverride && this.webpackWrapper.aotResources[Path.normalize(result.request)] === true) {
            result.request = this.options.resourceOverride;
        }
        callback(null, result);
    };
    NgcWebpackPlugin.prototype.afterResolve = function (result, callback) {
        if (!this.aotPass && this.options.resourceOverride && this.webpackWrapper.aotResources[Path.normalize(result.resource)] === true) {
            result.resource = Path.resolve(Path.dirname(result.resource), this.options.resourceOverride);
        }
        callback(null, result);
    };
    return NgcWebpackPlugin;
}());
exports.NgcWebpackPlugin = NgcWebpackPlugin;
//# sourceMappingURL=plugin.js.map