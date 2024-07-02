import { cn } from "@/utils/cn.utils";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    outerClassName?: string
}
export function ContainerForHeader({outerClassName, className, ...props}: Props){
    return(
        <div className={cn("pt-[var(--header-height)]", outerClassName)} >
            <div {...props} className={cn("flex flex-col", className)} />
        </div>
    )
}