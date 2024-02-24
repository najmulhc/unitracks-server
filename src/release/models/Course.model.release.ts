import e from "express";
import mongoose from "mongoose";

interface Course {
  name: string;
  batch: string;
  teacher: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
  resources: mongoose.Types.ObjectId[];
  code: number;
}

const CourseReleaseSchema = new mongoose.Schema<Course>({
    name: {
        type: String,
        required: true,
    },
    batch: {
        type: String,
        required: true,
        enum: ["15th", "16th", "17th", "18th"],
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
    },
    students: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "StudentRelease",
        default: [],
    },
    resources: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Resource",
        default: [],
    },
    code: {
        type: Number,
        required: true,
    },
    
});

const CourseReleaseModel = mongoose.model("CourseRelease", CourseReleaseSchema);

export default CourseReleaseModel;
