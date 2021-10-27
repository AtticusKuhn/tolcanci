"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const clientElement = (0, common_1.simpleElementBuilders)(window);
window.clientElement = clientElement;
window.index_1 = {};
for (const element of ["div", "p", "button"]) {
    window[element] = clientElement(element);
    window.index_1[element] = clientElement(element);
}
exports.default = null;
