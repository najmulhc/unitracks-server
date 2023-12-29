"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteColor = exports.getAllColors = exports.createColor = void 0;
const authTester_util_1 = __importDefault(require("../utils/authTester.util"));
const ApiError_util_1 = __importDefault(require("../utils/ApiError.util"));
const courseColor_model_1 = __importDefault(require("../models/courseColor.model"));
const ApiResponse_util_1 = __importDefault(require("../utils/ApiResponse.util"));
const createColor = async (req, res) => {
    try {
        const { role } = req.user;
        (0, authTester_util_1.default)(role, "admin");
        const { colorCode } = req.body;
        if (!colorCode) {
            throw new ApiError_util_1.default(400, "No color code given!");
        }
        const createdColor = await courseColor_model_1.default.create({
            code: colorCode,
        });
        res.status(200).json(new ApiResponse_util_1.default(200, {
            createdColor,
        }, "New color Created!"));
    }
    catch (error) {
        throw new ApiError_util_1.default(400, error?.message || "There was an error while creating the color");
    }
};
exports.createColor = createColor;
// get all colors
const getAllColors = async (req, res) => {
    const { role } = req.user;
    (0, authTester_util_1.default)(role, "admin");
    const colors = await courseColor_model_1.default.find();
    if (!colors) {
        throw new ApiError_util_1.default(404, "No colors found!");
    }
    res.status(200).json(new ApiResponse_util_1.default(200, {
        colors,
    }, "Here is all found colors."));
};
exports.getAllColors = getAllColors;
// to delete a color
const deleteColor = async (req, res) => {
    const { role } = req.user;
    (0, authTester_util_1.default)(role, "admin");
    const { deleteColorId } = req.body;
    if (!deleteColorId) {
        throw new ApiError_util_1.default(400, "No Color Id given");
    }
    const deletedColor = await courseColor_model_1.default.findByIdAndDelete(deleteColorId);
    if (!deletedColor) {
        throw new ApiError_util_1.default(404, "No deleteable color found!");
    }
    const colors = await courseColor_model_1.default.find();
    if (!colors) {
        throw new ApiError_util_1.default(404, "No colors found!");
    }
    res.status(200).json(new ApiResponse_util_1.default(200, {
        colors,
    }, "Color deletion complete!"));
};
exports.deleteColor = deleteColor;
