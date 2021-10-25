"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const fs_1 = __importDefault(require("fs"));
function main() {
    const b = (0, index_1.button)("press me");
    const counter = (0, index_1.div)(b, (count) => `the count is ${count}`);
    counter.setState(0);
    b.addEventListener("click", () => {
        counter.setState(10);
    });
    const main = (0, index_1.div)("hello", (0, index_1.p)("ee"), (0, index_1.div)("and goodbye"), counter);
    console.log("main html", main.innerHTML);
    console.log("main text", main.innerText);
    const app = (0, index_1.makeApplication)(main);
    fs_1.default.writeFileSync("./example.html", app);
}
main();
