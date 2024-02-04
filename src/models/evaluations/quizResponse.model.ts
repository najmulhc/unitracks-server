import mongoose, { Schema } from "mongoose";
import { QuizResponse as QuizResponseType } from "../../types";

const QuizResponseSchema = new Schema<QuizResponseType>({
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "student" }],
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "quiz",
  },
  answerScript: [{ type: Number, min: 0, max: 5 }],
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  isEvaluated: { type: Boolean, default: false },

  submissionTime: {
    type: Number,
    default: 0,
    required: [true, "Please provide the submission time"],
  },
});

const QuizResponse = mongoose.model("QuizResponse", QuizResponseSchema);
export default QuizResponse;
