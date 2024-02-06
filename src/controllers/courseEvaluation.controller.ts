import Course from "../models/course.model";
import FinalScore from "../models/evaluations/finalScore.model";
import { StudentType, UserRequest } from "../types";
import ApiError from "../utils/ApiError.util";
import ApiResponse from "../utils/ApiResponse.util";
import { Response } from "express";

export const getStudentProfile = async (req: UserRequest, res: Response) => {
  const { _id } = req.student as StudentType;
  if (!_id) {
    throw new ApiError(404, "Student not found");
  }
  const { courseId } = req.params;
  if (!courseId) {
    throw new ApiError(400, "Course id is required");
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const studentProfile = await FinalScore.findOne({
    student: _id,
    course: courseId,
  });
  if (!studentProfile) {
    throw new ApiError(404, "Student profile has not created yet.");
  }

  res.json(new ApiResponse(200, {
    studentProfile,
    course,
  }, "Successfully found teh student profile."));
};
