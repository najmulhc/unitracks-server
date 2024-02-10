"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMarksDistribution = exports.setMarksDistribution = exports.uploadTextBook = exports.deleteCourse = exports.uploadCourseCoverImage = exports.getCourseById = exports.getCourses = exports.getAllCourses = exports.assignTeacher = exports.createCourse = void 0;
const authTester_util_1 = __importDefault(require("../utils/authTester.util"));
const ApiError_util_1 = __importDefault(require("../utils/ApiError.util"));
const teacher_model_1 = __importDefault(require("../models/teacher.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const student_model_1 = __importDefault(require("../models/student.model"));
const ApiResponse_util_1 = __importDefault(require("../utils/ApiResponse.util"));
const mongoose_1 = __importDefault(require("mongoose"));
const uploadImage_1 = require("../utils/uploadImage");
const notificationController_1 = require("./notificationController");
const courseTeacherTester_1 = __importDefault(require("../utils/courseTeacherTester"));
const marksDistribution_model_1 = __importDefault(require("../models/evaluations/marksDistribution.model"));
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
    const { teacherId } = req.body;
    const { courseId } = req.params;
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
        const course = await course_model_1.default.findById(courseId).populate({
            path: "students",
            select: "firstName lastName -_id roll",
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
            .populate({
            path: "students",
            select: "firstName lastName -_id roll",
        })
            .populate({
            path: "teacher",
            select: "firstName lastName title -_id",
        });
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
    const { role } = req.user;
    (0, authTester_util_1.default)(role, "admin");
    const coverImageLocalPath = req.file?.path;
    const uploadedUrl = await (0, uploadImage_1.uploadImage)(coverImageLocalPath);
    res.status(200).json(new ApiResponse_util_1.default(200, {
        coverImageLocalPath,
        uploadedUrl,
    }, "we got the local path of the image. "));
};
exports.uploadCourseCoverImage = uploadCourseCoverImage;
const deleteCourse = async (req, res) => {
    // test if he is the admin
    const { role } = req.user;
    (0, authTester_util_1.default)(role, "admin");
    // test if the course exists.
    const { courseId } = req.params;
    const course = await course_model_1.default.findById(courseId);
    if (!course) {
        throw new ApiError_util_1.default(404, "No course found to delete");
    }
    // delete the cover photo of the course
    const { coverImage } = course;
    const deleted = await (0, uploadImage_1.deleteImage)(coverImage);
    // delete all the resources of the course
    // delete the course by Id.
    const deletedCourse = await course_model_1.default.findByIdAndDelete(courseId);
    // return the response
    await (0, notificationController_1.createNotification)({
        creator: req.user._id,
        sessions: [course.session],
        text: `The course titled ${course.name} was deleted.`,
    });
    res
        .status(200)
        .json(new ApiResponse_util_1.default(200, {}, "successfully deleted the course"));
};
exports.deleteCourse = deleteCourse;
const uploadTextBook = async (req, res) => {
    const { role, email } = req.user;
    (0, authTester_util_1.default)(role, "teacher");
    const { courseId, textbookUrl } = req.body;
    if (!courseId) {
        throw new ApiError_util_1.default(400, "No course id given");
    }
    const course = await (0, courseTeacherTester_1.default)({
        courseId,
        teacherEmail: email,
    });
    const updatedCourse = await course_model_1.default.updateOne({ _id: course._id }, {
        $push: {
            textBook: textbookUrl,
        },
    }, { new: true });
    if (!updatedCourse) {
        throw new ApiError_util_1.default(500, "There was an error to upload the textbook url.");
    }
    else {
        res
            .status(200)
            .json(new ApiResponse_util_1.default(200, {}, "Successfully updated the textbook."));
    }
};
exports.uploadTextBook = uploadTextBook;
// first here, teacher will set the marks distribution of the course
const setMarksDistribution = async (req, res) => {
    // get the course ID and teacher
    const course = await course_model_1.default.findById(req.params.courseId);
    const teacher = await teacher_model_1.default.findOne({ email: req.user.email });
    if (!req.params.courseId) {
        throw new ApiError_util_1.default(400, `No course Id found in the request params.`);
    }
    if (!course) {
        throw new ApiError_util_1.default(404, `No course found with the given Id.`);
    }
    if (course.isMarkDistributed) {
        throw new ApiError_util_1.default(400, "The marks distribution is already set for the course.");
    }
    if (!teacher) {
        throw new ApiError_util_1.default(404, `No teacher found with the given email.`);
    }
    // test the authenticity of the teacher for the course(we want to asses fi the teacher has access the course);
    if (course.teacher !== teacher._id) {
        throw new ApiError_util_1.default(401, `You do not have access to the course.`);
    }
    // get the marks distribution from the request body
    const { attendence, quiz, mid, assignment, presentation, final } = req.body.marksDistribution;
    if (!attendence || !quiz || !mid || !assignment || !presentation || !final) {
        throw new ApiError_util_1.default(400, "Incomplete marks distribution information.");
    }
    if (attendence.totalMarks +
        quiz.totalMarks +
        mid.totalMarks +
        assignment.totalMarks +
        presentation.totalMarks +
        final.totalMarks !==
        100) {
        throw new ApiError_util_1.default(400, "Total marks must be 100.");
    }
    // create a new marks distribution object and save it to the course.
    // it will make sure if you include quiz, you have set the number of questions and total marks of the quizzes.
    if (quiz.count && !quiz.questionsCount) {
        throw new ApiError_util_1.default(400, "You need to set the number of questions in a quiz.");
    }
    else if (quiz.count && !quiz.totalMarks) {
        throw new ApiError_util_1.default(400, "You need to set the total marks allocated to quiz.");
    }
    // it will make sure if you include mid, you have set the number of questions, total marks and max attempted questions of the mids.
    if (mid.count) {
        if (!mid.marksForEach) {
            throw new ApiError_util_1.default(400, "You need to set the marks for each question in mid.");
        }
        else if (!mid.totalMarks) {
            throw new ApiError_util_1.default(400, "You need to set the total marks allocated to mid.");
        }
        else if (!mid.totalQuestions) {
            throw new ApiError_util_1.default(400, "You need to set the total questions in mid.");
        }
        else if (!mid.maxAttemptedQuestions) {
            throw new ApiError_util_1.default(400, "You need to set the maximum attempted questions in mid.");
        }
    }
    // it will make sure if you include assignment, you have set the number of assignments and total marks of the assignments.
    if (assignment.count) {
        if (!assignment.totalMarks) {
            throw new ApiError_util_1.default(400, "You need to set the total marks allocated to assignment.");
        }
        else if (assignment.count * assignment.marksForEach !==
            assignment.totalMarks) {
            throw new ApiError_util_1.default(400, "The total marks of assignment must be equal to the multiplication of count and marksForEach.");
        }
    }
    // it will make sure if you include presentation, you have set the number of presentations and total marks of the presentations.
    if (presentation.count) {
        if (!presentation.marksForEach) {
            throw new ApiError_util_1.default(400, "You need to set the marks for each presentation.");
        }
        else if (presentation.count * presentation.marksForEach !==
            presentation.totalMarks) {
            throw new ApiError_util_1.default(400, "The total marks of presentation must be equal to the multiplication of count and marksForEach.");
        }
    }
    if (final) {
        if (!final.marksForEach) {
            throw new ApiError_util_1.default(400, "You need to set the marks for each question in final.");
        }
        else if (!final.totalMarks) {
            throw new ApiError_util_1.default(400, "You need to set the total marks allocated to final.");
        }
        else if (!final.totalQuestions) {
            throw new ApiError_util_1.default(400, "You need to set the total questions in final.");
        }
        else if (!final.maxAttemptedQuestions) {
            throw new ApiError_util_1.default(400, "You need to set the maximum attempted questions in final.");
        }
        else if (final.maxAttempedQuestions * final.marksForEach !==
            final.totalMarks) {
            throw new ApiError_util_1.default(400, "The total marks of final must be equal to the multiplication of maxAttempedQuestions and marksForEach.");
        }
    }
    // if you are here, that means all the data is validated and ready to saved as the marks disribution document for the course.
    const createdMarksDistribution = await marksDistribution_model_1.default.create({
        attendence,
        quiz,
        mid,
        assignment,
        presentation,
        final,
        total: 100,
        course: course._id,
    });
    if (!createdMarksDistribution) {
        throw new ApiError_util_1.default(500, "There was an error to create the marks distribution.");
    }
    const updatedCourse = await course_model_1.default.findByIdAndUpdate(course._id, {
        $set: {
            marksDistribution: createdMarksDistribution._id,
        },
    }, { new: true });
    if (!updatedCourse) {
        throw new ApiError_util_1.default(500, "There was an error to update the course.");
    }
    res.status(200).json(new ApiResponse_util_1.default(200, {
        course: updatedCourse,
        marksDistribution: createdMarksDistribution,
    }, "Successfully set the marks distribution."));
};
exports.setMarksDistribution = setMarksDistribution;
const getMarksDistribution = async (req, res) => {
    const { courseId } = req.params;
    // if the user did not provide any course Id 
    if (!courseId) {
        throw new ApiError_util_1.default(400, "No course id found in the request params.");
    }
    const course = await course_model_1.default.findById(courseId).populate("marksDistribution");
    // when there is no course found with the given id
    if (!course) {
        throw new ApiError_util_1.default(404, "No course found with the given id.");
    }
    // when the course does not have any marks distribution
    if (!course.isMarkDistributed) {
        throw new ApiError_util_1.default(404, "The marks distribution is not set for the course.");
    }
    const marksDistribution = await marksDistribution_model_1.default.findById(course.marksDistribution);
    // if the marksDistribution document does not found in the database
    if (!marksDistribution) {
        throw new ApiError_util_1.default(404, "No marks distribution found for the course.");
    }
    res.status(200).json(new ApiResponse_util_1.default(200, {
        marksDistribution,
    }, "Successfully found the marks distribution."));
};
exports.getMarksDistribution = getMarksDistribution;
