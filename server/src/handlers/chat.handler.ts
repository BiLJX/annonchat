import { Server, Socket } from "socket.io";
import { MatchKeys } from "./match.handler";
import { redis } from "lib/redis";
import { TMessage } from "@shared/types/message.type"
import { User } from "models/User.model";
import { makeId } from "lib/IdGen";
import { SocketChatEvents, SocketEvents, TMessageSendRequest } from "@shared/sockets/socketEvents.type";
export const chatHandler = async (io: Server, socket: Socket) => {
    const user_id = (socket as any).user_id;
    const onMessage = async ({room_id, message, message_id: old_msg_id}: TMessageSendRequest, cb: (message_data: TMessage, old_msg_id: string)=>void) => {
        const is_member = socket.rooms.has(room_id);
        if(!is_member) return;
        const author_data = (await User.aggregate([
            {
                $match: {user_id}
            },
            {
                $project: {
                    username: 1,
                    pfp_url: 1,
                    user_id: 1
                }
            }
        ]))[0];
        if(!author_data) return;
        const messageData: TMessage = {
            author_data,
            conversation_id: room_id,
            message,
            seen_by: [],
            message_id: makeId(),
            sent_on: new Date()
        }
        socket.to(room_id).emit(SocketChatEvents.MESSAGE_SEND, messageData);
        cb(messageData, old_msg_id);
    }
    socket.on(SocketChatEvents.MESSAGE_SEND, onMessage);
}