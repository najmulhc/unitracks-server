import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import dbConnect from "../dbconnect";
import { UserType } from "../types";
import Admin from "../models/admin.model";
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
      body: { email: req.body.email, password: req.body.password },
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
    const compared = await bcrypt.compare(password, user.hashedPassword);
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
      user: user,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// when an unassigned user wanted to be an admin.
export const beAnAdmin = async (req: Request, res: Response) => {
  try {
    await dbConnect();
    const { email, role, key } = req.body;
    console.log(req.body.email, req.body.role);
    if (role !== "unassigned") {
      throw new Error("You do not have permission to perform this task.");
    }
    if (key !== "uU06Qh,33g&,M4~X" || !key) {
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
      }
    );
    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


// get user from jwt token 
export const loginWithToken = async (req, res) => {
  try {
    const {user} = req.body;
    res.json({
      success: true, 
      user
    })
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
}

// sign up as admin
// set role for users
// delete unwanted users
