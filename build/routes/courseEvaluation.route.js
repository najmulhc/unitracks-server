"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const varifyJWT_middleware_1 = __importDefault(require("../middlewares/varifyJWT.middleware"));
const asyncHandler_util_1 = __importDefault(require("../utils/asyncHandler.util"));
const courseEvaluation_controller_1 = require("../controllers/courseEvaluation.controller");
const studentTester_middleware_1 = __importDefault(require("../middlewares/studentTester.middleware"));
const teacherTester_middleware_1 = __importDefault(require("../middlewares/teacherTester.middleware"));
const router = (0, express_1.Router)();
router
    .route("/profile/:courseId")
    .get(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(studentTester_middleware_1.default), (0, asyncHandler_util_1.default)(courseEvaluation_controller_1.getStudentProfile));
// for assignments
router
    .route("/:courseId/assignment")
    .post(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(teacherTester_middleware_1.default), (0, asyncHandler_util_1.default)(courseEvaluation_controller_1.createAssignment))
    .get(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(courseEvaluation_controller_1.getAllAssignments));
router
    .route("/:courseId/assignment/:assignmentId")
    .delete(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(teacherTester_middleware_1.default), (0, asyncHandler_util_1.default)(courseEvaluation_controller_1.deleteAssignment))
    .get(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(courseEvaluation_controller_1.getSingleAssignment))
    .patch(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(teacherTester_middleware_1.default), (0, asyncHandler_util_1.default)(courseEvaluation_controller_1.upadateAssignment));
router
    .route("/:courseId/assignment/:assignmentId/submit")
    .post(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(studentTester_middleware_1.default), (0, asyncHandler_util_1.default)(courseEvaluation_controller_1.submitAssignment));
// for presentations
router
    .route("/:courseId/presentation")
    .post(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(teacherTester_middleware_1.default), (0, asyncHandler_util_1.default)(courseEvaluation_controller_1.createPresentation))
    .get(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(courseEvaluation_controller_1.getAllPresentations));
router
    .route("/:courseId/presentation/:presentationId")
    .get(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(courseEvaluation_controller_1.getSinglePresentation))
    .patch(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(teacherTester_middleware_1.default), (0, asyncHandler_util_1.default)(courseEvaluation_controller_1.updatePresentation))
    .delete(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(teacherTester_middleware_1.default), (0, asyncHandler_util_1.default)(courseEvaluation_controller_1.deleteAssignment));
router
    .route("/:courseId/presentation/:presentationId/submit")
    .post(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(studentTester_middleware_1.default), (0, asyncHandler_util_1.default)(courseEvaluation_controller_1.submitAssignment));
router
    .route("/:courseId/presentation/:presentationId/evaluate")
    .patch(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(teacherTester_middleware_1.default), (0, asyncHandler_util_1.default)(courseEvaluation_controller_1.evaluatePresentation));
exports.default = router;
