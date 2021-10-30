"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const index_1 = require("../src/index");
const https_1 = __importDefault(require("https"));
console.log("[INFO] example program initialized");
const intro = (0, index_1.div)("welcome to tolcanci, a UI framework");
const temp = (0, index_1.div)("I am a reusable component");
const comps = (0, index_1.div)("we allow for reusable components", temp, temp);
const b = (0, index_1.button)("press me");
const displayCount = (count) => (0, index_1.div)((0, index_1.div)(`the current count ${count}`), (0, index_1.div)(`the next count wil be ${count + 1}`)).setCss(`font-size: ${count + 10}px`);
const counterExample = (0, index_1.div)(displayCount, b);
counterExample.setStaticProps(async () => {
    return 12;
});
b.addEventListener("click", () => {
    counterExample.setState(counterExample.state + 1);
});
const getTodos = () => new Promise((resolve) => {
    https_1.default.get(`https://jsonplaceholder.typicode.com/todos/1`, res => {
        res.on('data', d => resolve(JSON.parse(d.toString())["title"]));
    });
});
const state = (0, index_1.div)("we allow for stateful components", counterExample);
const staticProps = (0, index_1.div)("this is a component with static props (generated at build time)", (string) => (0, index_1.div)(string))
    .setStaticProps(getTodos);
const style = (0, index_1.div)("I have style", (0, index_1.p)("and so do I")).setCss("color:red");
const links = (0, index_1.a)("we support using links").$href("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
const main = (0, index_1.div)(intro, comps, state, staticProps, style, links);
const routes = (0, index_1.router)({
    "": main,
    ":other": (0, index_1.div)("404 not found"),
    "someStuff": (0, index_1.div)("")
});
exports.app = (0, index_1.makeApplication)(routes);
