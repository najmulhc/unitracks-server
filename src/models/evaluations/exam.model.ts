import mongoose, { Schema } from "mongoose";
import { Exam as ExamType } from "../../types";

const ExamSchema = new Schema<ExamType>({});

const Exam = mongoose.model("exam", ExamSchema)

export default Exam;