import express from "express";
import {
	createPost,
	deletePost,
	getFeedPosts,
	getUserPosts,
	likePost,
} from "../controllers/postController.js";
import { verifyToken } from "../middleware/auth.js";
import { upload2, uploadImage } from "../middleware/imageUpload.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getFeedPosts);
router.get("/:id/posts", getUserPosts);

router.post("/", upload2.single("picture"), uploadImage, createPost);

router.patch("/:id/like", likePost);
router.delete("/:id/delete", deletePost);

export { router as postRouter };
