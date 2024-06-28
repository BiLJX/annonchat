import { authenticateUser, getLoginStatus, loginUser, signupUser } from "controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.get("/status", authenticateUser, getLoginStatus);
router.post("/signup", signupUser);
router.post("/login", loginUser);


export { router as authRoutes }