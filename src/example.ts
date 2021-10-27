import { button, div, makeApplication, } from "./index";

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
const state = div("we allow for stateful components", counterExample)
// console.log("b.addEventListener(", b.addEventListener)
const main = div(
    intro,
    comps,
    state
)
export const app = makeApplication(main)

