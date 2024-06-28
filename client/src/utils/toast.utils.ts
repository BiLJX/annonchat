import { toast } from "react-toastify"

export const toastError = (msg: string) => {
    toast.error(msg, {
        hideProgressBar: true,
        theme: "colored",
    })
}

export const toastSuccess = (msg: string) => {
    toast.success(msg, {
        hideProgressBar: true,
        theme: "colored"
    })
}