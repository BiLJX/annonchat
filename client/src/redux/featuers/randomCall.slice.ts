import { TUser } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RandomCallTypes } from "@shared/types/random.type";
import { MediaConnection } from "peerjs";

export interface TCallUser extends TUser {
    peer_id: string
}

interface MainState {
    type: RandomCallTypes,
    status: "idle"|"finding"|"found"|"error",
    match: TCallUser[],
    connections: MediaConnection[],
    userStreams: MediaStream[],
    room_id: string|null
}



const initialState: MainState = {
    type: "individual",
    match: [],
    room_id: null,
    connections: [],
    userStreams: [],
    status: "idle"
}

const randomCallSlice = createSlice({
    name: "randomChat",
    initialState,
    reducers: {
        changeType: (state, action: PayloadAction<RandomCallTypes>) => {
            if(state.status === "error") return; 
            state.type = action.payload;
            state.match = [];
            state.userStreams = [];
            state.connections = [];
        },
        handleError: (state) => {
            state.status = "error";
        },
        findMatch: (state) => {
            if(state.status === "error") return; 
            if(state.status === "idle") {
                state.userStreams = [];
                state.connections = [];
                state.match = [];
                state.status = "finding";
            }
        },
        cancelMatch: (state) => {
            if(state.status === "error") return; 
            if(state.status === "found") {
                state.userStreams = [];
                state.connections = [];
                state.match = [];
                state.status = "idle";
            }
        },
        removeMember: (state, action: PayloadAction<string>) => {
            if(state.status === "error") return; 
            if(state.status === "found") {
                state.match = state.match.filter(x=>x.user_id !== action.payload);
                if(state.match.length <= 1){
                        state.match = [];
                        state.status = "idle";
                }
            }
        },
        setMatch: (state, action: PayloadAction<{users: TCallUser[], room_id: string}>) => {
            if(state.status === "error") return; 
            state.match = [];
            state.status = "found";
            state.match = action.payload.users
            state.room_id = action.payload.room_id
        },
        addStream: (state, action: PayloadAction<MediaStream>) => {
            if(state.status === "error") return; 
            state.userStreams.push(action.payload);
        },
        addConnection: (state, action: PayloadAction<MediaConnection>) => {
            if(state.status === "error") return; 
            state.connections.push(action.payload);
        },
        cancelFind: (state) => {
            if(state.status === "error") return; 
            if(state.status === "finding"){
                state.userStreams = [];
                state.connections = [];
                state.match = [];
                state.status = "idle"
            }
        }
    }
})

export default randomCallSlice.reducer;
export namespace RandomCallActions {
    export const {cancelMatch, changeType, findMatch, setMatch, cancelFind, removeMember, addStream, addConnection, handleError} = randomCallSlice.actions;
}