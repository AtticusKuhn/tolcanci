
export type child<T> = string | extendedElem<T>
export type reactiveChild<T> = (x: T) => extendedElem<T>;
export interface extendedElem<T> extends HTMLElement {
    state: T;
    setState: (x: T) => extendedElem<T>;
    attr: (b: string, c: string) => extendedElem<T>;
    secret_id: string;
    cloneWithEventListeners: () => extendedElem<T>;
    eventListeners: { event: string, handler: (this: HTMLElement, ev: any) => any }[];
    realEventListener: HTMLElement["addEventListener"];
    setStaticProps: (x: () => Promise<T>) => extendedElem<T>;
    getStaticProps: () => Promise<Record<string, any>>;
    staticProps: () => Promise<T>;
}
const isServer = (): boolean => typeof window === "undefined";
// const randomInRange = (low: number) => (high: number): number => Math.floor(Math.random() * (high - low) + low)
// const randomLetter = () => String.fromCharCode(randomInRange(97)(122))
let idCounter = 0
export const id = (): string => (idCounter++).toString()//new Array(10).fill(0).map(_x => randomLetter()).join("")
export const simpleElementBuilders = (window: Window) => (tagName: string | HTMLElement) => <T>(...args: (child<any> | reactiveChild<any>)[]): extendedElem<T> => {
    // const { document } = (new JSDOM(``)).window;
    let document = window.document
    let a = (typeof tagName === "string" ? document.createElement(tagName)
        : tagName) as extendedElem<T>;
    a.attr = (b, c) => {
        a.setAttribute(b, c)
        return a;
    }
    a.setStaticProps = (x) => {
        if (isServer()) {
            a.staticProps = x;
            console.log("a.staticProps was set for a", a)
        }
        return a;
    }

    a.eventListeners = [];
    a.realEventListener = a.addEventListener;
    a.addEventListener = (event: string, handler: (this: HTMLElement, ev: any) => any) => {
        // console.log("addEventListener called", event)
        a.eventListeners.push({ event, handler })
        a.realEventListener(event, handler)
    }
    //@ts-ignore
    const tmpClone = (a) => {
        let x = a.cloneNode(true)
        for (let i = 0; i < a.children.length; i++) {
            x.appendChild(tmpClone(a.children[i]))
        }
        console.log("in clone, a.eventListeners", a.eventListeners)
        if (a.eventListeners) {
            for (const listener of a.eventListeners) {
                x.addEventListener(listener.event, listener.handler)
            }
        }
        //@ts-ignore
        return x;
    }
    a.cloneWithEventListeners = () => {
        return tmpClone(a)
    }
    a.secret_id = id();

    for (const arg of args) {
        // let arg = typeof arg1 === "string" || arg1 instanceof Function ? arg1 : arg1.cloneNode(true);
        if (typeof arg === "string") {
            let text = document.createTextNode(arg);
            a.append(text.cloneNode(true));
        } else {
            if (arg instanceof Function) {
                a.attr("listener-id", a.secret_id)
                let argElem = arg(a.state)
                argElem.attr("arg-id", argElem.secret_id)
                //@ts-ignore
                a.addEventListener(`newState-${a.secret_id}`, (newState: CustomEvent<T>) => {
                    // console.log("hard-coded event listener called")
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

                a.append(argElem)
            } else {
                // clone node causes probles with event listeners
                a.append(arg);
            }
        }
    }
    a.setState = (newState: T) => {
        //@ts-ignore
        let { CustomEvent } = window;
        const event = new CustomEvent<T>(`newState-${a.secret_id}`, { detail: newState });
        a.state = newState;
        // console.log(`serverside braodcasting`, `newState-${a.secret_id}`)
        document.dispatchEvent(event)
        return a;
    }
    const recursiveStaticProps = async (a: extendedElem<any>): Promise<Record<string, any>> => {
        let record: Record<string, any> = {}
        for (let i = 0; i < a.children.length; i++) {
            // try {
            //@ts-ignore
            record = { ...record, ...await recursiveStaticProps(a.children[i]) }
            // } catch { }
        }
        if (a.staticProps !== undefined) {

            let props = await a.staticProps()
            a.setState(props)
            record[a.secret_id] = props;
            // console.log("a has static props")
            // return props;
        }
        return record;
    }
    a.attr("secret-id", a.secret_id)
    a.getStaticProps = async (): Promise<Record<string, any>> => {
        return await recursiveStaticProps(a);
    }
    // if (isServer()) {
    //     a.getStaticProps()?.then((state) => {
    //         if (state) {
    //             a.setState(state)
    //         }
    //     })

    // }
    // console.log("a.listeners", a.listeners)
    return a;
};