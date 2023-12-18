"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const varifyJWT_1 = __importDefault(require("../middlewares/varifyJWT"));
const course_controller_1 = require("../controllers/course.controller");
const asyncHandler_util_1 = __importDefault(require("../utils/asyncHandler.util"));
const router = (0, express_1.Router)();
router.route("/").post(varifyJWT_1.default, (0, asyncHandler_util_1.default)(course_controller_1.createCourse));
router.route("/my-courses").get(varifyJWT_1.default, (0, asyncHandler_util_1.default)(course_controller_1.getCourses));
exports.default = router;
