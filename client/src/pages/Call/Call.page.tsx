import CustomButton from "@/components/Buttons/Button.component";
import { HeaderContentWrapper } from "@/components/Container/Container.component";
import Header, { HeaderHeading } from "@/components/Header/Header.component";
import { useSocket } from "@/Contexts/socket.context";
import useWebRtc from "@/hooks/rtc.hook";
import { RandomCallActions } from "@/redux/featuers/randomCall.slice";
import { RootState } from "@/redux/store.redux";
import { toastError } from "@/utils/toast.utils";
import Video from "./5377684-uhd_2560_1440_25fps.mp4"
import { CallMatchEvents, SocketCallEvents } from "@shared/sockets/socketEvents.type";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { cn } from "@/utils/cn.utils";


export default function CallPage(){
    const { myStream, leaveCall } = useWebRtc();
    const {userStreams, type} =useSelector((state: RootState)=>state.randomCall);
    const myVideoRef = useRef<HTMLVideoElement>(null);
    const socket = useSocket() as Socket<CallMatchEvents.TServerToClients, CallMatchEvents.TClientToServer> | null;
    const dispatch = useDispatch();

    useEffect(()=>{
        if(!myVideoRef.current || !myStream) return;
        myVideoRef.current.srcObject = myStream;
        myVideoRef.current.muted = true;
        myVideoRef.current.play();
    } ,[myVideoRef, myStream])


    const onMemberLeave = ({user_id, username}: {user_id: string, username: string}) => {
        toastError(`${username} disconnected`);
        dispatch(RandomCallActions.removeMember(user_id));
    }

    useEffect(()=>{
        console.log(userStreams)
    }, [userStreams])

    useEffect(()=>{
        if(!socket) return;
        socket.on(SocketCallEvents.MATCH_CANCEL, onMemberLeave);
        return(()=>{
            socket.off(SocketCallEvents.MATCH_CANCEL, onMemberLeave);
        })
    }, [socket])
    return(
        <>
            <Header backButton onBack={leaveCall}>
                <div className="flex-1">
                    <HeaderHeading>Call</HeaderHeading>
                </div>
            </Header>
            <HeaderContentWrapper className="flex flex-col h-full w-full" outerClassName="h-[100svh]">
                <div className={cn("grid grid-cols-2 grid-rows-2 h-[100%]", {"grid-cols-1":type === "individual"})}>
                <div className="bg-c_gray-500">
                    <video playsInline controls={false} className="h-full object-cover" ref = {myVideoRef}/>
                </div>
                    {
                        userStreams.map((stream, i)=>{
                            return (
                                <div className="overflow-hidden">
                                    <video playsInline controls={false} className="h-full object-cover" key = {i} ref={(el)=>{if(el)el.srcObject=stream; el?.play()}} />
                                </div>
                            )
                        })
                    }
                </div>
            </HeaderContentWrapper>
        </>
    )
}

