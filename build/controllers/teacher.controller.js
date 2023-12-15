"use strict";
// teacher auth stage one.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeacher = exports.postTeacher = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const teacher_model_1 = __importDefault(require("../models/teacher.model"));
const postTeacher = async (req, res) => {
    // this will take all information needed for a teacher
};
exports.postTeacher = postTeacher;
const getTeacher = async (req, res) => {
    // jwt will give the email and role
    const { email, role } = req.body;
    if (role !== "teacher") {
        throw new ApiError_1.default(401, "you Do not have permission to perform this action");
    }
    const teacher = await teacher_model_1.default.findOne({
        email,
    });
    if (!teacher) {
        throw new ApiError_1.default(404, "The teacher does not exists!");
    }
    return res.status(200).json({
        success: true,
        teacher: teacher,
    });
};
exports.getTeacher = getTeacher;
