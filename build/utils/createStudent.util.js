"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const student_model_1 = __importDefault(require("../models/student.model"));
const ApiError_util_1 = __importDefault(require("./ApiError.util"));
const createStudent = async ({ email, userId, }) => {
    // test if there is any student with the email
    const existedUser = await student_model_1.default.findOne({
        email,
    });
    if (existedUser) {
        throw new ApiError_util_1.default(400, "Student already exists!");
    }
    const createdUser = await student_model_1.default.create({
        email, userId
    });
    return createdUser;
};
exports.default = createStudent;
