import { TUser } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RandomChatTypes } from "@shared/types/random.type";
interface MainState {
    type: RandomChatTypes,
    status: "idle"|"finding"|"found",
    match: TUser[]
}


const initialState: MainState = {
    type: "individual",
    match: [],
    status: "idle"
}

const randomChatSlice = createSlice({
    name: "randomChat",
    initialState,
    reducers: {
        changeType: (state, action: PayloadAction<RandomChatTypes>) => {
            state.match = [];
            state.type = action.payload;
        },
        findMatch: (state) => {
            if(state.status === "idle") state.status = "finding";
        },
        cancelMatch: (state) => {
            if(state.status === "found") state.status = "idle";
        },
        setMatch: (state, action: PayloadAction<TUser[]>) => {
            state.status = "found";
            state.match = action.payload;
        }
    }
})

export default randomChatSlice.reducer;
export const {cancelMatch, changeType, findMatch, setMatch} = randomChatSlice.actions;