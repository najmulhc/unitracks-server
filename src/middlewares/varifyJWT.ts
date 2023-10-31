import { NextFunction } from "express";
import User from "../models/user.model";
const jwt = require("jsonwebtoken");

const varifyJWT = (req, res , next ) => {
  const { authorization }: any = req.headers;
  const token = authorization.split(" ")[1];
  const decoded = jwt.varify(token, process.env.JWT_SIGN);
  if (!decoded) {
    throw new Error("Invalid token given");
  }
  const { email } = decoded;
  User.findOne({
    email,
  }).then((user) => {
    if (!user) {
      throw new Error("user does not exists");
    }
    req.body.email = user?.email;
    req.body.role = user?.role;
  });

  next();
};

export default varifyJWT;
