import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import dbConnect from "../dbconnect";
import { UserType } from "../types";
const jwt = require("jsonwebtoken");

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
    const token = jwt.sign({ email }, process.env.JWT_SIGN);
    res.json({
      success: true,
      user: createdUser,
      token,
    });
  } catch (error: any) {
    res.json({
      success: false,
      body: req.body,
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { email, password } = req.body;
    let user: UserType | null = null;
    //find user
    user = await User.findOne({
      email,
    });

    if (!user) {
      throw new Error("User not found");
    }
    const compared = bcrypt.compare(password, user.hashedPassword);
    if (!compared) {
      throw new Error("Incorrect password!");
    }

    const token = jwt.sign(
      {
        email,
      },
      process.env.JWT_SIGN
    );

    return res.json({
      success: true,
      token,
      role: user.role,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      body: req.body,
      message: error.message,
    });
  }
};

// sign up as admin
// set role for users
// delete unwanted users
