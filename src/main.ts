import { app } from "../example/example"
import fs from "fs"
app.then((a: string) =>
    fs.writeFileSync("./example/index.html", a)
)