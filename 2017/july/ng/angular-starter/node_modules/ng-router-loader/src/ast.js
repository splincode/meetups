"use strict";
var recast = require("recast");
var n = recast.types.namedTypes;
var b = recast.types.builders;
function isStringTree(value /* Expression | Pattern */) {
    return n.Literal.check(value) || n.BinaryExpression.check(value) || n.TemplateElement.check(value);
}
/**
 * Resolves a string expression from an AST property value.
 * Supports Literal, BinaryExpression and TemplateLiteral instructions.
 * BinaryExpression and TemplateLiteral are supported if their internal instructions are Literal only.
 * @param value
 * @returns string
 */
function resolveStringValue(value /* Expression | Pattern */) {
    if (n.Literal.check(value)) {
        return value.value;
    }
    else if (n.BinaryExpression.check(value) && value.operator === '+') {
        return resolveStringValue(value.left) + resolveStringValue(value.right);
    }
    else if (n.TemplateElement.check(value)) {
        return value.value.cooked;
    }
    else if (n.TemplateLiteral.check(value)) {
        var vals = [], len = value.expressions.length;
        var i = 0;
        for (i; i < len; i++) {
            vals.push(resolveStringValue(value.quasis[i]));
            vals.push(resolveStringValue(value.expressions[i]));
        }
        vals.push(resolveStringValue(value.quasis[i]));
        return vals.join('');
    }
    else {
        throw new Error("Can't resolve static string. Type " + value.type + " is not allowed.");
    }
}
function createTransformerController(source) {
    var ast = recast.parse(source, { ecmaVersion: 5, sourceType: 'module' });
    var routeModuleTransformer = {
        transformers: [],
        getCode: function (pretty) {
            if (pretty) {
                return recast.prettyPrint(ast).code;
            }
            else {
                return recast.print(ast).code;
            }
        }
    };
    recast.visit(ast, {
        visitProperty: function (path) {
            if (n.Identifier.check(path.value.key) && path.value.key.name === 'loadChildren' && isStringTree(path.value.value)) {
                routeModuleTransformer.transformers.push({
                    expLiteral: resolveStringValue(path.value.value),
                    transform: function (fnCode /* FunctionDeclaration */) {
                        var fnDec = typeof fnCode === 'string' ?
                            recast.parse(fnCode, { ecmaVersion: 5, sourceType: 'script' }).program.body[0]
                            : fnCode;
                        n.FunctionDeclaration.assert(fnDec);
                        path.value.value = b.functionExpression(null, // Anonymize the function expression.
                        fnDec.params, fnDec.body);
                        return recast.print(path.value.value).code;
                    }
                });
            }
            this.traverse(path);
        }
    });
    return routeModuleTransformer;
}
exports.createTransformerController = createTransformerController;
//# sourceMappingURL=ast.js.map