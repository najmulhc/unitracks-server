import mongoose, { Schema } from "mongoose";

interface StudentRelease {
  name: string;
  roll: string;
  section: "a" | "b";
  hashedPassword: string;
  email: string;
  batch: "15th" | "16th" | "17th" | "18th";
}

const StudentReleaseSchema = new Schema<StudentRelease>({
  name: {
    type: String,
    required: true,
  },
  roll: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
    enum: ["a", "b"],
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
    enum: ["15th", "16th", "17th", "18th"],
  },
});

const StudentReleaseModel = mongoose.model(
  "StudentRelease",
  StudentReleaseSchema,
);

export default StudentReleaseModel;
