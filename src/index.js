"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeApplication = exports.button = exports.p = exports.div = void 0;
const jsdom_1 = require("jsdom");
const simpleELement = (tagName) => (...args) => {
    const { document } = (new jsdom_1.JSDOM(``)).window;
    let a = document.createElement(tagName);
    a.realAddEventListener = a.addEventListener;
    a.listeners = [];
    a.attr = (b, c) => {
        a.setAttribute(b, c);
        return a;
    };
    a.addEventListener = function (t, b, c) {
        console.log("fake event listener");
        console.log("t", t);
        console.log("b", b);
        a.listeners.push({
            name: t,
            source: b.toString()
        });
        a.realAddEventListener(t, b, c);
    };
    for (const arg of args) {
        if (typeof arg === "string") {
            let text = document.createElement("div");
            text.innerHTML = arg;
            a.appendChild(text);
        }
        else {
            if (arg instanceof Function) {
                a.listeners.push({
                    name: "newState",
                    source: `(newState) => {
                        const arg = ${arg.toString()}
                            try {
                                a.appendChild(arg(newState.detail))
                            } catch {
                                a.append(arg(newState.detail))
                            }
                        })`
                });
            }
            else {
                a.appendChild(arg);
            }
        }
    }
    a.setState = (newState) => {
        let { CustomEvent } = (new jsdom_1.JSDOM(``)).window;
        const event = new CustomEvent('newState', { detail: newState });
        a.state = newState;
        a.dispatchEvent(event);
        return newState;
    };
    return a;
};
_a = ["div", "p", "button"].map(simpleELement), exports.div = _a[0], exports.p = _a[1], exports.button = _a[2];
const makeApplication = (x) => {
    const tmp = (0, exports.div)();
    tmp.appendChild(x);
    const js = getJs(tmp);
    console.log("js", js);
    let html = tmp.innerHTML;
    html += `<script defer>${js}</script>`;
    html = formatHTMLString(html);
    return html;
};
exports.makeApplication = makeApplication;
const getJs = (node) => {
    var _a;
    let js = "";
    if (((_a = node === null || node === void 0 ? void 0 : node.listeners) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        const id = Math.random().toString();
        node.attr('data-id', id);
        js += node.listeners.map(listener => `document.querySelector("[data-id='${id}']").addEventListener("${listener.name}",${listener.source});\n`).join(";\n");
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
            node.appendChild(textNode);
        }
    }
    return node;
}
