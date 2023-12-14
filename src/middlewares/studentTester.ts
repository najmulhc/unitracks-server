import { NextFunction } from "express";
import { StudentType, UserRequest } from "../types";
import ApiError from "../utils/ApiError";
import Student from "../models/student.model";

const studentTester = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, role } = req.user; // jwt varification will give the user object

    if (role !== "student") {
      throw new ApiError(
        402,
        "You do not have permission to perform this action.",
      );
    }

    const student: StudentType | null = await Student.findOne({
      email,
    });

    if (!student) {
      throw new ApiError(404, "There is no student with this email.");
    }

    req.student = student;

    next();
  } catch (error: any) {
    throw new ApiError(
      400,
      error.message || "There was an error accessing your student account",
    );
  }
};

export default studentTester;
