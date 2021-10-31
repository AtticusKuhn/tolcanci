import { simpleElementBuilders, makeA, extendedElem, child } from "./common"
console.log("[INFO] client runtime intialized")
const clientElement = simpleElementBuilders(window);
export const makeApplication = (s: any) => {
    document.body.innerHTML = ""
    document.body.append(s)
}
export const [div, p, button] = ["div", "p", "button"].map(clientElement)
const _a = makeA(window)
export const a = (...args: child<any>[]) => {
    const elem = _a(...args);
    elem.addEventListener("click", (e) => {
        if (elem.href) {
            e.preventDefault();
            const state = { 'page_id': 1, 'user_id': 5 }
            const title = ''
            const url = elem.href
            history.pushState(state, title, url)
        }
    })
    return elem;
}
export default { makeApplication, div, p, button }
export const router = (x: Record<string, extendedElem<any>>): extendedElem<void> => {
    const w = window;
    // const loc = w.location;
    const loc: string = w.location.pathname;
    // console.log("location is", w.location.href)
    //@ts-ignore
    const comp = x[loc.substr(w.basePath.length)];
    if (!comp) {
        throw new Error(`no component for path ${loc}`)
    }

    return comp
}
