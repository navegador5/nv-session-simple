#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

let src = fs.readFileSync(path.join(__dirname,"../browser","browser.js")).toString();

console.log(src)



