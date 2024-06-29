import axios from "./axios"

export const uploadUserPfp = async(pfp: File) => {
    const data = new FormData()
    data.append("pfp", pfp);
    const res = await axios.put("/api/user/pfp", data);
    return res.data as ApiResponse<{pfp_url: string}>;
}