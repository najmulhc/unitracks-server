"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentResponseSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.AssignmentResponseSchema = new mongoose_1.Schema({
    assignmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "assignment",
        required: [true, "What course this assignment belongs?"],
    },
    isEvaluated: {
        type: Boolean,
        default: false,
    },
    score: {
        type: Number,
        default: 0,
    },
    type: {
        type: String,
        enum: ["individual", "group"],
        required: [true, "Please specify the type of the assignment."],
    },
    students: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "student",
        },
    ],
    submission: {
        type: String,
        required: [true, "Please insert the assingment PDF file."],
    },
});
const AssignmentResponse = mongoose_1.default.model("assignmentResponse", exports.AssignmentResponseSchema);
exports.default = AssignmentResponse;
