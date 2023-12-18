"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const teacher_model_1 = __importDefault(require("../models/teacher.model"));
const ApiError_1 = __importDefault(require("./ApiError"));
// will create a new teacher once the admin assigns an unassigned user into a teacher.
const createTeacher = async (email) => {
    const existedTeacher = await teacher_model_1.default.findOne({
        email,
    });
    if (existedTeacher) {
        throw new ApiError_1.default(402, "A teacher exists with the email");
    }
    const createdTeacher = await teacher_model_1.default.create({
        email,
    });
    return createdTeacher;
};
exports.default = createTeacher;
