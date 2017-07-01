"use strict";
var findRoot = require('find-root');
var jsonfile = require('jsonfile');
var Path = require('path');
var fs = require('fs');
var PackageInfo = (function () {
    function PackageInfo(bundle, pkg) {
        this.bundle = bundle;
        if (typeof pkg === 'string') {
            this.name = this.path = pkg;
        }
        else {
            this.name = pkg.name;
            this.path = pkg.path;
        }
    }
    return PackageInfo;
}());
var BUNDLE_STATE_FILENAME = 'dll-bundles-state.json';
var DllBundlesControl = (function () {
    function DllBundlesControl(bundles, options) {
        this.bundles = bundles;
        this.options = options;
    }
    /**
     * Check for bundles that requires a rebuild, based on the bundle configuration.
     * Returns the bundles that requires rebuild.
     * @returns {Promise<DllBundleConfig[]>}
     */
    DllBundlesControl.prototype.checkBundles = function () {
        var _this = this;
        return this.analyzeState()
            .then(function (analyzed) {
            // make a list of all bundles that are invalid, this is not related to the analyzed data
            var bundleNames = _this.bundles
                .map(function (b) { return b.name; })
                .filter(function (name) { return _this.bundleLooksValid(name); });
            if (analyzed.error.length > 0) {
                analyzed.error.forEach(function (p) {
                    console.error(p.error);
                });
                if (!_this.options.ignorePackageError) {
                    throw new Error('DllBundlesPlugin: Some packages have errors.');
                }
            }
            // get all bundles that requires changed based on analyzed data
            // this is an aggregation for all bundles that need a rebuild.
            analyzed.added.concat(analyzed.changed).concat(analyzed.removed).concat(analyzed.error)
                .forEach(function (p) { return bundleNames.indexOf(p.bundle) === -1 && bundleNames.push(p.bundle); });
            // return the DllHostBundleConfig of all bundles that need a rebuild.
            return bundleNames
                .map(function (bundleName) { return _this.bundles.filter(function (bnd) { return bnd.name === bundleName; })[0]; });
        });
    };
    /**
     * Collect metadata from all packages in all bundles and save it to a file representing the current
     * state. File is saved in the `dllDir`.
     * @returns {Promise<void>}
     */
    DllBundlesControl.prototype.saveBundleState = function () {
        var _this = this;
        return this.getMetadata()
            .then(function (metadata) {
            var bundleState = metadata
                .filter(function (m) { return !m.error; })
                .reduce(function (state, pkg) {
                state[pkg.name] = { bundle: pkg.bundle, version: pkg.version };
                return state;
            }, {});
            fs.writeFileSync(Path.join(_this.options.dllDir, BUNDLE_STATE_FILENAME), JSON.stringify(bundleState, null, 2));
        });
    };
    /**
     * Check if the bundle name is valid.
     * This is a shallow check, it only checks for the existence of files that represent a DLL bundle.
     * @param name
     * @returns {boolean}
     */
    DllBundlesControl.prototype.bundleLooksValid = function (name) {
        return !fs.existsSync(Path.join(this.options.dllDir, name + ".dll.js"))
            || !fs.existsSync(Path.join(this.options.dllDir, name + "-manifest.json"));
    };
    /**
     * Collect metadata from all packages in all bundles
     * @returns {Promise<PackageInfo[]>}
     */
    DllBundlesControl.prototype.getMetadata = function () {
        var _this = this;
        var promises = this.bundles
            .map(function (b) { return b.packages.map(function (p) { return new PackageInfo(b.name, p); }); })
            .reduce(function (prev, curr) { return prev.concat(curr); }, [])
            .map(function (pkgInfo) {
            return _this.getPackageJson(pkgInfo.path)
                .then(function (pkgJson) {
                pkgInfo.version = pkgJson.version;
                if (pkgInfo.name !== pkgJson.name) {
                    throw new Error("Package name mismatch, Expected " + pkgInfo.name + " but found " + pkgJson.name + " ");
                }
            })
                .catch(function (err) { return pkgInfo.error = err; })
                .then(function () { return pkgInfo; });
        });
        return Promise.all(promises);
    };
    ;
    /**
     * Find the diff between the current bundle state to the last bundle state.
     * The current bundle state is the required bundle state, the bundle information entered by the user.
     * The last bundle state is a representation of the last build saved in JSON file combined with
     * the state of physical packages on the file system.
     * @returns {Promise<AnalyzedState>}
     */
    DllBundlesControl.prototype.analyzeState = function () {
        var _this = this;
        return this.getMetadata() // get metadata for the required bundle configuration
            .then(function (packages) {
            var result = {
                current: [],
                changed: [],
                added: [],
                removed: [],
                error: []
            };
            var bundleState = _this.getBundleSate();
            var pkgCache = {
                del: function (pkgInfo) {
                    delete bundleState[pkgInfo.name];
                    pkgCache.hist.push(pkgInfo.name);
                },
                deleted: function (pkgInfo) { return pkgCache.hist.indexOf(pkgInfo.name) > -1; },
                hist: []
            };
            // compare to the bundle state, i.e: the last state known
            // we have 4 possible outcomes for each package: No change, version change, added, removed.
            packages.forEach(function (pkgInfo) {
                if (pkgInfo.error) {
                    result.error.push(pkgInfo);
                    pkgCache.del(pkgInfo);
                }
                else if (bundleState.hasOwnProperty(pkgInfo.name)) {
                    if (bundleState[pkgInfo.name].version === pkgInfo.version) {
                        result.current.push(pkgInfo);
                    }
                    else {
                        result.changed.push(pkgInfo);
                    }
                    // we delete it from the bundle list so at the end we have a bundle state that
                    // has packages that were removed
                    pkgCache.del(pkgInfo);
                }
                else {
                    if (!pkgCache.deleted(pkgInfo)) {
                        // first we check if it wasn't deleted in previous loop
                        // this is when 2 names for different paths are set
                        // it can happen if the main file is not importing all parts of the package.
                        result.added.push(pkgInfo);
                    }
                }
            });
            /**
             * All packages left in the bundle state are those removed from last bundle build.
             */
            result.removed = Object.keys(bundleState).map(function (k) { return new PackageInfo(bundleState[k].bundle, k); });
            return result;
        });
    };
    /**
     * Load the last metadata state about all packages in all bundles
     * @returns BundleState
     */
    DllBundlesControl.prototype.getBundleSate = function () {
        if (fs.existsSync(Path.join(this.options.dllDir, BUNDLE_STATE_FILENAME))) {
            return jsonfile.readFileSync(Path.join(this.options.dllDir, BUNDLE_STATE_FILENAME));
        }
        else {
            return {};
        }
    };
    /**
     * Returns package json based on a URI.
     *
     * Currently supports only node resolved value.
     *
     * Returns a Promise for future integration with webpack resolve system.
     *
     * @param uri
     * @returns Promise<{name: string, version: string}>
     */
    DllBundlesControl.prototype.getPackageJson = function (uri) {
        try {
            var pkg = require(this.getPackageJsonPath(uri));
            if (!pkg.name || !pkg.version) {
                throw new Error('Invalid package.json');
            }
            return Promise.resolve(pkg);
        }
        catch (err) {
            return Promise.reject(err);
        }
    };
    DllBundlesControl.prototype.getPackageJsonPath = function (uri) {
        var location = findRoot(require.resolve(uri));
        return Path.join(location, 'package.json');
        // if (fs.statSync(location).isDirectory()) {
        //   return Path.join(location, 'package.json');
        // } else {
        //   return Path.join(Path.dirname(location), 'package.json');
        // }
    };
    return DllBundlesControl;
}());
exports.DllBundlesControl = DllBundlesControl;
//# sourceMappingURL=DllBundlesControl.js.map