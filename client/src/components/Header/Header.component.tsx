import { cn } from "@/utils/cn.utils";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
interface Props {
    children?: any;
    backButton?: boolean;
}

export default function Header({children, backButton}: Props){
    return(
        <header className="fixed top-0 left-0 h-[var(--header-height)] border-b-[1px] border-b-c_gray-200 w-screen flex items-center p-xs">
            {backButton && <button className="text-c_gray-600 mr-4">
                <ArrowBackIosNewRoundedIcon />
            </button>}
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