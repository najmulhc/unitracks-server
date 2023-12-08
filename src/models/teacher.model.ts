import mongoose, { Schema } from "mongoose";
import { TeacherType } from "../types";

const teacherSchema = new Schema<TeacherType>({});

const Teacher = mongoose.model("Model", teacherSchema);

export default Teacher;