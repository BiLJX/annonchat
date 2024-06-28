import { NavLink } from "react-router-dom";
import CustomButton from "@/components/Buttons/Button.component";
import AuthInput from "@/components/Input/AuthInput.component";
import AuthHeader from "@/components/Auth/Header.component";
import AuthFooter from "@/components/Auth/Footer.component";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store.redux";
import { useEffect, useState } from "react";
import { TSignupRequest } from "@shared/api/authApi.type";
import { signup } from "@/redux/featuers/user.slice";

export default function SignupPage(){
    const {data: user, error, is_loading, message} = useSelector((state: RootState)=>state.user);
    const dispatch = useDispatch<AppDispatch>();
    const [data, setData] = useState<TSignupRequest>({
        bio: "",
        email: "",
        password: "",
        username: "",
    })
    const handleSubmit = (e: any)=>{
        e.preventDefault();
        dispatch(signup(data));
    }
    useEffect(()=>{
        console.log(user);
    }, [user])
    return(
        <div className="p-lg w-screen h-screen flex flex-col pb-8">
            <AuthHeader />
            <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
                <div className="text-c_gray-800 font-medium text-lg">Create your account</div>
                <AuthInput placeholder="Username" onChange={(e)=>setData({...data, username: e.target.value})} />
                <AuthInput placeholder="Email" type = "email"  onChange={(e)=>setData({...data, email: e.target.value})} />
                <AuthInput placeholder="Password" type = "password"  onChange={(e)=>setData({...data, password: e.target.value})} />
                <CustomButton disabled = {is_loading} colorVariant="primary">{is_loading?"Loading...":"Register"}</CustomButton>
                <div className="text-center text-sm text-c_gray-500">Already have an account? <NavLink className="text-c_blue-500" to = "/login">Login</NavLink></div>
            </form>
           <AuthFooter />
        </div>
    )
}