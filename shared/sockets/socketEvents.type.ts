import { RandomChatTypes } from "@shared/types/random.type"
import { TUser } from "types/models/user.type"
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