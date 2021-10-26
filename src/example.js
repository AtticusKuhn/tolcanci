"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const index_1 = require("./index");
function main() {
    const a = (0, index_1.p)("my custom resuable component");
    const main = (0, index_1.div)("here are some reusable components:", a, a, a, a, a, a, a);
    const app = (0, index_1.makeApplication)(main);
    fs_1.default.writeFileSync("./example.html", app);
}
main();
