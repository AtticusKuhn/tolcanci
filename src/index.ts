import { JSDOM } from "jsdom"
//@ts-ignore
import client from "./client"
type child<T> = string | extendedElem<T>
type reactiveChild<T> = (x: T) => child<T>;
interface extendedElem<T> extends HTMLElement {
    listeners: { name: String, source: string }[];
    realAddEventListener: HTMLElement["addEventListener"];
    state: T;
    setState: (x: T) => T;
    attr: (b: string, c: string) => extendedElem<T>;
    secret_id: string;
    varName?: string;
    vname: (x: string) => extendedElem<T>;

}
const randomInRange = (low: number) => (high: number): number => Math.floor(Math.random() * (high - low) + low)
const randomLetter = () => String.fromCharCode(randomInRange(97)(122))
const id = (): string => new Array(10).fill(0).map(_x => randomLetter()).join("")
export const simpleElementBuilders = (document: Document) => (tagName: string) => <T>(...args: (child<T> | reactiveChild<T>)[]): extendedElem<T> => {
    // const { document } = (new JSDOM(``)).window;
    let a = document.createElement(tagName) as extendedElem<T>;
    a.realAddEventListener = a.addEventListener;
    a.listeners = []
    a.attr = (b, c) => {
        a.setAttribute(b, c)
        return a;
    }
    a.vname = (x: string) => {
        a.varName = x;
        return a;
    }
    a.secret_id = id();
    a.addEventListener = function (t: string, b: (x: any) => any, c: boolean) {
        console.log("adding fake event listener")
        // console.log("t", t)
        // console.log("b", b)
        console.log("in fake event listener, function source is", b.toString())
        a.listeners.push({
            name: t,
            source: b.toString()
        })
        a.realAddEventListener(t, b, c);
    };
    for (const arg of args) {
        if (typeof arg === "string") {
            let text = document.createTextNode(arg);
            a.append(text.cloneNode(true));
        }
        else {
            if (arg instanceof Function) {
                //@ts-ignore
                document.addEventListener(`newState-${a.secret_id}`, (newState: CustomEvent<T>) => {
                    console.log("hard-coded event listener")
                    try {
                        a.append(arg(newState.detail))
                    } catch (e) {
                        console.log("error in hard-coded event listener")
                    }
                    // try {
                    //     //@ts-ignore
                    //     a.appendChild(arg(newState.detail))
                    // } catch {
                    //     a.append(arg(newState.detail))
                    // }
                })
                a.attr("listener-id", a.secret_id);
                a.listeners.push({
                    name: `newState-${a.secret_id}`,
                    source: `(newState) => {
                        const arg = ${arg.toString()}
                        console.log("string-coded event listener")

                            try {
                                a.append(arg(newState.detail))
                            } catch {
                                let a = document.querySelector("[listener-id='${a.secret_id}']")
                                a.innerHTML = '';
                                a.append(arg(newState.detail))
                            }
                        }`
                })
            } else {
                a.append(arg.cloneNode(true));
            }
        }
    }
    a.setState = (newState: T) => {
        let { CustomEvent } = (new JSDOM(``)).window;
        const event = new CustomEvent<T>(`newState-${a.secret_id}`, { detail: newState });
        a.state = newState;
        console.log(`serverside braodcasting`, `newState-${a.secret_id}`)
        document.dispatchEvent(event)
        return newState;
    }

    return a;
};
export const simpleElement = simpleElementBuilders((new JSDOM(``)).window.document)

export const [div, p, button] = ["div", "p", "button"].map(simpleElement)
export const makeApplication = (x: HTMLElement): string => {
    // const { document } = (new JSDOM(``)).window;
    const tmp = div()
    tmp.appendChild(x.cloneNode(true));
    const js = getJs(tmp)
    // console.log("js", js)
    let html = tmp.innerHTML;
    html += "<script src='dist/build.js'></script>\n";
    html += `<script defer>${js}</script>\n`
    html = formatHTMLString(html);
    // console.log("tmp", tmp)
    return html
}
const getJs = (node: extendedElem<any>): string => {
    let js = ""
    const id = Math.random().toString()

    if (node.state !== null && node.state !== undefined) {
        node.attr('data-id', id)
        console.log("node has state", node.state)
        js += `
        const ${node.varName} = clientElement(document.querySelector("[data-id='${id}'"))();\n
        ${node.varName}.secret_id = "${node.secret_id}";\n
        `
        // js += `
        // const ${node.secret_id} = {

        // }
        // `
    }
    if (node?.listeners?.length > 0) {
        node.attr('data-id', id)
        js += node.listeners.map(listener =>
            listener.name.startsWith("newState") ?
                `document.addEventListener("${listener.name}",${listener.source});\n`
                : `document.querySelector("[data-id='${id}']").addEventListener("${listener.name}",
                ${listener.source});\n`

        ).join(";\n")
    }
    for (let i = 0; i < node.children.length; i++) {
        //@ts-ignore
        js += getJs(node.children[i])
    }
    return js;
}
//@ts-ignore
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
            node.appendChild(textNode.cloneNode(true));
        }
    }
    return node;
}