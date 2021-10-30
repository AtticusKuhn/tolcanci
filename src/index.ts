import fs from "fs";
import { JSDOM } from "jsdom";
import { extendedElem, makeA, simpleElementBuilders } from "./common";

//@ts-ignore
const window: Window = new JSDOM(``).window;
export const simpleElement = simpleElementBuilders(window);

export const [div, p, button] = ["div", "p", "button"].map(simpleElement)
export const a = makeA(window)
interface ops {
    buildOpts: {
        build: "server" | "static"
    },
}
type router = (extendedElem<any> & { routes: string[], update: (x: Window) => router });
export const makeApplication = async (x: extendedElem<any> | router, _options?: ops): Promise<string> => {
    console.log("make app called")
    // const { document } = (new JSDOM(``)).window;
    //@ts-ignore
    if (x.update) {
        //@ts-ignore
        x = x.update(new JSDOM(``).window)
    }
    //@ts-ignore
    const routes = x?.routes || ["/"]
    console.log("routes is", routes)
    console.log("x is", x)
    for (const route of routes) {
        const win = new JSDOM(``, {
            url: `http://localhost.com/${route}`
        }).window as unknown as Window;
        // const x = xf(win)
        //@ts-ignore
        if (x.update) {
            //@ts-ignore
            x = x.update(win)
        }
        const body = win.document.body;
        // window.
        // const tmp = div()
        const a = await x?.getStaticProps()
        console.log("setting window")
        // x.window = win;
        // console.log("result of static props is", a)
        console.log("making app")
        body.appendChild(x);
        let js = "";// getJs(tmp);
        const makeStr = ([a, b]: [string, any]) => `document.querySelector("[secret-id='${a}']").setState( ${JSON.stringify(b)});`;
        js += Object.entries(a).map(makeStr).join("\n");
        // console.log("js", js)
        let html = body.innerHTML;
        // html += "<script src='dist/runTime.js'></script>\n";
        html += "<script src='dist/program.js'></script>\n";
        html += `<script defer>${js}</script>\n`
        html = formatHTMLString(html);
        fs.writeFileSync(`./example/${route}.html`, html)

        // console.log("tmp", tmp)
        // return html
    }
    return "this is a placeholder"
}
//@ts-ignore
const getJs = (_node: extendedElem<any>): string => {
    let js = ""
    js += "let exports = {}; \n"
    js += "let require = (string) => window['index_1']; \n"
    js += fs.readFileSync("./src/example.js", "utf-8")
    js += "document.body.innerHTML = '';\n"
    js += "document.body.append(main);\n"
    js = js.replace(/(^.*require.*$)/g, "// $1")
    return js;
    // js += `//generaing js for ${node.secret_id}\n`
    // const id = Math.random().toString()

    // if (node.state !== null && node.state !== undefined) {
    //     node.attr('data-id', id)
    //     console.log("node has state", node.state)
    //     js += `
    //     const ${node.varName} = clientElement(document.querySelector("[data-id='${id}'"))().setState(${node.state});\n
    //     ${node.varName}.secret_id = "${node.secret_id}";\n
    //     `
    //     // js += `
    //     // const ${node.secret_id} = {

    //     // }
    //     // `
    // }
    // console.log("listeners in getJs", node?.listeners)
    // if (node?.listeners?.length > 0) {
    //     console.log("node has a listener")
    //     node.attr('data-id', id)
    //     js += node.listeners.map(listener =>
    //         listener.name.startsWith("newState") ?
    //             `document.addEventListener("${listener.name}",${listener.source});\n`
    //             : `document.querySelector("[data-id='${id}']").addEventListener("${listener.name}",
    //             ${listener.source});\n`

    //     ).join(";\n")
    // }
    // for (let i = 0; i < node.children.length; i++) {
    //     //@ts-ignore
    //     js += getJs(node.children[i])
    // }
    // return js;
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

export function router(x: Record<string, extendedElem<any>>): router {
    const comp = x[""] as router;
    const update = (w: Window): router => {


        const loc: string = w.location.pathname;

        const comp = x[loc.substr(1)] as router;
        console.log("x is", x)
        if (!comp) {
            throw new Error(`unrecognized location ${loc}`)
        }
        comp.update = update;
        comp.routes = Object.keys(x)
        return comp
    }

    if (!comp) {
        throw new Error("no handling for / route")
    }
    comp.update = update;
    return comp as router;
}
