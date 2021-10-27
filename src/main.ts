import { app } from "./example"
import fs from "fs"

fs.writeFileSync("./example.html", app)