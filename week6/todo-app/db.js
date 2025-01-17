import mongoose, { Schema } from "mongoose";

mongoose.connect("mongodb+srv://rishikn:FEFr9A9kZDjcJ0yC@cluster0.dwocy.mongodb.net/todo-app");

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
