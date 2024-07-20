import { HeaderContentWrapper } from "@/components/Container/Container.component";
import Header, { HeaderHeading } from "@/components/Header/Header.component";
import { useSocket } from "@/Contexts/socket.context";
import useWebRtc from "@/hooks/rtc.hook";
import { RandomCallActions } from "@/redux/featuers/randomCall.slice";
import { RootState } from "@/redux/store.redux";
import { toastError } from "@/utils/toast.utils";
import { CallMatchEvents, SocketCallEvents } from "@shared/sockets/socketEvents.type";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { cn } from "@/utils/cn.utils";
import useAuth from "@/hooks/auth.hook";


export default function CallPage(){
    const { myStream, leaveCall } = useWebRtc();
    const {match, type} =useSelector((state: RootState)=>state.randomCall);
    const myVideoRef = useRef<HTMLVideoElement>(null);
    const socket = useSocket() as Socket<CallMatchEvents.TServerToClients, CallMatchEvents.TClientToServer> | null;
    const { currentUser } = useAuth();
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
                <div className="bg-c_gray-500 overflow-hidden">
                    <video playsInline controls={false} className="h-full object-cover w-full" ref = {myVideoRef} muted/>
                </div>
                    {
                        match.map((user, i)=>{
                            if(user.user_id === currentUser?.user_id) return <></>
                            return (
                                <div className="overflow-hidden">
                                    <video playsInline controls={false} className="h-full object-cover w-full" key = {i} ref={(el)=>{if(el && user.stream)el.srcObject=user.stream; el?.play()}} />
                                </div>
                            )
                        })
                    }
                </div>
            </HeaderContentWrapper>
        </>
    )
}

