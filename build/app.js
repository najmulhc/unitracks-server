"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var user_route_1 = __importDefault(require("./routes/user.route"));
var student_route_1 = __importDefault(require("./routes/student.route"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// routes
app.use("/api/v1/users", user_route_1.default);
app.use("/api/v1/students", student_route_1.default);
exports.default = app;
