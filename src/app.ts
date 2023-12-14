import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route";
import studentRouter from "./routes/student.route";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/students", studentRouter);

export default app;
