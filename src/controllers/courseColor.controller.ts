// create a color.
import { Response } from "express";
import { UserRequest } from "../types";
import authTester from "../utils/authTester.util";
import ApiError from "../utils/ApiError.util";
import CourseColor from "../models/courseColor.model";
import ApiResponse from "../utils/ApiResponse.util";

export const createColor = async (req: UserRequest, res: Response) => {
  try {
    const { role } = req.user;
    authTester(role, "admin");

    const { colorCode } = req.body;
    if (!colorCode) {
      throw new ApiError(400, "No color code given!");
    }
    const createdColor = await CourseColor.create({
      code: colorCode,
    });
    res.status(200).json(
      new ApiResponse(
        200,
        {
          createdColor,
        },
        "New color Created!",
      ),
    );
  } catch (error: any) {
    throw new ApiError(
      400,
      error?.message || "There was an error while creating the color",
    );
  }
};

// get all colors

export const getAllColors = async (req: UserRequest, res: Response) => {
  const { role } = req.user;
  authTester(role, "admin");
  const colors = await CourseColor.find();
  if (!colors) {
    throw new ApiError(404, "No colors found!");
  }
  res.status(200).json(
    new ApiResponse(
      200,
      {
        colors,
      },
      "Here is all found colors.",
    ),
  );
};

// to delete a color
export const deleteColor = async (req: UserRequest, res: Response) => {
  const { role } = req.user;
  authTester(role, "admin");
  const { deleteColorId } = req.body;
  if (!deleteColorId) {
    throw new ApiError(400, "No Color Id given");
  }
  const deletedColor = await CourseColor.findByIdAndDelete(deleteColorId);
  if (!deletedColor) {
    throw new ApiError(404, "No deleteable color found!");
  }
  const colors = await CourseColor.find();
  if (!colors) {
    throw new ApiError(404, "No colors found!");
  }
  res.status(200).json(
    new ApiResponse(
      200,
      {
        colors,
      },
      "Color deletion complete!",
    ),
  );
};
