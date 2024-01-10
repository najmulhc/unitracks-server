//  get all dashboar data for admin

import { Response } from "express";
import { UserRequest } from "../types";
import ApiError from "../utils/ApiError.util";

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
  }
  if (!role || role === "unassigned") {
    throw new ApiError(
      403,
      "You do not have permission to have dashboard data.",
    );
  }
};
