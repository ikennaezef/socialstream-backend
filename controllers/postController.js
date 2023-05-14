import Post from "../models/Post.js";
import User from "../models/User.js";

//@desc Get all the available posts
//@route GET /api/posts
//@access private
const getFeedPosts = async (req, res) => {
	try {
		const posts = await Post.find();

		if (!posts) {
			return res.status(400).json({ message: "An error occured" });
		}

		res.status(200).json(posts);
	} catch (error) {
		return res.status(409).json({ message: error.message });
	}
};

//@desc Get all posts made by a user
//@route GET /api/posts/:id/posts
//@access private
const getUserPosts = async (req, res) => {
	try {
		const { id } = req.params;
		const posts = await Post.find({ userId: id });

		if (!posts) {
			return res.status(400).json({ message: "An error occured" });
		}

		res.status(200).json(posts);
	} catch (error) {
		return res.status(409).json({ message: error.message });
	}
};

//@desc Like or unlike a post
//@route PATCH /api/posts/:id/like
//@access private
const likePost = async (req, res) => {
	try {
		const { id } = req.params;
		const { userId } = req.body;

		const post = await Post.findById(id);
		const isLiked = post.likes.get(userId);

		if (isLiked) {
			post.likes.delete(userId);
		} else {
			post.likes.set(userId, true);
		}

		const updatedPost = await Post.findByIdAndUpdate(
			id,
			{ likes: post.likes },
			{ new: true }
		);

		if (!updatedPost) {
			return res.status(400).json({ message: "An error occured!" });
		}

		res.status(200).json(updatedPost);
	} catch (error) {
		return res.status(409).json({ message: error.message });
	}
};

//@desc Comment on a post
//@route POST /api/posts/:id/comment
//@access private
const postComment = async (req, res) => {
	try {
		const { id } = req.params;
		const { text } = req.body;

		const post = await Post.findById(id);
		post.comments.push(text);

		const updatedPost = await post.save();

		if (!updatedPost) {
			return res.status(400).json({ message: "An error occured!" });
		}

		res.status(200).json(updatedPost);
	} catch (error) {
		return res.status(409).json({ message: error.message });
	}
};

//@desc Create a post
//@route POST /api/posts
//@access private
const createPost = async (req, res) => {
	try {
		const { userId, description } = req.body;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found!" });
		}

		const newPost = await Post.create({
			userId,
			firstName: user.firstName,
			lastName: user.lastName,
			location: user.location,
			description,
			userPicturePath: user.picturePath,
			picturePath: req.imageURL ? req.imageURL : null,
			likes: {},
			comments: [],
		});

		if (!newPost) {
			return res.status(400).json({ message: "Post not created" });
		}

		const allPosts = await Post.find();

		res.status(201).json(allPosts);
	} catch (error) {
		res.status(400).json({ message: "An error occured" });
	}
};

//@desc Delete a post
//@route DELETE /api/posts/:id/delete
//@access private
const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ message: "Post not found!" });
		}

		if (req.user !== post.userId) {
			res.status(403).json({
				message: "Users are not allowed to delete other users' posts",
			});
		}

		await Post.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Post deleted" });
	} catch (error) {
		return res.status(409).json({ message: error.message });
	}
};

export {
	getFeedPosts,
	getUserPosts,
	likePost,
	createPost,
	deletePost,
	postComment,
};
