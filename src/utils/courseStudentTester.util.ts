// this is the utility function to test if the student has access to the course or not. this function requires the studentTester middleware to be used before it.

import mongoose from "mongoose";
import Course from "../models/course.model";
import ApiError from "./ApiError.util";

const courseStudentTester = async ({
  courseId,
  studentId,
}: {
  courseId: string;
  studentId: mongoose.Schema.Types.ObjectId;
}) => {
  if (!courseId || !studentId) {
    throw new ApiError(400, "CourseId and StudentId are required");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  if (!course.students.includes(studentId)) {
    throw new ApiError(403, "You are not allowed to access this course.");
  }

  return course;
};

export default courseStudentTester;
