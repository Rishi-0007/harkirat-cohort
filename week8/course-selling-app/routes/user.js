import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserModel } from "../db.js";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_USER_SECRET;

const userRouter = Router();

const userSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(3)
})

userRouter.post("/signup", async (req, res) => {
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

userRouter.post("/signin", async (req, res) => {
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

export { userRouter };