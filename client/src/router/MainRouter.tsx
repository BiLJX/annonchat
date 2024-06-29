import { Route, Routes } from "react-router-dom"
import SignupPage from "../pages/Signup/signup.page"
import LoginPage from "../pages/Login/login.page"
import PfpUploadPage from "@/pages/PfpUpload/pfpupload.page"
import ProtectedRouter from "./ProtectedRouter"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store.redux"
import useAuth from "@/hooks/auth.hook"
import { getStatus } from "@/redux/featuers/user.slice"


function App() {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch<AppDispatch>();
    const fetchStatus = async() => {
        await dispatch(getStatus());
        setIsLoading(false)
    }
    useEffect(()=>{
        fetchStatus()
    }, [dispatch])
    if(isLoading) return <>Loading...</>
    return (
        <Routes>
            <Route element = {<ProtectedRouter />}>
                <Route path="/" element={<>Hey</>} />
            </Route>
            <Route path = "/signup" element = {<SignupPage />} />
            <Route path = "/login" element = {<LoginPage />} />
            <Route path = "/upload/pfp" element = {<PfpUploadPage />} />
        </Routes>
    )
}

export default App
