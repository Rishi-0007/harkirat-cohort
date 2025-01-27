import { dotenv } from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
function auth(req, res, next) {
    const token = req.body.token;
    const foundAdmin = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    if (!token) {
        return res.json({
            message: "Token Missing"
        })
    }

    if (foundAdmin) {
        req.userID = foundAdmin._id;
        next();
    }
    else {
        res.json({
            message: "unauthorised"
        })
    }
}

export default auth;