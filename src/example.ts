import fs from "fs";
import { div, makeApplication, p } from "./index";

function main() {
    const a = p("my custom resuable component")
    const main = div(
        "here are some reusable components:",
        a, a, a, a, a, a, a
    )
    const app = makeApplication(main)
    fs.writeFileSync("./example.html", app)
}
main()
