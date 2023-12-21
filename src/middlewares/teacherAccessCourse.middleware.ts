import { NextFunction, Response } from "express";

import Course from "../models/course.model";
import { UserRequest } from "../types";
import ApiError from "../utils/ApiError.util";

const teacherCourseAccess = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacher = req.teacher;
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      throw new ApiError(404, "The course is not available.");
    }

    if (teacher?._id !== course?.teacher) {
      throw new ApiError(403, "The teacher does not have acces to the course.");
    } else {
      req.course = course;
      next();
    }
  } catch (error) {
    throw new ApiError(
      400,
      "There was an error while testing the teacher access. ",
    );
  }
};

export default teacherCourseAccess;
