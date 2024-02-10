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
const mongoose_1 = __importStar(require("mongoose"));
const ExamSchema = new mongoose_1.Schema({
    type: {
        enum: ["final", "mid"],
        default: "mid",
    },
    totalMarks: {
        type: Number,
        min: 0,
        max: 70,
        default: 0,
        required: [true, "Please specify the total marks"],
    },
    questions: [
        {
            questionNumber: { type: Number, min: 1, max: 10 },
            totalMarks: {
                type: Number,
                min: 3,
                max: 15,
            },
            subQuestions: [
                {
                    question: {
                        type: String,
                        required: [true, "Please specify the question"],
                    },
                    marks: {
                        type: Number,
                        min: 0,
                        max: 15,
                        required: [true, "Please specify the marks"],
                    },
                },
            ],
        },
    ],
    responses: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "examResponse",
    },
});
const Exam = mongoose_1.default.model("exam", ExamSchema);
exports.default = Exam;
