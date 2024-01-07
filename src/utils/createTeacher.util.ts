import mongoose, { mongo } from "mongoose";
import Teacher from "../models/teacher.model";
import ApiError from "./ApiError.util";

// will create a new teacher once the admin assigns an unassigned user into a teacher.
const createTeacher = async ({
  email, userId
}: {
  email: string, userId: mongoose.Schema.Types.ObjectId
}) => {
  const existedTeacher = await Teacher.findOne({
    email,
  });
  if (existedTeacher) {
    throw new ApiError(400, "A teacher exists with the email");
  }
  const createdTeacher = await Teacher.create({
    email, userId
  });
  return createdTeacher;
};

export default createTeacher;
