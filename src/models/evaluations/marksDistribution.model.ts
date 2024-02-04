import { MarksDistribution } from "./../../types.d";
import mongoose, { Schema } from "mongoose";
import { MarksDistribution as MarksDistributionType } from "../../types";

const MarksDistributionSchema = new Schema<MarksDistributionType>({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },
  quiz: {
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
    questionsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalMarks: {
      type: Number, 
    }
  },
});

const MarksDistribution = mongoose.model(
  "marksDistribution",
  MarksDistributionSchema,
);

export default MarksDistribution;
