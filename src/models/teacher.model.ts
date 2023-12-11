import mongoose, { Schema } from "mongoose";
import { TeacherType } from "../types";

const teacherSchema = new Schema<TeacherType>({
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
});

const Teacher = mongoose.model("Model", teacherSchema);

export default Teacher;
