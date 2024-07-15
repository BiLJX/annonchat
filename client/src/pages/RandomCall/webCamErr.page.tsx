import { HeaderContentWrapper } from "@/components/Container/Container.component";
import Header, { HeaderHeading } from "@/components/Header/Header.component";
import BottomNav from "@/components/Nav/BottomNav.component";

export default function WebCamErrorPage(){
    return(
        <>
            <Header>
                <HeaderHeading>Enable Camera</HeaderHeading>
            </Header>
            <HeaderContentWrapper className="flex justify-center items-center h-[100%]" outerClassName="h-[100svh]" hasNav>
                <h1 className="text-2xl font-semibold text-c_gray-700 text-center">Please allow camera access to use this feature</h1>
            </HeaderContentWrapper>
            <BottomNav />
        </>
    )
}