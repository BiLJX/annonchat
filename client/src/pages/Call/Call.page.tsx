import CustomButton from "@/components/Buttons/Button.component";
import { HeaderContentWrapper } from "@/components/Container/Container.component";
import Header, { HeaderHeading } from "@/components/Header/Header.component";
import { useSocket } from "@/Contexts/socket.context";
import useWebRtc from "@/hooks/rtc.hook";
import { RandomCallActions } from "@/redux/featuers/randomCall.slice";
import { toastError } from "@/utils/toast.utils";
import { CallMatchEvents, SocketCallEvents } from "@shared/sockets/socketEvents.type";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";
import terminal from "virtual:terminal";

export default function CallPage(){
    const { myStream } = useWebRtc();
    const myVideoRef = useRef<HTMLVideoElement>(null);
    const socket = useSocket() as Socket<CallMatchEvents.TServerToClients, CallMatchEvents.TClientToServer> | null;
    const dispatch = useDispatch();

    useEffect(()=>{
        if(!myVideoRef.current || !myStream) return;
        myVideoRef.current.srcObject = myStream;
        myVideoRef.current.muted = true;
        myVideoRef.current.play();
    } ,[myVideoRef, myStream])

    const cancel = () => {
        if(!socket) return;
        socket.emit(SocketCallEvents.MATCH_CANCEL);
        dispatch(RandomCallActions.cancelMatch());
    }

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
            <Header>
                <div className="flex-1">
                    <HeaderHeading className="text-center">Call</HeaderHeading>
                </div>
            </Header>
            <HeaderContentWrapper className="flex flex-col min-h-full w-full" outerClassName="h-[100svh]">
                <div className="grid grid-cols-2 grid-rows-2 flex-1">
                    <div className="bg-c_gray-500">
                        <video className="h-full object-cover" ref = {myVideoRef} />
                    </div>
                    <div className="bg-c_gray-500" />
                    <div className="bg-c_gray-500" />
                    <div className="bg-c_gray-500" />
                </div>
                <div className="p-sm">
                    <CustomButton colorVariant="secondary" className="w-full" onClick={cancel}>End Call</CustomButton>
                </div>
            </HeaderContentWrapper>
        </>
    )
}

