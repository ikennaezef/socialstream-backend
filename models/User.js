import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			min: 3,
			max: 40,
		},
		lastName: {
			type: String,
			required: true,
			min: 3,
			max: 40,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			max: 50,
		},
		password: {
			type: String,
			required: true,
			min: 6,
		},
		picturePath: {
			type: String,
			default: "",
		},
		friends: {
			type: Array,
			default: [],
		},
		location: String,
		occupation: String,
		viewedProfile: Number,
		impressions: Number,
	},
	{ timestamps: true }
);

export default User = mongoose.model("User", UserSchema);