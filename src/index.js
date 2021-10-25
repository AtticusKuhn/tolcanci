"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeApplication = exports.p = exports.div = void 0;
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
    return a;
};
_a = ["div", "p"].map(tagName => simpleELement(tagName)), exports.div = _a[0], exports.p = _a[1];
const makeApplication = (x) => {
    const { document } = (new jsdom_1.JSDOM(``)).window;
    const tmp = document.createElement("div");
    tmp.appendChild(x);
    console.log("tmp", tmp);
    return tmp.innerHTML;
};
exports.makeApplication = makeApplication;
