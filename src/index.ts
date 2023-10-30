import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 6969;
app.use(express.json());
app.use(cookieParser("shhh......."));
dotenv.config();
app.use("/user", userRouter);


app.listen(PORT, () => {
  console.log(`The app is running in the port ${PORT}`);
});
