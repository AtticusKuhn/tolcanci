"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const example_1 = require("./example");
const fs_1 = __importDefault(require("fs"));
fs_1.default.writeFileSync("./example.html", example_1.app);