"use strict";
var webpack = require('webpack');
function resolveConfig(config) {
    if (typeof config === 'string') {
        return resolveConfig(require(config));
    }
    else if (typeof config === 'function') {
        return config();
    }
    else if (config.__esModule === true && !!config.default) {
        return resolveConfig(config.default);
    }
    else {
        return config;
    }
}
exports.resolveConfig = resolveConfig;
function runWebpack(config) {
    var compiler = webpack(resolveConfig(config));
    return {
        compiler: compiler,
        done: new Promise(function (RSV, RJT) { return compiler.run(function (err, stats) { return err ? RJT(err) : RSV(stats); }); })
    };
}
exports.runWebpack = runWebpack;
//# sourceMappingURL=utils.js.map