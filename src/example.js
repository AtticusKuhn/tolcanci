"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const fs_1 = __importDefault(require("fs"));
function main() {
    const b = (0, index_1.button)("press me");
    const counter = (0, index_1.div)(b, (count) => (0, index_1.p)(`the count is ${count}`)).vname("counter");
    counter.setState(69);
    b.addEventListener("click", () => {
        counter.setState(10);
    });
    const counter2 = (0, index_1.div)(b, (count) => (0, index_1.p)(`the count2 is ${count}`)).vname("counter2");
    counter2.setState(50);
    b.addEventListener("click", () => {
        counter2.setState(12);
    });
    const main = (0, index_1.div)("hello", (0, index_1.p)("ee"), (0, index_1.div)("and goodbye"), counter, counter2);
    console.log("in main", global);
    console.log("in main", Object.keys(global));
    const app = (0, index_1.makeApplication)(main);
    fs_1.default.writeFileSync("./example.html", app);
}
main();
