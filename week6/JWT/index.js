// JWT based authentication

import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const JWT_SECRET = "ilovecode";

const users = [];

app.use(express.json())

function findUser(username) {
    const found = users.find(u => u.username == username);
    return found
}

app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({
            message: "Invalid username or password!"
        });
    }

    if (findUser(username)) {
        return res.json({
            message: "User already exists!"
        });
    }

    users.push({
        username: username,
        password: password
    });
    res.json({
        message: "Signed up successful!"
    });
})

app.post("/signin", (req, res) => {
    const { username, password } = req.body;
    const foundUser = findUser(username);

    if (foundUser && foundUser.password == password) {
        const token = jwt.sign({ username: username }, JWT_SECRET);
        foundUser.token = token;

        return res.json({
            message: "Successfully signed up!",
            token: token
        });
    } else {
        return res.json({
            message: "Invalid username or password!"
        });
    }
})

app.get("/profile", (req, res) => {
    const token = req.headers.token;
    const foundToken = jwt.verify(token, JWT_SECRET);

    const foundUser = findUser(foundToken.username);

    if (foundUser) {
        return res.json({
            message: "Welcome to your Profile.",
            username: foundUser.username,
            password: foundUser.password
        });
    }

    res.json({
        message: "Invalid token"
    })
})

app.listen(3000, () => {
    console.log("server is running");
})