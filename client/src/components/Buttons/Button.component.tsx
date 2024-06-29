import { cn } from "../../utils/cn.utils";

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    colorVariant?: "primary"|"secondary"|"transparent"
}

export default function CustomButton({colorVariant, ...props}: ButtonProps) {
    return (
        <button 
        {...props}
        className={cn("text-white bg-c_blue-900 rounded-lg py-[0.9em]", {
            "bg-c_blue-900": colorVariant === "primary",
            "bg-c_red-900": colorVariant === "secondary",
            "bg-transparent text-c_gray-500": colorVariant === "transparent",
            "opacity-40": props.disabled
        }, 
        props.className)}
        
        />
    )
}