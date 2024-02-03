import mongoose, { Schema } from "mongoose";
import { QuizResponse as QuizResponseType } from "../../types";

const QuizResponseSchema = new Schema<QuizResponseType>({});

const QuizResponse = mongoose.model(
  "Quiz",
  QuizResponseSchema,
);
export default QuizResponse;
