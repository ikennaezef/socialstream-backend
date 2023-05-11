import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { upload2, uploadImage } from "../middleware/imageUpload.js";

const router = express.Router();

router.post("/register", upload2.single("picture"), uploadImage, registerUser);
router.post("/login", loginUser);

export { router as authRouter };
