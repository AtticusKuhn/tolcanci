import { JSDOM } from "jsdom"
type child = string | HTMLElement
const simpleELement = (tagName: string) => (...args: child[]): HTMLElement => {
    const { document } = (new JSDOM(``)).window;
    let a = document.createElement(tagName);
    for (const arg of args) {
        if (typeof arg === "string") {
            let text = document.createElement("div");
            text.innerHTML = arg;
            a.appendChild(text);
        }
        else {
            a.appendChild(arg);
        }
    }
    return a;
};
export const [div, p] = ["div", "p"].map(tagName => simpleELement(tagName))
export const makeApplication = (x: HTMLElement): string => {
    const { document } = (new JSDOM(``)).window;
    const tmp = document.createElement("div")
    tmp.appendChild(x);
    console.log("tmp", tmp)
    return tmp.innerHTML;
}