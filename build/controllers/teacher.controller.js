"use strict";
// teacher auth stage one.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeacher = exports.postTeacher = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const teacher_model_1 = __importDefault(require("../models/teacher.model"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
// completes the information collection process of a teacher
const postTeacher = async (req, res) => {
    // this will take all information needed for a teacher
    const { email, role } = req.user;
    const existedTeacher = await teacher_model_1.default.findOne({
        email,
    });
    if (existedTeacher?.authStage !== "one") {
        throw new ApiError_1.default(401, "Your auth stage has been already completed!");
    }
    const { firstName, lastName, bloodGroup, title } = req.body;
    // validation of the given information
    if (!firstName || !lastName || !bloodGroup || !title) {
        throw new ApiError_1.default(400, "Incomplete user request. please fill the full form");
    }
    // validation of given information's correctness
    const bloodGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];
    const titles = ["Professor", "Assistant Professor", "Lecturer"];
    if (!titles.includes(title)) {
        throw new ApiError_1.default(400, "Invalid teacher title, please provide the correct one.");
    }
    if (!bloodGroups.includes(bloodGroup)) {
        throw new ApiError_1.default(400, "Invalid blood group, please provide  the correct one.");
    }
    const updatedTeacher = await teacher_model_1.default.findOneAndUpdate({
        email,
    }, {
        firstName,
        lastName,
        bloodGroup,
        title,
        authStage: "completed",
    }, {
        new: true,
    });
    return res.status(200).json(new ApiResponse_1.default(200, {
        teacher: updatedTeacher,
    }, "The teacher has updated."));
};
exports.postTeacher = postTeacher;
// gives the teacher object to the request
const getTeacher = async (req, res) => {
    // jwt will give the email and role
    const { email, role } = req.user;
    if (role !== "teacher") {
        throw new ApiError_1.default(401, "you Do not have permission to perform this action");
    }
    const teacher = await teacher_model_1.default.findOne({
        email,
    });
    if (!teacher) {
        throw new ApiError_1.default(404, "The teacher does not exists!");
    }
    return res.status(200).json(new ApiResponse_1.default(200, {
        teacher,
    }, "Found the teacher"));
};
exports.getTeacher = getTeacher;
