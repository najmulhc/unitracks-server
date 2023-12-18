"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_util_1 = __importDefault(require("../utils/asyncHandler.util"));
const admin_model_1 = __importDefault(require("../models/admin.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
// the user of the request will come from the varifyJWT middleware.
const adminTester = (0, asyncHandler_util_1.default)(async (req, res, next) => {
    try {
        const { email } = req.user;
        const foundAdmin = await admin_model_1.default.findOne(email);
        if (!foundAdmin) {
            throw new ApiError_1.default(404, "Admin is not found.");
        }
        req.admin = foundAdmin;
        next();
    }
    catch (error) {
        throw new ApiError_1.default(400, error.message || "There was an error testing admin previlages.");
    }
});
exports.default = adminTester;
