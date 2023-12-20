"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studnetInputPhaseTwo = exports.studentInputPhaseOne = exports.getStudent = void 0;
const student_model_1 = __importDefault(require("../models/student.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const getStudent = async (req, res) => {
    const { student } = req;
    return res.status(200).json(new ApiResponse_1.default(200, {
        student,
    }, "Student found successfully"));
};
exports.getStudent = getStudent;
// student input phase one
const studentInputPhaseOne = async (req, res) => {
    const { student } = req;
    if (student?.authStage !== "one") {
        throw new ApiError_1.default(401, "you are in wrong auth phase!");
    }
    // get body basic info (firstName, lastName, dateOfBirh, bloodGroup) etc.
    const { firstName, lastName, dateOfBirth, bloodGroup } = req.body;
    // varify the information given as per request.
    if (!firstName || !lastName || !dateOfBirth || !bloodGroup) {
        throw new ApiError_1.default(400, "Incomplete user information, please give full info");
    }
    const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    if (!bloodGroups.includes(bloodGroup)) {
        throw new ApiError_1.default(400, "Invalid blood group.");
    }
    const realDateOfBirth = new Date(dateOfBirth).getTime();
    if (!realDateOfBirth || typeof realDateOfBirth !== "number") {
        throw new ApiError_1.default(400, "Invalid date of birth.");
    }
    // update student object with new info and change user auth phase
    const updatedStudent = await student_model_1.default.findOneAndUpdate({ email: student.email }, {
        firstName,
        lastName,
        dateOfBirth: realDateOfBirth,
        bloodGroup,
        authStage: "two",
    }, { new: true });
    // return new student object
    return res.status(200).json(new ApiResponse_1.default(200, {
        student: updatedStudent,
    }, "student auth phase one completed."));
};
exports.studentInputPhaseOne = studentInputPhaseOne;
// student input phase two
const studnetInputPhaseTwo = async (req, res) => {
    const { student } = req;
    if (student?.authStage !== "two") {
        throw new ApiError_1.default(401, "you are in wrong auth phase!");
    }
    // get information such as batch, roll, section and other academic info.
    const { roll, session } = req.body;
    // varify user given info as per request.
    if (!roll || !session) {
        throw new ApiError_1.default(400, "Incomplete form informaiton, we need full information");
    }
    const studentWithRoll = await student_model_1.default.findOne({
        roll,
    });
    if (studentWithRoll) {
        throw new ApiError_1.default(401, "Student already exists with this roll.");
    }
    const sessions = ["2020", "2019"];
    if (!sessions.includes(session)) {
        throw new ApiError_1.default(400, "Invalid session! please provide the correct one.");
    }
    // update student object with new info and set authphase to completed
    const updatedStudent = await student_model_1.default.findOneAndUpdate({
        email: student.email,
    }, {
        roll,
        session,
        authStage: "completed",
        courses: [],
    }, {
        new: true,
    });
    // return student new object with no courses.
    return res.status(200).json(new ApiResponse_1.default(200, {
        student: updatedStudent,
    }, "student auth phase two completed."));
};
exports.studnetInputPhaseTwo = studnetInputPhaseTwo;
