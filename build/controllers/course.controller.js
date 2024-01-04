"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCourseCoverImage = exports.getCourseById = exports.getCourses = exports.getAllCourses = exports.assignTeacher = exports.createCourse = void 0;
const authTester_util_1 = __importDefault(require("../utils/authTester.util"));
const ApiError_util_1 = __importDefault(require("../utils/ApiError.util"));
const teacher_model_1 = __importDefault(require("../models/teacher.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const student_model_1 = __importDefault(require("../models/student.model"));
const ApiResponse_util_1 = __importDefault(require("../utils/ApiResponse.util"));
const mongoose_1 = __importDefault(require("mongoose"));
const uploadImage_1 = require("../utils/uploadImage");
const notificationController_1 = require("./notificationController");
const createCourse = async (req, res) => {
    // get required information (coursename, course code, batch, teacher);
    const { email, role } = req.user;
    const { courseName, session, courseCode } = req.body;
    // varify given information
    if ((0, authTester_util_1.default)(role, "admin")) {
        if (!courseName || !session || !courseCode) {
            throw new ApiError_util_1.default(400, "Incomplete course information, please provide the full information.");
        }
        // create course from the given information
        const createdCourse = await course_model_1.default.create({
            session,
            courseCode,
            name: courseName,
        });
        const notification = await (0, notificationController_1.createNotification)({
            creator: req.user._id,
            sessions: [session],
            text: `Successfully Enrolled to the course ${createdCourse.name}`,
        });
        return res.status(200).json(new ApiResponse_util_1.default(200, {
            course: createdCourse,
        }, "Successfully created the course."));
    }
};
exports.createCourse = createCourse;
// assign a teacher to the course
const assignTeacher = async (req, res) => {
    const { role } = req.user;
    (0, authTester_util_1.default)(role, "admin");
    const { teacherId, courseId } = req.body;
    const course = await course_model_1.default.findById(courseId);
    if (!course) {
        throw new ApiError_util_1.default(404, "No course found with this id");
    }
    if (course.teacher) {
        throw new ApiError_util_1.default(401, "You have already assigned a teacer to the course.");
    }
    const teacher = await teacher_model_1.default.findById(teacherId);
    if (!teacher) {
        throw new ApiError_util_1.default(404, "No teacher found with this id.");
    }
    // now we have the teacher, and a course that has no teacher assigned
    const updatedCourse = await course_model_1.default.findByIdAndUpdate(courseId, {
        $set: {
            teacher: teacherId,
        },
    }, {
        new: true,
    });
    if (!updatedCourse) {
        throw new ApiError_util_1.default(500, "there was an error updating the course");
    }
    const notification = await (0, notificationController_1.createNotification)({
        text: `You have been assignd as a teacher of the course titled ${course.name}`,
        userId: teacher._id,
        creator: req.user._id,
    });
    res.status(200).json(new ApiResponse_util_1.default(200, {
        course: updatedCourse,
    }, "The teacher has been assigned"));
};
exports.assignTeacher = assignTeacher;
// get all courses by admin
const getAllCourses = async (req, res) => {
    if (!req.admin) {
        throw new ApiError_util_1.default(403, "You do not have permission to perform this task.");
    }
    const courses = await course_model_1.default.find().select("-students -teacher");
    return res.status(200).json(new ApiResponse_util_1.default(200, {
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
        return res.status(200).json(new ApiResponse_util_1.default(200, {
            courses: student?.courses,
        }, "Response with all courses of the student."));
    }
    else if (role === "teacher") {
        const teacher = await teacher_model_1.default.findOne({
            email,
        }).populate("courses");
        return res.status(200).json(new ApiResponse_util_1.default(200, {
            courses: await course_model_1.default.find({
                teacher: teacher?._id,
            }).populate("teacher"),
        }, "Response with all courses of the teacher."));
    }
    else {
        throw new ApiError_util_1.default(400, "Invalid user type.");
    }
};
exports.getCourses = getCourses;
const getCourseById = async (req, res) => {
    const { courseId } = req.params;
    const { role, email } = req.user;
    // when you are a teacher and want to access the course
    if (role === "teacher") {
        const teacher = await teacher_model_1.default.findOne({
            email: req.user.email,
        });
        const course = await course_model_1.default.findById(courseId)
            .populate({
            path: "students",
            select: "firstName lastName -_id",
        });
        if (!course) {
            throw new ApiError_util_1.default(404, "Course not found.");
        }
        //@ts-ignore
        if (course?.teacher?._id === teacher?._id) {
            // testing if the teacher has access to the course
            return res.status(200).json(new ApiResponse_util_1.default(200, {
                course,
            }, "Course for the teacher is ready."));
        }
        else {
            throw new ApiError_util_1.default(401, "You do not have access to the course as a teacher.");
        }
    }
    else if (role === "student") {
        // route handler for a student
        const student = await student_model_1.default.findOne({
            email,
        });
        if (student?.courses.includes(new mongoose_1.default.Types.ObjectId(courseId))) {
            const course = await course_model_1.default.findById(courseId)
                .populate("resource")
                .select("-students")
                .populate("teacher");
            if (!course) {
                throw new ApiError_util_1.default(404, "Course not found.");
            }
            return res
                .status(200)
                .json(new ApiResponse_util_1.default(200, { course }, "Course for the student found successfully"));
        }
        else {
            throw new ApiError_util_1.default(403, "You do not have access to the course.");
        }
    }
    else if (role === "admin") {
        const course = await course_model_1.default.findById(courseId)
            .populate("teacher")
            .populate("students")
            .populate("resource");
        if (!course) {
            throw new ApiError_util_1.default(404, "Course not found.");
        }
        return res.status(200).json(new ApiResponse_util_1.default(200, {
            course,
        }, "Course for admin found successfully!"));
    }
    else {
        throw new ApiError_util_1.default(403, "Unauthorized access to the course.");
    }
};
exports.getCourseById = getCourseById;
// upload the cover image of the course
const uploadCourseCoverImage = async (req, res) => {
    // const { role } = req.user;
    // authTester(role, "admin");
    const coverImageLocalPath = req.file?.path;
    const uploadedUrl = await (0, uploadImage_1.uploadImage)(coverImageLocalPath);
    res.status(200).json(new ApiResponse_util_1.default(200, {
        coverImageLocalPath,
        uploadedUrl,
    }, "we got the local path of the image. "));
};
exports.uploadCourseCoverImage = uploadCourseCoverImage;
