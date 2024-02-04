import mongoose, { Schema } from "mongoose";
import { Exam as ExamType } from "../../types";

const ExamSchema = new Schema<ExamType>({
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
    type: Schema.Types.ObjectId,
    ref: "examResponse",
  },
});


const Exam = mongoose.model("exam", ExamSchema);

export default Exam;
