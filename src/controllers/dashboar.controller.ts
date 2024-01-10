//  get all dashboar data for admin

import { Response } from "express";
import { UserRequest } from "../types";
import ApiError from "../utils/ApiError.util";
import Student from "../models/student.model";
import User from "../models/user.model";
import ApiResponse from "../utils/ApiResponse.util";

export const getDashboardInfo = async (req: UserRequest, res: Response) => {
  const { role } = req.user;
  if (role === "admin") {
    /**
     *  as admin we need infos like,
     * number of students, teachers, courses
     *
     */
  } else if (role === "student") {
  } else if (role === "teacher") {
    const student = await Student.aggregate([
      {
        $match: {
          userId: req.user._id,
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "students",
          as: "courses",
        },
      },
      {
        $addFields: {
          courseCount: {
            $size: "courses",
          },
        },
      },
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          student,
        },
        "got the dashboard data for students.",
      ),
    );
  }
  if (!role || role === "unassigned") {
    throw new ApiError(
      403,
      "You do not have permission to have dashboard data.",
    );
  }
};
