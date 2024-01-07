import mongoose, { Schema } from "mongoose";
import { QuestionType } from "../types";

export const questionSchema = new Schema<QuestionType>({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    minlength: 3,
    maxlength: 6,
    required: true,
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
