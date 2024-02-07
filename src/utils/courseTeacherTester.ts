import mongoose from "mongoose";
import Course from "../models/course.model";
import ApiError from "./ApiError.util";

const courseTeacherTester = async ({
  courseId,
  teacherEmail,
}: {
  courseId: string;
  teacherEmail: string;
}) => {
  if (!courseId) {
    throw new ApiError(400, "No course Id is provided.");
  }
  const course = await Course.findById(courseId).populate({
    path: "teacher",
    select: "_id email",
  });
  const courseTeacher = course?.teacher as {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  if (!course) {
    throw new ApiError(404, "No course found with the given Id.");
  }
  if (courseTeacher?.email !== teacherEmail) {
    throw new ApiError(404, "You are not the teacher of this course.");
  }
  return course;
};

export default courseTeacherTester;
