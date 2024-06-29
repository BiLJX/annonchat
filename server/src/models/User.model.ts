import { makeId } from "lib/IdGen";
import { Schema, model } from "mongoose";
import { TUser } from "types/models/user.type";

const schema = new Schema<TUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    user_id: {
        type: String,
        required: true,
        unique: true,
        default: ()=>makeId()
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
}, {timestamps: true})

export const User = model("User", schema);