"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var asyncHandler_util_1 = __importDefault(require("../utils/asyncHandler.util"));
var student_controller_1 = require("../controllers/student.controller");
var varifyJWT_1 = __importDefault(require("../middlewares/varifyJWT"));
var studentRouter = (0, express_1.Router)();
studentRouter.route("/").get(varifyJWT_1.default, (0, asyncHandler_util_1.default)(student_controller_1.getStudent));
studentRouter.post("/authphase/one", varifyJWT_1.default, (0, asyncHandler_util_1.default)(student_controller_1.studentInputPhaseOne));
exports.default = studentRouter;
