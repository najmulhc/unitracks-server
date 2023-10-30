"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
// import cookieParser from "cookie-parser";
var user_route_1 = __importDefault(require("./routes/user.route"));
var dotenv = require("dotenv");
var app = express();
var PORT = process.env.PORT || 6969;
app.use(express.json());
// app.use(cookieParser("shhh......."));
dotenv.config();
app.use("/user", user_route_1.default);
app.listen(PORT, function () {
    console.log("The app is running in the port ".concat(PORT));
});
