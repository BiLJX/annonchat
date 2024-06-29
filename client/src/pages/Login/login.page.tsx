import { NavLink, useNavigate } from "react-router-dom";
import CustomButton from "@/components/Buttons/Button.component";
import AuthFooter from "@/components/Auth/Footer.component";
import AuthHeader from "@/components/Auth/Header.component";
import AuthInput from "@/components/Input/AuthInput.component";
import { useEffect, useState } from "react";
import { login, signup } from "@/redux/featuers/user.slice";
import { AppDispatch, RootState } from "@/redux/store.redux";
import { TLoginRequest, TSignupRequest } from "@shared/api/authApi.type";
import { useSelector, useDispatch } from "react-redux";
import { toastError } from "@/utils/toast.utils";

export default function LoginPage(){
    const {is_loading} = useSelector((state: RootState)=>state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [data, setData] = useState<TLoginRequest>({
        password: "",
        username: "",
    })
    const handleSubmit = (e: any)=>{
        e.preventDefault();
        dispatch(login(data))
        .unwrap()
        .then((payload)=>{
            if(payload.error) return toastError(payload.message)
            navigate("/")
        });
    }
    return(
        <div className="p-md w-screen h-screen flex flex-col pb-8">
           <AuthHeader />
            <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
                <div className="text-c_gray-800 font-medium text-lg">Login to your account</div>
                <AuthInput placeholder="Username" onChange={(e)=>setData({...data, username: e.target.value})} />
                <AuthInput placeholder="Password" type = "password" onChange={(e)=>setData({...data, password: e.target.value})} />
                <div className="text-sm text-c_gray-600 font-medium">Forgot password? <NavLink className="text-c_blue-500" to = "/forgot">Click Here</NavLink></div>
                <CustomButton disabled = {is_loading} colorVariant="primary">{is_loading?"Loading...":"Login"}</CustomButton>
                <div className="text-center text-sm text-c_gray-500">Don't have an account? <NavLink className="text-c_blue-500" to = "/signup">Signup</NavLink></div>
            </form>
           <AuthFooter />
        </div>
    )
}