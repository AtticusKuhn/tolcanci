import { JSDOM } from "jsdom"
type child = string | HTMLElement
type reactiveChild<T> = (x: T) => child;
interface extendedElem<T> extends HTMLElement {
    listeners: { name: String, source: string }[];
    realAddEventListener: HTMLElement["addEventListener"];
    state: T;
    setState: (x: T) => T;

}
const simpleELement = (tagName: string) => <T>(...args: (child | reactiveChild<T>)[]): extendedElem<T> => {
    const { document } = (new JSDOM(``)).window;
    let a = document.createElement(tagName) as extendedElem<T>;
    a.realAddEventListener = a.addEventListener;
    a.listeners = []
    a.addEventListener = function (t: string, b: (x: any) => any, c: boolean) {
        console.log("fake event listener")
        console.log("t", t)
        console.log("b", b)
        a.listeners.push({
            name: t,
            source: b.toString()
        })
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
                //@ts-ignore
                a.addEventListener("newState", (newState: T) => {
                    //@ts-ignore
                    a.appendChild(arg(newState))
                })
            } else {
                a.appendChild(arg);
            }
        }
    }
    a.setState = (newState: T) => {
        let { CustomEvent } = (new JSDOM(``)).window;
        //@ts-ignore
        const event = new CustomEvent('newState', { state: newState });
        a.state = newState;
        a.dispatchEvent(event)
        return newState;
    }

    return a;
};

export const [div, p, button] = ["div", "p", "button"].map(simpleELement)
export const makeApplication = (x: HTMLElement): string => {
    // const { document } = (new JSDOM(``)).window;
    const tmp = div()
    tmp.appendChild(x);
    const js = getJs(tmp)
    console.log("js", js)
    let html = tmp.innerHTML;
    html += `<script>${js}</script>`
    html = formatHTMLString(html);
    // console.log("tmp", tmp)
    return html
}
const getJs = (node: extendedElem<any>): string => {
    let js = ""
    if (node?.listeners?.length > 0) {
        // const f = node.listeners[0].func
        //@ts-ignore
        // console.log(`to String: ${f.toString()}. source ${f} `)

        js += node.listeners.map(listener => listener.source).join(";\n")
    }
    for (let i = 0; i < node.children.length; i++) {
        //@ts-ignore
        js += getJs(node.children[i])
    }
    return js;
}

function formatHTMLString(str: string): string {
    const { document } = (new JSDOM(``)).window;
    var div = document.createElement('div');
    div.innerHTML = str.trim();
    return formatNode(div, 0).innerHTML;
}

function formatNode(node: Element, level: number): Element {
    const { document } = (new JSDOM(``)).window;
    let indentBefore = new Array(level++ + 1).join('    '),
        indentAfter = new Array(level - 1).join('    '),
        textNode;
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