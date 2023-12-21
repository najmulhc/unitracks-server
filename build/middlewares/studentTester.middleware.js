"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_util_1 = __importDefault(require("../utils/ApiError.util"));
const student_model_1 = __importDefault(require("../models/student.model"));
const studentTester = async (req, res, next) => {
    try {
        const { email, role } = req.user; // jwt varification will give the user object
        if (role !== "student") {
            throw new ApiError_util_1.default(403, "You do not have permission to perform this action.");
        }
        const student = await student_model_1.default.findOne({
            email,
        });
        if (!student) {
            throw new ApiError_util_1.default(404, "There is no student with this email.");
        }
        req.student = student;
        next();
    }
    catch (error) {
        throw new ApiError_util_1.default(400, error.message || "There was an error accessing your student account");
    }
};
exports.default = studentTester;
