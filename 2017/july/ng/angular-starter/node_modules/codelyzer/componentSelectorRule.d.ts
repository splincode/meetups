import { SelectorRule } from './selectorNameBase';
import * as Lint from 'tslint';
export declare class Rule extends SelectorRule {
    static metadata: Lint.IRuleMetadata;
    handleType: string;
    getTypeFailure(): any;
    getNameFailure(): any;
    getSinglePrefixFailure(): any;
    getManyPrefixFailure(): any;
}
