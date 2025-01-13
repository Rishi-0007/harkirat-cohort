// This is an example of production grade JWT authentication 
// P.S database and CI/CD setup are needed to be production ready

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
const users = [];

app.use(express.json());
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(409).json({ message: "User already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: "Signed up successfully!" });
});

app.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
        return res.json({ token });
    }
    res.status(401).json({ message: "Invalid credentials!" });
});

app.get("/profile", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized!" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.find(u => u.username === decoded.username);
        if (!user) throw new Error();
        res.json({ message: "Welcome!", username: user.username });
    } catch {
        res.status(401).json({ message: "Invalid or expired token!" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));

