import { Route, Routes } from "react-router-dom"
import SignupPage from "../pages/Signup/signup.page"
import LoginPage from "../pages/Login/login.page"
import PfpUploadPage from "@/pages/PfpUpload/pfpupload.page"
import ProtectedRouter from "./ProtectedRouter"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store.redux"
import { getStatus } from "@/redux/featuers/user.slice"
import RandomChatPage from "@/pages/RandomChat/randomChat.page"
import RandomCallPage from "@/pages/RandomCall/randomCall.page"
import { toastError } from "@/utils/toast.utils"
import SocketContextProvider from "@/Contexts/socket.context"
import PeerContextProvider from "@/Contexts/peer.context"

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
            <PeerContextProvider>
                <Routes>
                    <Route element = {<ProtectedRouter />}>
                        <Route path="/" element={<RandomCallPage />} />
                        <Route path="/chat" element={<RandomChatPage />} />
                        {/* <Route path = "/call" element = {<CallPage />} /> */}
                    </Route>
                    <Route path = "/signup" element = {<SignupPage />} />
                    <Route path = "/login" element = {<LoginPage />} />
                    <Route path = "/upload/pfp" element = {<PfpUploadPage />} />
                </Routes>
            </PeerContextProvider>
            
        </SocketContextProvider>
        
    )
}

export default App
