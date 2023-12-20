"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const teacher_model_1 = __importDefault(require("../models/teacher.model"));
const teacherTester = async (req, res, next) => {
    try {
        const { email, role } = req.user;
        if (role !== "teacher") {
            throw new ApiError_1.default(403, "Unauthorized access to be a teacher.");
        }
        const teacher = await teacher_model_1.default.findOne({
            email,
        });
        if (!teacher?.email) {
            throw new ApiError_1.default(404, "Teacher not found!");
        }
        req.teacher = teacher;
        next();
    }
    catch (error) {
        throw new ApiError_1.default(500, error.message || "something went wrong while testing the teacher");
    }
};
exports.default = teacherTester;
