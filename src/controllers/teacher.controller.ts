// teacher auth stage one.

import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import Teacher from "../models/teacher.model";

export const postTeacher = async (req: Request, res: Response) => {
  // this will take all information needed for a teacher
};

export const getTeacher = async (req: Request, res: Response) => {
  // jwt will give the email and role
  const { email, role } = req.body;
  if (role !== "teacher") {
    throw new ApiError(
      401,
      "you Do not have permission to perform this action",
    );
  }
  const teacher = await Teacher.findOne({
    email,
  });

  if (!teacher) {
    throw new ApiError(404, "The teacher does not exists!");
  }

  return res.status(200).json({
    success: true,
    teacher: teacher,
  });
};

// teacher auth stage two
