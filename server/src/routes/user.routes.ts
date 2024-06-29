import { authenticateUser } from "controllers/auth.controller";
import { uploadPfp } from "controllers/user.controller";
import { Router } from "express";

const router = Router();
router.put("/pfp", authenticateUser, uploadPfp)
export { router as userRoutes }