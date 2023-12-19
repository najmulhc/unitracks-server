import { NextFunction, Response } from "express";
import { TeacherType, UserRequest } from "../types";
import ApiError from "../utils/ApiError";
import Teacher from "../models/teacher.model";

const teacherTester = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, role } = req.user;
    if (role !== "teacher") {
      throw new ApiError(401, "Unauthorized access to be a teacher.");
    }
    const teacher: TeacherType | null = await Teacher.findOne({
      email,
    });

    if (!teacher?.email) {
      throw new ApiError(404, "Teacher not found!");
    }

    req.teacher = teacher;
    next();
  } catch (error: any) {
    throw new ApiError(
      400,
      error.message || "something went wrong while testing the teacher",
    );
  }
};

export default teacherTester;
