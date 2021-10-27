"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleElementBuilders = void 0;
const isServer = () => typeof window === "undefined";
const randomInRange = (low) => (high) => Math.floor(Math.random() * (high - low) + low);
const randomLetter = () => String.fromCharCode(randomInRange(97)(122));
const id = () => new Array(10).fill(0).map(_x => randomLetter()).join("");
const simpleElementBuilders = (window) => (tagName) => (...args) => {
    let document = window.document;
    let a = (typeof tagName === "string" ? document.createElement(tagName)
        : tagName);
    a.attr = (b, c) => {
        a.setAttribute(b, c);
        return a;
    };
    a.setStaticProps = (x) => {
        a.staticProps = x();
        return a;
    };
    a.eventListeners = [];
    a.realEventListener = a.addEventListener;
    a.addEventListener = (event, handler) => {
        console.log("addEventListener called", event);
        a.eventListeners.push({ event, handler });
        a.realEventListener(event, handler);
    };
    const tmpClone = (a) => {
        let x = a.cloneNode(true);
        for (let i = 0; i < a.children.length; i++) {
            x.appendChild(tmpClone(a.children[i]));
        }
        console.log("in clone, a.eventListeners", a.eventListeners);
        if (a.eventListeners) {
            for (const listener of a.eventListeners) {
                x.addEventListener(listener.event, listener.handler);
            }
        }
        return x;
    };
    a.cloneWithEventListeners = () => {
        return tmpClone(a);
    };
    a.secret_id = id();
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
    a.getStaticProps = async () => {
        return await a.staticProps;
    };
    if (isServer() && a.getStaticProps) {
        a.getStaticProps().then((state) => {
            a.setState(state);
        });
    }
    return a;
};
exports.simpleElementBuilders = simpleElementBuilders;
