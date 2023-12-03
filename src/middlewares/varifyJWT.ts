import e, { NextFunction } from "express";
import User from "../models/user.model";
import dbConnect from "../dbconnect";
var jwt = require("jsonwebtoken");

const varifyJWT = async (req: Request, res, next) => {
  //@ts-ignore
  const token = req.headers?.authorization.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SIGN);
  if (!decoded) {
    throw new Error("Invalid token given");
  }
  const { email } = decoded;
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("User does not exists!");
  }
  const { role } = user;
  //@ts-ignore
  req.body?.role = role;
  //@ts-ignore
  req.body?.email = email;
  //@ts-ignore
  req.body?.user = user;
  next();
};

export default varifyJWT;
