import { simpleElementBuilders, makeA, extendedElem } from "./common"
console.log("[INFO] client runtime intialized")
const clientElement = simpleElementBuilders(window);
export const makeApplication = (s: any) => {
    document.body.innerHTML = ""
    document.body.append(s)
}
export const [div, p, button] = ["div", "p", "button"].map(clientElement)
export const a = makeA(window)
export default { makeApplication, div, p, button }
export const router = (x: Record<string, extendedElem<any>>): extendedElem<void> => {
    const w = window;
    // const loc = w.location;
    const loc: string = w.location.pathname;
    // console.log("location is", w.location.href)

    const comp = x[loc.substr(1)];
    if (!comp) {
        throw new Error(`no component for path ${loc}`)
    }

    return comp
}
