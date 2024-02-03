import mongoose, { Schema } from "mongoose";
import { ExamResponse as ExamResponseType } from "../../types";

const ExamResponseSchema = new Schema<ExamResponseType>({});

const ExamResponse = mongoose.model("ExamResponse", ExamResponseSchema);

export default ExamResponse;
