import { Reflection, ReflectionKind, TraverseCallback } from './abstract';
import { ReflectionGroup } from '../ReflectionGroup';
import { DeclarationReflection } from './declaration';
export declare class ContainerReflection extends Reflection {
    children: DeclarationReflection[];
    groups: ReflectionGroup[];
    getChildrenByKind(kind: ReflectionKind): DeclarationReflection[];
    traverse(callback: TraverseCallback): void;
    toObject(): any;
}
