import { usePeer } from "@/Contexts/peer.context";
import { useSocket } from "@/Contexts/socket.context";
import { RandomCallActions, TCallUser } from "@/redux/featuers/randomCall.slice";
import { AppDispatch, RootState } from "@/redux/store.redux";
import { SocketCallEvents } from "@shared/sockets/socketEvents.type";
import { MediaConnection } from "peerjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toastError } from "@/utils/toast.utils";

export default function useWebRtc() {
    const { type, match } = useSelector((state: RootState) => state.randomCall);
    const [myStream, setMyStream] = useState<MediaStream>();
    const peer = usePeer();
    const dispatch = useDispatch<AppDispatch>();
    const socket = useSocket();

    const findCallMatch = () => {
        if (!socket) return;
        dispatch(RandomCallActions.findMatch());
        socket.emit(SocketCallEvents.MATCH_FIND, { type });
    };

    const leaveCall = () => {
        if(!socket) return;
        socket.emit(SocketCallEvents.MATCH_CANCEL);
        const connections = match.map(x=>x.connection);
        connections.forEach(call=>{
            if(call) call.close();
        })
        dispatch(RandomCallActions.cancelMatch());
    }

    const handleFound = (data: { users: TCallUser[]; room_id: string }) => {
        console.log("Match found", data);
        if (!peer) return;
        if (!data.users) return;
        if (!myStream) return;
        //const peer_ids = data.users.map(x => (x.user_id !== currentUser?.user_id ? x.peer_id : null)).filter(Boolean);
        data.users.forEach(user => {
            const id = user.peer_id;
            if (id) {
                const call = peer.call(id, myStream);
                call.on("stream", stream => {
                    dispatch(RandomCallActions.addStream({stream, user_id: user.user_id}));
                });
                call.on("error", (error) => {
                    toastError("Unknown Error Occured");
                    console.log(error)
                });
            }
        });
        dispatch(RandomCallActions.setMatch(data));
    };

    const handleCall = (call: MediaConnection) => {
        console.log("Incoming call", call);
        const user = match.find(user=>user.peer_id===call.peer);
        if(!user) return;
        dispatch(RandomCallActions.addConnection({connection: call, user_id: user.user_id}));
        call.answer(myStream);
        call.on("stream", stream => {
            dispatch(RandomCallActions.addStream({stream, user_id: user.user_id}));
        });
        // call.on("stream", stream => {
           
        // });
        call.on("close", () => {
            console.log("Incoming call closed", call.peer);
        });
        call.on("error", (error) => {
            console.error("Incoming call error", error);
        });
    };

    useEffect(() => {
        if (!socket) return;
        if (!myStream) return;
        if(!peer) return;
        socket.on(SocketCallEvents.MATCH_FOUND, handleFound);
        peer.on("call", handleCall);
        return () => {
            socket.off(SocketCallEvents.MATCH_FOUND, handleFound);
            peer.off("call", handleCall);
        };
    }, [socket, myStream, peer]);

    //Setting my stream
    useEffect(() => {
        try {
            const navigator = window.navigator as any;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if (!navigator.getUserMedia) return;
            navigator.getUserMedia(
                { video: true, audio: true },
                (stream: MediaStream) => {
                    setMyStream(stream);
                },
                (error: any) => {
                    console.log(error);
                    dispatch(RandomCallActions.handleError());
                }
            );
        } catch (error) {
            console.error("Error in navigator.getUserMedia", error);
        }
    }, []);

    return { myStream, findCallMatch, leaveCall };
}