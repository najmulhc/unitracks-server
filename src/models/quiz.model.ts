import mongoose, { Schema } from "mongoose";
import { QuizType } from "../types";
import { questionSchema } from "./question.model";
import { studentQuizSchema } from "./studentQuiz.model";

const quizSchema = new Schema<QuizType>({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
  questions: {
    type: [questionSchema],
    default: [],
  },
  participents: {
    type: [studentQuizSchema],
    default: [],
  },
  name: {
    type: String,
    required: true,
  },
});

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
