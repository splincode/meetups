/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Attribute, Component, ContentChild, ContentChildren, Directive, Host, HostBinding, HostListener, Inject, Injectable, Input, NgModule, Optional, Output, Pipe, Self, SkipSelf, ViewChild, ViewChildren, animate, group, keyframes, sequence, state, style, transition, trigger } from '@angular/core';
import { StaticSymbol } from './static_symbol';
var SUPPORTED_SCHEMA_VERSION = 2;
var ANGULAR_IMPORT_LOCATIONS = {
    coreDecorators: '@angular/core/src/metadata',
    diDecorators: '@angular/core/src/di/metadata',
    diMetadata: '@angular/core/src/di/metadata',
    diOpaqueToken: '@angular/core/src/di/opaque_token',
    animationMetadata: '@angular/core/src/animation/metadata',
    provider: '@angular/core/src/di/provider'
};
/**
 * A cache of static symbol used by the StaticReflector to return the same symbol for the
 * same symbol values.
 */
export var StaticSymbolCache = (function () {
    function StaticSymbolCache() {
        this.cache = new Map();
    }
    StaticSymbolCache.prototype.get = function (declarationFile, name, members) {
        var memberSuffix = members ? "." + members.join('.') : '';
        var key = "\"" + declarationFile + "\"." + name + memberSuffix;
        var result = this.cache.get(key);
        if (!result) {
            result = new StaticSymbol(declarationFile, name, members);
            this.cache.set(key, result);
        }
        return result;
    };
    return StaticSymbolCache;
}());
/**
 * A static reflector implements enough of the Reflector API that is necessary to compile
 * templates statically.
 */
export var StaticReflector = (function () {
    function StaticReflector(host, staticSymbolCache) {
        if (staticSymbolCache === void 0) { staticSymbolCache = new StaticSymbolCache(); }
        this.host = host;
        this.staticSymbolCache = staticSymbolCache;
        this.declarationCache = new Map();
        this.annotationCache = new Map();
        this.propertyCache = new Map();
        this.parameterCache = new Map();
        this.metadataCache = new Map();
        this.conversionMap = new Map();
        this.initializeConversionMap();
    }
    StaticReflector.prototype.importUri = function (typeOrFunc) {
        var staticSymbol = this.findDeclaration(typeOrFunc.filePath, typeOrFunc.name, '');
        return staticSymbol ? staticSymbol.filePath : null;
    };
    StaticReflector.prototype.resolveIdentifier = function (name, moduleUrl, runtime) {
        return this.findDeclaration(moduleUrl, name, '');
    };
    StaticReflector.prototype.resolveEnum = function (enumIdentifier, name) {
        var staticSymbol = enumIdentifier;
        return this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name, [name]);
    };
    StaticReflector.prototype.annotations = function (type) {
        var annotations = this.annotationCache.get(type);
        if (!annotations) {
            var classMetadata = this.getTypeMetadata(type);
            if (classMetadata['decorators']) {
                annotations = this.simplify(type, classMetadata['decorators']);
            }
            else {
                annotations = [];
            }
            this.annotationCache.set(type, annotations.filter(function (ann) { return !!ann; }));
        }
        return annotations;
    };
    StaticReflector.prototype.propMetadata = function (type) {
        var _this = this;
        var propMetadata = this.propertyCache.get(type);
        if (!propMetadata) {
            var classMetadata = this.getTypeMetadata(type);
            var members = classMetadata ? classMetadata['members'] : {};
            propMetadata = mapStringMap(members, function (propData, propName) {
                var prop = propData
                    .find(function (a) { return a['__symbolic'] == 'property' || a['__symbolic'] == 'method'; });
                if (prop && prop['decorators']) {
                    return _this.simplify(type, prop['decorators']);
                }
                else {
                    return [];
                }
            });
            this.propertyCache.set(type, propMetadata);
        }
        return propMetadata;
    };
    StaticReflector.prototype.parameters = function (type) {
        if (!(type instanceof StaticSymbol)) {
            throw new Error("parameters received " + JSON.stringify(type) + " which is not a StaticSymbol");
        }
        try {
            var parameters_1 = this.parameterCache.get(type);
            if (!parameters_1) {
                var classMetadata = this.getTypeMetadata(type);
                var members = classMetadata ? classMetadata['members'] : null;
                var ctorData = members ? members['__ctor__'] : null;
                if (ctorData) {
                    var ctor = ctorData.find(function (a) { return a['__symbolic'] == 'constructor'; });
                    var parameterTypes = this.simplify(type, ctor['parameters'] || []);
                    var parameterDecorators_1 = this.simplify(type, ctor['parameterDecorators'] || []);
                    parameters_1 = [];
                    parameterTypes.forEach(function (paramType, index) {
                        var nestedResult = [];
                        if (paramType) {
                            nestedResult.push(paramType);
                        }
                        var decorators = parameterDecorators_1 ? parameterDecorators_1[index] : null;
                        if (decorators) {
                            nestedResult.push.apply(nestedResult, decorators);
                        }
                        parameters_1.push(nestedResult);
                    });
                }
                if (!parameters_1) {
                    parameters_1 = [];
                }
                this.parameterCache.set(type, parameters_1);
            }
            return parameters_1;
        }
        catch (e) {
            console.log("Failed on type " + JSON.stringify(type) + " with error " + e);
            throw e;
        }
    };
    StaticReflector.prototype.hasLifecycleHook = function (type, lcProperty) {
        if (!(type instanceof StaticSymbol)) {
            throw new Error("hasLifecycleHook received " + JSON.stringify(type) + " which is not a StaticSymbol");
        }
        var classMetadata = this.getTypeMetadata(type);
        var members = classMetadata ? classMetadata['members'] : null;
        var member = members && members.hasOwnProperty(lcProperty) ? members[lcProperty] : null;
        return member ? member.some(function (a) { return a['__symbolic'] == 'method'; }) : false;
    };
    StaticReflector.prototype.registerDecoratorOrConstructor = function (type, ctor) {
        this.conversionMap.set(type, function (context, args) { return new (ctor.bind.apply(ctor, [void 0].concat(args)))(); });
    };
    StaticReflector.prototype.registerFunction = function (type, fn) {
        this.conversionMap.set(type, function (context, args) { return fn.apply(undefined, args); });
    };
    StaticReflector.prototype.initializeConversionMap = function () {
        var coreDecorators = ANGULAR_IMPORT_LOCATIONS.coreDecorators, diDecorators = ANGULAR_IMPORT_LOCATIONS.diDecorators, diMetadata = ANGULAR_IMPORT_LOCATIONS.diMetadata, diOpaqueToken = ANGULAR_IMPORT_LOCATIONS.diOpaqueToken, animationMetadata = ANGULAR_IMPORT_LOCATIONS.animationMetadata, provider = ANGULAR_IMPORT_LOCATIONS.provider;
        this.opaqueToken = this.findDeclaration(diOpaqueToken, 'OpaqueToken');
        this.registerDecoratorOrConstructor(this.findDeclaration(diDecorators, 'Host'), Host);
        this.registerDecoratorOrConstructor(this.findDeclaration(diDecorators, 'Injectable'), Injectable);
        this.registerDecoratorOrConstructor(this.findDeclaration(diDecorators, 'Self'), Self);
        this.registerDecoratorOrConstructor(this.findDeclaration(diDecorators, 'SkipSelf'), SkipSelf);
        this.registerDecoratorOrConstructor(this.findDeclaration(diDecorators, 'Inject'), Inject);
        this.registerDecoratorOrConstructor(this.findDeclaration(diDecorators, 'Optional'), Optional);
        this.registerDecoratorOrConstructor(this.findDeclaration(coreDecorators, 'Attribute'), Attribute);
        this.registerDecoratorOrConstructor(this.findDeclaration(coreDecorators, 'ContentChild'), ContentChild);
        this.registerDecoratorOrConstructor(this.findDeclaration(coreDecorators, 'ContentChildren'), ContentChildren);
        this.registerDecoratorOrConstructor(this.findDeclaration(coreDecorators, 'ViewChild'), ViewChild);
        this.registerDecoratorOrConstructor(this.findDeclaration(coreDecorators, 'ViewChildren'), ViewChildren);
        this.registerDecoratorOrConstructor(this.findDeclaration(coreDecorators, 'Input'), Input);
        this.registerDecoratorOrConstructor(this.findDeclaration(coreDecorators, 'Output'), Output);
        this.registerDecoratorOrConstructor(this.findDeclaration(coreDecorators, 'Pipe'), Pipe);
        this.registerDecoratorOrConstructor(this.findDeclaration(coreDecorators, 'HostBinding'), HostBinding);
        this.registerDecoratorOrConstructor(this.findDeclaration(coreDecorators, 'HostListener'), HostListener);
        this.registerDecoratorOrConstructor(this.findDeclaration(coreDecorators, 'Directive'), Directive);
        this.registerDecoratorOrConstructor(this.findDeclaration(coreDecorators, 'Component'), Component);
        this.registerDecoratorOrConstructor(this.findDeclaration(coreDecorators, 'NgModule'), NgModule);
        // Note: Some metadata classes can be used directly with Provider.deps.
        this.registerDecoratorOrConstructor(this.findDeclaration(diMetadata, 'Host'), Host);
        this.registerDecoratorOrConstructor(this.findDeclaration(diMetadata, 'Self'), Self);
        this.registerDecoratorOrConstructor(this.findDeclaration(diMetadata, 'SkipSelf'), SkipSelf);
        this.registerDecoratorOrConstructor(this.findDeclaration(diMetadata, 'Optional'), Optional);
        this.registerFunction(this.findDeclaration(animationMetadata, 'trigger'), trigger);
        this.registerFunction(this.findDeclaration(animationMetadata, 'state'), state);
        this.registerFunction(this.findDeclaration(animationMetadata, 'transition'), transition);
        this.registerFunction(this.findDeclaration(animationMetadata, 'style'), style);
        this.registerFunction(this.findDeclaration(animationMetadata, 'animate'), animate);
        this.registerFunction(this.findDeclaration(animationMetadata, 'keyframes'), keyframes);
        this.registerFunction(this.findDeclaration(animationMetadata, 'sequence'), sequence);
        this.registerFunction(this.findDeclaration(animationMetadata, 'group'), group);
    };
    /**
     * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param declarationFile the absolute path of the file where the symbol is declared
     * @param name the name of the type.
     */
    StaticReflector.prototype.getStaticSymbol = function (declarationFile, name, members) {
        return this.staticSymbolCache.get(declarationFile, name, members);
    };
    StaticReflector.prototype.resolveExportedSymbol = function (filePath, symbolName) {
        var _this = this;
        var resolveModule = function (moduleName) {
            var resolvedModulePath = _this.host.moduleNameToFileName(moduleName, filePath);
            if (!resolvedModulePath) {
                throw new Error("Could not resolve module '" + moduleName + "' relative to file " + filePath);
            }
            return resolvedModulePath;
        };
        var cacheKey = filePath + "|" + symbolName;
        var staticSymbol = this.declarationCache.get(cacheKey);
        if (staticSymbol) {
            return staticSymbol;
        }
        var metadata = this.getModuleMetadata(filePath);
        if (metadata) {
            // If we have metadata for the symbol, this is the original exporting location.
            if (metadata['metadata'][symbolName]) {
                staticSymbol = this.getStaticSymbol(filePath, symbolName);
            }
            // If no, try to find the symbol in one of the re-export location
            if (!staticSymbol && metadata['exports']) {
                // Try and find the symbol in the list of explicitly re-exported symbols.
                for (var _i = 0, _a = metadata['exports']; _i < _a.length; _i++) {
                    var moduleExport = _a[_i];
                    if (moduleExport.export) {
                        var exportSymbol = moduleExport.export.find(function (symbol) {
                            if (typeof symbol === 'string') {
                                return symbol == symbolName;
                            }
                            else {
                                return symbol.as == symbolName;
                            }
                        });
                        if (exportSymbol) {
                            var symName = symbolName;
                            if (typeof exportSymbol !== 'string') {
                                symName = exportSymbol.name;
                            }
                            staticSymbol = this.resolveExportedSymbol(resolveModule(moduleExport.from), symName);
                        }
                    }
                }
                if (!staticSymbol) {
                    // Try to find the symbol via export * directives.
                    for (var _b = 0, _c = metadata['exports']; _b < _c.length; _b++) {
                        var moduleExport = _c[_b];
                        if (!moduleExport.export) {
                            var resolvedModule = resolveModule(moduleExport.from);
                            var candidateSymbol = this.resolveExportedSymbol(resolvedModule, symbolName);
                            if (candidateSymbol) {
                                staticSymbol = candidateSymbol;
                                break;
                            }
                        }
                    }
                }
            }
        }
        this.declarationCache.set(cacheKey, staticSymbol);
        return staticSymbol;
    };
    StaticReflector.prototype.findDeclaration = function (module, symbolName, containingFile) {
        try {
            var filePath = this.host.moduleNameToFileName(module, containingFile);
            var symbol = void 0;
            if (!filePath) {
                // If the file cannot be found the module is probably referencing a declared module
                // for which there is no disambiguating file and we also don't need to track
                // re-exports. Just use the module name.
                symbol = this.getStaticSymbol(module, symbolName);
            }
            else {
                symbol = this.resolveExportedSymbol(filePath, symbolName) ||
                    this.getStaticSymbol(filePath, symbolName);
            }
            return symbol;
        }
        catch (e) {
            console.error("can't resolve module " + module + " from " + containingFile);
            throw e;
        }
    };
    /** @internal */
    StaticReflector.prototype.simplify = function (context, value) {
        var _this = this;
        var scope = BindingScope.empty;
        var calling = new Map();
        function simplifyInContext(context, value, depth) {
            function resolveReference(context, expression) {
                var staticSymbol;
                if (expression['module']) {
                    staticSymbol =
                        _this.findDeclaration(expression['module'], expression['name'], context.filePath);
                }
                else {
                    staticSymbol = _this.getStaticSymbol(context.filePath, expression['name']);
                }
                return staticSymbol;
            }
            function resolveReferenceValue(staticSymbol) {
                var moduleMetadata = _this.getModuleMetadata(staticSymbol.filePath);
                var declarationValue = moduleMetadata ? moduleMetadata['metadata'][staticSymbol.name] : null;
                return declarationValue;
            }
            function isOpaqueToken(context, value) {
                if (value && value.__symbolic === 'new' && value.expression) {
                    var target = value.expression;
                    if (target.__symbolic == 'reference') {
                        return sameSymbol(resolveReference(context, target), _this.opaqueToken);
                    }
                }
                return false;
            }
            function simplifyCall(expression) {
                var callContext = undefined;
                if (expression['__symbolic'] == 'call') {
                    var target = expression['expression'];
                    var functionSymbol = void 0;
                    var targetFunction = void 0;
                    if (target) {
                        switch (target.__symbolic) {
                            case 'reference':
                                // Find the function to call.
                                callContext = { name: target.name };
                                functionSymbol = resolveReference(context, target);
                                targetFunction = resolveReferenceValue(functionSymbol);
                                break;
                            case 'select':
                                // Find the static method to call
                                if (target.expression.__symbolic == 'reference') {
                                    functionSymbol = resolveReference(context, target.expression);
                                    var classData = resolveReferenceValue(functionSymbol);
                                    if (classData && classData.statics) {
                                        targetFunction = classData.statics[target.member];
                                    }
                                }
                                break;
                        }
                    }
                    if (targetFunction && targetFunction['__symbolic'] == 'function') {
                        if (calling.get(functionSymbol)) {
                            throw new Error('Recursion not supported');
                        }
                        calling.set(functionSymbol, true);
                        try {
                            var value_1 = targetFunction['value'];
                            if (value_1 && (depth != 0 || value_1.__symbolic != 'error')) {
                                // Determine the arguments
                                var args = (expression['arguments'] || []).map(function (arg) { return simplify(arg); });
                                var parameters = targetFunction['parameters'];
                                var defaults = targetFunction.defaults;
                                if (defaults && defaults.length > args.length) {
                                    args.push.apply(args, defaults.slice(args.length).map(function (value) { return simplify(value); }));
                                }
                                var functionScope = BindingScope.build();
                                for (var i = 0; i < parameters.length; i++) {
                                    functionScope.define(parameters[i], args[i]);
                                }
                                var oldScope = scope;
                                var result_1;
                                try {
                                    scope = functionScope.done();
                                    result_1 = simplifyInContext(functionSymbol, value_1, depth + 1);
                                }
                                finally {
                                    scope = oldScope;
                                }
                                return result_1;
                            }
                        }
                        finally {
                            calling.delete(functionSymbol);
                        }
                    }
                }
                if (depth === 0) {
                    // If depth is 0 we are evaluating the top level expression that is describing element
                    // decorator. In this case, it is a decorator we don't understand, such as a custom
                    // non-angular decorator, and we should just ignore it.
                    return { __symbolic: 'ignore' };
                }
                return simplify({ __symbolic: 'error', message: 'Function call not supported', context: callContext });
            }
            function simplify(expression) {
                if (isPrimitive(expression)) {
                    return expression;
                }
                if (expression instanceof Array) {
                    var result_2 = [];
                    for (var _i = 0, _a = expression; _i < _a.length; _i++) {
                        var item = _a[_i];
                        // Check for a spread expression
                        if (item && item.__symbolic === 'spread') {
                            var spreadArray = simplify(item.expression);
                            if (Array.isArray(spreadArray)) {
                                for (var _b = 0, spreadArray_1 = spreadArray; _b < spreadArray_1.length; _b++) {
                                    var spreadItem = spreadArray_1[_b];
                                    result_2.push(spreadItem);
                                }
                                continue;
                            }
                        }
                        var value_2 = simplify(item);
                        if (shouldIgnore(value_2)) {
                            continue;
                        }
                        result_2.push(value_2);
                    }
                    return result_2;
                }
                if (expression instanceof StaticSymbol) {
                    return expression;
                }
                if (expression) {
                    if (expression['__symbolic']) {
                        var staticSymbol = void 0;
                        switch (expression['__symbolic']) {
                            case 'binop':
                                var left = simplify(expression['left']);
                                if (shouldIgnore(left))
                                    return left;
                                var right = simplify(expression['right']);
                                if (shouldIgnore(right))
                                    return right;
                                switch (expression['operator']) {
                                    case '&&':
                                        return left && right;
                                    case '||':
                                        return left || right;
                                    case '|':
                                        return left | right;
                                    case '^':
                                        return left ^ right;
                                    case '&':
                                        return left & right;
                                    case '==':
                                        return left == right;
                                    case '!=':
                                        return left != right;
                                    case '===':
                                        return left === right;
                                    case '!==':
                                        return left !== right;
                                    case '<':
                                        return left < right;
                                    case '>':
                                        return left > right;
                                    case '<=':
                                        return left <= right;
                                    case '>=':
                                        return left >= right;
                                    case '<<':
                                        return left << right;
                                    case '>>':
                                        return left >> right;
                                    case '+':
                                        return left + right;
                                    case '-':
                                        return left - right;
                                    case '*':
                                        return left * right;
                                    case '/':
                                        return left / right;
                                    case '%':
                                        return left % right;
                                }
                                return null;
                            case 'if':
                                var condition = simplify(expression['condition']);
                                return condition ? simplify(expression['thenExpression']) :
                                    simplify(expression['elseExpression']);
                            case 'pre':
                                var operand = simplify(expression['operand']);
                                if (shouldIgnore(operand))
                                    return operand;
                                switch (expression['operator']) {
                                    case '+':
                                        return operand;
                                    case '-':
                                        return -operand;
                                    case '!':
                                        return !operand;
                                    case '~':
                                        return ~operand;
                                }
                                return null;
                            case 'index':
                                var indexTarget = simplify(expression['expression']);
                                var index = simplify(expression['index']);
                                if (indexTarget && isPrimitive(index))
                                    return indexTarget[index];
                                return null;
                            case 'select':
                                var selectTarget = simplify(expression['expression']);
                                if (selectTarget instanceof StaticSymbol) {
                                    // Access to a static instance variable
                                    var declarationValue_1 = resolveReferenceValue(selectTarget);
                                    if (declarationValue_1 && declarationValue_1.statics) {
                                        selectTarget = declarationValue_1.statics;
                                    }
                                    else {
                                        var member_1 = expression['member'];
                                        var members = selectTarget.members ?
                                            selectTarget.members.concat(member_1) :
                                            [member_1];
                                        return _this.getStaticSymbol(selectTarget.filePath, selectTarget.name, members);
                                    }
                                }
                                var member = simplify(expression['member']);
                                if (selectTarget && isPrimitive(member))
                                    return simplify(selectTarget[member]);
                                return null;
                            case 'reference':
                                if (!expression.module) {
                                    var name_1 = expression['name'];
                                    var localValue = scope.resolve(name_1);
                                    if (localValue != BindingScope.missing) {
                                        return localValue;
                                    }
                                }
                                staticSymbol = resolveReference(context, expression);
                                var result_3 = staticSymbol;
                                var declarationValue = resolveReferenceValue(result_3);
                                if (declarationValue) {
                                    if (isOpaqueToken(staticSymbol, declarationValue)) {
                                        // If the referenced symbol is initalized by a new OpaqueToken we can keep the
                                        // reference to the symbol.
                                        return staticSymbol;
                                    }
                                    result_3 = simplifyInContext(staticSymbol, declarationValue, depth + 1);
                                }
                                return result_3;
                            case 'class':
                                return context;
                            case 'function':
                                return context;
                            case 'new':
                            case 'call':
                                // Determine if the function is a built-in conversion
                                var target = expression['expression'];
                                if (target['module']) {
                                    staticSymbol =
                                        _this.findDeclaration(target['module'], target['name'], context.filePath);
                                }
                                else {
                                    staticSymbol = _this.getStaticSymbol(context.filePath, target['name']);
                                }
                                var converter = _this.conversionMap.get(staticSymbol);
                                if (converter) {
                                    var args = expression['arguments'];
                                    if (!args) {
                                        args = [];
                                    }
                                    return converter(context, args.map(function (arg) { return simplifyInContext(context, arg, depth + 1); }));
                                }
                                // Determine if the function is one we can simplify.
                                return simplifyCall(expression);
                            case 'error':
                                var message = produceErrorMessage(expression);
                                if (expression['line']) {
                                    message =
                                        message + " (position " + (expression['line'] + 1) + ":" + (expression['character'] + 1) + " in the original .ts file)";
                                    throw positionalError(message, context.filePath, expression['line'], expression['character']);
                                }
                                throw new Error(message);
                        }
                        return null;
                    }
                    return mapStringMap(expression, function (value, name) { return simplify(value); });
                }
                return null;
            }
            try {
                return simplify(value);
            }
            catch (e) {
                var message = e.message + ", resolving symbol " + context.name + " in " + context.filePath;
                if (e.fileName) {
                    throw positionalError(message, e.fileName, e.line, e.column);
                }
                throw new Error(message);
            }
        }
        var result = simplifyInContext(context, value, 0);
        if (shouldIgnore(result)) {
            return undefined;
        }
        return result;
    };
    /**
     * @param module an absolute path to a module file.
     */
    StaticReflector.prototype.getModuleMetadata = function (module) {
        var moduleMetadata = this.metadataCache.get(module);
        if (!moduleMetadata) {
            var moduleMetadatas = this.host.getMetadataFor(module);
            if (moduleMetadatas) {
                var maxVersion_1 = -1;
                moduleMetadatas.forEach(function (md) {
                    if (md['version'] > maxVersion_1) {
                        maxVersion_1 = md['version'];
                        moduleMetadata = md;
                    }
                });
            }
            if (!moduleMetadata) {
                moduleMetadata =
                    { __symbolic: 'module', version: SUPPORTED_SCHEMA_VERSION, module: module, metadata: {} };
            }
            if (moduleMetadata['version'] != SUPPORTED_SCHEMA_VERSION) {
                throw new Error("Metadata version mismatch for module " + module + ", found version " + moduleMetadata['version'] + ", expected " + SUPPORTED_SCHEMA_VERSION);
            }
            this.metadataCache.set(module, moduleMetadata);
        }
        return moduleMetadata;
    };
    StaticReflector.prototype.getTypeMetadata = function (type) {
        var moduleMetadata = this.getModuleMetadata(type.filePath);
        return moduleMetadata['metadata'][type.name] || { __symbolic: 'class' };
    };
    return StaticReflector;
}());
function expandedMessage(error) {
    switch (error.message) {
        case 'Reference to non-exported class':
            if (error.context && error.context.className) {
                return "Reference to a non-exported class " + error.context.className + ". Consider exporting the class";
            }
            break;
        case 'Variable not initialized':
            return 'Only initialized variables and constants can be referenced because the value of this variable is needed by the template compiler';
        case 'Destructuring not supported':
            return 'Referencing an exported destructured variable or constant is not supported by the template compiler. Consider simplifying this to avoid destructuring';
        case 'Could not resolve type':
            if (error.context && error.context.typeName) {
                return "Could not resolve type " + error.context.typeName;
            }
            break;
        case 'Function call not supported':
            var prefix = error.context && error.context.name ? "Calling function '" + error.context.name + "', f" : 'F';
            return prefix +
                'unction calls are not supported. Consider replacing the function or lambda with a reference to an exported function';
        case 'Reference to a local symbol':
            if (error.context && error.context.name) {
                return "Reference to a local (non-exported) symbol '" + error.context.name + "'. Consider exporting the symbol";
            }
            break;
    }
    return error.message;
}
function produceErrorMessage(error) {
    return "Error encountered resolving symbol values statically. " + expandedMessage(error);
}
function mapStringMap(input, transform) {
    if (!input)
        return {};
    var result = {};
    Object.keys(input).forEach(function (key) {
        var value = transform(input[key], key);
        if (!shouldIgnore(value)) {
            result[key] = value;
        }
    });
    return result;
}
function isPrimitive(o) {
    return o === null || (typeof o !== 'function' && typeof o !== 'object');
}
var BindingScope = (function () {
    function BindingScope() {
    }
    BindingScope.build = function () {
        var current = new Map();
        return {
            define: function (name, value) {
                current.set(name, value);
                return this;
            },
            done: function () {
                return current.size > 0 ? new PopulatedScope(current) : BindingScope.empty;
            }
        };
    };
    BindingScope.missing = {};
    BindingScope.empty = { resolve: function (name) { return BindingScope.missing; } };
    return BindingScope;
}());
var PopulatedScope = (function (_super) {
    __extends(PopulatedScope, _super);
    function PopulatedScope(bindings) {
        _super.call(this);
        this.bindings = bindings;
    }
    PopulatedScope.prototype.resolve = function (name) {
        return this.bindings.has(name) ? this.bindings.get(name) : BindingScope.missing;
    };
    return PopulatedScope;
}(BindingScope));
function sameSymbol(a, b) {
    return a === b || (a.name == b.name && a.filePath == b.filePath);
}
function shouldIgnore(value) {
    return value && value.__symbolic == 'ignore';
}
function positionalError(message, fileName, line, column) {
    var result = new Error(message);
    result.fileName = fileName;
    result.line = line;
    result.column = column;
    return result;
}
//# sourceMappingURL=static_reflector.js.map