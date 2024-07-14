import CustomButton from "@/components/Buttons/Button.component";
import AvatarInput from "@/components/Input/AvatarInput.component";
import { uploadPfp } from "@/redux/featuers/user.slice";
import { AppDispatch, RootState } from "@/redux/store.redux";
import { toastError } from "@/utils/toast.utils";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function PfpUploadPage(){
    const dispatch = useDispatch<AppDispatch>();
    const {is_loading} = useSelector((state: RootState)=>state.user);
    const [image, setImage] = useState<File>();
    const navigate = useNavigate();
    const onUpload = () => {
        if(image) dispatch(uploadPfp(image)).unwrap().then((res)=>{
            if(res.error){
                return toastError(res.message);
            }
            navigate("/")
        });
    }
    return(
        <div className="p-md flex flex-col space-y-8">
            <div>
                <h1 className="text-c_gray-800 text-2xl font-medium">Let's setup your account!</h1>
            </div>
            <div className="flex flex-col space-y-8">
                <div className="justify-center flex">
                    <AvatarInput onImageChange={setImage} />
                </div>
                <div className="flex w-full border-[1px] border-c_gray-200 rounded-lg">
                    <CustomButton onClick={onUpload} disabled = {is_loading} className="flex-1">{is_loading?"loading...":"Continue"}</CustomButton>
                </div>
            </div> 
        </div>
    )
}