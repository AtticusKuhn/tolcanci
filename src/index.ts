import { JSDOM } from "jsdom"
type child = string | HTMLElement
type reactiveChild<T> = (x: T) => child;
interface extendedElem<T> extends HTMLElement {
    listeners: { name: String, source: string }[];
    realAddEventListener: HTMLElement["addEventListener"];
    state: T;
    setState: (x: T) => T;
    attr: (b: string, c: string) => extendedElem<T>;

}
const simpleELement = (tagName: string) => <T>(...args: (child | reactiveChild<T>)[]): extendedElem<T> => {
    const { document } = (new JSDOM(``)).window;
    let a = document.createElement(tagName) as extendedElem<T>;
    a.realAddEventListener = a.addEventListener;
    a.listeners = []
    a.attr = (b, c) => {
        a.setAttribute(b, c)
        return a;
    }
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
                // a.addEventListener("newState", (newState: CustomEvent<T>) => {
                //     try {
                //         //@ts-ignore
                //         a.appendChild(arg(newState.detail))
                //     } catch {
                //         a.append(arg(newState.detail))
                //     }
                // })
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
                })
            } else {
                a.appendChild(arg);
            }
        }
    }
    a.setState = (newState: T) => {
        let { CustomEvent } = (new JSDOM(``)).window;
        const event = new CustomEvent<T>('newState', { detail: newState });
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
    html += `<script defer>${js}</script>`
    html = formatHTMLString(html);
    // console.log("tmp", tmp)
    return html
}
const getJs = (node: extendedElem<any>): string => {
    let js = ""
    if (node?.listeners?.length > 0) {
        const id = Math.random().toString()
        node.attr('data-id', id)
        js += node.listeners.map(listener =>
            `document.querySelector("[data-id='${id}']").addEventListener("${listener.name}",${listener.source});\n`
        ).join(";\n")
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