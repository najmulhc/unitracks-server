"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const asyncHandler_util_1 = __importDefault(require("../utils/asyncHandler.util"));
const varifyJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        throw new ApiError_1.default(400, "No token given", [], "");
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SIGN);
    if (!decoded) {
        throw new ApiError_1.default(401, "Invalid token.", [], "");
    }
    //@ts-ignore
    const { email, role } = decoded;
    const user = await user_model_1.default.findOne({
        email,
    });
    // if you change your role by mistake or intentionally. 
    if (user.role !== role) {
        throw new ApiError_1.default(403, "Unauthorized access.");
    }
    if (!user) {
        throw new ApiError_1.default(404, "User Does not eixsts.");
    }
    req.user = user;
    next();
};
exports.default = (0, asyncHandler_util_1.default)(varifyJWT);
