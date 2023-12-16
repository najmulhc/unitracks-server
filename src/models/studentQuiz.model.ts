import mongoose, { Schema } from "mongoose";
import { StudentQuizType } from "../types";

// this model will geneerate a response on the quiz by a student.
export const studentQuizSchema = new Schema<StudentQuizType>({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  attempted: {
    type: Number,
    required: true,
  },
  correct: {
    type: Number,
    required: true,
  },
  wrong: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const StudentQuiz = mongoose.model("studentQuiz", studentQuizSchema);

export default StudentQuiz;
