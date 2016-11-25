/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export function isStaticSymbol(value) {
    return typeof value === 'object' && value !== null && value['name'] && value['filePath'];
}
/**
 * A token representing the a reference to a static type.
 *
 * This token is unique for a filePath and name and can be used as a hash table key.
 */
export var StaticSymbol = (function () {
    function StaticSymbol(filePath, name, members) {
        this.filePath = filePath;
        this.name = name;
        this.members = members;
    }
    return StaticSymbol;
}());
//# sourceMappingURL=static_symbol.js.map