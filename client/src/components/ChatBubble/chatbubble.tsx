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
    isDelivered?: boolean
    type: "group"|"individual",
    sender_name?: string,
}


export default function ChatBubble(props: MainProps) {
    let AvatarComp: JSX.Element = props.type === "individual"?<></>:<div className="w-[40px]" />;
    let SenderNameComp: JSX.Element = <></>;
    if (!props.isMine) {
        if(props.isSingle && props.type === "group" ){
            AvatarComp = (
                <div className="flex flex-col justify-end">
                    <Avatar src={props.pfp || ""} size={40} />
                </div>
            )
            SenderNameComp = (<div className="px-4 text-c_gray-500 font-medium">{props.sender_name}</div>)
        }
        else if(props.isLast  && props.type === "group"){
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
        <div className={cn("flex space-x-2 mb-[1px]", {"justify-end": props.isMine, "mb-4": props.isLast || props.isSingle})}>
            {AvatarComp}
            <div className="flex flex-col space-y-1">
                {SenderNameComp}
                <div className="flex space-x-4">
                    <div className={cn(
                            "px-4 py-2 bg-c_gray-200 rounded-3xl text-c_gray-700 flex space-x-4",
                            {
                                "bg-c_blue-900": props.isMine,
                                "rounded-br-[0]":  props.isMine && props.isFirst,
                                "rounded-tr-[0]": props.isMine && props.isLast,
                                "rounded-r-[0]": props.isMine && !props.isSingle && !props.isLast && !props.isFirst,

                                "rounded-bl-[0]":  !props.isMine && props.isFirst,
                                "rounded-tl-[0]": !props.isMine && props.isLast,
                                "rounded-l-[0]": !props.isMine && !props.isSingle && !props.isLast && !props.isFirst,

                                "bg-c_blue-500": !props.isDelivered
                            }
                        )
                    }>
                        <div className={cn("flex-1", {"text-white": props.isMine})}>{props.text}</div>
                        <div className={cn("flex flex-col justify-end text-c_gray-500 text-xs", {"text-gray-50": props.isMine})}>{moment(props.time).format("hh:mm a")}</div>
                    </div>
                    {!props.isDelivered && <div className="w-[10px] h-[10px] rounded-full bg-c_gray-200"/>}
                </div>
                
            </div>
        </div>
    )
}