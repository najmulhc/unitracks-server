import mongoose, { Schema,  } from "mongoose";
import { FinalScore as FinalScoreType } from "./../../types.d";
const FinalScoreSchema = new Schema<FinalScoreType>({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student"
    }, 
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
    },
    parts: {
        quiz: {
            type: Number,
            min: 0,
            max: 100,
        },
        mid: {
            type: Number,
            min: 0,
            max: 100
        },
        attendence: {
            type: Number,
            min: 0,
            max: 100
        },
        presentation: {
            type: Number,
            min: 0,
            max: 100
        },
        final: {
            type: Number,
            min: 0,
            max: 100, 
            required: [true, "Please specify the score in final exam."]
        }
    },
    grade: {
        type: String, 
        enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"], 
        required: [true, "Please specify the grade"]
    }, 
    total: {
        type: Number,
        min: 0, 
        max: 100, 
        default: 0
    }, GPA: {
        type: Number,
        min: 0,
        max: 4, 
        required: [true, "Please specify the GPA"]
    }
});

const FinalScore = mongoose.model("finalScore", FinalScoreSchema);

export default FinalScore;
