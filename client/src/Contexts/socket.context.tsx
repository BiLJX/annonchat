import { URI } from "@/api/axios";
import useAuth from "@/hooks/auth.hook";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client"
import Cookies from "js-cookie"
let temp: any;
const SocketContext = createContext<Socket|null>(temp);
export default function SocketContextProvider({children}: {children: any}){
    const { currentUser } = useAuth();
    const [socket, setSocket] = useState<Socket|null>();
    useEffect(()=>{
        if(!currentUser) return;
        setSocket(io(URI, {
            query: {
                token: Cookies.get("session")
            }
        }))
        return (() => {
            socket?.disconnect();
        })
    }, [currentUser])
    return(
        <SocketContext.Provider value={socket as Socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext);