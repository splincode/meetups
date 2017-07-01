'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _addAllAssetsToCompilation = require('./addAllAssetsToCompilation');

var _addAllAssetsToCompilation2 = _interopRequireDefault(_addAllAssetsToCompilation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AddAssetHtmlPlugin = function () {
  function AddAssetHtmlPlugin() {
    var assets = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, AddAssetHtmlPlugin);

    this.assets = Array.isArray(assets) ? assets.slice().reverse() : [assets];
  }

  /* istanbul ignore next: this would be integration tests */


  _createClass(AddAssetHtmlPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-generation', function (htmlPluginData, callback) {
          (0, _addAllAssetsToCompilation2.default)(_this.assets, compilation, htmlPluginData, callback);
        });
      });
    }
  }]);

  return AddAssetHtmlPlugin;
}();

exports.default = AddAssetHtmlPlugin;
module.exports = exports['default'];