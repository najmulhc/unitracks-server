import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler.util";

const varifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  const token = req.headers?.authorization.split(" ")[1];
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
  const { role } = user;
  //@ts-ignore
  req.body.role = role;
  //@ts-ignore
  req.body.email = email;
  //@ts-ignore
  req.body.user = user;
  next();
};

export default asyncHandler(varifyJWT);
