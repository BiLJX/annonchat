import { SocketEvents, TIndieMatchFound, TMatchFound, TSocketMatchRequest, TSocketRequest, TSocketResponseData } from "@shared/sockets/socketEvents.type";
import { makeId } from "lib/IdGen";
import { redis } from "lib/redis";
import { User } from "models/User.model";
import { Server, Socket } from "socket.io";

enum MatchKeys {
    INDVIDUAL_QUE = "matchmakingIndieQue",
    GROUP_QUE = "matchmakingGroupQue",
    INDIVIDAL_ROOM = "indieRoom:",
    ROOM_MAP = "roomMap:",
    LOCK_USER = "lock",
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

const lockUser = async(user_id: string) => {
    return !(await redis.set(MatchKeys.LOCK_USER+user_id, "locked", {
        EX: 10,
        NX: true
    }))
}

const unlockUser = async(user_id: string) => {
    await redis.del(MatchKeys.LOCK_USER+user_id);
}

const isUserLocked = async(user_id: string) => {
    const locked = await redis.get(MatchKeys.LOCK_USER+user_id)
    return !locked;
}



export const matchHandler = async(io: Server, socket: Socket) => {
    const user_id = socket.user_id;
    const handleIndividual = async() => {
        const match_user_id = await redis.rPop(MatchKeys.INDVIDUAL_QUE);
        //if no user found then stay in que
        if(!match_user_id){
            await redis.lPush(MatchKeys.INDVIDUAL_QUE, user_id);
            return;
        }
        //locking matched user for further processing
        const isLocked = await lockUser(match_user_id);
        if(isLocked) return console.log("User Locked");

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
        if(user.length === 0) return;
           

        const room_id = makeId();
        await leaveQue(user_id);
        await leaveQue(match_user_id);
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
        await unlockUser(match_user_id);
    }
    const handleGroup = async() => {
        const match_user_ids = await redis.lRange(MatchKeys.GROUP_QUE, 0, 4);
        if(match_user_ids.length < 4){
            await redis.lPush(MatchKeys.GROUP_QUE, user_id);
            return;
        }
        match_user_ids.forEach(async ids=>{
            await lockUser(ids);
            await leaveQue(ids);
        })
        const users = await User.aggregate([
            {
                $match: {
                    user_id: {
                        $in: match_user_ids
                    }
                }
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
        if(users.length === 0) return;
        const room_id = makeId();
        await leaveQue(user_id);
        match_user_ids.forEach(async x=>{
            await leaveQue(x);
        })
        await joinRoom([...match_user_ids, user_id], room_id);
        const res: TMatchFound = {
            users,
            room_id,
        }
        match_user_ids.forEach(async x=> {
            const res: TMatchFound = {
                users: users.filter(user_id=>user_id!==x),
                room_id
            }
            io.to(x).emit(SocketEvents.MATCH_FOUND, res);
        })
        socket.emit(SocketEvents.MATCH_FOUND, res);
    }

    socket.on(SocketEvents.MATCH_FIND, async(data: TSocketMatchRequest)=>{
        try {
            const room_id = await getRoomId(user_id);
            if (room_id) await leaveRoom(user_id, room_id);
            await leaveQue(user_id);
            if(data.type === "individual"){
                handleIndividual()
            }else{
                handleGroup()
            }
           
        } catch (error) {
            console.log(error);
        }
    })

    const handleCancel = async() => {
        try {
            const room_id = await getRoomId(user_id);
            await leaveQue(user_id);
            await unlockUser(user_id)
            if(!room_id) return;
            await leaveRoom(user_id, room_id);
        } catch (error) {
            console.log(error);
        }
    }

    socket.on(SocketEvents.MATCH_CANCEL, handleCancel)
    socket.on(SocketEvents.DISCONNECT, handleCancel)
    socket.on(SocketEvents.MATCH_FIND_CANCEL, handleCancel)
}