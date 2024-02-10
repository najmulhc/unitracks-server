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
const multer_middleware_1 = __importDefault(require("../middlewares/multer.middleware"));
const router = (0, express_1.Router)();
router.use(varifyJWT_middleware_1.default);
router.route("/").post((0, asyncHandler_util_1.default)(course_controller_1.createCourse));
router.route("/my-courses").get((0, asyncHandler_util_1.default)(course_controller_1.getCourses));
router
    .route("/get-all-courses")
    .get((0, asyncHandler_util_1.default)(adminTester_middleware_1.default), (0, asyncHandler_util_1.default)(course_controller_1.getAllCourses));
router
    .route("/:courseId")
    .get((0, asyncHandler_util_1.default)(course_controller_1.getCourseById))
    .delete((0, asyncHandler_util_1.default)(course_controller_1.deleteCourse));
router
    .route("/assign-teacher/:courseId")
    .patch((0, asyncHandler_util_1.default)(adminTester_middleware_1.default), (0, asyncHandler_util_1.default)(course_controller_1.assignTeacher));
router
    .route("/cover-image")
    .patch(multer_middleware_1.default.single("coverImage"), (0, asyncHandler_util_1.default)(course_controller_1.uploadCourseCoverImage));
router.route("/textbook").post((0, asyncHandler_util_1.default)(course_controller_1.uploadTextBook));
router
    .route("/:courseId/marks-distribution")
    .post((0, asyncHandler_util_1.default)(course_controller_1.setMarksDistribution))
    .get((0, asyncHandler_util_1.default)(course_controller_1.getMarksDistribution));
exports.default = router;
