import { TUser } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RandomCallTypes, RandomChatTypes } from "@shared/types/random.type";

export interface TCallUser extends TUser {
    peer_id: string
}

interface MainState {
    type: RandomCallTypes,
    status: "idle"|"finding"|"found",
    match: TCallUser[],
    room_id: string|null
}



const initialState: MainState = {
    type: "individual",
    match: [],
    room_id: null,
    status: "idle"
}

const randomCallSlice = createSlice({
    name: "randomChat",
    initialState,
    reducers: {
        changeType: (state, action: PayloadAction<RandomCallTypes>) => {
            state.type = action.payload;
            state.match = []
        },
        findMatch: (state) => {
            if(state.status === "idle") {
                state.match = [];
                state.status = "finding";
            }
        },
        cancelMatch: (state) => {
            if(state.status === "found") {
                state.match = [];
                state.status = "idle";
            }
        },
        removeMember: (state, action: PayloadAction<string>) => {
            if(state.status === "found") {
                state.match = state.match.filter(x=>x.user_id !== action.payload);
                if(state.match.length <= 1){
                        state.match = [];
                        state.status = "idle";
                }
            }
        },
        setMatch: (state, action: PayloadAction<{users: TCallUser[], room_id: string}>) => {
            state.match = [];
            state.status = "found";
            state.match = action.payload.users
            state.room_id = action.payload.room_id
        },
        cancelFind: (state) => {
            if(state.status === "finding"){
                state.match = [];
                state.status = "idle"
            }
        }
    }
})

export default randomCallSlice.reducer;
export namespace RandomCallActions {
    export const {cancelMatch, changeType, findMatch, setMatch, cancelFind, removeMember} = randomCallSlice.actions;
}