import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";

import { UserRequest, UserType } from "../types";
import Admin from "../models/admin.model";
import * as jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.util";
import createStudent from "../utils/createStudent.util";
import authTester from "../utils/authTester.util";
import createTeacher from "../utils/createTeacher.util";
import ApiResponse from "../utils/ApiResponse.util";

// in the first time the user will have no role assigned, so we will create a simple unassigned user role untill
export const basicRegister = async (req: UserRequest, res: Response) => {
  const { email, password } = req?.body;
  if (!email || !password) {
    throw new ApiError(400, "Incomplete form info!");
  }

  const existedUser: UserType | null = await User.findOne({
    email,
  });
  if (existedUser) {
    throw new ApiError(400, "User already exists!");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await User.create({
    email,
    hashedPassword,
    role: "unassigned",
  });
  const token = jwt.sign(
    { email, role: "unassigned" },
    process.env.JWT_SIGN as string,
  );
  return res.json({
    success: true,
    user: {
      email: createdUser.email,
      role: createdUser.role,
    },
    token,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Incomplete login credentials.");
  }

  let user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  const compared = await bcrypt.compare(password, user.hashedPassword);
  if (!compared) {
    throw new ApiError(400, "Incorrect password.");
  }

  const token = jwt.sign(
    {
      email,
      role: user?.role,
    },
    process.env.JWT_SIGN as string,
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        user: {
          email: user.email,
          role: user.role,
        },
      },
      "user created",
    ),
  );
};

// when an unassigned user wanted to be an admin.
export const beAnAdmin = async (req: UserRequest, res: Response) => {
  const { email, role } = req.user;
  const { key } = req.body;

  authTester(role, "unassigned");

  if (key !== process.env.ADMIN_KEY || !key) {
    throw new ApiError(400, "Invalid admin key");
  }

  const admin = await Admin.create({
    email,
  });
  const updatedUser = await User.findOneAndUpdate(
    { email },
    {
      role: "admin",
    },
    {
      new: true,
    },
  ).select("-hashedPassword");
  const token = jwt.sign(
    {
      email: email,
      role: "admin",
    },
    process.env.JWT_SIGN as string,
  );
  res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        user: updatedUser,
      },
      "user role set to admin.",
    ),
  );
};

// get user from jwt token
export const loginWithToken = async (req: UserRequest, res: Response) => {
  const { user } = req;
  res
    .status(200)
    .json(new ApiResponse(200, { user }, "Got user from given token"));
};

// get all users
export const getAllUsers = async (req: UserRequest, res: Response) => {
  const { role } = req.user;

  authTester(role, "admin");
  const users = await User.find({}).select(
    "-hashedPassword -name -refreshToken",
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
      },
      "all users getted",
    ),
  );
};

export const setUserRole = async (req: UserRequest, res: Response) => {
  const { role } = req.user;
  authTester(role, "admin");
  const { userRole, userEmail } = req.body;

  // test if the user is exist
  const user = await User.findOne({
    email: userEmail,
  });
  if (!user) {
    throw new ApiError(404, "User does not exists.");
  }

  if (user.role !== "unassigned") {
    throw new ApiError(400, "User allready has a role assigned.");
  }

  if (!["teacher", "student"].includes(userRole)) {
    throw new ApiError(400, "Invalid user role.");
  }

  const updatedUser = await User.findOneAndUpdate(
    { email: userEmail },
    { role: userRole },
    {
      new: true,
    },
  );

  // creates new student
  if (req.body.userRole === "student") {
    const createdStudent = await createStudent(userEmail);
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          student: createdStudent,
        },
        "student created Successfully",
      ),
    );
  } else if (userRole === "teacher") {
    // when you are looking to make a teacher
    await createTeacher(userEmail);
  }

  return res.status(200).json({
    success: true,
    users: await User.find(),
  });
};

// delete a user by admin
export const deleteUser = async (req: UserRequest, res: Response) => {
  const { role } = req.user;

  const { deletedUserId } = req.body;
  authTester(role, "admin");

  try {
    const deleted = await User.findByIdAndDelete(deletedUserId);
  } catch (error: any) {
    throw new ApiError(
      500,
      error.message || "there was an error deleting  the user.",
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
};
