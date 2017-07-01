"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var compiler_cli_1 = require("@angular/compiler-cli");
var webpack_resource_loader_1 = require("./webpack-resource-loader");
var WebpackChainModuleResolutionHostAdapter = (function (_super) {
    __extends(WebpackChainModuleResolutionHostAdapter, _super);
    function WebpackChainModuleResolutionHostAdapter(host, webpackWrapper) {
        var _this = _super.call(this, host) || this;
        _this.webpackWrapper = webpackWrapper;
        _this._loader = new webpack_resource_loader_1.WebpackResourceLoader(webpackWrapper.compiler.createCompilation());
        webpackWrapper.externalAssetsSource = _this;
        return _this;
    }
    Object.defineProperty(WebpackChainModuleResolutionHostAdapter.prototype, "externalAssets", {
        get: function () {
            return this._loader.getExternalAssets();
        },
        enumerable: true,
        configurable: true
    });
    WebpackChainModuleResolutionHostAdapter.prototype.readFile = function (path) {
        return this.webpackWrapper.readFileTransformer(path, _super.prototype.readFile.call(this, path));
    };
    WebpackChainModuleResolutionHostAdapter.prototype.readResource = function (path) {
        var _this = this;
        var newPath = this.webpackWrapper.resourcePathTransformer(path);
        if (newPath === '') {
            return Promise.resolve(newPath);
        }
        else if (!this.fileExists(newPath)) {
            throw new Error("Compilation failed. Resource file not found: " + newPath);
        }
        else {
            return this._loader.get(newPath)
                .then(function (source) { return Promise.resolve(_this.webpackWrapper.resourceTransformer(newPath, source)); });
        }
    };
    return WebpackChainModuleResolutionHostAdapter;
}(compiler_cli_1.ModuleResolutionHostAdapter));
exports.WebpackChainModuleResolutionHostAdapter = WebpackChainModuleResolutionHostAdapter;
//# sourceMappingURL=webpack-chain-module-resolution-host-adapter.js.map