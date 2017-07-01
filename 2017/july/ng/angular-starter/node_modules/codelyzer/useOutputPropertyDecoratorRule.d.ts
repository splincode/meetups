import * as Lint from 'tslint';
import { UsePropertyDecorator } from './propertyDecoratorBase';
export declare class Rule extends UsePropertyDecorator {
    static metadata: Lint.IRuleMetadata;
    constructor(ruleName: string, value: any, disabledIntervals: Lint.IDisabledInterval[]);
}
