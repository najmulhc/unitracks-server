"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controller_1 = require("../controllers/user.controller");
var userRouter = (0, express_1.Router)();
userRouter.post("/", user_controller_1.basicRegister);
userRouter.post("/login", user_controller_1.login);
exports.default = userRouter;
