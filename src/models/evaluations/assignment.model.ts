import mongoose, { Schema } from "mongoose";
import { Assignment as AssignmentType } from "../../types";


const AssignmentSchema = new Schema<AssignmentType>({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please add the course for the assignment."],
  },
  topic: {
    type: String,
    required: [true, "Please write the topic of the assignment."],
  },
  startingTime: {
    type: Number,
    required: [true, "You need to specify the starting time for submission."],
  },
  endingTime: {
    type: Number,
    required: [true, "You need to specify the last time of submission."],
  },
  description: {
    type: String,
    default: "No description given by the teacher.",
  },
  responses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "assignmentResponse",
    },
  ],
  type: {
    type: String,
    enum: ["individual", "group"],
    required: [true, "Please specify the type of the assignment."],
  },
});

const Assignment = mongoose.model("assignment", AssignmentSchema);
export default Assignment;
