import CustomButton from "@/components/Buttons/Button.component";
import { HeaderContentWrapper } from "@/components/Container/Container.component";
import Header, { HeaderHeading } from "@/components/Header/Header.component";
import GroupImage from "@/assets/CallGroup.png";
import IndieImage from "@/assets/CallIndie.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store.redux";
import { changeType } from "@/redux/featuers/random.slice";

import FindingMatchPage from "../Finding/finding.page";
import BottomNav from "@/components/Nav/BottomNav.component";
import CallPage from "../Call/Call.page";
import useWebRtc from "@/hooks/rtc.hook";
const GROUP_TEXT = "Group mode allows you to find random matches of 3 people. You will then be able to video call with these users.";
const INDIVIDUAL_TEXT = "Individual mode allows you to find random match of a singe user. You will then be able to video call with the user.";
export default function RandomCallPage(){
    const {findCallMatch} = useWebRtc();
    const {status, type} = useSelector((state: RootState)=>state.randomCall);
    const dispatch = useDispatch<AppDispatch>();

    if(status === "finding"){
        return(
            <FindingMatchPage />
        )
    }
    if(status === "found"){
        return(
            <CallPage />
        )
    }
    return(
        <>
            <Header>
                <div className="flex-1">
                    <HeaderHeading className="text-center">Random Call</HeaderHeading>
                </div>
            </Header>
            <HeaderContentWrapper className="p-sm space-y-2" hasNav>
                <div className="flex">
                    <CustomButton colorVariant={type === "group"?"primary":"transparent"} className="flex-1" onClick={()=>dispatch(changeType("group"))}>Group</CustomButton>
                    <CustomButton colorVariant={type === "individual"?"primary":"transparent"} className="flex-1" onClick={()=>dispatch(changeType("individual"))}>Individual</CustomButton>
                </div>
                <div>
                    <img src = {type === "group"?GroupImage:IndieImage} />
                </div>
                <div className="space-y-8">
                    <h1 className="text-xl font-bold text-c_gray-800">{type === "group"?"Group Mode":"Individual Mode"}</h1>
                    <p className="text-c_gray-700 text-sm font-medium">
                        {type === "group"?GROUP_TEXT:INDIVIDUAL_TEXT}
                    </p>
                    <CustomButton colorVariant="secondary" className="w-full" onClick={findCallMatch}>Start Calling</CustomButton>
                </div>
            </HeaderContentWrapper>
            <BottomNav />
        </>
    )
}