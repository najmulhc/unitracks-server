import mongoose, { ObjectId } from "mongoose";
import { Types } from "mongoose";
import { Response } from "express";
import { UserRequest } from "../types";
import courseTeacherTester from "../utils/courseTeacherTester";
import ApiError from "../utils/ApiError.util";
import Quiz from "../models/evaluations/quiz.model";
import ApiResponse from "../utils/ApiResponse.util";

// route handler for quiz creation.
const createQuiz = async (req: UserRequest, res: Response) => {
  const course = await courseTeacherTester({
    courseId: req.params.courseId as string,
    teacherEmail: req?.teacher?.email as string,
  });

  const { name, startingTime, endingTime } = req.body;

  if (!name || !startingTime || !endingTime) {
    throw new ApiError(400, "Incomplete quiz creation request.");
  }

  if (typeof name !== "string") {
    throw new ApiError(
      400,
      "Invalid type of data in the quiz name. we only accept string for this data.",
    );
  }
  if (typeof startingTime !== "number" || typeof endingTime !== "number") {
    throw new ApiError(
      400,
      "Invalid type of data in the date fields. Please provide data in unix date number.",
    );
  }

  const createdQuiz = await Quiz.create({
    courseId: course?._id,
    name,
    startTime: startingTime,
    endTime: endingTime,
  });

  if (!createdQuiz) {
    throw new ApiError(500, "There was an error to create the quiz.");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        createdQuiz,
      },
      "Successfully created the quiz.",
    ),
  );
};

// route handler for accessing all quizzess

// route handler for getting a single quiz

// route handler for updating a quiz

// route handler for deleting a quiz

// route handler for adding questiuons to a quiz

// route handler for deleting a question from a quiz.

// route handler for publishing a quiz
