import { RandomChatTypes } from "@shared/types/random.type"
import { TUser } from "@shared/types/user.type"
export enum SocketEvents {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    MATCH_FIND = "match find",
    MATCH_FIND_CANCEL = "match find cancel",
    MATCH_FOUND = "match found",
    MATCH_CANCEL = "cancel match",
    CHAT_MESSAGE = 'chat message',
    NOTIFICATION = 'notification'
}

export enum SocketChatEvents {
    MESSAGE_SEND = "message send"
}

export enum SocketCallEvents {
    PEER_ID = "peer-id",
    MATCH_FIND = "call-match:find",
    MATCH_FIND_CANCEL = "call-match:find-cancel",
    MATCH_FOUND = "call-match:found",
    MATCH_CANCEL = "call-cancel:match",
}

export namespace ChatMatchEvents {
    export interface TServerToClients {
        //[SocketEvents.MATCH_FIND]: (res: TMatchFound)=>void
        [SocketEvents.MATCH_FOUND]: (res: TMatchFound)=>void;
        [SocketEvents.MATCH_CANCEL]: (data: {user_id: string, username: string})=>void;
    }
    
    export interface TClientToServer {
        [SocketEvents.MATCH_CANCEL]: ()=>void;
        [SocketEvents.MATCH_FIND]: (data: TSocketMatchRequest)=>void;
        [SocketEvents.MATCH_CANCEL]: ()=>void;
        [SocketEvents.MATCH_FIND_CANCEL]: ()=>void;
    }
}

export namespace CallMatchEvents {
    export interface TServerToClients {
        //[SocketEvents.MATCH_FIND]: (res: TMatchFound)=>void
        [SocketCallEvents.MATCH_FOUND]: (res: {users: (TUser & {peer_id: string})[], room_id: string})=>void;
        [SocketCallEvents.MATCH_CANCEL]: (data: {user_id: string, username: string})=>void;
    }
    
    export interface TClientToServer {
        [SocketCallEvents.MATCH_CANCEL]: ()=>void;
        [SocketCallEvents.MATCH_FIND]: (data: TSocketMatchRequest)=>void;
        [SocketCallEvents.MATCH_CANCEL]: ()=>void;
        [SocketCallEvents.MATCH_FIND_CANCEL]: ()=>void;
        [SocketCallEvents.PEER_ID]: (peer_id: string)=>void;
    }
}








export interface TSocketResponse<T>{
    result: T,
    error: boolean,
    message?: string
}

export interface TSocketRequest<T>{
    payload: T
}

export interface TSocketMatchRequest {
    type: RandomChatTypes
}

export interface TSocketResponseData<T>{
    payload: T,
    error: boolean,
    message: string
}

export interface TIndieMatchFound {
    user: TUser[],
    room_id: string
}

export interface TMatchFound {
    users: TUser[],
    room_id: string
}

interface TMessageSendRequestMain {
    room_id: string, 
    message: string,
    message_id: string 
}

interface TMessageSendRequestRandom extends TMessageSendRequestMain {
    is_random_room: true
    room_type: "individual"|"group"
}

interface TMessageSendRequestDM extends TMessageSendRequestMain {
    is_random_room: false
}

export type TMessageSendRequest = TMessageSendRequestRandom | TMessageSendRequestDM;