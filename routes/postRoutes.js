import express from "express";
import {
	createPost,
	deletePost,
	getFeedPosts,
	getUserPosts,
	likePost,
} from "../controllers/postController.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../utils/imageUpload.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getFeedPosts);
router.get("/:id/posts", getUserPosts);

router.post("/", upload.single("picture"), createPost);

router.patch("/:id/like", likePost);
router.delete("/:id/delete", deletePost);

export { router as postRouter };
