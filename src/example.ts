import { div, p, makeApplication, button } from "./index"
import fs from "fs";

function main() {
    const b = button("press me")
    // console.log("b.addEventListener(", b.addEventListener)

    const counter = div<number>(
        b,
        (count) => p(`the count is ${count}`)
    ).vname("counter");
    counter.setState(69)
    b.addEventListener("click", () => {
        counter.setState(10)
    })
    const counter2 = div<number>(
        b,
        (count) => p(`the count2 is ${count}`)
    ).vname("counter2");
    counter2.setState(50)
    b.addEventListener("click", () => {
        counter2.setState(12)
    })
    const main = div("hello",
        p("ee"),
        div("and goodbye"),
        counter,
        counter2,
    )

    // console.log("main html", main.innerHTML)
    // console.log("main text", main.innerText)
    console.log("in main", global)
    //@ts-ignore
    console.log("in main", Object.keys(global))

    const app = makeApplication(main)
    // console.log("app", app)
    fs.writeFileSync("./example.html", app)
}
main()
// window.onload = () => {
//     document.body.innerHTML = app;
// }