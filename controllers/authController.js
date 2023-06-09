import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//@desc Register a user
//@route POST /api/auth/register
//@access public
const registerUser = async (req, res) => {
	try {
		const {
			firstName,
			lastName,
			email,
			password,
			picturePath,
			friends,
			location,
			occupation,
		} = req.body;

		if (
			!firstName ||
			!lastName ||
			!email ||
			!password ||
			!location ||
			!occupation
		) {
			return res
				.status(400)
				.json({ message: "Some required fields are empty!" });
		}

		
		let userImage;
		if (!picturePath) {
			userImage = process.env.DEFAULT_PFP;
		} else {
			userImage = req.imageURL;
		}

		const duplicateUser = await User.findOne({ email });
		if (duplicateUser) {
			return res
				.status(400)
				.json({ message: "The email is already registered" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			picturePath: userImage,
			friends,
			location,
			occupation,
			viewedProfile: Math.floor(Math.random() * 1000),
			impressions: Math.floor(Math.random() * 1000),
		});

		if (!newUser) {
			return res.status(400).json({ message: "User not created!" });
		}

		const returnedUser = {
			id: newUser.id,
			email: newUser.email,
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			location: newUser.location,
			occupation: newUser.occupation,
			friends: newUser.friends,
		};

		res.status(201).json(returnedUser);
	} catch (error) {
		res.status(500).json({ message: "An error occured" });
	}
};

//@desc Login a user
//@route POST /api/auth/login
//@access public
const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "All the fields are required!" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found!" });
		}

		const passwordIsCorrect = await bcrypt.compare(password, user.password);

		if (!passwordIsCorrect) {
			return res.status(400).json({ message: "Invalid username or password!" });
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
		const returnedUser = {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			picturePath: user.picturePath,
			location: user.location,
			occupation: user.occupation,
			friends: user.friends,
		};
		res.status(200).json({ token, user: returnedUser });
	} catch (error) {
		res.status(500).json({ message: "An error occured" });
	}
};

export { registerUser, loginUser };
