export interface RouteModuleTransformerController {
    transformers: Array<{
        expLiteral: string;
        transform: (fnCode: string | any) => string;
    }>;
    getCode: (pretty: boolean) => string;
}
export declare function createTransformerController(source: string): RouteModuleTransformerController;
