import { simpleElementBuilders } from "./common"
console.log("[INFO] client runtime intialized")
const clientElement = simpleElementBuilders(window);
//@ts-ignore
window.clientElement = clientElement
// export const [div, p, button] = ["div", "p", "button"].map(clientElement)
//@ts-ignore
window.index_1 = {}
for (const element of ["div", "p", "button"]) {
    //@ts-ignore
    window[element] = clientElement(element)
    //@ts-ignore
    window.index_1[element] = clientElement(element)
    //@ts-ignore
    window.index_1.makeApplication = (s: any) => null
    //@ts-ignore
    window.makeApplication = (s: any) => {
        document.body.innerHTML = ""
        document.body.append(s)
    }

}
export default null