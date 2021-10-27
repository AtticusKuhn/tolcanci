"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeApplication = exports.button = exports.p = exports.div = exports.simpleElement = exports.simpleElementBuilders = void 0;
const jsdom_1 = require("jsdom");
const randomInRange = (low) => (high) => Math.floor(Math.random() * (high - low) + low);
const randomLetter = () => String.fromCharCode(randomInRange(97)(122));
const id = () => new Array(10).fill(0).map(_x => randomLetter()).join("");
const simpleElementBuilders = (document) => (tagName) => (...args) => {
    let a = document.createElement(tagName);
    a.realAddEventListener = a.addEventListener;
    a.listeners = [];
    a.attr = (b, c) => {
        a.setAttribute(b, c);
        return a;
    };
    a.vname = (x) => {
        a.varName = x;
        return a;
    };
    a.secret_id = id();
    a.addEventListener = function (t, b, c) {
        console.log("adding fake event listener");
        a.listeners.push({
            name: t,
            source: b.toString()
        });
        a.realAddEventListener(t, b, c);
    };
    for (const arg of args) {
        if (typeof arg === "string") {
            let text = document.createTextNode(arg);
            a.append(text.cloneNode(true));
        }
        else {
            if (arg instanceof Function) {
                a.attr("listener-id", a.secret_id);
                a.addEventListener(`newState-${a.secret_id}`, (newState) => {
                    console.log("hard-coded event listener called");
                    try {
                        a.append(arg(newState.detail));
                    }
                    catch (e) {
                        console.log("error in hard-coded event listener");
                    }
                });
                document.addEventListener(`newState-${a.secret_id}`, (newState) => {
                    console.log("hard-coded event listener called");
                    try {
                        a.append(arg(newState.detail));
                    }
                    catch (e) {
                        console.log("error in hard-coded event listener");
                    }
                });
                a.listeners.push({
                    name: `newState-${a.secret_id}`,
                    source: `(newState) => {
                        const arg = ${arg.toString()}
                        console.log("string-coded event listener called")

                            try {
                                a.append(arg(newState.detail))
                            } catch {
                                let a = document.querySelector("[listener-id='${a.secret_id}']")
                                a.innerHTML = '';
                                a.append(arg(newState.detail))
                            }
                        }`
                });
            }
            else {
                a.append(arg);
            }
        }
    }
    a.setState = (newState) => {
        let { CustomEvent } = (new jsdom_1.JSDOM(``)).window;
        const event = new CustomEvent(`newState-${a.secret_id}`, { detail: newState });
        a.state = newState;
        console.log(`serverside braodcasting`, `newState-${a.secret_id}`);
        document.dispatchEvent(event);
        return newState;
    };
    return a;
};
exports.simpleElementBuilders = simpleElementBuilders;
exports.simpleElement = (0, exports.simpleElementBuilders)((new jsdom_1.JSDOM(``)).window.document);
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
        const ${node.varName} = clientElement(document.querySelector("[data-id='${id}'"))();\n
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
