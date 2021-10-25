import { JSDOM } from "jsdom"
type child = string | HTMLElement
const simpleELement = (tagName: string) => (...args: child[]): HTMLElement => {
    const { document } = (new JSDOM(``)).window;
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
    //@ts-ignore
    a.realAddEventListener = a.addEventListener;
    //@ts-ignore

    function reportIn(e) {
        //@ts-ignore

        var a = this.lastListenerInfo[this.lastListenerInfo.length - 1];
        console.log(a)
    }
    //@ts-ignore

    a.addEventListener = function (a, b, c) {
        //@ts-ignore
        this.realAddEventListener(a, reportIn, c);
        //@ts-ignore

        this.realAddEventListener(a, b, c);
        //@ts-ignore
        if (!this.lastListenerInfo) { this.lastListenerInfo = new Array() };
        //@ts-ignore

        this.lastListenerInfo.push({ a: a, b: b, c: c });
    };
    // const handler = {
    //     get: (target: any, prop: string, _receiver: any) => {
    //         const proxyList = ["onclick", "addEventListener"]
    //         if (prop in proxyList) {
    //             //@ts-ignore
    //             target.prop(...arguments)
    //             return target
    //         } else {
    //             //@ts-ignore
    //             return Reflect.get(...arguments);
    //         }

    //     }
    // }
    // const proxy = new Proxy(a, handler);
    return a;
};

// export const div = (...x: child[]) => new cdiv(...x)
export const [div, p, button] = ["div", "p", "button"].map(simpleELement)
export const makeApplication = (x: HTMLElement): string => {
    const { document } = (new JSDOM(``)).window;
    const tmp = document.createElement("div")
    tmp.appendChild(x);
    const js = getJs(tmp)
    console.log("js", js)
    const html = formatHTMLString(tmp.innerHTML);
    // console.log("tmp", tmp)
    return html
}
const getJs = (node: Element) => {
    //@ts-ignore
    console.log("lastinfo", node.lastListenerInfo)
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