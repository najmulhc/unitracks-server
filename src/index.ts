const express = require("express")
// import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
const dotenv = require("dotenv")
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 6969;
app.use(express.json());
app.use(cors())
// app.use(cookieParser("shhh......."));
dotenv.config();
app.use("/user", userRouter);


app.listen(PORT, () => {
  console.log(`The app is running in the port ${PORT}`);
});
