import { simpleElementBuilders, makeA } from "./common"
console.log("[INFO] client runtime intialized")
const clientElement = simpleElementBuilders(window);
export const makeApplication = (s: any) => {
    document.body.innerHTML = ""
    document.body.append(s)
}
export const [div, p, button] = ["div", "p", "button"].map(clientElement)
export const a = makeA(window)
export default { makeApplication, div, p, button }