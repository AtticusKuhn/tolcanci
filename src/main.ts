import { app } from "./example"
import fs from "fs"
app.then(a =>
    fs.writeFileSync("./example.html", a)
)