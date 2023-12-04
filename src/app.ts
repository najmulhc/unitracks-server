import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route";
import studentRouter from "./routes/student.route";

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/students", studentRouter);

export default app;
