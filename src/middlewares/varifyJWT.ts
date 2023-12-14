import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler.util";
import { UserRequest } from "../types";

const varifyJWT = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  const token: string | undefined = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(400, "No token given", [], "");
  }
  const decoded:
    | {
        email: string;
      }
    | JwtPayload
    | string = jwt.verify(token, process.env.JWT_SIGN as string);
  if (!decoded) {
    throw new ApiError(404, "Invalid token.", [], "");
  }
  //@ts-ignore
  const { email } = decoded;
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(404, "User Does not eixsts.");
  }
  req.user = user;
  next();
};

export default asyncHandler(varifyJWT);
