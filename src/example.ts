import { div, p, makeApplication } from "./index"
import fs from "fs";

function main() {
    const main = div("hello",
        p("ee"),
        div("and goodbye")
    )
    console.log("main html", main.innerHTML)
    console.log("main text", main.innerText)

    const app = makeApplication(main)
    console.log("app", app)
    fs.writeFileSync("./example.html", app)
}
main()
// window.onload = () => {
//     document.body.innerHTML = app;
// }