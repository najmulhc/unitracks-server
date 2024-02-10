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
const MarksDistributionSchema = new mongoose_1.Schema({
    course: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "course",
    },
    attendence: {
        minimum: {
            type: Number,
            default: 0,
            min: 0,
            max: 20,
            required: [
                true,
                "You need to set the minimum amount of attendence to the class.",
            ],
        },
        totalMarks: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    quiz: {
        count: {
            type: Number,
            default: 0,
            min: 0,
        },
        questionsCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalMarks: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        taken: {
            type: Number,
            default: 0,
        },
    },
    mid: {
        taken: {
            type: Number,
            default: 0,
        },
        count: {
            type: Number,
            min: 1,
            max: 5,
            default: 1,
        },
        marksForEach: {
            type: Number,
            min: 10,
            max: 20,
            default: 10,
        },
        totalMarks: {
            type: Number,
            min: 10,
            max: 100,
            default: 10,
        },
        totalQuestions: {
            type: Number,
            min: 0,
            max: 20,
            default: 0,
        },
        maxAttemptedQuestions: {
            type: Number,
            min: 0,
            max: 20,
            default: 0,
        },
    },
    assignment: {
        taken: {
            type: Number,
            default: 0,
        },
        count: {
            type: Number,
            min: 0,
            max: 10,
            default: 0,
        },
        marksForEach: {
            type: Number,
            min: 0,
            max: 20,
            default: 0,
        },
        totalMarks: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
    },
    presentation: {
        taken: {
            type: Number,
            default: 0,
        },
        count: {
            type: Number,
            min: 0,
            max: 10,
            default: 0,
        },
        marksForEach: {
            type: Number,
            min: 0,
            max: 20,
            default: 0,
        },
        totalMarks: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
    },
    final: {
        marksForEach: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        totalMarks: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        totalQuestions: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        maxAttempedQuestions: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        taken: {
            type: Number,
            default: 0,
        },
    },
    total: {
        type: Number,
        default: 100,
        min: 100,
        max: 100,
    },
});
const MarksDistribution = mongoose_1.default.model("marksDistribution", MarksDistributionSchema);
exports.default = MarksDistribution;
