import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.DB_URL);

const users = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
})

const todos = new Schema({
    userID: Schema.ObjectId,
    title: String,
    status: Boolean
})

const UserModel = mongoose.model("users", users);
const TodoModel = mongoose.model("todos", todos);

export { UserModel, TodoModel };
