"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const varifyJWT_middleware_1 = __importDefault(require("../middlewares/varifyJWT.middleware"));
const asyncHandler_util_1 = __importDefault(require("../utils/asyncHandler.util"));
const userRouter = (0, express_1.Router)();
userRouter.post("/register", (0, asyncHandler_util_1.default)(user_controller_1.basicRegister));
userRouter.post("/login", (0, asyncHandler_util_1.default)(user_controller_1.login));
userRouter.post("/be-an-admin", varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(user_controller_1.beAnAdmin));
userRouter.get("/", varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(user_controller_1.loginWithToken));
userRouter.get("/get-all-users", varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(user_controller_1.getAllUsers));
userRouter.patch("/update-user-role", varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(user_controller_1.setUserRole));
userRouter.delete("/", varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(user_controller_1.deleteUser));
exports.default = userRouter;
