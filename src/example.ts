import { button, div, makeApplication, } from "./index";
import https from "https"
const intro = div("welcome to tolcanci, a UI framework")
const temp = div("I am a reusable component")
const comps = div("we allow for reusable components", temp, temp)
const b = button("press me")
const displayCount = (count: number) => div<null>(
    div(`the current count ${count}`),
    div(`the next count wil be ${count + 1}`),
)
const counterExample = div<number>(
    displayCount,
    b,
)
counterExample.setState(1)
b.addEventListener("click", () => {
    counterExample.setState(counterExample.state + 1)
})
const getTodos = () => new Promise<string>((resolve) => {
    https.get(`https://jsonplaceholder.typicode.com/todos/1`, res => {
        res.on('data', d =>
            resolve(JSON.parse(d.toString())["title"])
        )
    })
})
const state = div("we allow for stateful components", counterExample)
const staticProps = div<string>("this is a component with static props (generated at build time)",
    //@ts-ignore    
    (string) => div(string)
)
    .setStaticProps(getTodos)
// console.log("b.addEventListener(", b.addEventListener)
const main = div(
    intro,
    comps,
    state,
    staticProps
)
export const app = makeApplication(main)

