import { Route, Routes } from "react-router-dom"
import SignupPage from "../pages/Signup/signup.page"
import LoginPage from "../pages/Login/login.page"
import PfpUploadPage from "@/pages/PfpUpload/pfpupload.page"


function App() {
    return (
        <Routes>
            <Route path="/" element={<>Hey</>} />
            <Route path = "/signup" element = {<SignupPage />} />
            <Route path = "/login" element = {<LoginPage />} />
            <Route path = "/upload/pfp" element = {<PfpUploadPage />} />
        </Routes>
    )
}

export default App
