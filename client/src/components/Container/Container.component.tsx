import { cn } from "@/utils/cn.utils";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {

}
export function ContainerForHeader({className, ...props}: Props){
    return(
        <div className="pt-[var(--header-height)]">
            <div {...props} className={cn("flex flex-col", className)} />
        </div>
    )
}