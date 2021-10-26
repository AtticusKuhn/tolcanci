"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const index_1 = require("./index");
function main() {
    const intro = (0, index_1.div)("welcome to tolcanci, a UI framework");
    const temp = (0, index_1.div)("I am a reusable component");
    const comps = (0, index_1.div)("we allow for reusablwe components", temp, temp);
    const b = (0, index_1.button)("press me to increment cout");
    const displayCount = (count) => (0, index_1.p)("the count is", count.toString());
    const counterExample = (0, index_1.div)(b, displayCount).vname("counterExample");
    counterExample.setState(0);
    b.addEventListener("click", () => {
        counterExample.setState(counterExample.state + 1);
    });
    const state = (0, index_1.div)("we allow for stateful components", counterExample);
    const main = (0, index_1.div)(intro, comps, state);
    const app = (0, index_1.makeApplication)(main);
    fs_1.default.writeFileSync("./example.html", app);
}
main();
