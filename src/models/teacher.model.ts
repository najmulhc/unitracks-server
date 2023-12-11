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
  email: {
    type: String,
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  title: {
    type: String,
    enum: {
      values: ["Professor", "Assistant Professor", "Lecturer"],
    },
  },
  authStage: {
    type: String,
    enum: {
      values: ["one", "completed"],
    },
    default: "one",
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"],
    },
  },
});

const Teacher = mongoose.model("Model", teacherSchema);

export default Teacher;
