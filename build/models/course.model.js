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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const student_model_1 = __importDefault(require("./student.model"));
const courseSchema = new mongoose_1.Schema({
    teacher: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "teacher",
    },
    session: {
        type: String,
        enum: {
            values: ["2020", "2021"],
        },
        required: true,
    },
    students: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "student",
        },
    ],
    courseCode: {
        type: Number,
        min: 101,
        max: 110,
        required: [true, "Please Enter the Course Code"],
        index: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        index: true,
        trim: true
    }
});
courseSchema.pre("save", async function (next) {
    if (!this.isModified("courseCode")) {
        return;
    }
    // find the student in the session
    const sessionStudents = await student_model_1.default.find({
        session: this.session,
    });
    // for each student 1. add the course id to their course array, 2. add their id to the students array.
    this.students = sessionStudents.map((student) => student._id);
    for (let student of sessionStudents) {
        await student_model_1.default.findOneAndUpdate({ email: student.email }, {
            courses: [...student.courses, this._id],
        }, {
            new: true,
        });
    }
    next();
});
const Course = mongoose_1.default.model("course", courseSchema);
exports.default = Course;
