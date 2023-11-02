"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controller_1 = require("../controllers/user.controller");
var varifyJWT_1 = __importDefault(require("../middlewares/varifyJWT"));
var userRouter = (0, express_1.Router)();
userRouter.post("/", user_controller_1.basicRegister);
userRouter.post("/login", user_controller_1.login);
userRouter.post("/be-an-admin", varifyJWT_1.default, user_controller_1.beAnAdmin);
userRouter.get("/", varifyJWT_1.default, user_controller_1.loginWithToken);
userRouter.get("/get-all-users", varifyJWT_1.default, user_controller_1.getAllUsers);
userRouter.patch("/update-user-role", varifyJWT_1.default, user_controller_1.setUserRole);
exports.default = userRouter;
