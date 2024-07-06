import Avatar from "@/components/Avatar/avatar.component";
import ChatBubble from "@/components/ChatBubble/chatbubble";
import { HeaderContentWrapper } from "@/components/Container/Container.component";
import Header, { HeaderHeading } from "@/components/Header/Header.component";
import { useEffect, useState } from "react";
import { TMessage } from "@shared/types/message.type"
import { useSocket } from "@/Contexts/socket.context";
import { SocketChatEvents, SocketEvents, TMessageSendRequest } from "@shared/sockets/socketEvents.type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store.redux";
import useAuth from "@/hooks/auth.hook";
import { ChatInput } from "@/components/ChatInput/chatInput.component";
import { toastError } from "@/utils/toast.utils";
import { cancelMatch } from "@/redux/featuers/random.slice";
import { makeId } from "@/utils/IdGen";

interface TMyMessage extends TMessage{
    is_delivered: boolean;
}

export default function ChatPage(){
    const { room_id, type, match } = useSelector((state: RootState)=>state.randomChat);
    const {currentUser} = useAuth();
    const [messages, setMessages] = useState<TMessage[]|TMyMessage[]>([]);
    const socket = useSocket();
    const dispatch = useDispatch<AppDispatch>();
    const onMessageDelivered = (message: TMessage, old_message_id: string)=>{
        if(message && old_message_id){
            setMessages((prevMessages)=>prevMessages.map(x=>{
                if(x.message_id === old_message_id){
                    const myMessage = x as TMyMessage;
                    myMessage.is_delivered = true;
                    return myMessage
                }
                return x;
            }))
        }
    }
    const sendMessage = (text: string) => {
        if(!socket || !room_id) return;
        const data: TMessageSendRequest = {
            room_type: type,
            is_random_room: true,
            message: text,
            room_id: room_id||"",
            message_id: makeId()
        }
       socket.emit(SocketChatEvents.MESSAGE_SEND, data, onMessageDelivered)
        if(!currentUser) return;
        const message: TMyMessage = {
            author_data: {
                user_id: currentUser.user_id,
                pfp_url: currentUser.pfp_url,
                username: currentUser.username
            },
            conversation_id: room_id||"",
            message: text,
            message_id: data.message_id,
            seen_by: [],
            sent_on: new Date(),
            is_delivered: false
        }
        setMessages((messages)=>[...messages, message])
    }
    const onMessage = (message: TMessage) => {
        setMessages((messages)=>[...messages, message])
    }
    const onLeave = (msg: string) => {
        toastError(msg);
        dispatch(cancelMatch());
    }
    const cancel = () => {
        if(!socket) return;
        socket.emit(SocketEvents.MATCH_CANCEL);
        dispatch(cancelMatch());
    }
    useEffect(()=>{
        if(!socket) return;
        socket.on(SocketChatEvents.MESSAGE_SEND, onMessage);
        socket.on(SocketEvents.MATCH_CANCEL, onLeave);
        return(()=>{
            socket.off(SocketChatEvents.MESSAGE_SEND, onMessage);
            socket.off(SocketEvents.MATCH_CANCEL, onLeave);
        })
    }, [socket])
    return(
            <>
                <Header backButton onBack={cancel}>
                    <div className="space-x-4 flex items-center">
                        <Avatar src = {match[0].pfp_url} size={35} />
                        <HeaderHeading>{match[0].username}</HeaderHeading>
                    </div>
                </Header>
                <HeaderContentWrapper className="flex flex-col h-full" outerClassName="h-[100svh]">
                    <div className="flex flex-col p-sm flex-1">
                        {
                            messages.map((msg, index)=>{
                                
                                const nextMessage: TMessage | undefined = messages[index + 1];
                                const prevMessage: TMessage | undefined = messages[index - 1];

                                const isPrevMessageConsecutive = prevMessage?.author_data.user_id === msg.author_data.user_id;
                                const isNextMessageConsecutive = nextMessage?.author_data.user_id === msg.author_data.user_id;

                                const isLastMessage = isPrevMessageConsecutive && !isNextMessageConsecutive;
                                const isFirstMessage = isNextMessageConsecutive && !isPrevMessageConsecutive;
                                const isSingleMessage = !isPrevMessageConsecutive && !isNextMessageConsecutive;
                                
                                return(
                                    <ChatBubble
                                    author_id={msg.author_data.user_id}
                                    message_id={msg.message_id}
                                    type="individual"
                                    text={msg.message}
                                    time={msg.sent_on}
                                    key={index}
                                    isLast = {isLastMessage}
                                    isFirst = {isFirstMessage}
                                    isSingle = {isSingleMessage}
                                    isMine = {currentUser?.user_id===msg.author_data.user_id}
                                    isDelivered = {currentUser?.user_id!==msg.author_data.user_id || (msg as TMyMessage).is_delivered}
                                    />
                                )
                               
                            })
                        }
                    </div>
                    <ChatInput onSend={sendMessage}/>
                </HeaderContentWrapper>
            </>
    )
}