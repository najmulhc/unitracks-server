import mongoose, { Schema, Types } from "mongoose";
import { CourseType } from "../types";
import Student from "./student.model";

const courseSchema = new Schema<CourseType>({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
  },
  session: {
    type: String,
    enum: {
      values: ["2020", "2021"],
    },
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  ],
  courseCode: {
    type: Number,
    min: 101,
    max: 110,
    required: [true, "Please Enter the Course Code"],
    index: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  resources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resource",
    },
  ],
  coverImage: {
    type: String,  // will get from cloudinary. 
    required: false, 
  }
});

courseSchema.pre("save", async function (next) {
  if (!this.isModified("courseCode")) {
    return;
  }
  // find the student in the session
  const sessionStudents = await Student.find({
    session: this.session,
  });
  // for each student 1. add the course id to their course array, 2. add their id to the students array.

  this.students = sessionStudents.map((student) => student._id) as [
    Schema.Types.ObjectId,
  ];

  for (let student of sessionStudents) {
    await Student.findOneAndUpdate(
      { email: student.email },
      {
        courses: [...student.courses, this._id],
      },
      {
        new: true,
      },
    );
  }
  next();
});

const Course = mongoose.model("course", courseSchema);

export default Course;
