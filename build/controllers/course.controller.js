"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseById = exports.getCourses = exports.getAllCourses = exports.createCourse = void 0;
const authTester_1 = __importDefault(require("../utils/authTester"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const teacher_model_1 = __importDefault(require("../models/teacher.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const student_model_1 = __importDefault(require("../models/student.model"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
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
        return res.status(200).json(new ApiResponse_1.default(200, {
            course: createdCourse,
        }, "Successfully created the course."));
    }
};
exports.createCourse = createCourse;
// get all courses by admin
const getAllCourses = async (req, res) => {
    if (!req.admin) {
        throw new ApiError_1.default(402, "You do not have permission to perform this task.");
    }
    const courses = await course_model_1.default.find().select("-students -teacher");
    return res.status(200).json(new ApiResponse_1.default(200, {
        courses,
    }, "Successfully found all courses."));
};
exports.getAllCourses = getAllCourses;
// get courses  for  a user.
const getCourses = async (req, res) => {
    const { email, role } = req.user;
    if (role === "student") {
        const student = await student_model_1.default.findOne({
            email,
        }).populate("courses");
        return res.status(200).json(new ApiResponse_1.default(200, {
            courses: student?.courses,
        }, "Response with all courses of the student."));
    }
    else if (role === "teacher") {
        const teacher = await teacher_model_1.default.findOne({
            email,
        }).populate("courses");
        return res.status(200).json(new ApiResponse_1.default(200, {
            courses: await course_model_1.default.find({
                teacher: teacher?._id,
            }).populate("teacher"),
        }, "Response with all courses of the teacher."));
    }
    else {
        throw new ApiError_1.default(400, "Invalid user type.");
    }
};
exports.getCourses = getCourses;
const getCourseById = async (req, res) => {
    const { courseId } = req.body;
    const { role } = req.user;
    // when you are a teacher and want to access the course
    if (role === "teacher") {
        const teacher = await teacher_model_1.default.findOne({
            email: req.user.email,
        });
        const course = await course_model_1.default.findById(courseId)
            .populate("resource")
            .populate("students")
            .populate("teacher");
        if (!course) {
            throw new ApiError_1.default(404, "Course not found.");
        }
        if (teacher?._id === course?.teacher._id) {
            return res.status(200).json(new ApiResponse_1.default(200, {
                course,
            }, "Course for the teacher is ready."));
        }
        else {
            throw new ApiError_1.default(401, "You do not have access to the course as a teacher.");
        }
    }
    else if (role === "student") {
        const { student } = req;
        if (student?.courses.includes(courseId)) {
            const course = await course_model_1.default.findById(courseId)
                .populate("resource")
                .select("-students")
                .populate("teacher");
            if (!course) {
                throw new ApiError_1.default(404, "Course not found.");
            }
            return res
                .status(200)
                .json(new ApiResponse_1.default(200, { course }, "Course for the student found successfully"));
        }
        else {
            throw new ApiError_1.default(400, "You do not have access to the course.");
        }
    }
    else if (role === "admin") {
        const course = await course_model_1.default.findById(courseId)
            .populate("teacher")
            .populate("students")
            .populate("resource");
        if (!course) {
            throw new ApiError_1.default(404, "Course not found.");
        }
        return res.status(200).json(new ApiResponse_1.default(200, {
            course,
        }, "Course for admin found successfully!"));
    }
    else {
        throw new ApiError_1.default(403, "Unauthorized access to the course.");
    }
};
exports.getCourseById = getCourseById;
