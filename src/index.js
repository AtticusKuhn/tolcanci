"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeApplication = exports.button = exports.p = exports.div = exports.simpleElement = void 0;
const fs_1 = __importDefault(require("fs"));
const jsdom_1 = require("jsdom");
const common_1 = require("./common");
exports.simpleElement = (0, common_1.simpleElementBuilders)((new jsdom_1.JSDOM(``)).window);
_a = ["div", "p", "button"].map(exports.simpleElement), exports.div = _a[0], exports.p = _a[1], exports.button = _a[2];
const makeApplication = async (x) => {
    const tmp = (0, exports.div)();
    const a = await x.getStaticProps();
    console.log("result of static props is", a);
    console.log("making app");
    tmp.appendChild(x);
    const js = getJs(tmp);
    let html = tmp.innerHTML;
    html += "<script src='dist/build.js'></script>\n";
    html += `<script defer>${js}</script>\n`;
    html = formatHTMLString(html);
    return html;
};
exports.makeApplication = makeApplication;
const getJs = (_node) => {
    let js = "";
    js += "let exports = {}; \n";
    js += "let require = (string) => window['index_1']; \n";
    js += fs_1.default.readFileSync("./src/example.js", "utf-8");
    js += "document.body.innerHTML = '';\n";
    js += "document.body.append(main);\n";
    js = js.replace(/(^.*require.*$)/g, "// $1");
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
