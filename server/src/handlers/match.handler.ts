import { SocketEvents, TIndieMatchFound, TMatchFound, TSocketMatchRequest, ChatMatchEvents} from "@shared/sockets/socketEvents.type";
import { makeId } from "lib/IdGen";
import { redis } from "lib/redis";
import { User } from "models/User.model";
import { Server, Socket } from "socket.io";

export enum MatchKeys {
    INDVIDUAL_QUE = "matchmakingIndieQue",
    GROUP_QUE = "matchmakingGroupQue",
    ROOM_MAP = "roomMap:",
    LOCK_USER = "lock",
}

const getRoomId = async(user_id: string) => {
    const key = MatchKeys.ROOM_MAP+user_id;
    return await redis.get(key);
}

const leaveQue = async(user_id: string) => {
    await redis.lRem(MatchKeys.INDVIDUAL_QUE, 1, user_id);
    await redis.lRem(MatchKeys.GROUP_QUE, 1, user_id);
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

export const matchHandler = async(io: Server<ChatMatchEvents.TClientToServer, ChatMatchEvents.TServerToClients>, socket: Socket<ChatMatchEvents.TClientToServer, ChatMatchEvents.TServerToClients>) => {
    const user_id = socket.user_id;
    
    const joinRoom = async(members: string[], room_id: string) => {
        for(let member_id of members){
            io.in(member_id).socketsJoin(room_id);
            await redis.set(MatchKeys.ROOM_MAP+member_id, room_id);
        }
    }
    const leaveRoom = async(user_id: string, room_id: string) => {
        socket.leave(room_id);
        const map_key = MatchKeys.ROOM_MAP+user_id
        await redis.del(map_key);
    }
    const handleIndividual = async() => {
        const match_user_id = await redis.rPop(MatchKeys.INDVIDUAL_QUE);
        //if no user found then stay in que
        if(!match_user_id && match_user_id !== user_id){
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
        
        //response
        const res: TMatchFound = {
            users: [...current_user, ...user],
            room_id
        }
        io.to(room_id).emit(SocketEvents.MATCH_FOUND, res);
        await unlockUser(match_user_id);
    }
    const handleGroup = async() => {
        const GROUP_MEMBERS_LIMIT = 3
        const match_user_ids = await redis.lRange(MatchKeys.GROUP_QUE, 0, GROUP_MEMBERS_LIMIT-1);
        if(match_user_ids.length < GROUP_MEMBERS_LIMIT-1){
            await redis.lPush(MatchKeys.GROUP_QUE, user_id);
            return;
        }
        for(const id of match_user_ids){
            const isLocked = await lockUser(id);
            if(isLocked){
                handleGroup();
                return console.log("User Locked")
            }
            
        }
        const users = await User.aggregate([
            {
                $match: {
                    user_id: {
                        $in: [user_id, ...match_user_ids]
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
        if(users.length === 0) return;
        const room_id = makeId();
        await joinRoom([...match_user_ids, user_id], room_id);
        const res: TMatchFound = {
            users,
            room_id,
        }
        await leaveQue(user_id);
        io.to(room_id).emit(SocketEvents.MATCH_FOUND, res)
        match_user_ids.forEach(async x=> {
            await leaveQue(x);
        })
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
            await leaveQue(user_id);
            await unlockUser(user_id)
            const room_id = await getRoomId(user_id);
            if(!room_id) return;
            await leaveRoom(user_id, room_id);
            const user = await User.findOne({user_id})
            if(!user) return;
            
            io.to(room_id).emit(SocketEvents.MATCH_CANCEL, {user_id, username: user.toJSON().username})
        } catch (error) {
            console.log(error);
        }
    }

    socket.on(SocketEvents.MATCH_CANCEL, handleCancel)
    socket.on(SocketEvents.DISCONNECT, handleCancel)
    socket.on(SocketEvents.MATCH_FIND_CANCEL, handleCancel)
}