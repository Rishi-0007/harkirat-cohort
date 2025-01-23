import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.DB_URL);

const User = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
})

const Admin = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
})

const Course = new Schema({
    title: String,
    description: String,
    price: Number,
    creatorID: Schema.ObjectId
})

const Purchases = new Schema({
    courseID: Schema.ObjectId,
    userID: Schema.ObjectId
})

export const UserModel = mongoose.model("users", User);
export const AdminModel = mongoose.model("admin", Admin);