"use strict";
var webpack = require("webpack");
var Path = require("path");
var compiler_cli_1 = require("@angular/compiler-cli");
var plugin_1 = require("./plugin");
/**
 * Resolve the config to an object.
 * If it's a fn, invoke.
 *
 * Also check if it's a mocked ES6 Module in cases where TS file is used that uses "export default"
 * @param config
 * @returns {any}
 */
function resolveConfig(config) {
    if (typeof config === 'function') {
        return config();
    }
    else if (config.__esModule === true && !!config.default) {
        return resolveConfig(config.default);
    }
    else {
        return config;
    }
}
function findPlugin(compiler) {
    return compiler.options.plugins
        .filter(function (p) { return p instanceof plugin_1.NgcWebpackPlugin; })[0];
}
var WebpackWrapper = (function () {
    function WebpackWrapper(compiler) {
        this.compiler = compiler;
        this.aotResources = {}; //TODO: use Map if in node 5
        this.plugin = findPlugin(compiler);
        this.hasPlugin = !!this.plugin;
    }
    ;
    Object.defineProperty(WebpackWrapper.prototype, "externalAssetsSource", {
        get: function () {
            return this._externalAssetsSource;
        },
        set: function (value) {
            this._externalAssetsSource = value;
        },
        enumerable: true,
        configurable: true
    });
    WebpackWrapper.prototype.emitOnCompilationSuccess = function () {
        if (this.hasPlugin && typeof this.plugin.options.onCompilationSuccess === 'function') {
            this.plugin.options.onCompilationSuccess.call(this);
        }
    };
    WebpackWrapper.prototype.emitOnCompilationError = function (err) {
        if (this.hasPlugin && typeof this.plugin.options.onCompilationError === 'function') {
            this.plugin.options.onCompilationError.call(this, err);
        }
    };
    WebpackWrapper.prototype.resourcePathTransformer = function (path) {
        this.aotResources[Path.normalize(path)] = true;
        var fn = this.plugin && (this.plugin.options.resourcePathTransformer || this.plugin.options.pathTransformer);
        if (typeof fn === 'function') {
            return fn(path);
        }
        else {
            return path;
        }
    };
    WebpackWrapper.prototype.resourceTransformer = function (path, source) {
        var fn = this.plugin && (this.plugin.options.resourceTransformer || this.plugin.options.sourceTransformer);
        if (typeof fn === 'function') {
            return fn(path, source);
        }
        else {
            return source;
        }
    };
    WebpackWrapper.prototype.readFileTransformer = function (path, source) {
        if (this.plugin && typeof this.plugin.options.readFileTransformer === 'function') {
            return this.plugin.options.readFileTransformer(path, source);
        }
        else {
            return source;
        }
    };
    WebpackWrapper.fromConfig = function (webpackConfig) {
        try {
            var config = void 0;
            if (!webpackConfig) {
                webpackConfig = './webpack.config.js';
            }
            if (typeof webpackConfig === 'string') {
                var configPath = Path.isAbsolute(webpackConfig)
                    ? webpackConfig
                    : Path.join(process.cwd(), webpackConfig);
                config = require(configPath);
            }
            else {
                config = webpackConfig;
            }
            var configModule = resolveConfig(config);
            var compiler = webpack(configModule);
            // setting the plugin is not mandatory so we check if it exists.
            // if does it creates the wrapper, otherwise we need to create it.
            var plugin = findPlugin(compiler);
            return plugin ? plugin.webpackWrapper : WebpackWrapper.fromCompiler(compiler);
        }
        catch (err) {
            throw new compiler_cli_1.UserError("Invalid webpack configuration. Please set a valid --webpack argument.\n" + err.message);
        }
    };
    WebpackWrapper.fromCompiler = function (compiler) {
        return new WebpackWrapper(compiler);
    };
    return WebpackWrapper;
}());
exports.WebpackWrapper = WebpackWrapper;
//# sourceMappingURL=webpack-wrapper.js.map