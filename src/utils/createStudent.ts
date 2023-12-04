import Student from "../models/student.model";
import ApiError from "./ApiError";

interface CreateStudent {
  email: string;
}
const createStudent = async ({ email }: CreateStudent) => {
  // test if there is any student with the email
  const existedUser = await Student.findOne({
    email,
  });
  if (existedUser) {
    throw new ApiError(400, "Student already exists!");
  }
  const createdUser = await Student.create({
    email,
  });
  return createdUser;
};

export default createStudent;
