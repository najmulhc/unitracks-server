import mongoose, { Schema } from "mongoose";
import { Quiz as QuizType } from "../../types";

const QuizSchema = new Schema<QuizType>({
  name: {
    type: String,
    required: [true, "Please provide the name of the quiz"],
  },
  startTime: {
    type: Number,
    required: [true, "Please provide the starting time of the quiz"],
  },
  endTime: {
    type: Number,
    required: [true, "Please provide the ending time of the quiz"],
  },
  questions: [
    {
      question: [
        { type: String, required: [true, "Please provide the question"] },
      ],
      options: [
        { type: String, required: [true, "Please provide the options"] },
      ],
      correctOption: {
        type: Number,
        required: [true, "Please provide the correct option"],
      },
    },
  ],
  responses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quizResponse",
    },
  ],
});

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;
