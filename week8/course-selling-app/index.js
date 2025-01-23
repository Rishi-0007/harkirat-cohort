import express from "express";
import { userRouter } from "./routes/user.js";
import { adminRouter } from "./routes/admin.js";
const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/admin", adminRouter);


app.listen(3000, () => {
    console.log("server is running")
})