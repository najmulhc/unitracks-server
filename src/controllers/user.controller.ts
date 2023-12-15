import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";

import { UserRequest, UserType } from "../types";
import Admin from "../models/admin.model";
import * as jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError";
import createStudent from "../utils/createStudent";
import authTester from "../utils/authTester";
import createTeacher from "../utils/createTeacher";

// in the first time the user will have no role assigned, so we will create a simple unassigned user role untill
export const basicRegister = async (req: UserRequest, res: Response) => {
 
  const { email, password } = req?.body;
  if(!email || !password) {
    throw new ApiError(400, "Incomplete form info!")
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
  const token = jwt.sign({ email }, process.env.JWT_SIGN as string);
  return res.json({
    success: true,
    user: createdUser,
    token,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user: UserType | null = null;

  user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("User not found");
  }
  const compared = await bcrypt.compare(password, user.hashedPassword);
  if (!compared) {
    throw new Error("Incorrect password!");
  }

  const token = jwt.sign(
    {
      email,
    },
    process.env.JWT_SIGN as string,
  );

  return res.json({
    success: true,
    token,
    user: user,
  });
};

// when an unassigned user wanted to be an admin.
export const beAnAdmin = async (req: Request, res: Response) => {
  const { email, role, key } = req.body;

  authTester(role, "unassigned");

  if (key !== process.env.ADMIN_KEY || !key) {
    throw new Error("Invalid admin key");
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
  );
  res.json({
    success: true,
    user: updatedUser,
  });
};

// get user from jwt token
export const loginWithToken = async (req: UserRequest, res: Response) => {
  const { user } = req;
  res.json({
    success: true,
    user,
  });
};

// get all users
export const getAllUsers = async (req: UserRequest, res: Response) => {
  const { role } = req.user;
 
  authTester(role, "admin");
  const users = await User.find({}).select("-hashedPassword -name -refreshToken");

  return res.status(200).json({
    success: true,
    users,
  });
};

export const setUserRole = async (req: UserRequest, res: Response) => {
  const { role } = req.user;
  authTester(role, "admin");
  const updatedUser = await User.findOneAndUpdate(
    { email: req.body.userEmail },
    { role: req.body.userRole },
    {
      new: true,
    },
  );

  let createdObject;
  // creates new student
  if (req.body.userRole === "student") {
    createdObject = await createStudent({
      email: req.body.userEmail,
    });
  } else if (req.body.userRole === "teacher") {
    // when you are looking to make a teacher
    createdObject = await createTeacher(req.body.userEmail);
  }

  return res.status(200).json({
    success: true,
    users: await User.find(),
    createdObject
  });
};

// delete a user by admin
export const deleteUser = async (req: Request, res: Response) => {
  const { role } = req.body;

  const { deletedUser } = req.body;
  authTester(role, "admin");

  const deleted = await User.findOneAndDelete({
    email: deletedUser.email,
  });
  const users = await User.find();
  return res.json({
    success: true,
    users,
  });
};
