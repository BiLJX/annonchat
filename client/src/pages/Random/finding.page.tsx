import { useSocket } from "@/Contexts/socket.context";
import CustomButton from "@/components/Buttons/Button.component";
import { ContainerForHeader } from "@/components/Container/Container.component";
import Header, { HeaderHeading } from "@/components/Header/Header.component";
import { cancelFind } from "@/redux/featuers/random.slice";
import { SocketEvents } from "@shared/sockets/socketEvents.type";
import { useDispatch } from "react-redux";

export default function FindingMatchPage(){
    const socket = useSocket();
    const dispatch = useDispatch();
    const handleCancel = (data: any) => {
        socket?.emit(SocketEvents.MATCH_FIND_CANCEL)
        dispatch(cancelFind());
    }
    return(
        <>
            <Header>
                <div className="flex-1">
                    <HeaderHeading className="text-center">Random Match</HeaderHeading>
                </div>
            </Header>
            <ContainerForHeader className="justify-center items-center h-full p-md space-y-8" outerClassName="w-screen h-screen">
                <h1 className="text-2xl font-semibold text-c_gray-700">Finding you a match...</h1>
                <p className="text-c_gray-700">You are in a que. Please wait while we find you a perfect match</p>
                <CustomButton className="w-full" onClick={handleCancel}>Cancel</CustomButton>
            </ContainerForHeader>
        </>
    )
}