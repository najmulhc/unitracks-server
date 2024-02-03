import mongoose, { Schema } from "mongoose";
import { Assignment as AssignmentType } from "../../types";

const AssignmentSchema = new Schema<AssignmentType>({

})

const Assignment = mongoose.model("assignment", AssignmentSchema);
export default Assignment;