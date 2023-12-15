"use strict";
// creating a new quiz
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuiz = exports.createNewQuiz = void 0;
const course_model_1 = __importDefault(require("../models/course.model"));
const quiz_model_1 = __importDefault(require("../models/quiz.model"));
const teacher_model_1 = __importDefault(require("../models/teacher.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const createNewQuiz = async (req, res) => {
    // varification  of authorization
    const { role, email, courseId } = req.body;
    if (role !== "teacher") {
        throw new ApiError_1.default(400, "You do not have permission to create a course.");
    }
    const teacher = await teacher_model_1.default.findOne({
        email,
    });
    if (!teacher) {
        throw new ApiError_1.default(400, "Teacher does not exists.");
    }
    const course = await course_model_1.default.findById(courseId);
    if (!course) {
        throw new ApiError_1.default(400, "The course does not exists.");
    }
    if (course.teacher !== teacher._id) {
        throw new ApiError_1.default(400, "The teacher does not takes the course.");
    }
    // varification of given information
    const { quizName } = req.body;
    if (!quizName) {
        throw new ApiError_1.default(400, "No quiz name given.");
    }
    // create simple quiz object and store it to db.
    const quiz = await quiz_model_1.default.create({
        teacher: teacher._id,
        course: course._id,
        name: quizName,
    });
    if (!quiz) {
        throw new ApiError_1.default(500, "There was an error creating the quiz.");
    }
    const result = { success: true, quiz };
    // return created quiz
    return res.json(result);
};
exports.createNewQuiz = createNewQuiz;
// adding questions to the quiz
// getting a quiz by id.
// getting quizzes by course for a student.
// getting all quizzes by a teacher.
// getting quiz questions by students
// posting student response of a quiz
// deleting a quiz
const deleteQuiz = async (req, res) => {
    // test teacher and if he ownes the quiz
    // get quiz id and test if it exists with proper validation
    // delete the quiz
    // return the resutl
    return res.status(200).json({
        success: true,
    });
};
exports.deleteQuiz = deleteQuiz;
