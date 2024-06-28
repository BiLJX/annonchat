import { cn } from "../../utils/cn.utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {

}

export default function AuthInput(props: AuthInputProps){
    return(
       <input  {...props} className={cn("p-4 border-b-[.5px] border-c_gray-500 placeholder:text-c_gray-500 text-c_gray-800 placeholder:font-medium focus:border-c_gray-600", props.className)} />
    )
}