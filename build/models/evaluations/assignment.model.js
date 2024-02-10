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
const AssignmentSchema = new mongoose_1.Schema({
    course: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "Please add the course for the assignment."],
    },
    topic: {
        type: String,
        required: [true, "Please write the topic of the assignment."],
    },
    startingTime: {
        type: Number,
        required: [true, "You need to specify the starting time for submission."],
    },
    endingTime: {
        type: Number,
        required: [true, "You need to specify the last time of submission."],
    },
    description: {
        type: String,
        default: "No description given by the teacher.",
    },
    responses: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "assignmentResponse",
        },
    ],
    type: {
        type: String,
        enum: ["individual", "group"],
        required: [true, "Please specify the type of the assignment."],
    },
});
const Assignment = mongoose_1.default.model("assignment", AssignmentSchema);
exports.default = Assignment;
