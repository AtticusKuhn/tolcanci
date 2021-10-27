import { simpleElementBuilders } from "./common"

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

}
export default null