import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({});

const Course = mongoose.model("Course", courseSchema);

export default Course;