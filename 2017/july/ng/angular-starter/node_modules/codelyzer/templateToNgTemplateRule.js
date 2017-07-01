"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("tslint");
var ng2Walker_1 = require("./angular/ng2Walker");
var basicTemplateAstVisitor_1 = require("./angular/templates/basicTemplateAstVisitor");
var ErrorMessage = 'You should use <ng-template/> instead of <template/>';
var TemplateStart = '<template';
var TemplateEnd = '</template>';
var TemplateEndRe = /<\/template>/i;
var set = new Set();
var TemplateToNgTemplateVisitor = (function (_super) {
    __extends(TemplateToNgTemplateVisitor, _super);
    function TemplateToNgTemplateVisitor() {
        var _this = _super.apply(this, arguments) || this;
        _this._prevClosing = 0;
        _this._visitedElements = new Set();
        return _this;
    }
    TemplateToNgTemplateVisitor.prototype.visitEmbeddedTemplate = function (element, ctx) {
        if (this._visitedElements.has(element)) {
            return;
        }
        else {
            this._visitedElements.add(element);
        }
        var sp = element.sourceSpan;
        var content = sp.start.file.content;
        var subtemplate = content.substring(sp.start.offset, sp.end.offset);
        if (subtemplate.startsWith(TemplateStart)) {
            var replacement = this.createReplacement(sp.start.offset, TemplateStart.length, '<ng-template');
            if (!this._fix) {
                this._fix = this.createFix(replacement);
            }
            else {
                this._fix.replacements.push(replacement);
            }
            this.addFailure(this.createFailure(sp.start.offset, sp.end.offset - sp.start.offset, ErrorMessage));
        }
        _super.prototype.visitEmbeddedTemplate.call(this, element, ctx);
        var subcontent = content.substring(this._prevClosing, content.length);
        var matches = TemplateEndRe.exec(subcontent);
        if (this._fix && matches && typeof matches.index === 'number') {
            this._fix.replacements.push(this.createReplacement(matches.index + this._prevClosing, TemplateEnd.length, '</ng-template>'));
            this._prevClosing = matches.index + this._prevClosing + TemplateEnd.length;
            var rest = content.substring(this._prevClosing, content.length);
            if (!TemplateEndRe.test(rest)) {
                this._fix = null;
                this._prevClosing = 0;
                this._visitedElements = new Set();
            }
        }
    };
    return TemplateToNgTemplateVisitor;
}(basicTemplateAstVisitor_1.BasicTemplateAstVisitor));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ng2Walker_1.Ng2Walker(sourceFile, this.getOptions(), {
            templateVisitorCtrl: TemplateToNgTemplateVisitor
        }));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: 'templates-use-public-rule',
    type: 'functionality',
    description: "Ensure that properties and methods accessed from the template are public.",
    rationale: "When Angular compiles the templates, it has to access these propertes from outside the class.",
    options: null,
    optionsDescription: "Not configurable.",
    typescriptOnly: true,
};
Rule.FAILURE = 'The %s "%s" that you\'re trying to access does not exist in the class declaration.';
exports.Rule = Rule;
