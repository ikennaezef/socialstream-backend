import User from "../models/User.js";

//@desc Get a user's details
//@route GET /api/users/:id
//@access private
const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id, { password: 0 });
		if (!user) {
			return res.status(404).json({ message: "User not found!" });
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

//@desc Get a user's friends list
//@route GET /api/users/:id/friends
//@access private
const getUserFriends = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({ message: "User not found!" });
		}

		const friends = await Promise.all(
			user.friends.map((id) => User.findById(id))
		);

		const formattedFriends = friends.map(
			({ _id, firstName, lastName, occupation, location, picturePath }) => {
				return { _id, firstName, lastName, occupation, location, picturePath };
			}
		);

		res.status(200).json(formattedFriends);
	} catch (error) {
		return res.status(400).json({ message: "An error occured" });
	}
};

//@desc Add or remove a user's friends
//@route PATCH /api/users/:id/:friendId
//@access private
const addRemoveFriend = async (req, res) => {
	try {
		const { id, friendId } = req.params;
		const user = await User.findById(id);
		const friend = await User.findById(friendId);

		if (!user) {
			res.status(404).json({ message: "User not found!" });
		}

		if (id === friendId) {
			res.status(400).json({ message: "You cannot add yourself as a friend!" });
		}

		if (user.friends.includes(friendId)) {
			user.friends = user.friends.filter((currentId) => currentId !== friendId);

			friend.friends = friend.friends.filter((currentId) => currentId !== id);
		} else {
			user.friends.push(friendId);

			friend.friends.push(id);
		}

		await user.save();
		await friend.save();

		const friends = await Promise.all(
			user.friends.map((id) => User.findById(id))
		);

		const formattedFriends = friends.map(
			({ _id, firstName, lastName, occupation, location, picturePath }) => {
				return { _id, firstName, lastName, occupation, location, picturePath };
			}
		);

		res.status(200).json(formattedFriends);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

export { getUser, getUserFriends, addRemoveFriend };
