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
const teacherSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        default: "",
    },
    lastName: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        default: "teacher",
    },
    email: {
        type: String,
        required: true,
    },
    courses: {
        type: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
        default: [],
    },
    title: {
        type: String,
        enum: {
            values: ["Professor", "Assistant Professor", "Lecturer"],
        },
    },
    authStage: {
        type: String,
        enum: {
            values: ["one", "completed"],
        },
        default: "one",
    },
    bloodGroup: {
        type: String,
        enum: {
            values: ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"],
        },
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});
const Teacher = mongoose_1.default.model("Teacher", teacherSchema);
exports.default = Teacher;
