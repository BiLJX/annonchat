import { SocketEvents, TIndieMatchFound, TSocketMatchRequest, TSocketRequest, TSocketResponseData } from "@shared/sockets/socketEvents.type";
import { makeId } from "lib/IdGen";
import { redis } from "lib/redis";
import { User } from "models/User.model";
import { Server, Socket } from "socket.io";

enum MatchKeys {
    INDVIDUAL_QUE = "matchmakingIndieQue",
    GROUP_QUE = "matchmakingGroupQue",
    INDIVIDAL_ROOM = "indieRoom:",
    ROOM_MAP = "roomMap:"
}



const leaveRoom = async(user_id: string, room_id: string) => {
    const key = MatchKeys.INDVIDUAL_QUE + room_id;
    const is_member = await redis.sIsMember(key, user_id);
    if(!is_member) return;
    await redis.sRem(key, user_id);
    const members = await redis.sMembers(key);
    if(members.length === 0){
        await redis.del(key);
    }
}

const joinRoom = async(members: string[], room_id: string) => {
    const key = MatchKeys.INDVIDUAL_QUE + room_id;
    await redis.sAdd(key, members);
    for(let member_id of members){
        await redis.set(MatchKeys.ROOM_MAP+member_id, room_id);
    }
}

const getRoomId = async(user_id: string) => {
    const key = MatchKeys.ROOM_MAP+user_id;
    return await redis.get(key);
}

const leaveQue = async(user_id: string) => {
    await redis.lRem(MatchKeys.INDVIDUAL_QUE, 1, user_id);
    await redis.lRem(MatchKeys.GROUP_QUE, 1, user_id);
}

const isUserInQue = async(user_id: string) => {
    const user_pos_i = await redis.lPos(MatchKeys.INDVIDUAL_QUE, user_id);
    const user_pos_g = await redis.lPos(MatchKeys.GROUP_QUE, user_id);
    if(user_pos_i || user_pos_g) return true;
    return false
}



export const matchHandler = async(io: Server, socket: Socket) => {
    const user_id = socket.user_id;

    socket.on(SocketEvents.MATCH_FIND, async(data: TSocketMatchRequest)=>{
        try {
            const room_id = await getRoomId(user_id);
            if(room_id) await leaveRoom(user_id, room_id);
            const is_in_que = await isUserInQue(user_id);
            if(is_in_que) await leaveQue(user_id);

            if(data.type === "individual"){
                const match_user_id = await redis.rPop(MatchKeys.INDVIDUAL_QUE);
                //if no user found then stay in que
                if(!match_user_id){
                    await redis.lPush(MatchKeys.INDVIDUAL_QUE, user_id);
                    return;
                }
                //if user found
                const user = await User.aggregate([
                    {
                        $match: {
                            user_id: match_user_id
                        },
                    },
                    {
                        $project: {
                            password: 0,
                            email: 0
                        }
                    }
                ]);
                const current_user = await User.aggregate([
                    {
                        $match: {
                            user_id
                        }
                    },
                    {
                        $project: {
                            password: 0,
                            email: 0
                        }
                    }
                ]);
                if(!current_user) return;
                if(!user) return;
                const room_id = makeId()
                await joinRoom([user_id, match_user_id], room_id);
                
                //response for current user
                const res1: TIndieMatchFound = {
                    user,
                    room_id
                }
                //response for found user
                const res2: TIndieMatchFound = {
                    user: current_user,
                    room_id
                }
                socket.emit(SocketEvents.MATCH_FOUND, res1);
                io.to(match_user_id).emit(SocketEvents.MATCH_FOUND, res2);
            }
        } catch (error) {
            console.log(error);
        }
    })

    socket.on(SocketEvents.MATCH_CANCEL, async(room_id: string)=>{
        try {
            if(!room_id) return;
            leaveRoom(user_id, room_id);
        } catch (error) {
            console.log(error);
        }
        
    })

    socket.on(SocketEvents.DISCONNECT, async()=>{
        try {
            const room_id = await getRoomId(user_id);
            if(!room_id) return;
            await leaveRoom(user_id, room_id);
            await leaveQue(user_id);
        } catch (error) {
            console.log(error);
        }
    })

    socket.on(SocketEvents.MATCH_FIND_CANCEL, async()=>{
        try {
            
            await leaveQue(user_id);
            const room_id = await getRoomId(user_id);
            if(!room_id) return;
            await leaveRoom(user_id, room_id);
        } catch (error) {
            console.log(error);
        }
    })
}