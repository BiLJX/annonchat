import { Server, Socket } from "socket.io";
import { MatchKeys } from "./match.handler";
import { redis } from "lib/redis";
import { TMessage } from "@shared/types/message.type"
import { User } from "models/User.model";
import { makeId } from "lib/IdGen";
import { SocketChatEvents, SocketEvents, TMessageSendRequest } from "@shared/sockets/socketEvents.type";
export const chatHandler = async (io: Server, socket: Socket) => {
    const user_id = socket.user_id;
    const onMessage = async ({room_id, message}: TMessageSendRequest) => {
        const room_key = MatchKeys.ROOM + room_id;
        const is_member = await redis.sIsMember(room_key, user_id);
        if(!is_member) return;
        const members = await redis.sMembers(room_key);
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
        }
        members.forEach(member_id=>{
            if(member_id === user_id) return;
            io.to(member_id).emit(SocketChatEvents.MESSAGE_SEND, messageData);
        })
    }
    socket.on(SocketChatEvents.MESSAGE_SEND, onMessage);
}