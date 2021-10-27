
type child<T> = string | extendedElem<T>
type reactiveChild<T> = (x: T) => extendedElem<T>;
export interface extendedElem<T> extends HTMLElement {
    listeners: { name: String, source: string }[];
    realAddEventListener: HTMLElement["addEventListener"];
    state: T;
    setState: (x: T) => extendedElem<T>;
    attr: (b: string, c: string) => extendedElem<T>;
    secret_id: string;
    varName?: string;
    vname: (x: string) => extendedElem<T>;

}
const randomInRange = (low: number) => (high: number): number => Math.floor(Math.random() * (high - low) + low)
const randomLetter = () => String.fromCharCode(randomInRange(97)(122))
const id = (): string => new Array(10).fill(0).map(_x => randomLetter()).join("")
export const simpleElementBuilders = (window: Window) => (tagName: string) => <T>(...args: (child<any> | reactiveChild<any>)[]): extendedElem<T> => {
    // const { document } = (new JSDOM(``)).window;
    let document = window.document
    let a = (typeof tagName === "string" ? document.createElement(tagName)
        : tagName) as extendedElem<T>;
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
        // console.log("in fake event listener, function source is", b.toString())
        a.listeners.push({
            name: t,
            source: b.toString()
        })
        a.realAddEventListener(t, b, c);
    };
    for (const arg of args) {
        if (typeof arg === "string") {
            let text = document.createTextNode(arg);
            a.append(text.cloneNode(true));
        }
        else {
            if (arg instanceof Function) {
                a.attr("listener-id", a.secret_id)
                let argElem = arg(a.state)
                argElem.attr("arg-id", argElem.secret_id)
                //@ts-ignore
                a.addEventListener(`newState-${a.secret_id}`, (newState: CustomEvent<T>) => {
                    console.log("hard-coded event listener called")
                    try {
                        a.append(arg(newState.detail))
                    } catch (e) {
                        console.log("error in hard-coded event listener")
                    }
                });
                //@ts-ignore
                document.addEventListener(`newState-${a.secret_id}`, (newState: CustomEvent<T>) => {
                    console.log("hard-coded event listener called")
                    try {
                        argElem.innerHTML = '';
                        argElem.append(arg(newState.detail))
                    } catch (e) {
                        console.log("error in hard-coded event listener")
                    }
                })
                a.listeners.push({
                    name: `newState-${a.secret_id}`,
                    source: `(newState) => {
                        const arg = ${arg.toString()}
                        console.log("string-coded event listener called")

                            try {
                                a.append(arg(newState.detail))
                            } catch {
                                let a = document.querySelector("[arg-id='${argElem.secret_id}']")
                                a.innerHTML = '';
                                a.append(arg(newState.detail).attr("arg-id","${argElem.secret_id}"))
                            }
                        }`
                })
                a.append(argElem)
            } else {
                // clone node causes probles with event listeners
                a.append(arg/*.cloneNode(true)*/);
            }
        }
    }
    a.setState = (newState: T) => {
        //@ts-ignore
        let { CustomEvent } = window;
        const event = new CustomEvent<T>(`newState-${a.secret_id}`, { detail: newState });
        a.state = newState;
        console.log(`serverside braodcasting`, `newState-${a.secret_id}`)
        document.dispatchEvent(event)
        return a;
    }
    // console.log("a.listeners", a.listeners)
    return a;
};