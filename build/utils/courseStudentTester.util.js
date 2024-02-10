"use strict";
// this is the utility function to test if the student has access to the course or not. this function requires the studentTester middleware to be used before it.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const course_model_1 = __importDefault(require("../models/course.model"));
const ApiError_util_1 = __importDefault(require("./ApiError.util"));
const courseStudentTester = async ({ courseId, studentId, }) => {
    if (!courseId || !studentId) {
        throw new ApiError_util_1.default(400, "CourseId and StudentId are required");
    }
    const course = await course_model_1.default.findById(courseId);
    if (!course) {
        throw new ApiError_util_1.default(404, "Course not found");
    }
    if (!course.students.includes(studentId)) {
        throw new ApiError_util_1.default(403, "You are not allowed to access this course.");
    }
    return course;
};
exports.default = courseStudentTester;
