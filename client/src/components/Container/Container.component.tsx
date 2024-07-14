import { cn } from "@/utils/cn.utils";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    outerClassName?: string,
    hasNav?: boolean
}
export function HeaderContentWrapper({outerClassName, hasNav,className, ...props}: Props){
    return(
        <div className={cn("pt-[var(--header-height)]", {"pb-[var(--nav-height)]": hasNav} , outerClassName)} >
            <div {...props} className={cn("flex flex-col", className)} />
        </div>
    )
}