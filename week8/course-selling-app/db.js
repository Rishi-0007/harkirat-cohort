import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.DB_URL);

const User = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
})

export const UserModel = mongoose.model("users", User);