"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeApplication = exports.button = exports.p = exports.div = exports.simpleElement = void 0;
const jsdom_1 = require("jsdom");
const common_1 = require("./common");
exports.simpleElement = (0, common_1.simpleElementBuilders)((new jsdom_1.JSDOM(``)).window);
_a = ["div", "p", "button"].map(exports.simpleElement), exports.div = _a[0], exports.p = _a[1], exports.button = _a[2];
const makeApplication = (x) => {
    const tmp = (0, exports.div)();
    tmp.appendChild(x);
    const js = getJs(tmp);
    let html = tmp.innerHTML;
    html += "<script src='dist/build.js'></script>\n";
    html += `<script defer>${js}</script>\n`;
    html = formatHTMLString(html);
    return html;
};
exports.makeApplication = makeApplication;
const getJs = (node) => {
    var _a;
    let js = "";
    js += `//generaing js for ${node.secret_id}\n`;
    const id = Math.random().toString();
    if (node.state !== null && node.state !== undefined) {
        node.attr('data-id', id);
        console.log("node has state", node.state);
        js += `
        const ${node.varName} = clientElement(document.querySelector("[data-id='${id}'"))().setState(${node.state});\n
        ${node.varName}.secret_id = "${node.secret_id}";\n
        `;
    }
    console.log("listeners in getJs", node === null || node === void 0 ? void 0 : node.listeners);
    if (((_a = node === null || node === void 0 ? void 0 : node.listeners) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        console.log("node has a listener");
        node.attr('data-id', id);
        js += node.listeners.map(listener => listener.name.startsWith("newState") ?
            `document.addEventListener("${listener.name}",${listener.source});\n`
            : `document.querySelector("[data-id='${id}']").addEventListener("${listener.name}",
                ${listener.source});\n`).join(";\n");
    }
    for (let i = 0; i < node.children.length; i++) {
        js += getJs(node.children[i]);
    }
    return js;
};
function formatHTMLString(str) {
    const { document } = (new jsdom_1.JSDOM(``)).window;
    var div = document.createElement('div');
    div.innerHTML = str.trim();
    return formatNode(div, 0).innerHTML;
}
function formatNode(node, level) {
    const { document } = (new jsdom_1.JSDOM(``)).window;
    let indentBefore = new Array(level++ + 1).join('    '), indentAfter = new Array(level - 1).join('    '), textNode;
    for (let i = 0; i < node.children.length; i++) {
        textNode = document.createTextNode('\n' + indentBefore);
        node.insertBefore(textNode, node.children[i]);
        formatNode(node.children[i], level);
        if (node.lastElementChild == node.children[i]) {
            textNode = document.createTextNode('\n' + indentAfter);
            node.appendChild(textNode.cloneNode(true));
        }
    }
    return node;
}
