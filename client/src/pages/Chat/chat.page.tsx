import Avatar from "@/components/Avatar/avatar.component";
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
        </>
   )
}