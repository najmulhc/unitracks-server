import mongoose, { Schema } from "mongoose";
import { AssignmentResponse as AssignmentResponseType } from "../../types";

export const AssignmentResponseSchema = new Schema<AssignmentResponseType>({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "assignment",
    required: [true, "What course this assignment belongs?"],
  },
  isEvaluated: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ["individual", "group"],
    required: [true, "Please specify the type of the assignment."],
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  ],
  submission: {
    type: String, // the link of the pdf, we will try to implement the upload pdf and generating the link,
    required: [true, "Please insert the assingment PDF file."],
  },
});

const AssignmentResponse = mongoose.model(
  "assignmentResponse",
  AssignmentResponseSchema,
);
export default AssignmentResponse;
