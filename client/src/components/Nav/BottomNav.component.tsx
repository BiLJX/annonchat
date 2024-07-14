import { NavLink } from "react-router-dom";
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import { cn } from "@/utils/cn.utils";
export default function BottomNav(){
    return(
        <nav className="fixed bottom-0 left-0 flex w-full h-[var(--nav-height)] p-2 border-t-[1px] border-c_gray-200 bg-white">

            <NavLink className={({isActive})=>cn("flex flex-col flex-1 items-center text-c_gray-500 text-sm", {
                "text-c_blue-900": isActive
            })} to = "/">
                <CallRoundedIcon style={{fontSize: "30px"}}/>
                <div>Call</div>
            </NavLink>

            <NavLink className={({isActive})=>cn("flex flex-col flex-1 items-center text-c_gray-500 text-sm", {
                "text-c_blue-900": isActive
            })} to = "/chat">
                <ForumRoundedIcon style={{fontSize: "30px"}}/>
                <div>Chat</div>
            </NavLink>
        </nav>
    )
}