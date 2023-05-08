import express from "express";
import { upload } from "../utils/imageUpload.js";
import { loginUser, registerUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", upload.single("picture"), registerUser);
router.post("/login", loginUser);

export { router as authRouter };
