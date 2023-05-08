import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { authRouter } from "./routes/authRoute.js";
import { verifyToken } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use("/api/auth", authRouter);

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose
	.connect(process.env.MONGO_CONNECTION_STRING)
	.then(() => {
		app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));
	})
	.catch((err) => {
		console.log("DID NOT CONNECT ----->", err);
	});
