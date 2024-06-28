import { loginUser, signupUser } from '@/api/auth.api';
import { TUser } from '@/types/user';
import { toastError } from '@/utils/toast.utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TLoginRequest, TSignupRequest } from '@shared/api/authApi.type';

const initialState: TReduxAsyncState<TUser|null> = {
    data: null,
    error: null,
    is_loading: false,
}

export const login = createAsyncThunk("user/login", async(data: TLoginRequest)=>{
    const res = await loginUser(data);
    return res;
})

export const signup = createAsyncThunk("user/signup", async(data: TSignupRequest)=>{
    const res = await signupUser(data);
    return res;
})

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //login
        builder.addCase(login.pending, (state)=>{
            state.is_loading = true;
        });
        builder.addCase(login.fulfilled, (state, action)=>{
            state.is_loading = false;
            const data = action.payload;
            const user = action.payload.data;
            state.error = data.error
            state.message = data.message;
            if(user) state.data = user;
            if(data.error){
                state.error = true;
                toastError(data.message);
            }
            
        });
        builder.addCase(login.rejected, (state)=>{
            state.is_loading = false;
            state.error = true;
        })
        //signup
        builder.addCase(signup.fulfilled, (state, action)=>{
            state.is_loading = false;
            const data = action.payload;
            state.message = data.message;
            state.error = data.error;
            state.data = data.data
            if(data.error) {
                toastError(data.message);
            }
        })
        builder.addCase(signup.pending, (state)=>{
            state.is_loading = true;
        })
        builder.addCase(signup.rejected, (state)=>{
            state.is_loading = false;
            state.error = true;
        })
    }
})

export default userSlice.reducer;

