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