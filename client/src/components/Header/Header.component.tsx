import { cn } from "@/utils/cn.utils";

interface Props {
    children?: any;
}

export default function Header({children}: Props){
    return(
        <header className="fixed top-0 left-0 h-[var(--header-height)] border-b-[1px] border-b-c_gray-200 w-screen flex items-center">
            {children}
        </header>
    )
}

interface HProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {

}
export function HeaderHeading({className, ...props}: HProps){
    return(
        <h1 {...props} className={cn("text-c_gray-800 font-semibold", className)} />
    )
}