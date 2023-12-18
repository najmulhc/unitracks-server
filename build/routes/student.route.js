"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_util_1 = __importDefault(require("../utils/asyncHandler.util"));
const student_controller_1 = require("../controllers/student.controller");
const varifyJWT_1 = __importDefault(require("../middlewares/varifyJWT"));
const studentTester_1 = __importDefault(require("../middlewares/studentTester"));
const studentRouter = (0, express_1.Router)();
studentRouter
    .route("/")
    .get(varifyJWT_1.default, (0, asyncHandler_util_1.default)(studentTester_1.default), (0, asyncHandler_util_1.default)(student_controller_1.getStudent));
studentRouter.post("/auth-phase/one", varifyJWT_1.default, (0, asyncHandler_util_1.default)(studentTester_1.default), (0, asyncHandler_util_1.default)(student_controller_1.studentInputPhaseOne));
studentRouter.post("/auth-phase/two", varifyJWT_1.default, (0, asyncHandler_util_1.default)(studentTester_1.default), (0, asyncHandler_util_1.default)(student_controller_1.studnetInputPhaseTwo));
exports.default = studentRouter;
