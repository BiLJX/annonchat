import { Schema, model } from "mongoose";
import { TMessageModel } from "types/models/message.type";

const schema = new Schema<TMessageModel>({
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
}, {timestamps: true});

export const Message = model("Message", schema);


