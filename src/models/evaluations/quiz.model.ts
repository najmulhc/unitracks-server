import mongoose, { Schema } from "mongoose";
import { Quiz as QuizType } from "../../types";

const QuizSchema = new Schema<QuizType>({});

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;
