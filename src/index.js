"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeApplication = exports.button = exports.p = exports.div = void 0;
const jsdom_1 = require("jsdom");
const simpleELement = (tagName) => (...args) => {
    const { document } = (new jsdom_1.JSDOM(``)).window;
    let a = document.createElement(tagName);
    for (const arg of args) {
        if (typeof arg === "string") {
            let text = document.createElement("div");
            text.innerHTML = arg;
            a.appendChild(text);
        }
        else {
            a.appendChild(arg);
        }
    }
    a.realAddEventListener = a.addEventListener;
    function reportIn(e) {
        var a = this.lastListenerInfo[this.lastListenerInfo.length - 1];
        console.log(a);
    }
    a.addEventListener = function (a, b, c) {
        this.realAddEventListener(a, reportIn, c);
        this.realAddEventListener(a, b, c);
        if (!this.lastListenerInfo) {
            this.lastListenerInfo = new Array();
        }
        ;
        this.lastListenerInfo.push({ a: a, b: b, c: c });
    };
    return a;
};
_a = ["div", "p", "button"].map(simpleELement), exports.div = _a[0], exports.p = _a[1], exports.button = _a[2];
const makeApplication = (x) => {
    const { document } = (new jsdom_1.JSDOM(``)).window;
    const tmp = document.createElement("div");
    tmp.appendChild(x);
    const js = getJs(tmp);
    console.log("js", js);
    const html = formatHTMLString(tmp.innerHTML);
    return html;
};
exports.makeApplication = makeApplication;
const getJs = (node) => {
    console.log("lastinfo", node.lastListenerInfo);
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
            node.appendChild(textNode);
        }
    }
    return node;
}
