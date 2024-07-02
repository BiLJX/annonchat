import Avatar from "@/components/Avatar/avatar.component";
import ChatBubble from "@/components/ChatBubble/chatbubble";
import { HeaderContentWrapper } from "@/components/Container/Container.component";
import Header, { HeaderHeading } from "@/components/Header/Header.component";
import { useEffect, useState } from "react";
import { TMessage } from "@shared/types/message.type"
import { useSocket } from "@/Contexts/socket.context";
import { SocketChatEvents, TMessageSendRequest } from "@shared/sockets/socketEvents.type";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store.redux";
import useAuth from "@/hooks/auth.hook";
import { ChatInput } from "@/components/ChatInput/chatInput.component";

export default function ChatPage(){
    const { room_id, type } = useSelector((state: RootState)=>state.randomChat);
    const {currentUser} = useAuth();
    const [messages, setMessages] = useState<TMessage[]>([]);
    const socket = useSocket();
    const onMessage = (message: TMessage) => {
        console.log(onMessage)
        setMessages((messages)=>[...messages, message])
    }
    const sendMessage = (text: string) => {
        if(!socket || !room_id) return;
        const data: TMessageSendRequest = {
            room_type: type,
            is_random_room: true,
            message: text,
            room_id: room_id||"",
        }
       socket.emit(SocketChatEvents.MESSAGE_SEND, data)
        if(!currentUser) return;
        const message: TMessage = {
            author_data: {
                user_id: currentUser.user_id,
                pfp_url: currentUser.pfp_url,
                username: currentUser.username
            },
            conversation_id: room_id||"",
            message: text,
            message_id: "asd",
            seen_by: [],
            sent_on: new Date()
        }
        setMessages((messages)=>[...messages, message])
    }

    useEffect(()=>{
        if(!socket) return;
        socket.on(SocketChatEvents.MESSAGE_SEND, onMessage);
        return(()=>{
            socket.off(SocketChatEvents.MESSAGE_SEND, onMessage);
        })
    }, [socket])
    return(
            <>
                <Header backButton>
                    <div className="space-x-4 flex items-center">
                        <Avatar src = "https://pics.craiyon.com/2023-07-15/dc2ec5a571974417a5551420a4fb0587.webp" size={35} />
                        <HeaderHeading>BiLJX</HeaderHeading>
                    </div>
                </Header>
                <HeaderContentWrapper className="flex flex-col h-full" outerClassName="h-screen">
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