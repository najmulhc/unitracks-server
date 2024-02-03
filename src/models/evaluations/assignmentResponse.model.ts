import mongoose, { Schema } from "mongoose";
import { AssignmentResponse as AssignmentResponseType } from "../../types";

const AssignmentResponseSchema = new Schema<AssignmentResponseType>({});

const AssignmentResponse = mongoose.model(
  "assignment",
  AssignmentResponseSchema,
);
export default AssignmentResponse;
