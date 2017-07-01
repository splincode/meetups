import { DllBundleConfig, DllBundlesPluginOptions } from './interfaces';
export declare class DllBundlesControl {
    private bundles;
    private options;
    constructor(bundles: DllBundleConfig[], options: DllBundlesPluginOptions);
    /**
     * Check for bundles that requires a rebuild, based on the bundle configuration.
     * Returns the bundles that requires rebuild.
     * @returns {Promise<DllBundleConfig[]>}
     */
    checkBundles(): Promise<DllBundleConfig[]>;
    /**
     * Collect metadata from all packages in all bundles and save it to a file representing the current
     * state. File is saved in the `dllDir`.
     * @returns {Promise<void>}
     */
    saveBundleState(): Promise<void>;
    /**
     * Check if the bundle name is valid.
     * This is a shallow check, it only checks for the existence of files that represent a DLL bundle.
     * @param name
     * @returns {boolean}
     */
    private bundleLooksValid(name);
    /**
     * Collect metadata from all packages in all bundles
     * @returns {Promise<PackageInfo[]>}
     */
    private getMetadata();
    /**
     * Find the diff between the current bundle state to the last bundle state.
     * The current bundle state is the required bundle state, the bundle information entered by the user.
     * The last bundle state is a representation of the last build saved in JSON file combined with
     * the state of physical packages on the file system.
     * @returns {Promise<AnalyzedState>}
     */
    private analyzeState();
    /**
     * Load the last metadata state about all packages in all bundles
     * @returns BundleState
     */
    private getBundleSate();
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
    private getPackageJson(uri);
    private getPackageJsonPath(uri);
}
