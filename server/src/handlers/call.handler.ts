import { SocketCallEvents, SocketEvents, TMatchFound, TSocketMatchRequest, CallMatchEvents } from "@shared/sockets/socketEvents.type";
import { makeId } from "lib/IdGen";
import { redis } from "lib/redis";
import { User } from "models/User.model";
import { Server, Socket } from "socket.io";
import { TUser } from "types/models/user.type";

export enum CallMatchKeys {
    INDIVIDUAL_QUEUE = "call-matchmakingIndividualQueue",
    GROUP_QUEUE = "call-matchmakingGroupQueue",
    ROOM_MAP = "call-roomMap:",
    LOCK_USER = "lock",
    PEER_MAP = "peer-id:"
}

const getRoomId = async (userId: string): Promise<string | null> => {
    const key = `${CallMatchKeys.ROOM_MAP}${userId}`;
    return await redis.get(key);
};

const leaveQueue = async (userId: string): Promise<void> => {
    await redis.lRem(CallMatchKeys.INDIVIDUAL_QUEUE, 1, userId);
    await redis.lRem(CallMatchKeys.GROUP_QUEUE, 1, userId);
};

const lockUser = async (userId: string): Promise<boolean> => {
    return !(await redis.set(`${CallMatchKeys.LOCK_USER}${userId}`, "locked", {
        EX: 10,
        NX: true
    }));
};

const setPeerId = async (userId: string, peerId: string): Promise<void> => {
    await redis.set(`${CallMatchKeys.PEER_MAP}${userId}`, peerId);
};

const getPeerId = async (userId: string): Promise<string | null> => {
    return await redis.get(`${CallMatchKeys.PEER_MAP}${userId}`);
};

const removePeerId = async(userId: string) => {
    await redis.del(`${CallMatchKeys.PEER_MAP}${userId}`);
}

const unlockUser = async (userId: string): Promise<number> => {
    return await redis.del(`${CallMatchKeys.LOCK_USER}${userId}`);
};

export const callMatchHandler = (io: Server<CallMatchEvents.TClientToServer, CallMatchEvents.TServerToClients>, socket: Socket): void => {
    const userId = (socket as any).user_id as string;

    const joinRoom = async (members: string[], roomId: string): Promise<void> => {
        for (const memberId of members) {
            io.in(memberId).socketsJoin(roomId);
            await redis.set(`${CallMatchKeys.ROOM_MAP}${memberId}`, roomId);
        }
    };

    const leaveRoom = async (userId: string, roomId: string): Promise<void> => {
        socket.leave(roomId);
        await redis.del(`${CallMatchKeys.ROOM_MAP}${userId}`);
    };

    const handleIndividual = async (): Promise<void> => {
        const matchUserId = await redis.rPop(CallMatchKeys.INDIVIDUAL_QUEUE);
        if (!matchUserId && matchUserId !== userId) {
            await redis.lPush(CallMatchKeys.INDIVIDUAL_QUEUE, userId);
            return;
        }
        


        const isLocked = await lockUser(matchUserId);
        if (isLocked) {
            console.log("User Locked");
            handleIndividual()
            return;
        }

        const matchUser = await User.aggregate<TUser & { peer_id: string }>([
            { $match: { user_id: matchUserId } },
            { $project: { password: 0, email: 0 } }
        ]);

        const currentUser = await User.aggregate<TUser & { peer_id: string }>([
            { $match: { user_id: userId } },
            { $project: { password: 0, email: 0 } }
        ]);

        if (!currentUser || matchUser.length === 0) return;

        const myPeerId = await getPeerId(userId);
        const matchPeerId = await getPeerId(matchUser[0].user_id);

        if (!myPeerId || !matchPeerId) return;

        matchUser[0].peer_id = matchPeerId;
        currentUser[0].peer_id = myPeerId;
        const roomId = makeId();

        await leaveQueue(userId);
        await leaveQueue(matchUserId);
        await joinRoom([userId, matchUserId], roomId);

        io.to(roomId).emit(SocketCallEvents.MATCH_FOUND, {
            users: [...currentUser, ...matchUser],
            room_id: roomId
        });
        await unlockUser(matchUserId);
    };

    const handleGroup = async (): Promise<void> => {
        const GROUP_MEMBERS_LIMIT = 3;
        const matchUserIds = await redis.lRange(CallMatchKeys.GROUP_QUEUE, 0, GROUP_MEMBERS_LIMIT - 1);

        if (matchUserIds.length < GROUP_MEMBERS_LIMIT - 1) {
            await redis.lPush(CallMatchKeys.GROUP_QUEUE, userId);
            return;
        }

        for (const id of matchUserIds) {
            const isLocked = await lockUser(id);
            if (isLocked) {
                handleGroup();
                console.log("User Locked");
                return;
            }
        }

        const users = await User.aggregate<TUser & { peer_id: string }>([
            { $match: { user_id: { $in: [userId, ...matchUserIds] } } },
            { $project: { password: 0, email: 0 } }
        ]);


        if (users.length <= 1) return;

        const roomId = makeId();
        await joinRoom([...matchUserIds, userId], roomId);

        for (const user of users) {
            user.peer_id = await getPeerId(user.user_id) || "";
        }

        await leaveQueue(userId);
        io.to(roomId).emit(SocketCallEvents.MATCH_FOUND, {users, room_id: roomId});

        for (const id of matchUserIds) {
            await leaveQueue(id);
        }
    };

    const handleMatchFind = async (data: TSocketMatchRequest): Promise<void> => {
        try {
            const roomId = await getRoomId(userId);
            if (roomId) await leaveRoom(userId, roomId);
            await leaveQueue(userId);
            if (data.type === "individual") {
                await handleIndividual();
            } else {
                await handleGroup();
            }
        } catch (error) {
            console.error("Error handling match find:", error);
        }
    };

    const handleCancel = async (): Promise<void> => {
        try {
            await leaveQueue(userId);
            await unlockUser(userId);
            
            const roomId = await getRoomId(userId);
            if (!roomId) return;

            await leaveRoom(userId, roomId);
            const user = await User.findOne({ user_id: userId });
            if (!user) return;

            io.to(roomId).emit(SocketCallEvents.MATCH_CANCEL, { user_id: userId, username: user.toJSON().username });
        } catch (error) {
            console.error("Error handling cancel:", error);
        }
    };

    const handlePeerJoin = async (peerId: string): Promise<void> => {
        try {
            if (!peerId) return;
            await setPeerId(userId, peerId);
        } catch (error) {
            console.error("Error handling peer join:", error);
        }
    };

    socket.on(SocketCallEvents.MATCH_FIND, handleMatchFind);
    socket.on(SocketCallEvents.PEER_ID, handlePeerJoin);
    socket.on(SocketCallEvents.MATCH_CANCEL, handleCancel);
    socket.on(SocketEvents.DISCONNECT, handleCancel);
    socket.on(SocketCallEvents.MATCH_FIND_CANCEL, handleCancel);

    socket.on(SocketEvents.DISCONNECT, async()=>{
        await removePeerId(userId)
    })
};
