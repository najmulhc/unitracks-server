import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
