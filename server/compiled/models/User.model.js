"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var IdGen_1 = require("lib/IdGen");
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    user_id: {
        type: String,
        required: true,
        unique: true,
        default: function () { return (0, IdGen_1.makeId)(); }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        default: ""
    },
    is_verified: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: true
    },
    pfp_url: {
        type: String,
        default: ""
    }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", schema);
