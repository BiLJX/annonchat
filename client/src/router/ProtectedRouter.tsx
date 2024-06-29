import useAuth from "@/hooks/auth.hook";
import { Navigate, Outlet } from "react-router-dom";


interface Props {
    to?: string;
}
export default function ProtectedRouter({to = "/login"}: Props){
    const { currentUser } = useAuth();
    if(!currentUser){
        return(
            <Navigate to = {to} />
        )
    }
    return (
        <>
            {<Outlet />}
        </>
    )
}

