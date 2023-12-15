import Teacher from "../models/teacher.model";
import ApiError from "./ApiError";

// will create a new teacher once the admin assigns an unassigned user into a teacher.
const createTeacher = async (email: string) => {
  const existedTeacher = await Teacher.findOne({
    email,
  });
  if (existedTeacher) {
    throw new ApiError(402, "A teacher exists with the email");
  }
  const createdTeacher = await Teacher.create({
    email,
  });
  return createdTeacher;
};

export default createTeacher;

