"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourses = exports.getAllCourses = exports.createCourse = void 0;
const authTester_1 = __importDefault(require("../utils/authTester"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const teacher_model_1 = __importDefault(require("../models/teacher.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const student_model_1 = __importDefault(require("../models/student.model"));
const createCourse = async (req, res) => {
    // get required information (coursename, course code, batch, teacher);
    const { email, role } = req.user;
    const { courseName, teacherEmail, session, courseCode } = req.body;
    // varify given information
    if ((0, authTester_1.default)(role, "admin")) {
        if (!courseName || !teacherEmail || !session || !courseCode) {
            throw new ApiError_1.default(400, "Incomplete course information, please provide the full information.");
        }
        const teacher = await teacher_model_1.default.findOne({
            email: teacherEmail,
        });
        if (!teacher) {
            throw new ApiError_1.default(404, "The teacher is not available!");
        }
        // create course from the given information
        const createdCourse = await course_model_1.default.create({
            teacher: teacher._id,
            session,
            courseCode,
            name: courseName,
        });
        return res.status(200).json({
            success: true,
            course: createdCourse,
        });
    }
};
exports.createCourse = createCourse;
// get all courses by admin
const getAllCourses = async (req, res) => {
    if (!req.admin) {
        throw new ApiError_1.default(402, "You do not have permission to perform this task.");
    }
    const courses = await course_model_1.default.find().select("-students -teacher");
    return res.status(200).json({
        success: true,
        courses,
    });
};
exports.getAllCourses = getAllCourses;
// get courses  for  a user.
const getCourses = async (req, res) => {
    const { email, role } = req.user;
    if (role === "student") {
        const student = await student_model_1.default.findOne({
            email,
        }).populate("courses");
        return res.status(200).json({
            success: true,
            courses: student?.courses,
        });
    }
    else if (role === "teacher") {
        const teacher = await teacher_model_1.default.findOne({
            email,
        }).populate("courses");
        return res.status(200).json({
            success: true,
            coursessss: await course_model_1.default.find({ teacher: teacher?._id }).populate("teacher"),
        });
    }
};
exports.getCourses = getCourses;
// get course by ID  -> when you need a full page course detail
//
