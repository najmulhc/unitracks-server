import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route";
import studentRouter from "./routes/student.route";
import teacherRouter from "./routes/teacher.route";
import courseRouter from "./routes/course.route";
import cookieParser from "cookie-parser";
import resourceRouter from "./routes/resource.route";
import courseColorRouter from "./routes/courseColor.route";
import notificationRouter from "./routes/notification.route";

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/resource", resourceRouter);
app.use("/api/v1/course-colors", courseColorRouter);
app.use("/api/v1/notifications", notificationRouter);

export default app;
