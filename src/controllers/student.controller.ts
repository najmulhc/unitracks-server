import { Request, Response } from "express";
import Student from "../models/student.model";
import ApiError from "../utils/ApiError";
import { UserRequest } from "../types";
import ApiResponse from "../utils/ApiResponse";

export const getStudent = async (req: UserRequest, res: Response) => {
  const { student } = req;
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        student,
      },
      "Student found successfully",
    ),
  );
};

// student input phase one
export const studentInputPhaseOne = async (req: UserRequest, res: Response) => {
  const { student } = req;
  if (student?.authStage !== "one") {
    throw new ApiError(401, "you are in wrong auth phase!");
  }
  // get body basic info (firstName, lastName, dateOfBirh, bloodGroup) etc.
  const { firstName, lastName, dateOfBirth, bloodGroup } = req.body;
  // varify the information given as per request.
  if (!firstName || !lastName || !dateOfBirth || !bloodGroup) {
    throw new ApiError(
      400,
      "Incomplete user information, please give full info",
    );
  }
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  if (!bloodGroups.includes(bloodGroup)) {
    throw new ApiError(400, "Invalid blood group.");
  }
  const realDateOfBirth = new Date(dateOfBirth).getTime();
  if (!realDateOfBirth || typeof realDateOfBirth !== "number") {
    throw new ApiError(400, "Invalid date of birth.");
  }
  // update student object with new info and change user auth phase
  const updatedStudent = await Student.findOneAndUpdate(
    { email: student.email },
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
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        student: updatedStudent,
      },
      "student auth phase one completed.",
    ),
  );
  
};

// student input phase two
export const studnetInputPhaseTwo = async (req: UserRequest, res: Response) => {
  const { student } = req;
  if (student?.authStage !== "two") {
    throw new ApiError(401, "you are in wrong auth phase!");
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
      email: student.email,
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
   return res.status(200).json(
     new ApiResponse(
       200,
       {
         student: updatedStudent,
       },
       "student auth phase two completed.",
     ),
   );
};
