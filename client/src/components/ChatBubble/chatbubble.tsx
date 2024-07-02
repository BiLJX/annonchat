import { cn } from "@/utils/cn.utils"
import Avatar from "../Avatar/avatar.component"
import moment from "moment"


interface MainProps {
    message_id: string,
    text: string,
    time: Date,
    author_id: string,
    isMine?: boolean,
    isLast?: boolean,
    isFirst?: boolean,
    isSingle?: boolean,
    pfp?: string,

}

interface GroupChatProps extends MainProps {
    
    sender_name: string,
    type: "group"
}

interface SingleChatProps extends MainProps {
    type: "individual"
}
export default function ChatBubble(props: GroupChatProps | SingleChatProps) {
    let AvatarComp: JSX.Element = <div className="w-[40px]" />;
    let SenderNameComp: JSX.Element = <></>;
    if (!props.isMine) {
        if(props.isLast){
            AvatarComp = (
                <div className="flex flex-col justify-end">
                    <Avatar src={props.pfp || ""} size={40} />
                </div>
            )
        }else if(props.isFirst && props.type === "group"){
            SenderNameComp = (<div className="px-4 text-c_gray-500 font-medium">{props.sender_name}</div>)
        }
    }

    return (
        <div className={cn("flex space-x-2 mb-[2px]", {"justify-end": props.isMine, "mb-4": props.isLast})}>
            {AvatarComp}
            <div className="flex flex-col space-y-1">
                {SenderNameComp}
                <div className={cn(
                        "px-4 py-2 bg-c_gray-200 rounded-3xl text-c_gray-700 flex space-x-4",
                        {
                            "bg-c_blue-900": props.isMine,
                            "rounded-br-[0]":  props.isFirst,
                            "rounded-tr-[0]": props.isLast,
                            "rounded-r-[0]": !props.isLast && !props.isFirst,
                        }
                    )
                }>
                    <div className={cn("flex-1", {"text-white": props.isMine})}>{props.text}</div>
                    <div className={cn("flex flex-col justify-end text-c_gray-500 text-xs", {"text-gray-50": props.isMine})}>{moment(props.time).format("hh:mm a")}</div>
                </div>
            </div>
        </div>
    )
}