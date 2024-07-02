import Avatar from "@/components/Avatar/avatar.component";
import ChatBubble from "@/components/ChatBubble/chatbubble";
import { HeaderContentWrapper } from "@/components/Container/Container.component";
import Header, { HeaderHeading } from "@/components/Header/Header.component";

export default function ChatPage(){
   return(
        <>
            <Header backButton>
                <div className="space-x-4 flex items-center">
                    <Avatar src = "https://pics.craiyon.com/2023-07-15/dc2ec5a571974417a5551420a4fb0587.webp" size={35} />
                    <HeaderHeading>BiLJX</HeaderHeading>
                </div>
            </Header>
            <HeaderContentWrapper>
                <div className="flex flex-col p-sm">
                    <ChatBubble 
                    type = "group"
                    author_id="asd"
                    message_id="asd"
                    text="asdasdasdasd"
                    time={new Date}
                    pfp= {"https://pics.craiyon.com/2023-07-15/dc2ec5a571974417a5551420a4fb0587.webp"}
                    sender_name="BiLJX"
                    isFirst
                    isMine
                    />
                </div>
            </HeaderContentWrapper>
        </>
   )
}