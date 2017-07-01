"use strict";
var loaderUtils = require('loader-utils');
var os = require("os");
var fs = require("fs");
var path = require("path");
var options_1 = require("./options");
var RouteModule_1 = require("./RouteModule");
var ast_1 = require("./ast");
var LOAD_CHILDREN_RE = /loadChildren[\s]*:[\s]*['|"].+?['|"]/;
var Loader = (function () {
    function Loader(webpack) {
        this.webpack = webpack;
    }
    Loader.prototype.replace = function (source) {
        var _this = this;
        // TODO: Check what is faster: match -> match found -> AST    OR just AST for all modules.
        var match = LOAD_CHILDREN_RE.exec(source);
        // let match = source.match(/loadChildren[\s]*:[\s]*['|"](.*?)['|"]/);
        if (match) {
            this.query = Object.assign({}, options_1.DEFAULT_OPTIONS, loaderUtils.parseQuery(this.webpack.query));
            var transformController_1 = ast_1.createTransformerController(source);
            var promises = transformController_1.transformers
                .map(function (exp) { return _this.replaceSource(exp.expLiteral, exp.expLiteral)
                .then(function (result) {
                result.replacement = exp.transform(result.replacement);
                return result;
            }); });
            return Promise.all(promises)
                .then(function (results) {
                return {
                    debug: typeof _this.query.debug !== 'boolean' ? _this.webpack.debug : _this.query.debug,
                    source: transformController_1.getCode(!_this.query.inline),
                    results: results
                };
            });
        }
        else {
            return Promise.resolve({ source: source, results: [] });
        }
    };
    Loader.prototype.resolve = function (context, resourceUri) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.webpack.resolve(context, resourceUri, function (err, fullPath) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(fullPath);
                }
            });
        });
    };
    Loader.prototype.replaceSource = function (match, loadChildrenPath) {
        var _this = this;
        var route = new RouteModule_1.RouteDestination(loadChildrenPath, this.webpack.resourcePath, this.query);
        var codeGen = Loader.LOADER_CODEGEN_MAP.get(route.options.loader);
        if (!codeGen) {
            return Promise.reject(new Error("ng-router-loader - Invalid code generator \"" + route.options.loader + "\""));
        }
        var context = !route.isRawRelative || !route.isCompiled
            ? path.dirname(this.webpack.resourcePath)
            : path.dirname(this.genDirToSourceTree(this.webpack.resourcePath));
        return this.resolve(context, route.rawFilePath)
            .then(function (filePath) {
            var moduleName = route.moduleName;
            // update the file path for non-ngfactory files
            if (_this.query.aot) {
                filePath = _this.sourceTreeToGenDir(filePath);
                filePath = filePath.substr(0, filePath.lastIndexOf('.'));
                if (route.options.bySymbol) {
                    filePath = _this.trackSymbolRootDecl(filePath, route.moduleName);
                }
                filePath = filePath + _this.query.moduleSuffix;
                moduleName = moduleName + _this.query.factorySuffix;
            }
            else {
                filePath = filePath.substr(0, filePath.lastIndexOf('.'));
            }
            filePath = _this.normalize(filePath);
            var replacement = codeGen(filePath, moduleName, _this.query, route.options);
            return {
                filePath: filePath,
                moduleName: moduleName,
                resourceQuery: route.options,
                match: match,
                replacement: replacement
            };
        });
    };
    Loader.prototype.normalize = function (filePath) {
        var normalizedPath = path.normalize(filePath);
        if (os.platform() === 'win32') {
            normalizedPath = normalizedPath.replace(/\\/g, '\\\\');
        }
        return normalizedPath;
    };
    Loader.prototype.trackSymbolRootDecl = function (absPath, moduleName) {
        var summarySuffix = '.ngsummary.json';
        if (absPath.endsWith(summarySuffix)) {
            var summary_1 = require(absPath);
            var symbols = summary_1.symbols
                .filter(function (s) { return s.name === moduleName; })
                .filter(function (s) { return summary_1.summaries.some(function (ss) { return ss.metadata.__symbol === s.__symbol; }); });
            var m = symbols[0];
            var filePath = m.filePath.replace(/^(.*)\.d\.ts$/, '$1');
            return this.trackSymbolRootDecl(this.sourceTreeToGenDir(filePath), moduleName);
        }
        else if (fs.existsSync(absPath + this.query.moduleSuffix + '.ts')) {
            return absPath;
        }
        else {
            return this.trackSymbolRootDecl(absPath + summarySuffix, moduleName);
        }
    };
    /**
     * Convert a source tree file path into a it's genDir representation
     * this only change the path to the file, not the file iteself (i.e: suffix)
     * @param absFilePath
     * @returns {string}
     */
    Loader.prototype.sourceTreeToGenDir = function (absFilePath) {
        if (this.query.genDir && this.query.genDir !== '.') {
            var relativeNgModulePath = path.relative(process.cwd(), absFilePath);
            return path.join(path.resolve(process.cwd(), this.query.genDir), relativeNgModulePath);
        }
        else {
            return absFilePath;
        }
    };
    Loader.prototype.genDirToSourceTree = function (absFilePath) {
        if (this.query.genDir && this.query.genDir !== '.') {
            var relativeNgModulePath = path.relative(path.resolve(process.cwd(), this.query.genDir), absFilePath);
            return path.join(process.cwd(), relativeNgModulePath);
        }
        else {
            return absFilePath;
        }
    };
    Loader.setCodeGen = function (name, codeGen) {
        Loader.LOADER_CODEGEN_MAP.set(name, codeGen);
    };
    return Loader;
}());
Loader.LOADER_CODEGEN_MAP = new Map();
exports.Loader = Loader;
//# sourceMappingURL=Loader.js.map