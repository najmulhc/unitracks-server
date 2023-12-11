import mongoose, { Schema, model } from "mongoose";
import { StudentType } from "../types";

const studentSchema = new Schema<StudentType>({
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  authStage: {
    type: String,
    enum: {
      values: ["one", "two", "completed"],
    },
    default: "one",
  },
  roll: {
    type: String,
    default: "",
    unique: true,
  },
  dateOfBirth: {
    type: Number,
    default: 0,
  },
  session: {
    type: String,
    enum: {
      values: ["2020", "2019"],
    },
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  email: {
    type: String,
    required: [true, "We need an email to create a student."],
  },
  role: {
    type: String,
    default: "student",
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"],
    },
  },
});

const Student = model("student", studentSchema);

export default Student;
