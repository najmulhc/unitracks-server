import mongoose, { Schema } from "mongoose";
import { EvaluationResponse } from "../../types";

const evaluationResponseSchema = new Schema<EvaluationResponse>({
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
});

export default evaluationResponseSchema;
