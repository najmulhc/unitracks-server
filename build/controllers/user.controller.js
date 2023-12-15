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
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const createStudent_1 = __importDefault(require("../utils/createStudent"));
const authTester_1 = __importDefault(require("../utils/authTester"));
const createTeacher_1 = __importDefault(require("../utils/createTeacher"));
// in the first time the user will have no role assigned, so we will create a simple unassigned user role untill
const basicRegister = async (req, res) => {
    const { email, password } = req.body;
    const existedUser = await user_model_1.default.findOne({
        email,
    });
    if (existedUser) {
        throw new ApiError_1.default(400, "User already exists!");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const createdUser = await user_model_1.default.create({
        email,
        hashedPassword,
        role: "unassigned",
    });
    const token = jwt.sign({ email }, process.env.JWT_SIGN);
    res.json({
        success: true,
        user: createdUser,
        token,
    });
};
exports.basicRegister = basicRegister;
const login = async (req, res) => {
    const { email, password } = req.body;
    let user = null;
    user = await user_model_1.default.findOne({
        email,
    });
    if (!user) {
        throw new Error("User not found");
    }
    const compared = await bcrypt_1.default.compare(password, user.hashedPassword);
    if (!compared) {
        throw new Error("Incorrect password!");
    }
    const token = jwt.sign({
        email,
    }, process.env.JWT_SIGN);
    return res.json({
        success: true,
        token,
        user: user,
    });
};
exports.login = login;
// when an unassigned user wanted to be an admin.
const beAnAdmin = async (req, res) => {
    const { email, role, key } = req.body;
    (0, authTester_1.default)(role, "unassigned");
    if (key !== "uU06Qh,33g&,M4~X" || !key) {
        throw new Error("Invalid admin key");
    }
    const admin = await admin_model_1.default.create({
        email,
    });
    const updatedUser = await user_model_1.default.findOneAndUpdate({ email }, {
        role: "admin",
    }, {
        new: true,
    });
    res.json({
        success: true,
        user: updatedUser,
    });
};
exports.beAnAdmin = beAnAdmin;
// get user from jwt token
const loginWithToken = async (req, res) => {
    const { user } = req.body;
    res.json({
        success: true,
        user,
    });
};
exports.loginWithToken = loginWithToken;
// get all users
const getAllUsers = async (req, res) => {
    const { role } = req.user;
    (0, authTester_1.default)(role, "admin");
    const users = await user_model_1.default.find({});
    return res.json({
        success: true,
        users,
    });
};
exports.getAllUsers = getAllUsers;
const setUserRole = async (req, res) => {
    const { role } = req.user;
    (0, authTester_1.default)(role, "admin");
    const updatedUser = await user_model_1.default.findOneAndUpdate({ email: req.body.userEmail }, { role: req.body.userRole }, {
        new: true,
    });
    // creates new student
    if (req.body.userRole === "student") {
        const createdStudent = await (0, createStudent_1.default)(req.body.userEmail);
    }
    else if (req.body.userRole === "teacher") {
        const createdTeacher = await (0, createTeacher_1.default)(req.body.email);
    }
    return res.json({
        success: true,
        users: await user_model_1.default.find(),
    });
};
exports.setUserRole = setUserRole;
// delete a user by admin
const deleteUser = async (req, res) => {
    const { role } = req.body;
    const { deletedUser } = req.body;
    (0, authTester_1.default)(role, "admin");
    const deleted = await user_model_1.default.findOneAndDelete({
        email: deletedUser.email,
    });
    const users = await user_model_1.default.find();
    return res.json({
        success: true,
        users,
    });
};
exports.deleteUser = deleteUser;
