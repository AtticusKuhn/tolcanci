import { simpleElementBuilders, makeA, extendedElem, child } from "./common"
console.log("[INFO] client runtime intialized")
const clientElement = simpleElementBuilders(window);
export const makeApplication = (s: any) => {
    document.body.innerHTML = ""
    document.body.append(s)
}
export const [div, p, button] = ["div", "p", "button"].map(clientElement)
export const br = clientElement("br")()
const _a = makeA(window)
export const a = (...args: child<any>[]) => {
    const elem = _a(...args);
    elem.addEventListener("click", (e) => {
        if (elem.href) {
            e.preventDefault();
            const state = { 'page_id': 1, 'user_id': 5 }
            const title = ''
            //@ts-ignore
            const url = new URL(window.basePath).pathname + new URL(elem.href).pathname.substring(1)
            history.pushState(state, title, url)
            const event = new CustomEvent<void>(`newPath`);
            // a.state = newState;
            // console.log(`serverside braodcasting`, `newState-${a.secret_id}`)
            document.dispatchEvent(event)
        }
    })
    return elem;
}
export default { makeApplication, div, p, button }
export const router = (x: Record<string, extendedElem<any>>): extendedElem<void> => {
    const w = window;
    //@ts-ignore
    const pathPath = new URL(w.basePath).pathname
    const loc: string = w.location.pathname;
    const comp = x[loc.substr(pathPath.length)] || x[loc.substr(pathPath.length).substr(0, loc.substr(pathPath.length).length - 5)];
    console.log(`loc.substr(pathPath.length) is ${loc.substr(pathPath.length)}`)
    if (!comp) {
        throw new Error(`no component for path ${loc}`)
    }
    document.addEventListener("newPath", () => {
        console.log("got newpath event")
        const loc: string = w.location.pathname;
        // console.log("location is", w.location.href)
        //@ts-ignore
        const newComp = x[loc.substr(pathPath.length)] || x[loc.substr(pathPath.length).substr(0, loc.substr(pathPath.length).length - 5)];
        if (!newComp) {
            throw new Error(`no component for path ${loc}`)
        }
        comp.replaceWith(newComp)
    })

    return comp
}
