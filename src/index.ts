import fs from "fs";
import { JSDOM } from "jsdom";
import { extendedElem, makeA, simpleElementBuilders } from "./common";

//@ts-ignore
const window: Window = new JSDOM(``).window;
export const simpleElement = simpleElementBuilders(window);

export const [div, p, button] = ["div", "p", "button"].map(simpleElement)
export const br = simpleElement("br")<void>()

export const a = makeA(window)
interface ops {
    buildOpts: {
        build: "server" | "static"
        basePath: string;
    },
}
type router = (extendedElem<any> & { routes: string[], update: (x: Window, basePath: string) => router });
export const makeApplication = async (x: extendedElem<any> | router, options: ops): Promise<string> => {
    console.log("make app called")
    // const { document } = (new JSDOM(``)).window;
    const url = options.buildOpts.basePath
    //@ts-ignore
    if (x.update) {
        //@ts-ignore
        x = x.update(new JSDOM(``, {
            url,
        }).window, url)
    }
    //@ts-ignore
    const routes = x?.routes || ["/"]
    console.log("routes is", routes)
    console.log("x is", x)
    for (const route of routes) {
        const win = new JSDOM(``, {
            url: `${url}${route}`
        }).window as unknown as Window;
        // const x = xf(win)
        //@ts-ignore
        if (x.update) {
            //@ts-ignore
            x = x.update(win, url)
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
        html += `<script>window.basePath = "${url}"</script>\n`;
        // html += "<script src='dist/runTime.js'></script>\n";
        html += "<script src='./program.js'></script>\n";
        html += `<script defer>${js}</script>\n`
        html = formatHTMLString(html);

        fs.writeFileSync(`./example/dist/${routeToFile(route)}.html`, html)

        // console.log("tmp", tmp)
        // return html
    }
    return "this is a placeholder"
}
const routeToFile = (route: string): string => route === "/" || route === "" ? "index" : route;
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
    const update = (w: Window, basePath: string): router => {
        const pathPath = new URL(basePath).pathname

        console.log("in update, pathPath is", pathPath)
        const loc: string = w.location.pathname // .substr(new URL(basePath).href.length);
        console.log("in router, location is", w.location.href)
        const path = loc.substr(pathPath.length)
        console.log(`in router, 
        loc: ${loc}, 
        pathPath: ${pathPath}
        pathPath.length: ${pathPath.length}
        path: ${path}`)
        const comp = x[path] as router;
        // console.log("x is", x)
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
