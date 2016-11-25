import { ReflectorReader } from '../private_import_core';
import { StaticSymbol } from './static_symbol';
/**
 * The host of the StaticReflector disconnects the implementation from TypeScript / other language
 * services and from underlying file systems.
 */
export interface StaticReflectorHost {
    /**
     * Return a ModuleMetadata for the given module.
     * Angular 2 CLI will produce this metadata for a module whenever a .d.ts files is
     * produced and the module has exported variables or classes with decorators. Module metadata can
     * also be produced directly from TypeScript sources by using MetadataCollector in tools/metadata.
     *
     * @param modulePath is a string identifier for a module as an absolute path.
     * @returns the metadata for the given module.
     */
    getMetadataFor(modulePath: string): {
        [key: string]: any;
    }[];
    /**
     * Converts a module name that is used in an `import` to a file path.
     * I.e.
     * `path/to/containingFile.ts` containing `import {...} from 'module-name'`.
     */
    moduleNameToFileName(moduleName: string, containingFile: string): string;
}
/**
 * A cache of static symbol used by the StaticReflector to return the same symbol for the
 * same symbol values.
 */
export declare class StaticSymbolCache {
    private cache;
    get(declarationFile: string, name: string, members?: string[]): StaticSymbol;
}
/**
 * A static reflector implements enough of the Reflector API that is necessary to compile
 * templates statically.
 */
export declare class StaticReflector implements ReflectorReader {
    private host;
    private staticSymbolCache;
    private declarationCache;
    private annotationCache;
    private propertyCache;
    private parameterCache;
    private metadataCache;
    private conversionMap;
    private opaqueToken;
    constructor(host: StaticReflectorHost, staticSymbolCache?: StaticSymbolCache);
    importUri(typeOrFunc: StaticSymbol): string;
    resolveIdentifier(name: string, moduleUrl: string, runtime: any): any;
    resolveEnum(enumIdentifier: any, name: string): any;
    annotations(type: StaticSymbol): any[];
    propMetadata(type: StaticSymbol): {
        [key: string]: any;
    };
    parameters(type: StaticSymbol): any[];
    hasLifecycleHook(type: any, lcProperty: string): boolean;
    private registerDecoratorOrConstructor(type, ctor);
    private registerFunction(type, fn);
    private initializeConversionMap();
    /**
     * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param declarationFile the absolute path of the file where the symbol is declared
     * @param name the name of the type.
     */
    getStaticSymbol(declarationFile: string, name: string, members?: string[]): StaticSymbol;
    private resolveExportedSymbol(filePath, symbolName);
    findDeclaration(module: string, symbolName: string, containingFile?: string): StaticSymbol;
    /**
     * @param module an absolute path to a module file.
     */
    getModuleMetadata(module: string): {
        [key: string]: any;
    };
    private getTypeMetadata(type);
}
