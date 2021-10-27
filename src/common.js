"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleElementBuilders = void 0;
const randomInRange = (low) => (high) => Math.floor(Math.random() * (high - low) + low);
const randomLetter = () => String.fromCharCode(randomInRange(97)(122));
const id = () => new Array(10).fill(0).map(_x => randomLetter()).join("");
const simpleElementBuilders = (window) => (tagName) => (...args) => {
    let document = window.document;
    let a = (typeof tagName === "string" ? document.createElement(tagName)
        : tagName);
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
                let argElem = arg(a.state);
                argElem.attr("arg-id", argElem.secret_id);
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
                        argElem.innerHTML = '';
                        argElem.append(arg(newState.detail));
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
                                let a = document.querySelector("[arg-id='${argElem.secret_id}']")
                                a.innerHTML = '';
                                a.append(arg(newState.detail).attr("arg-id","${argElem.secret_id}"))
                            }
                        }`
                });
                a.append(argElem);
            }
            else {
                a.append(arg);
            }
        }
    }
    a.setState = (newState) => {
        let { CustomEvent } = window;
        const event = new CustomEvent(`newState-${a.secret_id}`, { detail: newState });
        a.state = newState;
        console.log(`serverside braodcasting`, `newState-${a.secret_id}`);
        document.dispatchEvent(event);
        return a;
    };
    return a;
};
exports.simpleElementBuilders = simpleElementBuilders;
