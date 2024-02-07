import { MarksDistribution } from "./../../types.d";
import mongoose, { Schema } from "mongoose";
import { MarksDistribution as MarksDistributionType } from "../../types";

const MarksDistributionSchema = new Schema<MarksDistributionType>({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },
  attendence: {
    minimum: {
      type: Number,
      default: 0,
      min: 0,
      max: 20,
      required: [
        true,
        "You need to set the minimum amount of attendence to the class.",
      ],
    },
    totalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },
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
      min: 0,
      max: 100,
      default: 0,
    },
    taken: {
      type: Number,
      default: 0,
    },
  },
  mid: {
    taken: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    marksForEach: {
      type: Number,
      min: 10,
      max: 20,
      default: 10,
    },
    totalMarks: {
      type: Number,
      min: 10,
      max: 100,
      default: 10,
    },
    totalQuestions: {
      type: Number,
      min: 0,
      max: 20,
      default: 0,
    },
    maxAttemptedQuestions: {
      type: Number,
      min: 0,
      max: 20,
      default: 0,
    },
  },
  assignment: {
    taken: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    marksForEach: {
      type: Number,
      min: 0,
      max: 20,
      default: 0,
    },
    totalMarks: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  presentation: {
    taken: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    marksForEach: {
      type: Number,
      min: 0,
      max: 20,
      default: 0,
    },
    totalMarks: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  final: {
    marksForEach: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    totalMarks: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    maxAttempedQuestions: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    taken: {
      type: Number,
      default: 0,
    },
  },
  total: {
    type: Number,
    default: 100,
    min: 100,
    max: 100,
  },
});

const MarksDistribution = mongoose.model(
  "marksDistribution",
  MarksDistributionSchema,
);

export default MarksDistribution;
