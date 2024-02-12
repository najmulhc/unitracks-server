"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleQuiz = exports.getAllQuizzes = void 0;
const courseTeacherTester_1 = __importDefault(require("../utils/courseTeacherTester"));
const ApiError_util_1 = __importDefault(require("../utils/ApiError.util"));
const quiz_model_1 = __importDefault(require("../models/evaluations/quiz.model"));
const ApiResponse_util_1 = __importDefault(require("../utils/ApiResponse.util"));
// route handler for quiz creation.
const createQuiz = async (req, res) => {
    const course = await (0, courseTeacherTester_1.default)({
        courseId: req.params.courseId,
        teacherEmail: req?.teacher?.email,
    });
    const { name, startingTime, endingTime } = req.body;
    if (!name || !startingTime || !endingTime) {
        throw new ApiError_util_1.default(400, "Incomplete quiz creation request.");
    }
    if (typeof name !== "string") {
        throw new ApiError_util_1.default(400, "Invalid type of data in the quiz name. we only accept string for this data.");
    }
    if (typeof startingTime !== "number" || typeof endingTime !== "number") {
        throw new ApiError_util_1.default(400, "Invalid type of data in the date fields. Please provide data in unix date number.");
    }
    const createdQuiz = await quiz_model_1.default.create({
        courseId: course?._id,
        name,
        startTime: startingTime,
        endTime: endingTime,
    });
    if (!createdQuiz) {
        throw new ApiError_util_1.default(500, "There was an error to create the quiz.");
    }
    res.status(200).json(new ApiResponse_util_1.default(200, {
        createdQuiz,
    }, "Successfully created the quiz."));
};
// route handler for accessing all quizzess
const getAllQuizzes = async (req, res) => {
    const quizzes = await quiz_model_1.default.find({
        courseId: req.params.courseId,
        isPublished: true,
    });
    if (!quizzes) {
        throw new ApiError_util_1.default(404, "No quizzes found for this course.");
    }
    res.status(200).json(new ApiResponse_util_1.default(200, {
        quizzes,
    }, "Successfully fetched all the quizzes."));
};
exports.getAllQuizzes = getAllQuizzes;
// route handler for getting a single quiz
const getSingleQuiz = async (req, res) => {
    const quiz = await quiz_model_1.default.findById(req.params.quizId);
    if (!quiz) {
        throw new ApiError_util_1.default(404, "No quiz found with this id.");
    }
    res.status(200).json(new ApiResponse_util_1.default(200, {
        quiz,
    }, "Successfully fetched the quiz."));
};
exports.getSingleQuiz = getSingleQuiz;
// route handler for updating a quiz
// route handler for deleting a quiz
// route handler for adding questiuons to a quiz
// route handler for deleting a question from a quiz.
// route handler for publishing a quiz
