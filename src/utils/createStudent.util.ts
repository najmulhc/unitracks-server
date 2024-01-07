import mongoose from "mongoose";
import Student from "../models/student.model";
import ApiError from "./ApiError.util";
 
const createStudent = async ({
  email,
  userId,
}: {
  email: string;
  userId: mongoose.Schema.Types.ObjectId;
}) => {
  // test if there is any student with the email
  const existedUser = await Student.findOne({
    email,
  });
  if (existedUser) {
    throw new ApiError(400, "Student already exists!");
  }
  const createdUser = await Student.create({
    email, userId
  });

  return createdUser;
};

export default createStudent;
