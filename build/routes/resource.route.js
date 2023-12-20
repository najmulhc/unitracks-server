"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_util_1 = __importDefault(require("../utils/asyncHandler.util"));
const varifyJWT_1 = __importDefault(require("../middlewares/varifyJWT"));
const teacherTester_1 = __importDefault(require("../middlewares/teacherTester"));
const resource_controller_1 = require("../controllers/resource.controller");
const router = (0, express_1.Router)();
router
    .route("/")
    .post((0, asyncHandler_util_1.default)(varifyJWT_1.default), (0, asyncHandler_util_1.default)(teacherTester_1.default), (0, asyncHandler_util_1.default)(resource_controller_1.createResource))
    .delete((0, asyncHandler_util_1.default)(varifyJWT_1.default), (0, asyncHandler_util_1.default)(teacherTester_1.default), (0, asyncHandler_util_1.default)(resource_controller_1.deleteResource));
exports.default = router;
