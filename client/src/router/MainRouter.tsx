import { Route, Routes } from "react-router-dom"
import SignupPage from "../pages/Signup/signup.page"
import LoginPage from "../pages/Login/login.page"
import PfpUploadPage from "@/pages/PfpUpload/pfpupload.page"
import ProtectedRouter from "./ProtectedRouter"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store.redux"
import { getStatus } from "@/redux/featuers/user.slice"
import RandomPage from "@/pages/Random/random.page"
import { toastError } from "@/utils/toast.utils"
import SocketContextProvider from "@/Contexts/socket.context"

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch<AppDispatch>();
    const [failed, setFailed] = useState(false);
    const fetchStatus = async() => {
        try{
            await dispatch(getStatus()).unwrap();
            setIsLoading(false);
        }catch(err){
            console.log(err);
            toastError("Something Went Wrong");
            setFailed(true)
        }
    }
    useEffect(()=>{
        fetchStatus()
    }, [dispatch])
    if(failed) return <>Error while connecting to server</>
    if(isLoading) return <>Loading...</>
    return (
        <SocketContextProvider>
            <Routes>
                <Route element = {<ProtectedRouter />}>
                    <Route path="/" element={<RandomPage />} />
                </Route>
                <Route path = "/signup" element = {<SignupPage />} />
                <Route path = "/login" element = {<LoginPage />} />
                <Route path = "/upload/pfp" element = {<PfpUploadPage />} />
            </Routes>
        </SocketContextProvider>
        
    )
}

export default App
