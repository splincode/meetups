/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ViewEncapsulation } from '@angular/core';
import { analyzeAndValidateNgModules, extractProgramSymbols, loadNgModuleDirectives } from '../aot/compiler';
import { StaticAndDynamicReflectionCapabilities } from '../aot/static_reflection_capabilities';
import { StaticReflector } from '../aot/static_reflector';
import { CompilerConfig } from '../config';
import { DirectiveNormalizer } from '../directive_normalizer';
import { DirectiveResolver } from '../directive_resolver';
import { CompileMetadataResolver } from '../metadata_resolver';
import { HtmlParser } from '../ml_parser/html_parser';
import { InterpolationConfig } from '../ml_parser/interpolation_config';
import { NgModuleResolver } from '../ng_module_resolver';
import { PipeResolver } from '../pipe_resolver';
import { DomElementSchemaRegistry } from '../schema/dom_element_schema_registry';
import { createOfflineCompileUrlResolver } from '../url_resolver';
import { I18NHtmlParser } from './i18n_html_parser';
import { MessageBundle } from './message_bundle';
export var Extractor = (function () {
    function Extractor(options, host, staticReflector, messageBundle, metadataResolver) {
        this.options = options;
        this.host = host;
        this.staticReflector = staticReflector;
        this.messageBundle = messageBundle;
        this.metadataResolver = metadataResolver;
    }
    Extractor.prototype.extract = function (rootFiles) {
        var _this = this;
        var programSymbols = extractProgramSymbols(this.staticReflector, rootFiles, this.options);
        var _a = analyzeAndValidateNgModules(programSymbols, this.options, this.metadataResolver), ngModuleByPipeOrDirective = _a.ngModuleByPipeOrDirective, files = _a.files, ngModules = _a.ngModules;
        return loadNgModuleDirectives(ngModules).then(function () {
            var errors = [];
            files.forEach(function (file) {
                var compMetas = [];
                file.directives.forEach(function (directiveType) {
                    var dirMeta = _this.metadataResolver.getDirectiveMetadata(directiveType);
                    if (dirMeta && dirMeta.isComponent) {
                        compMetas.push(dirMeta);
                    }
                });
                compMetas.forEach(function (compMeta) {
                    var html = compMeta.template.template;
                    var interpolationConfig = InterpolationConfig.fromArray(compMeta.template.interpolation);
                    errors.push.apply(errors, _this.messageBundle.updateFromTemplate(html, file.srcUrl, interpolationConfig));
                });
            });
            if (errors.length) {
                throw new Error(errors.map(function (e) { return e.toString(); }).join('\n'));
            }
            return _this.messageBundle;
        });
    };
    Extractor.create = function (host, options) {
        var htmlParser = new I18NHtmlParser(new HtmlParser());
        var urlResolver = createOfflineCompileUrlResolver();
        var staticReflector = new StaticReflector(host);
        StaticAndDynamicReflectionCapabilities.install(staticReflector);
        var config = new CompilerConfig({
            genDebugInfo: false,
            defaultEncapsulation: ViewEncapsulation.Emulated,
            logBindingUpdate: false,
            useJit: false
        });
        var normalizer = new DirectiveNormalizer({ get: function (url) { return host.loadResource(url); } }, urlResolver, htmlParser, config);
        var elementSchemaRegistry = new DomElementSchemaRegistry();
        var resolver = new CompileMetadataResolver(new NgModuleResolver(staticReflector), new DirectiveResolver(staticReflector), new PipeResolver(staticReflector), elementSchemaRegistry, normalizer, staticReflector);
        // TODO(vicb): implicit tags & attributes
        var messageBundle = new MessageBundle(htmlParser, [], {});
        var extractor = new Extractor(options, host, staticReflector, messageBundle, resolver);
        return { extractor: extractor, staticReflector: staticReflector };
    };
    return Extractor;
}());
//# sourceMappingURL=extractor.js.map