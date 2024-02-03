import mongoose, { Schema } from "mongoose";
import { ExamResponse as ExamResponseType } from "../../types";

const ExamResponseSchema = new Schema<ExamResponseType>({
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  ],
  score: {
    type: Number,
    min: 0,
    max: 60, // it should be validated in the controller
    default: 0,
  },
  submissionTime: {
    type: Number,
    required: true,
  },
  isEvaluated: {
    type: Boolean,
    default: false,
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "exam",
  },
  answerScript: [
    {
      questionNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
      subQuestions: [
        {
          answer: {
            type: String,
            default: "",
          },
          marks: {
            type: Number,
            min: 0,
            max: 15,
          },
        },
      ],
    },
  ],
});

const ExamResponse = mongoose.model("ExamResponse", ExamResponseSchema);

export default ExamResponse;
