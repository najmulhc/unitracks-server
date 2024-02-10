"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const course_model_1 = __importDefault(require("../models/course.model"));
const ApiError_util_1 = __importDefault(require("./ApiError.util"));
const courseTeacherTester = async ({ courseId, teacherEmail, }) => {
    if (!courseId) {
        throw new ApiError_util_1.default(400, "No course Id is provided.");
    }
    const course = await course_model_1.default.findById(courseId).populate({
        path: "teacher",
        select: "_id email",
    });
    const courseTeacher = course?.teacher;
    if (!course) {
        throw new ApiError_util_1.default(404, "No course found with the given Id.");
    }
    if (courseTeacher?.email !== teacherEmail) {
        throw new ApiError_util_1.default(404, "You are not the teacher of this course.");
    }
    return course;
};
exports.default = courseTeacherTester;
