"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const varifyJWT_middleware_1 = __importDefault(require("../middlewares/varifyJWT.middleware"));
const course_controller_1 = require("../controllers/course.controller");
const asyncHandler_util_1 = __importDefault(require("../utils/asyncHandler.util"));
const adminTester_middleware_1 = __importDefault(require("../middlewares/adminTester.middleware"));
const router = (0, express_1.Router)();
router.route("/").post(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(course_controller_1.createCourse));
router.route("/my-courses").get(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(course_controller_1.getCourses));
router
    .route("/get-all-courses")
    .get(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(adminTester_middleware_1.default), (0, asyncHandler_util_1.default)(course_controller_1.getAllCourses));
router.route("/:courseId").get(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(course_controller_1.getCourseById));
router.route("/assign-teacher").patch(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(course_controller_1.assignTeacher));
exports.default = router;
