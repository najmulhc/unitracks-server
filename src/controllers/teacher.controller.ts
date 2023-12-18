// teacher auth stage one.

import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import Teacher from "../models/teacher.model";
import { TeacherType, UserRequest } from "../types";
import ApiResponse from "../utils/ApiResponse";

// completes the information collection process of a teacher
export const postTeacher = async (req: UserRequest, res: Response) => {
  // this will take all information needed for a teacher
  const { email, role } = req.user;
  const existedTeacher: TeacherType | null = await Teacher.findOne({
    email,
  });

  if (existedTeacher?.authStage !== "one") {
    throw new ApiError(401, "Your auth stage has been already completed!");
  }

  const { firstName, lastName, bloodGroup, title } = req.body;

  // validation of the given information
  if (!firstName || !lastName || !bloodGroup || !title) {
    throw new ApiError(
      400,
      "Incomplete user request. please fill the full form",
    );
  }

  // validation of given information's correctness
  const bloodGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];
  const titles = ["Professor", "Assistant Professor", "Lecturer"];

  if (!titles.includes(title)) {
    throw new ApiError(
      400,
      "Invalid teacher title, please provide the correct one.",
    );
  }
  if (!bloodGroups.includes(bloodGroup)) {
    throw new ApiError(
      400,
      "Invalid blood group, please provide  the correct one.",
    );
  }

  const updatedTeacher = await Teacher.findOneAndUpdate(
    {
      email,
    },
    {
      firstName,
      lastName,
      bloodGroup,
      title,
      authStage: "completed",
    },
    {
      new: true,
    },
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        teacher: updatedTeacher,
      },
      "The teacher has updated.",
    ),
  );
};

// gives the teacher object to the request
export const getTeacher = async (req: UserRequest, res: Response) => {
  // jwt will give the email and role
  const { email, role } = req.user;
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

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        teacher,
      },
      "Found the teacher",
    ),
  );
};
