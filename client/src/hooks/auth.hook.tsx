import { RootState } from "@/redux/store.redux";
import { useSelector } from "react-redux";

export default function useAuth(){
    const currentUser = useSelector((state: RootState)=>state.user.data);
    return { currentUser };
}