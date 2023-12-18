"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const varifyJWT_1 = __importDefault(require("../middlewares/varifyJWT"));
const asyncHandler_util_1 = __importDefault(require("../utils/asyncHandler.util"));
const teacher_controller_1 = require("../controllers/teacher.controller");
const router = (0, express_1.Router)();
router
    .route("/")
    .get(varifyJWT_1.default, (0, asyncHandler_util_1.default)(teacher_controller_1.getTeacher))
    .post((0, asyncHandler_util_1.default)(varifyJWT_1.default), (0, asyncHandler_util_1.default)(teacher_controller_1.postTeacher));
exports.default = router;
