"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const index_1 = require("./index");
const https_1 = __importDefault(require("https"));
const intro = (0, index_1.div)("welcome to tolcanci, a UI framework");
const temp = (0, index_1.div)("I am a reusable component");
const comps = (0, index_1.div)("we allow for reusable components", temp, temp);
const b = (0, index_1.button)("press me");
const displayCount = (count) => (0, index_1.div)((0, index_1.div)(`the current count ${count}`), (0, index_1.div)(`the next count wil be ${count + 1}`));
const counterExample = (0, index_1.div)(displayCount, b);
counterExample.setState(1);
b.addEventListener("click", () => {
    counterExample.setState(counterExample.state + 1);
});
const getTodos = () => new Promise((resolve) => {
    https_1.default.get(`https://jsonplaceholder.typicode.com/todos/1`, res => {
        res.on('data', d => resolve(d.toString()));
    });
});
const state = (0, index_1.div)("we allow for stateful components", counterExample);
const staticProps = (0, index_1.div)("this is a component with static props (generated at build time)", (string) => (0, index_1.div)(string))
    .setStaticProps(getTodos);
const main = (0, index_1.div)(intro, comps, state, staticProps);
exports.app = (0, index_1.makeApplication)(main);
