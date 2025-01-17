import express from "express";
import jwt from "jsonwebtoken";
import { UserModel, TodoModel } from "./db.js";

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

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    await UserModel.create
        ({
            name: name,
            email: email,
            password: password
        });

    res.json({
        message: "Sign up successful!"
    })
})

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({
        email: email,
        password: password
    })

    if (user) {
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
