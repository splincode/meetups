"use strict";
var recast = require("recast");
var n = recast.types.namedTypes;
var b = recast.types.builders;
function getRequireString(file, module) {
    return 'require(\'' + file + '\')[\'' + module + '\']';
}
exports.syncCodeGen = function (file, module) { return "function syncCodeGen() { return " + getRequireString(file, module) + "; }"; };
exports.ensureCodeGen = function (file, module, loaderOptions, resourceOptions) {
    var requireString = getRequireString(file, module);
    var webpackChunkName = resourceOptions.chunkName ? ", '" + resourceOptions.chunkName + "'" : '';
    var result = [
        "function ensureCodeGen() { return new Promise(function (resolve) {",
        "  require.ensure([], function (require) {",
        "    resolve(" + requireString + ");",
        "  }" + webpackChunkName + ");",
        "})}"
    ];
    return result.join('');
};
exports.systemCodeGen = function (file, module, opts) {
    exports.systemCodeGen['deprecated']();
    var result = [
        "function systemCodeGen() { return System.import('" + file + "')",
        ".then( function(module) { return module['" + module + "']; } ); }"
    ];
    return result.join('');
};
exports.systemCodeGen['deprecated'] = function () {
    console.warn('\nDEPRECATED: ng-router-loader "async-system" loader use the System.import construct which is deprecated in webpack 2 and will be removed in webpack 3, please use the "async-import" instead. (https://github.com/webpack/webpack/releases/tag/v2.1.0-beta.28)\n');
    exports.systemCodeGen['deprecated'] = function () { };
};
exports.importCodeGen = function (file, module, opts) {
    var result = [
        "function importCodeGen() { return import_('" + file + "')",
        "  .then( function(module) { return module['" + module + "']; } ); }"
    ];
    var fnDec = recast.parse(result.join(''), { ecmaVersion: 5, sourceType: 'script' }).program.body[0];
    n.FunctionDeclaration.assert(fnDec);
    fnDec.body.body[0].argument.callee.object.callee.name = 'import';
    return fnDec;
};
exports.BUILT_IN_CODEGENS = [
    { name: 'sync', codeGen: exports.syncCodeGen },
    { name: 'async-require', codeGen: exports.ensureCodeGen },
    { name: 'async-import', codeGen: exports.importCodeGen },
    { name: 'async-system', codeGen: exports.systemCodeGen }
];
//# sourceMappingURL=builtin_codegens.js.map