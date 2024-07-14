import { usePeer } from "@/Contexts/peer.context";
import { useSocket } from "@/Contexts/socket.context";
import { RandomCallActions, TCallUser } from "@/redux/featuers/randomCall.slice";
import { AppDispatch, RootState } from "@/redux/store.redux";
import { SocketCallEvents } from "@shared/sockets/socketEvents.type";
import { MediaConnection } from "peerjs";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import terminal from "virtual:terminal";
import useAuth from "./auth.hook";
export default function useWebRtc(){
    const {type} = useSelector((state: RootState)=>state.randomCall);
    const { currentUser } = useAuth();
    const [myStream, setMyStream] = useState<MediaStream>();
    const peer = usePeer();
    const [userStreams, setUserStreams] = useState<MediaStream[]>([]);
    const dispatch = useDispatch<AppDispatch>()
    const socket = useSocket();
    const findCallMatch = () => {
        if(!socket) return;
        dispatch(RandomCallActions.findMatch());
        socket.emit(SocketCallEvents.MATCH_FIND, {type});
    }
    const handleFound = (data: {users: TCallUser[], room_id: string}) => {
       
        if(!peer) return;
        if(!data.users) return;
        if(!myStream) return;
        const peer_ids = data.users.map(x=>{if(x.user_id !== currentUser?.user_id) return x.peer_id});
        peer_ids.forEach(id=>{
            if(id){
                const call = peer.call(id, myStream);
                call.on("stream", stream=>{
                    console.log(stream)
                    setUserStreams((userStreams)=>[...userStreams, stream]);
                })
            }
            
        })
        dispatch(RandomCallActions.setMatch(data));
    }
    const handleCall = (call: MediaConnection) => {
        call.answer(myStream)
        // call.on("stream", stream=>{
        //     setUserStreams((userStreams)=>[...userStreams, stream]);
        // })
    }
    useEffect(()=>{
        console.log(userStreams)
    }, [userStreams])
    useEffect(()=>{
        if(!socket) return;
        if(!myStream) return;
        socket.on(SocketCallEvents.MATCH_FOUND, handleFound);
        peer.on("call", handleCall);
        return(()=>{
            socket.off(SocketCallEvents.MATCH_FOUND, handleFound);
            peer.off("call", handleCall);
        })
    }, [socket, myStream])
    useEffect(()=>{
        try {
            const navigator = window.navigator as any;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if(!navigator.getUserMedia) return;
            navigator.getUserMedia({video: true, audio: false}, setMyStream, terminal.log)
            //navigator.getUserMedia({video: true, audio: false}, (stream: MediaStream)=>console.log(stream), terminal.log)
        } catch (error) {
            terminal.log(error)
        }
    } ,[])
    return {myStream, findCallMatch, userStreams}
}