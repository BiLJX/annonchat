"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeId = void 0;
function makeId() {
    return (Math.floor(Math.random() * Math.pow(10, 15))).toString(16);
}
exports.makeId = makeId;
