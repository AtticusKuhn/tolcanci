"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const fs_1 = __importDefault(require("fs"));
function main() {
    const main = (0, index_1.div)("hello", (0, index_1.p)("ee"), (0, index_1.div)("and goodbye"));
    console.log("main html", main.innerHTML);
    console.log("main text", main.innerText);
    const app = (0, index_1.makeApplication)(main);
    console.log("app", app);
    fs_1.default.writeFileSync("./example.html", app);
}
main();
