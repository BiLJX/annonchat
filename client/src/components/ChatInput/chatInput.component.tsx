import CustomButton from "../Buttons/Button.component";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useEffect, useRef, useState } from "react";

interface Props {
    onSend: (message: string) => void;
}
export function ChatInput({onSend}: Props){
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if(!message.trim()) return;
            onSend(message)
            setMessage(''); // Clear the input after sending the message
            return;
        }
    };
    

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '20px';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);
    return(
        <div className="border-t-[1px] border-t-c_gray-200 flex justify-center p-4">
            <div className="flex py-2 px-2 w-full bg-c_gray-200 rounded-[30px] items-center">
                <textarea onKeyDown={handleKeyDown} onChange={handleChange} value={message} ref={textareaRef} style={{height: "20px"}} className="px-4 bg-transparent font-normal text-[1rem] placeholder:text-c_gray-500 flex-1 text-c_gray-600" placeholder="Message..."  />
                <CustomButton colorVariant="secondary" className="px-4 py-1 rounded-full" onClick={()=>{onSend(message); setMessage("")}}>
                    <SendRoundedIcon className="rotate-[-45deg] translate-y-[-3px] translate-x-[2px]"/>
                </CustomButton>
            </div>
        </div>
    )
}

// "mongodb+srv://BiLJX:42a3RePvN1DGXkDh@cluster0.vyegx.mongodb.net/annonchat?retryWrites=true&w=majority"