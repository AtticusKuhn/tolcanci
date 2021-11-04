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
    const getPaths = (loc: string): string[] => {
        let arr = [loc.substr(pathPath.length), loc.substr(pathPath.length).substr(0, loc.substr(pathPath.length).length - 5)]
        if (loc.substr(pathPath.length).substr(0, loc.substr(pathPath.length).length - 5) === "index" || loc.substr(pathPath.length) === "index") {
            arr.push("")
        }
        return arr;
    }
    const recalculate = () => {
        const loc: string = w.location.pathname;
        const newComp = x[getPaths(loc).find(p => !!x[p])]
        if (!newComp) {
            throw new Error(`no component for path ${getPaths(loc).join(", ")} `)
        }
        console.log(`in recalcuate, ${getPaths(loc).join(", ")} and ${newComp.innerHTML}`)
        return newComp;
    }
    const comp = recalculate()
    const holder = div<void>()
    holder.append(comp)
    document.addEventListener("newPath", () => {
        console.log("got newpath event")
        // const loc: string = w.location.pathname;
        const newComp = recalculate()
        holder.innerHTML = ""
        holder.append(newComp)
        // document.body.append(newComp)
        ///comp.replaceWith(newComp)
    })
    window.onpopstate = function (event) {
        console.log("window pop")
        const newComp = recalculate()
        holder.innerHTML = ""
        holder.append(newComp)

        // comp.replaceWith(newComp)
    }

    return holder
}
