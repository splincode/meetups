'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (assets, compilation, htmlPluginData, callback) {
  return _bluebird2.default.mapSeries(assets, function (asset) {
    return addFileToAssets(compilation, htmlPluginData, asset);
  }).then(function () {
    return callback(null, htmlPluginData);
  }).catch(function (e) {
    return callback(e, htmlPluginData);
  });
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ensureTrailingSlash(string) {
  if (string.length && string.substr(-1, 1) !== '/') {
    return string + '/';
  }

  return string;
}

// Copied from html-webpack-plugin
function resolvePublicPath(compilation, filename) {
  /* istanbul ignore else */
  var publicPath = typeof compilation.options.output.publicPath !== 'undefined' ? compilation.options.output.publicPath : _path2.default.relative(_path2.default.dirname(filename), '.'); // TODO: How to test this? I haven't written this logic, unsure what it does

  return ensureTrailingSlash(publicPath);
}

function resolveOutput(compilation, addedFilename, outputPath) {
  if (outputPath && outputPath.length) {
    compilation.assets[outputPath + '/' + addedFilename] = compilation.assets[addedFilename]; // eslint-disable-line no-param-reassign
    delete compilation.assets[addedFilename]; // eslint-disable-line no-param-reassign
  }
}

function addFileToAssets(compilation, htmlPluginData, _ref) {
  var filepath = _ref.filepath;
  var _ref$typeOfAsset = _ref.typeOfAsset;
  var typeOfAsset = _ref$typeOfAsset === undefined ? 'js' : _ref$typeOfAsset;
  var _ref$includeSourcemap = _ref.includeSourcemap;
  var includeSourcemap = _ref$includeSourcemap === undefined ? true : _ref$includeSourcemap;
  var _ref$hash = _ref.hash;
  var hash = _ref$hash === undefined ? false : _ref$hash;
  var publicPath = _ref.publicPath;
  var outputPath = _ref.outputPath;

  if (!filepath) {
    var error = new Error('No filepath defined');
    compilation.errors.push(error);
    return _bluebird2.default.reject(error);
  }

  return htmlPluginData.plugin.addFileToAssets(filepath, compilation).then(function (addedFilename) {
    var suffix = '';
    if (hash) {
      var md5 = _crypto2.default.createHash('md5');
      md5.update(compilation.assets[addedFilename].source());
      suffix = '?' + md5.digest('hex').substr(0, 20);
    }

    var resolvedPublicPath = typeof publicPath === 'undefined' ? resolvePublicPath(compilation, addedFilename) : ensureTrailingSlash(publicPath);
    var resolvedPath = '' + resolvedPublicPath + addedFilename + suffix;

    htmlPluginData.assets[typeOfAsset].unshift(resolvedPath);

    resolveOutput(compilation, addedFilename, outputPath);

    return resolvedPath;
  }).then(function () {
    if (includeSourcemap) {
      return htmlPluginData.plugin.addFileToAssets(filepath + '.map', compilation).then(function (addedFilename) {
        resolveOutput(compilation, addedFilename, outputPath);
        return null;
      });
    }
    return null;
  });
}

// Visible for testing
module.exports = exports['default'];