import express from "express";
import jwt from "jsonwebtoken";
import { UserModel, TodoModel } from "./db.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
app.use(express.json());

function auth(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
    try {
        const decodeToken = jwt.verify(token, JWT_SECRET);
        req.userID = decodeToken.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

const userSchema = z.object({
    name: z.string().min(3),
    email: z.string().min(3).email(),
    password: z.string().min(6)
})

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const result = userSchema.safeParse(req.body);

        if (result.success) {

            const hashedPassword = await bcrypt.hash(password, 10);

            await UserModel.create
                ({
                    name: name,
                    email: email,
                    password: hashedPassword
                });

            res.json({
                message: "Sign up successful!"
            })
        }
        else {
            res.status(400).json({
                message: result.error.issues.map(issue => issue.message).join(", ")
            });
        }
    } catch (err) {
        res.status(400).json({
            message: "User already exists"
        })
    }
})

app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: "Incorrect credentials" });
        }

        const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET);
        res.json({ message: "You are logged in", token });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.post("/todo", auth, async (req, res) => {
    const { title, status } = req.body;

    await TodoModel.create({
        userID: req.userID,
        title: title,
        status: status
    })

    res.json({
        message: "Todos set successfully!"
    })
})

app.get("/todos", auth, async (req, res) => {
    const foundTodo = await TodoModel.find({
        userID: req.userID
    })

    res.json({
        todos: foundTodo
    })
})

app.listen(3000, () => {
    console.log("server is running");
})
