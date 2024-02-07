import Course from "../models/course.model";
import ApiError from "./ApiError.util";

const findCourse = async (courseId: string) => {
  if (!courseId) {
    throw new ApiError(400, "No course Id is provided.");
  }
  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }
  return course;
};

export default findCourse;
