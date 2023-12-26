"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.setUserRole = exports.getAllUsers = exports.loginWithToken = exports.beAnAdmin = exports.login = exports.basicRegister = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const admin_model_1 = __importDefault(require("../models/admin.model"));
const jwt = __importStar(require("jsonwebtoken"));
const ApiError_util_1 = __importDefault(require("../utils/ApiError.util"));
const createStudent_util_1 = __importDefault(require("../utils/createStudent.util"));
const authTester_util_1 = __importDefault(require("../utils/authTester.util"));
const createTeacher_util_1 = __importDefault(require("../utils/createTeacher.util"));
const ApiResponse_util_1 = __importDefault(require("../utils/ApiResponse.util"));
// in the first time the user will have no role assigned, so we will create a simple unassigned user role untill
const basicRegister = async (req, res) => {
    const { email, password } = req?.body;
    if (!email || !password) {
        throw new ApiError_util_1.default(400, "Incomplete form info!");
    }
    const existedUser = await user_model_1.default.findOne({
        email,
    });
    if (existedUser) {
        throw new ApiError_util_1.default(400, "User already exists!");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const createdUser = await user_model_1.default.create({
        email,
        hashedPassword,
        role: "unassigned",
    });
    const token = jwt.sign({ email, role: "unassigned" }, process.env.JWT_SIGN);
    return res.json({
        success: true,
        user: {
            email: createdUser.email,
            role: createdUser.role,
        },
        token,
    });
};
exports.basicRegister = basicRegister;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError_util_1.default(400, "Incomplete login credentials.");
    }
    let user = await user_model_1.default.findOne({
        email,
    });
    if (!user) {
        throw new ApiError_util_1.default(404, "User not found.");
    }
    const compared = await bcrypt_1.default.compare(password, user.hashedPassword);
    if (!compared) {
        throw new ApiError_util_1.default(400, "Incorrect password.");
    }
    const token = jwt.sign({
        email,
        role: user?.role,
    }, process.env.JWT_SIGN);
    return res.status(200).json(new ApiResponse_util_1.default(200, {
        token,
        user: {
            email: user.email,
            role: user.role,
        },
    }, "user created"));
};
exports.login = login;
// when an unassigned user wanted to be an admin.
const beAnAdmin = async (req, res) => {
    const { email, role } = req.user;
    const { key } = req.body;
    (0, authTester_util_1.default)(role, "unassigned");
    if (key !== process.env.ADMIN_KEY || !key) {
        throw new ApiError_util_1.default(400, "Invalid admin key");
    }
    const admin = await admin_model_1.default.create({
        email,
    });
    const updatedUser = await user_model_1.default.findOneAndUpdate({ email }, {
        role: "admin",
    }, {
        new: true,
    }).select("-hashedPassword");
    const token = jwt.sign({
        email: email,
        role: "admin",
    }, process.env.JWT_SIGN);
    res.status(200).json(new ApiResponse_util_1.default(200, {
        token,
        user: updatedUser,
    }, "user role set to admin."));
};
exports.beAnAdmin = beAnAdmin;
// get user from jwt token
const loginWithToken = async (req, res) => {
    const { user } = req;
    res
        .status(200)
        .json(new ApiResponse_util_1.default(200, { user }, "Got user from given token"));
};
exports.loginWithToken = loginWithToken;
// get all users
const getAllUsers = async (req, res) => {
    const { role } = req.user;
    (0, authTester_util_1.default)(role, "admin");
    const users = await user_model_1.default.find({}).select("-hashedPassword -name -refreshToken");
    return res.status(200).json(new ApiResponse_util_1.default(200, {
        users,
    }, "all users getted"));
};
exports.getAllUsers = getAllUsers;
const setUserRole = async (req, res) => {
    const { role } = req.user;
    (0, authTester_util_1.default)(role, "admin");
    const { userRole, userEmail } = req.body;
    // test if the user is exist
    const user = await user_model_1.default.findOne({
        email: userEmail,
    });
    if (!user) {
        throw new ApiError_util_1.default(404, "User does not exists.");
    }
    if (user.role !== "unassigned") {
        throw new ApiError_util_1.default(400, "User allready has a role assigned.");
    }
    if (!["teacher", "student"].includes(userRole)) {
        throw new ApiError_util_1.default(400, "Invalid user role.");
    }
    const updatedUser = await user_model_1.default.findOneAndUpdate({ email: userEmail }, { role: userRole }, {
        new: true,
    });
    // creates new student
    if (req.body.userRole === "student") {
        const createdStudent = await (0, createStudent_util_1.default)(userEmail);
        return res.status(200).json(new ApiResponse_util_1.default(200, {
            student: createdStudent,
        }, "student created Successfully"));
    }
    else if (userRole === "teacher") {
        // when you are looking to make a teacher
        await (0, createTeacher_util_1.default)(userEmail);
    }
    return res.status(200).json({
        success: true,
        users: await user_model_1.default.find(),
    });
};
exports.setUserRole = setUserRole;
// delete a user by admin
const deleteUser = async (req, res) => {
    const { role } = req.user;
    const { deletedUserId } = req.body;
    (0, authTester_util_1.default)(role, "admin");
    try {
        const deleted = await user_model_1.default.findByIdAndDelete(deletedUserId);
    }
    catch (error) {
        throw new ApiError_util_1.default(500, error.message || "there was an error deleting  the user.");
    }
    return res
        .status(200)
        .json(new ApiResponse_util_1.default(200, {}, "User deleted successfully"));
};
exports.deleteUser = deleteUser;
