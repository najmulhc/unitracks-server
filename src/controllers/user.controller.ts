import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import dbConnect from "../dbconnect";

// in the first time the user will have no role assigned, so we will create a simple unassigned user role untill
export const basicRegister = async (req: Request, res: Response) => {
  try {
    await dbConnect();
 
    const { email, password } = req.body;
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const createdUser = await User.create({
      email,
      hashedPassword,
      role: "unassigned",
    });
    res.json({
      success: true,
      user: createdUser,
    });
  } catch (error: any) {
    res.json({
      success: false,
      body: req.body,
      message: error.message,
    });
  }
};

// sign up as admin
// set role for users
// delete unwanted users
