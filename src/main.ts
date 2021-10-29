import { app } from "./example"
import fs from "fs"
app.then((a: string) =>
    fs.writeFileSync("./example.html", a)
)