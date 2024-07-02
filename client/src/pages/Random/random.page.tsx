import CustomButton from "@/components/Buttons/Button.component";
import { ContainerForHeader } from "@/components/Container/Container.component";
import Header, { HeaderHeading } from "@/components/Header/Header.component";
import GroupImage from "@/assets/groupils.jpg";
import IndieImage from "@/assets/individualils.webp";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store.redux";
import { cancelFind, changeType, findMatch } from "@/redux/featuers/random.slice";
import { useSocket } from "@/Contexts/socket.context";
import { SocketEvents } from "@shared/sockets/socketEvents.type"
import { useEffect } from "react";
import FindingMatchPage from "./finding.page";
const GROUP_TEXT = "Group mode allows you to find random matches of 5 people. You can also add members of the group as friend";
const INDIVIDUAL_TEXT = "Individual mode allows you to find a random match. You can also add the match as friend";
export default function RandomPage(){
    const {status, type} = useSelector((state: RootState)=>state.randomChat);
    const dispatch = useDispatch<AppDispatch>();
    const socket = useSocket();
    const onFind = () => {
        if(!socket) return;
        dispatch(findMatch());
        socket.emit(SocketEvents.MATCH_FIND, {type});
    }
    const handleFound = (data: any) => {
        console.log(data);
    }

    useEffect(()=>{
        if(!socket) return;
        socket.on(SocketEvents.MATCH_FOUND, handleFound)
        return(()=>{
            socket.off(SocketEvents.MATCH_FOUND, handleFound)
        })
    }, [socket])
    if(status === "finding"){
        return(
            <FindingMatchPage />
        )
    }
    return(
        <>
            <Header>
                <div className="flex-1">
                    <HeaderHeading className="text-center">Random Match</HeaderHeading>
                </div>
            </Header>
            <ContainerForHeader className="p-sm space-y-2">
                <div className="flex">
                    <CustomButton colorVariant={type === "group"?"secondary":"transparent"} className="flex-1" onClick={()=>dispatch(changeType("group"))}>Group</CustomButton>
                    <CustomButton colorVariant={type === "individual"?"secondary":"transparent"} className="flex-1" onClick={()=>dispatch(changeType("individual"))}>Individual</CustomButton>
                </div>
                <div>
                    <img src = {type === "group"?GroupImage:IndieImage} />
                </div>
                <div className="space-y-8">
                    <h1 className="text-xl font-bold text-c_gray-800">{type === "group"?"Group Mode":"Individual Mode"}</h1>
                    <p className="text-c_gray-700 text-sm font-medium">
                        {type === "group"?GROUP_TEXT:INDIVIDUAL_TEXT}
                    </p>
                    <CustomButton className="w-full" onClick={onFind}>Find</CustomButton>
                </div>
               
                
            </ContainerForHeader>
        </>
    )
}