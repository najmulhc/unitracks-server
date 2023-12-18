"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const student_route_1 = __importDefault(require("./routes/student.route"));
const teacher_route_1 = __importDefault(require("./routes/teacher.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// routes
app.use("/api/v1/users", user_route_1.default);
app.use("/api/v1/students", student_route_1.default);
app.use("/api/v1/teachers", teacher_route_1.default);
app.use("/api/v1/courses", course_route_1.default);
exports.default = app;
