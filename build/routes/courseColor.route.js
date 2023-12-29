"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const varifyJWT_middleware_1 = __importDefault(require("../middlewares/varifyJWT.middleware"));
const asyncHandler_util_1 = __importDefault(require("../utils/asyncHandler.util"));
const courseColor_controller_1 = require("../controllers/courseColor.controller");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(courseColor_controller_1.createColor))
    .get(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(courseColor_controller_1.getAllColors))
    .delete(varifyJWT_middleware_1.default, (0, asyncHandler_util_1.default)(courseColor_controller_1.deleteColor));
exports.default = router;
