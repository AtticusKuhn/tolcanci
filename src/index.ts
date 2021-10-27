import { JSDOM } from "jsdom"
//@ts-ignore
import client from "./client"
import { simpleElementBuilders, extendedElem } from "./common"
//@ts-ignore
export const simpleElement = simpleElementBuilders((new JSDOM(``)).window)

export const [div, p, button] = ["div", "p", "button"].map(simpleElement)
export const makeApplication = (x: HTMLElement): string => {
    // const { document } = (new JSDOM(``)).window;
    const tmp = div()
    tmp.appendChild(x);
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
    js += `//generaing js for ${node.secret_id}\n`
    const id = Math.random().toString()

    if (node.state !== null && node.state !== undefined) {
        node.attr('data-id', id)
        console.log("node has state", node.state)
        js += `
        const ${node.varName} = clientElement(document.querySelector("[data-id='${id}'"))().setState(${node.state});\n
        ${node.varName}.secret_id = "${node.secret_id}";\n
        `
        // js += `
        // const ${node.secret_id} = {

        // }
        // `
    }
    console.log("listeners in getJs", node?.listeners)
    if (node?.listeners?.length > 0) {
        console.log("node has a listener")
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