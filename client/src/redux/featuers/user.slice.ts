import { loginUser, signupUser } from '@/api/auth.api';
import { uploadUserPfp } from '@/api/user.api';
import { TUser } from '@/types/user';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TLoginRequest, TSignupRequest } from '@shared/api/authApi.type';

const initialState: TReduxAsyncState<TUser|null> = {
    data: null,
    is_loading: false,
    error: false,
    message: ""    
}

export const login = createAsyncThunk("user/login", async(data: TLoginRequest)=>{
    const res = await loginUser(data);
    return res;
})

export const signup = createAsyncThunk("user/signup", async(data: TSignupRequest)=>{
    const res = await signupUser(data);
    return res;
})

export const uploadPfp = createAsyncThunk("user/upload/pfp", async(pfp: File)=>{
    const res = await uploadUserPfp(pfp);
    return res;
})

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //login
        builder.addCase(login.pending, (state)=>{
            state.is_loading = true
        });
        builder.addCase(login.fulfilled, (state, action)=>{
            state.is_loading = false
            const res = action.payload;
            const user = res.result;
            state.error = res.error
            state.message = res.message;
            if(user) state.data = user;
        });
        builder.addCase(login.rejected, (state)=>{
            state.is_loading = true;
            state.error = true;
            state.message = "Network request Error"
        })
        //signup
        builder.addCase(signup.fulfilled, (state, action)=>{
            state.is_loading = false;
            const data = action.payload;
            state.message = data.message;
            state.error = data.error;
            state.data = data.result;
            
        })
        builder.addCase(signup.pending, (state)=>{
            state.is_loading = true;
        })
        builder.addCase(signup.rejected, (state, action)=>{
            state.is_loading = false;
            state.error = true;
            state.message = "Network request Error"
        })
        //upload pfp
        builder.addCase(uploadPfp.pending, (state)=>{
            state.is_loading = true;
        })
        builder.addCase(uploadPfp.fulfilled, (state, action)=>{
            state.is_loading = false;
            const res = action.payload;
            state.message = res.message;
            if(state.data) state.data.pfp_url = res.result.pfp_url;
            state.error = res.error;
            state.message = res.message;
        })
        builder.addCase(uploadPfp.rejected, (state)=>{
            state.is_loading = false;
            state.error = true;
            state.message = "Network request Error"
        })
    }
})

export default userSlice.reducer;

