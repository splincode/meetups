/// <reference types="webpack" />
import { loader } from 'webpack';
import { RouterLoaderOptions, RouteResourceOptions } from './options';
export interface ReplaceResult {
    /**
     * The resolved path
     */
    filePath: string;
    /**
     * The NgModule property on the resolved module
     */
    moduleName: string;
    /**
     * The RESOURCE query used to resolve the module.
     * Note: This is the query defined on the URI used in "loadChildren", not the global query.
     */
    resourceQuery: RouteResourceOptions;
    /**
     * The content remove from the source file.
     */
    match: string;
    /**
     * The content inserted into the source file.
     */
    replacement: string;
}
/**
 * Loader code generator type, can return the code as string or as an esprima FunctionDeclaration
 */
export declare type LoaderCodeGen = Function & (((file: string, module: string) => string | any) | ((file: string, module: string, loaderOptions: RouterLoaderOptions) => any) | ((file: string, module: string, loaderOptions: RouterLoaderOptions, resourceOptions: RouteResourceOptions) => string));
export declare class Loader {
    private webpack;
    query: RouterLoaderOptions;
    constructor(webpack: loader.LoaderContext);
    replace(source: string): Promise<{
        debug: boolean;
        source: string;
        results: Array<ReplaceResult>;
    }>;
    private resolve(context, resourceUri);
    private replaceSource(match, loadChildrenPath);
    private normalize(filePath);
    private trackSymbolRootDecl(absPath, moduleName);
    /**
     * Convert a source tree file path into a it's genDir representation
     * this only change the path to the file, not the file iteself (i.e: suffix)
     * @param absFilePath
     * @returns {string}
     */
    private sourceTreeToGenDir(absFilePath);
    private genDirToSourceTree(absFilePath);
    static setCodeGen(name: string, codeGen: LoaderCodeGen): void;
    static LOADER_CODEGEN_MAP: Map<string, LoaderCodeGen>;
}
