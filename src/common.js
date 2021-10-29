"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeA = exports.simpleElementBuilders = exports.id = void 0;
const isServer = () => typeof window === "undefined";
let idCounter = 0;
const id = () => (idCounter++).toString();
exports.id = id;
const simpleElementBuilders = (window) => (tagName) => (...args) => {
    let document = window.document;
    let a = (typeof tagName === "string" ? document.createElement(tagName)
        : tagName);
    a.noop = () => {
        return a;
    };
    a.attr = (b, c) => {
        a.setAttribute(b, c);
        return a;
    };
    a.setStaticProps = (x) => {
        if (isServer()) {
            a.staticProps = x;
        }
        else {
            throw new Error("static props should never be called on client side");
        }
        return a;
    };
    a.onStateChangeF = [];
    a.onStateChange = (f) => {
        a.onStateChangeF.push(f);
    };
    a.eventListeners = [];
    a.realEventListener = a.addEventListener;
    a.addEventListener = (event, handler) => {
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
    a.secret_id = (0, exports.id)();
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
        if (a.onStateChangeF.length > 0) {
            a.onStateChangeF.forEach(f => f(newState));
        }
        let { CustomEvent } = window;
        const event = new CustomEvent(`newState-${a.secret_id}`, { detail: newState });
        a.state = newState;
        document.dispatchEvent(event);
        return a;
    };
    const recursiveStaticProps = async (a) => {
        let record = {};
        for (let i = 0; i < a.children.length; i++) {
            record = { ...record, ...await recursiveStaticProps(a.children[i]) };
        }
        if (a.staticProps !== undefined) {
            let props = await a.staticProps();
            a.setState(props);
            record[a.secret_id] = props;
        }
        return record;
    };
    a.attr("secret-id", a.secret_id);
    a.getStaticProps = async () => {
        return await recursiveStaticProps(a);
    };
    a.setCss = (css) => {
        if (typeof css === "string") {
            let split = css.split(";");
            for (const line of split) {
                let [prop, val] = line.split(":");
                if (!prop || !val) {
                    throw new Error(`invalid css prop: ${prop} and val: ${val}`);
                }
                a.style[prop] = val;
            }
        }
        else {
            console.log("it's a function");
            a.onStateChange((state) => {
                console.log("onstatechange css");
                a.setCss(css(state));
            });
            let cssVal = css(a.state);
            console.log("css is", cssVal);
            a.setCss(cssVal);
        }
        return a;
    };
    return a;
};
exports.simpleElementBuilders = simpleElementBuilders;
const makeElemWithProps = (props) => (tagName) => (window) => {
    return (...args) => {
        let elem = (0, exports.simpleElementBuilders)(window)(tagName)(...args);
        for (const prop of props) {
            elem[prop] = "";
            elem[`$${prop}`] = (newValue) => {
                elem[prop] = newValue;
                return elem;
            };
        }
        return elem;
    };
};
exports.makeA = makeElemWithProps(["href", "referer"])("a");
