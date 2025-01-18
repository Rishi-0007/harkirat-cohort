import express, { json } from "express";
import jwt from "jsonwebtoken";
import { UserModel, TodoModel } from "./db.js";
import bcrypt from "bcrypt";
import { z } from "zod";

const app = express();
const JWT_SECRET = "s3cret";
app.use(express.json());

function auth(req, res, next) {
    const token = req.headers.token;
    const decodeToken = jwt.verify(token, JWT_SECRET);

    if (decodeToken) {
        req.userID = decodeToken.id;
        next();
    } else {
        return res.json({
            message: "Token Invalid"
        })
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

            const hashedPassword = await bcrypt.hash(password, 5);

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
                message: JSON.parse(result.error.message)
            })
        }
    } catch (err) {
        res.status(400).json({
            message: "User already exists"
        })
    }
})

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({
        email: email
    })

    const isPasswordCorrect = bcrypt.compare(password, user.password);

    if (user && isPasswordCorrect) {
        const token = jwt.sign({
            id: user._id.toString()  // convert to string because id is of type ObjectID
        }, JWT_SECRET);
        res.json({
            message: "You are logged in",
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
})

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
