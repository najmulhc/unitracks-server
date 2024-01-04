"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const varifyJWT_middleware_1 = __importDefault(require("../middlewares/varifyJWT.middleware"));
const studentTester_middleware_1 = __importDefault(require("../middlewares/studentTester.middleware"));
const asyncHandler_util_1 = __importDefault(require("../utils/asyncHandler.util"));
const notificationController_1 = require("../controllers/notificationController");
const router = (0, express_1.Router)();
router
    .route("/")
    .get(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(studentTester_middleware_1.default), (0, asyncHandler_util_1.default)(notificationController_1.getNotifications));
router.post("/see", varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(studentTester_middleware_1.default), (0, asyncHandler_util_1.default)(notificationController_1.seeNotifications));
exports.default = router;
