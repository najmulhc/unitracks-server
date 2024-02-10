"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuiz = exports.postQuizResponse = exports.getQuizQuestions = exports.getAllCoursesForStudent = exports.getQuizById = exports.addQuestion = exports.createNewQuiz = void 0;
const quiz_model_1 = __importDefault(require("../models/evaluations/quiz.model"));
const ApiError_util_1 = __importDefault(require("../utils/ApiError.util"));
const ApiResponse_util_1 = __importDefault(require("../utils/ApiResponse.util"));
const createNewQuiz = async (req, res) => {
    const { teacher, course } = req;
    // varification of given information
    const { quizName } = req.body;
    if (!quizName) {
        throw new ApiError_util_1.default(400, "No quiz name given.");
    }
    // create simple quiz object and store it to db.
    const quiz = await quiz_model_1.default.create({
        teacher: teacher?._id,
        course: course?._id,
        name: quizName,
    });
    if (!quiz) {
        throw new ApiError_util_1.default(500, "There was an error creating the quiz.");
    }
    // return created quiz
    return res.status(200).json(new ApiResponse_util_1.default(200, {
        quiz,
    }, "The quiz has been created."));
};
exports.createNewQuiz = createNewQuiz;
// adding questions to the quiz
const addQuestion = async (req, res) => {
    const { teacher, course } = req;
    return res.status(200).json(new ApiResponse_util_1.default(200, {}, "Messge"));
};
exports.addQuestion = addQuestion;
// getting a quiz by id.
const getQuizById = async (req, res) => {
    return res.status(200).json(new ApiResponse_util_1.default(200, {}, "Messge"));
};
exports.getQuizById = getQuizById;
// getting quizzes by course for a student.
const getAllCoursesForStudent = async (req, res) => {
    return res.status(200).json(new ApiResponse_util_1.default(200, {}, "Messge"));
};
exports.getAllCoursesForStudent = getAllCoursesForStudent;
// getting all quizzes by a teacher.
// getting quiz questions by students
const getQuizQuestions = async (req, res) => {
    return res.status(200).json(new ApiResponse_util_1.default(200, {}, "Messge"));
};
exports.getQuizQuestions = getQuizQuestions;
// posting student response of a quiz
const postQuizResponse = async (req, res) => {
    return res.status(200).json(new ApiResponse_util_1.default(200, {}, "Messge"));
};
exports.postQuizResponse = postQuizResponse;
// deleting a quiz
const deleteQuiz = async (req, res) => {
    const { course } = req;
    const { quizId } = req.body;
    // find and validate the quiz
    const quiz = await quiz_model_1.default.findById(quizId);
    if (!quiz) {
        throw new ApiError_util_1.default(400, "Invalid quiz id.");
    }
    if (quiz && quiz.course !== course?._id) {
        throw new ApiError_util_1.default(404, "The quiz does not exists in the course.");
    }
    // delete the quiz
    try {
        await quiz_model_1.default.findByIdAndDelete(quizId);
    }
    catch (error) {
        throw new ApiError_util_1.default(500, error.message || "There was an error to delete the quiz.");
    }
    // return the resutl
    return res.status(200).json(new ApiResponse_util_1.default(200, {
        quizzes: await quiz_model_1.default.find({
            course: course?._id,
        }),
    }, "The quiz has been deleted."));
};
exports.deleteQuiz = deleteQuiz;
