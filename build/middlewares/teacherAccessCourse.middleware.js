"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const course_model_1 = __importDefault(require("../models/course.model"));
const ApiError_util_1 = __importDefault(require("../utils/ApiError.util"));
const teacherCourseAccess = async (req, res, next) => {
    try {
        const teacher = req.teacher;
        const { courseId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            throw new ApiError_util_1.default(404, "The course is not available.");
        }
        if (teacher?._id !== course?.teacher) {
            throw new ApiError_util_1.default(403, "The teacher does not have acces to the course.");
        }
        else {
            req.course = course;
            next();
        }
    }
    catch (error) {
        throw new ApiError_util_1.default(400, "There was an error while testing the teacher access. ");
    }
};
exports.default = teacherCourseAccess;
