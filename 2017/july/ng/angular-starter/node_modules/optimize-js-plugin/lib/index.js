'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var optimizeJs = require('optimize-js');

var _require = require("webpack-sources");

var RawSource = _require.RawSource;


module.exports = function () {
    function OptimizeJsPlugin() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, OptimizeJsPlugin);

        this.options = options;
    }

    _createClass(OptimizeJsPlugin, [{
        key: 'apply',
        value: function apply(compiler) {
            var _this = this;

            var jsRegex = /\.js($|\?)/i;

            compiler.plugin('compilation', function (compilation) {
                compilation.plugin("after-optimize-chunk-assets", function (chunks) {
                    chunks.forEach(function (chunk) {
                        var files = [];
                        chunk.files.forEach(function (file) {
                            return files.push(file);
                        });

                        files.filter(function (file) {
                            return jsRegex.test(file);
                        }).forEach(function (file) {
                            try {
                                var asset = compilation.assets[file];
                                var input = asset.source();
                                var result = optimizeJs(input, {
                                    sourceMap: !!_this.options.sourceMap
                                });
                                compilation.assets[file] = new RawSource(result);
                            } catch (e) {
                                compilation.errors.push(e);
                            }
                        });
                    });
                });
            });
        }
    }]);

    return OptimizeJsPlugin;
}();