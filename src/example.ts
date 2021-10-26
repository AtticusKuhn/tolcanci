import fs from "fs";
import { button, div, makeApplication, p } from "./index";

function main() {
    const intro = div("welcome to tolcanci, a UI framework")
    const temp = div("I am a reusable component")
    const comps = div("we allow for reusable components", temp, temp)
    const b = button<number>("press me to increment cout")
    const displayCount = (count: number) => p<number>(
        "the count is",
        count.toString()
    )
    const counterExample = div<number>(
        b,
        displayCount
    ).vname("counterExample")
    counterExample.setState(0)
    b.addEventListener("click", () => {
        counterExample.setState(counterExample.state + 1)
    })
    const state = div("we allow for stateful components", counterExample)
    const main = div(
        intro,
        comps,
        //@ts-ignore
        state
    )
    const app = makeApplication(main)
    fs.writeFileSync("./example.html", app)
}
main()
