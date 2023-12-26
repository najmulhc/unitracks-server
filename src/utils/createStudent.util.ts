import Student from "../models/student.model";
import ApiError from "./ApiError.util";
 
const createStudent = async (email: string) => {
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
