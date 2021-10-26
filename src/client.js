"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleElementBuilders = void 0;
const randomInRange = (low) => (high) => Math.floor(Math.random() * (high - low) + low);
const randomLetter = () => String.fromCharCode(randomInRange(97)(122));
const id = () => new Array(10).fill(0).map(_x => randomLetter()).join("");
const simpleElementBuilders = (document) => (tagName) => (...args) => {
    let a;
    if (typeof tagName === "string") {
        a = document.createElement(tagName);
    }
    else {
        a = tagName;
    }
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
        console.log("in fake event listener, function source is", b.toString());
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
                a.addEventListener(`newState-${a.secret_id}`, (newState) => {
                    console.log("hard-coded event listener");
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
                        console.log("string-coded event listener")

                            try {
                                a.appendChild(arg(newState.detail))
                            } catch {
                                a.append(arg(newState.detail))
                            }
                        }`
                });
            }
            else {
                a.appendChild(arg);
            }
        }
    }
    a.setState = (newState) => {
        const event = new CustomEvent(`newState-${a.secret_id}`, { detail: newState });
        a.state = newState;
        console.log(`serverside braodcasting`, `newState-${a.secret_id}`);
        document.dispatchEvent(event);
        return newState;
    };
    return a;
};
exports.simpleElementBuilders = simpleElementBuilders;
const clientElement = (0, exports.simpleElementBuilders)(document);
window.clientElement = clientElement;
window.index_1 = {};
for (const element of ["div", "p", "button"]) {
    window[element] = clientElement(element);
    window.index_1[element] = clientElement(element);
}
exports.default = null;
