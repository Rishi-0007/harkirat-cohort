import dotenv from "dotenv"
import jwt from "jsonwebtoken";

dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET;

export const auth = (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({
            message: "Token missing"
        })
    }
    try {
        const decodeData = jwt.verify(token, JWT_SECRET);
        req.userID = decodeData.id;
        next();
    } catch (e) {
        return res.status(401).json({ message: "Invalid token" });
    }
}