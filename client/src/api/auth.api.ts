import { TSignupRequest,TLoginRequest, TSignupResponse, TloginResponse } from "@shared/api/authApi.type";
import axios from "./axios";
import { TUser } from "@/types/user";
export const loginUser = async (data: TLoginRequest) => {
    const res = await axios.post("/api/auth/login", data);
    return res.data as ApiResponse<TUser>;
} 
export const signupUser = async (data: TSignupRequest): Promise<ApiResponse<TUser|null>> => {
    const res = await axios.post("/api/auth/signup", data);
    return res.data as ApiResponse<TUser>;
} 

export const getAuthStatus = async()=> {
    const res = await axios.get("/api/auth/status");
    return res.data as ApiResponse<TUser|null>
}