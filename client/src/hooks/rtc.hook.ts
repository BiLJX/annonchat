import { useSocket } from "@/Contexts/socket.context";
import { AppDispatch } from "@/redux/store.redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import terminal from "virtual:terminal";
export default function useWebRtc(){
    const [myStream, setMyStream] = useState<MediaStream>();
    const dispatch = useDispatch<AppDispatch>()
    const socket = useSocket();
    const findCallMatch = () => {
        if(!socket) return;

    }
    useEffect(()=>{
        try {
            const navigator = window.navigator as any;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if(!navigator.getUserMedia) return;
            navigator.getUserMedia({video: true, audio: false}, setMyStream, terminal.log)
        } catch (error) {
            terminal.log(error)
        }
    } ,[])
    return {myStream}
}