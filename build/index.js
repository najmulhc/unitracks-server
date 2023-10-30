var express = require("express");
// import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
var dotenv = require("dotenv");
var app = express();
var PORT = process.env.PORT || 6969;
app.use(express.json());
// app.use(cookieParser("shhh......."));
dotenv.config();
app.use("/user", userRouter);
app.listen(PORT, function () {
    console.log("The app is running in the port ".concat(PORT));
});
