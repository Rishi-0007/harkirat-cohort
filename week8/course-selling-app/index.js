import { auth, JWT_SECRET } from "./auth.js";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserModel } from "./db.js";

const app = express();

app.use(express.json());

const userSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(3)
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
})

app.get("/me", auth, async (req, res) => {
    const foundUser = await UserModel.findOne({
        _id: req.userID
    });

    return res.json({ message: "Welcome " + foundUser.name });
})

app.listen(3000, () => {
    console.log("server is running")
})