"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    message_id: {
        type: String,
        required: true,
        unique: true
    },
    conversation_id: {
        type: String,
        required: true,
    },
    author_id: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    seen_by: {
        type: [String],
        default: []
    }
}, { timestamps: true });
exports.Message = (0, mongoose_1.model)("Message", schema);
