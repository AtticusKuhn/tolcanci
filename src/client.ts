// import { simpleElementBuilders } from "./index"
type child = string | HTMLElement
type reactiveChild<T> = (x: T) => child;
interface extendedElem<T> extends HTMLElement {
    listeners: { name: String, source: string }[];
    realAddEventListener: HTMLElement["addEventListener"];
    state: T;
    setState: (x: T) => T;
    attr: (b: string, c: string) => extendedElem<T>;
    secret_id: string;
    varName?: string;
    vname: (x: string) => extendedElem<T>;

}
const randomInRange = (low: number) => (high: number): number => Math.floor(Math.random() * (high - low) + low)
const randomLetter = () => String.fromCharCode(randomInRange(97)(122))
const id = (): string => new Array(10).fill(0).map(_x => randomLetter()).join("")
export const simpleElementBuilders = (document: Document) => (tagName: string | Element) => <T>(...args: (child | reactiveChild<T>)[]): extendedElem<T> => {
    // const { document } = (new JSDOM(``)).window;
    let a: extendedElem<T>
    if (typeof tagName === "string") {
        a = document.createElement(tagName) as extendedElem<T>;
    } else {
        //@ts-ignore
        a = tagName;
    }
    a.realAddEventListener = a.addEventListener;
    a.listeners = []
    a.attr = (b, c) => {
        a.setAttribute(b, c)
        return a;
    }
    a.vname = (x: string) => {
        a.varName = x;
        return a;
    }
    a.secret_id = id();
    a.addEventListener = function (t: string, b: (x: any) => any, c: boolean) {
        console.log("adding fake event listener")
        // console.log("t", t)
        // console.log("b", b)
        console.log("in fake event listener, function source is", b.toString())
        a.listeners.push({
            name: t,
            source: b.toString()
        })
        a.realAddEventListener(t, b, c);
    };
    for (const arg of args) {
        if (typeof arg === "string") {
            let text = document.createElement("div");
            text.innerHTML = arg;
            a.appendChild(text);
        }
        else {
            if (arg instanceof Function) {
                //@ts-ignore
                a.addEventListener(`newState-${a.secret_id}`, (newState: CustomEvent<T>) => {
                    console.log("hard-coded event listener")
                    try {
                        a.append(arg(newState.detail))
                    } catch (e) {
                        console.log("error in hard-coded event listener")
                    }
                    // try {
                    //     //@ts-ignore
                    //     a.appendChild(arg(newState.detail))
                    // } catch {
                    //     a.append(arg(newState.detail))
                    // }
                })
                a.listeners.push({
                    name: `newState-${a.secret_id}`,
                    source: `(newState) => {
                        const arg = ${arg.toString()}
                        console.log("string-coded event listener")

                            try {
                                a.appendChild(arg(newState.detail))
                            } catch {
                                a.append(arg(newState.detail))
                            }
                        }`
                })
            } else {
                a.appendChild(arg);
            }
        }
    }
    a.setState = (newState: T) => {
        // let { CustomEvent } = (new JSDOM(``)).window;
        const event = new CustomEvent<T>(`newState-${a.secret_id}`, { detail: newState });
        a.state = newState;
        console.log(`serverside braodcasting`, `newState-${a.secret_id}`)
        document.dispatchEvent(event)
        return newState;
    }

    return a;
};
const clientElement = simpleElementBuilders(document);
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