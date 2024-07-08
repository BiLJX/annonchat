import { TUser } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RandomChatTypes } from "@shared/types/random.type";


interface MainState {
    type: RandomChatTypes,
    status: "idle"|"finding"|"found",
    match: TUser[],
    room_id: string|null
}



const initialState: MainState = {
    type: "individual",
    match: [],
    room_id: null,
    status: "idle"
}

const randomChatSlice = createSlice({
    name: "randomChat",
    initialState,
    reducers: {
        changeType: (state, action: PayloadAction<RandomChatTypes>) => {
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
        setMatch: (state, action: PayloadAction<{users: TUser[], room_id: string}>) => {
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

export default randomChatSlice.reducer;
export const {cancelMatch, changeType, findMatch, setMatch, cancelFind, removeMember} = randomChatSlice.actions;