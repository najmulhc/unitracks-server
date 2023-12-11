import { Request, Response } from "express";
import Student from "../models/student.model";
import ApiError from "../utils/ApiError";

export const getStudent = async (req: Request, res: Response) => {
  // get user ID from jwt,
  const { email, role } = req.body;
  // varify user is student
  if (role !== "student") {
    throw new ApiError(400, "You are not a student");
  }
  const student = await Student.findOne({
    email,
  });
  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  return res.json({
    success: true,
    student,
  });
  // return student object
};

// student input phase one
export const studentInputPhaseOne = async (req: Request, res: Response) => {
  // varify the user is student
  const { email, role } = req.body;
  // varify user is student
  if (role !== "student") {
    throw new ApiError(400, "You are not a student");
  }
  // he is in the phase One state in registration
  const student = await Student.findOne({
    email,
  });
  if (!student) {
    throw new ApiError(404, "Student not found.");
  }
  if (student.authStage !== "one") {
    throw new ApiError(400, "you are in wrong auth phase!");
  }
  // get body basic info (firstName, lastName, dateOfBirh, bloodGroup) etc.
  const { firstName, lastName, dateOfBirh, bloodGroup } = req.body;
  // varify the information given as per request.
  if (!firstName || !lastName || !dateOfBirh || !bloodGroup) {
    throw new ApiError(
      400,
      "Incomplete user information, please give full info",
    );
  }
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  if (!bloodGroups.includes(bloodGroup)) {
    throw new ApiError(400, "Invalid blood group.");
  }
  const realDateOfBirth = new Date(dateOfBirh).getTime();
  if (!realDateOfBirth || typeof realDateOfBirth !== "number") {
    throw new ApiError(400, "Invalid date of birth.");
  }
  // update student object with new info and change user auth phase
  const updatedStudent = await Student.findOneAndUpdate(
    { email },
    {
      firstName,
      lastName,
      dateOfBirth: realDateOfBirth,
      bloodGroup,
      authStage: "two",
    },
    { new: true },
  );
  // return new student object
  return res.json({
    success: true,
    student: updatedStudent,
  });
};

export const studnetInputPhaseTwo = async (req: Request, res: Response) => {
  // varify the user is a student and is in auth phase two.
  // varify the user is student
  const { email, role } = req.body;
  // varify user is student
  if (role !== "student") {
    throw new ApiError(400, "You are not a student");
  }
  // he is in the phase One state in registration
  const student = await Student.findOne({
    email,
  });
  if (!student) {
    throw new ApiError(404, "Student not found.");
  }
  if (student.authStage !== "two") {
    throw new ApiError(400, "you are in wrong auth phase!");
  }
  // get information such as batch, roll, section and other academic info.
  const { roll, session } = req.body;

  // varify user given info as per request.
  if (!roll || !session) {
    throw new ApiError(
      400,
      "Incomplete form informaiton, we need full information",
    );
  }
  const studentWithRoll = await Student.findOne({
    roll,
  });
  if (studentWithRoll) {
    throw new ApiError(401, "Student already exists with this roll.");
  }

  const sessions = ["2020", "2019"];

  if (!sessions.includes(session)) {
    throw new ApiError(400, "Invalid session! please provide the correct one.");
  }

  // update student object with new info and set authphase to completed
  const updatedStudent = await Student.findOneAndUpdate(
    {
      email,
    },
    {
      roll,
      session,
      authStage: "completed",
      courses: [],
    },
    {
      new: true,
    },
  );
  // return student new object with no courses.
  return res.status(200).json({
    success: true,
    student: updatedStudent,
  });
};
