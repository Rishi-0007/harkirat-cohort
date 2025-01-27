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

const Purchase = new Schema({
    userID: Schema.ObjectId,
    courseID: Schema.ObjectId
})

export const UserModel = mongoose.model("user", User);
export const AdminModel = mongoose.model("admin", Admin);
export const CourseModel = mongoose.model("course", Course);
export const PurchasesModel = mongoose.model("purchase", Purchase);
