import fs from "fs";
import { button, div, makeApplication, } from "./index";

function main() {
    const intro = div("welcome to tolcanci, a UI framework")
    const temp = div("I am a reusable component")
    const comps = div("we allow for reusable components", temp, temp)
    const b = button("press me")
    const counterExample = div<number>(
        (count) => `hello ${count}`,

        b,
    ).vname("counterExample")
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
    const app = makeApplication(main)
    fs.writeFileSync("./example.html", app)
}
main()
