import { NextFunction } from "express";
import { UserRequest } from "../types";
import asyncHandler from "../utils/asyncHandler.util";
import Admin from "../models/admin.model";
import ApiError from "../utils/ApiError";

// the user of the request will come from the varifyJWT middleware.
const adminTester = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { email } = req.user;

      const foundAdmin = await Admin.findOne(email);

      if (!foundAdmin) {
        throw new ApiError(404, "Admin is not found.");
      }

      req.admin = foundAdmin;

      next();
    } catch (error: any) {
      throw new ApiError(
        400,
        error.message || "There was an error testing admin previlages.",
      );
    }
  },
);

export default adminTester;
