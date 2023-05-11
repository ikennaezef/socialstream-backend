import multer from "multer";
import config from "../config/firebase.config.js";
import { initializeApp } from "firebase/app";
import {
	getStorage,
	ref,
	getDownloadURL,
	uploadBytesResumable,
} from "firebase/storage";

// Initialise a firebase app
initializeApp(config.firebaseConfig);

// Initialise a cloud storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab image uploads
export const upload2 = multer({ storage: multer.memoryStorage() });

const uploadImage = async (req, res, next) => {
	try {
		const { picturePath } = req.body;
		if (!picturePath) {
			return next();
		}

		const dateTime = new Date().toISOString();

		const storageRef = ref(
			storage,
			`files/${req.file.originalname} ${dateTime}`
		);

		// Create file metadata including the content type
		const metadata = {
			contentType: req.file.mimetype,
		};

		// Upload file to bucket storage
		const snapshot = await uploadBytesResumable(
			storageRef,
			req.file.buffer,
			metadata
		);

		// Grab the public url
		const downloadURL = await getDownloadURL(snapshot.ref);

		if (!downloadURL) {
			return res.status(400).json({ message: "An error occured" });
		}

		req.imageURL = downloadURL;
		next();
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export { uploadImage };
