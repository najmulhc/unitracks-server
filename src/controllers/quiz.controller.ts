import Quiz from "../models/quiz.model";
import ApiError from "../utils/ApiError.util";
import { Request, Response } from "express";
import ApiResponse from "../utils/ApiResponse.util";
import { QuizType, UserRequest } from "../types";

export const createNewQuiz = async (req: UserRequest, res: Response) => {
  const { teacher, course } = req;

  // varification of given information
  const { quizName }: any = req.body;
  if (!quizName) {
    throw new ApiError(400, "No quiz name given.");
  }

  // create simple quiz object and store it to db.
  const quiz = await Quiz.create({
    teacher: teacher?._id,
    course: course?._id,
    name: quizName,
  });

  if (!quiz) {
    throw new ApiError(500, "There was an error creating the quiz.");
  }

  // return created quiz
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        quiz,
      },
      "The quiz has been created.",
    ),
  );
};

// adding questions to the quiz

export const addQuestion = async (req: UserRequest, res: Response) => {
  const { teacher, course } = req;
  return res.status(200).json(new ApiResponse(200, {}, "Messge"));
};

// getting a quiz by id.

export const getQuizById = async (req: UserRequest, res: Response) => {
  return res.status(200).json(new ApiResponse(200, {}, "Messge"));
};

// getting quizzes by course for a student.

export const getAllCoursesForStudent = async (
  req: UserRequest,
  res: Response,
) => {
  return res.status(200).json(new ApiResponse(200, {}, "Messge"));
};

// getting all quizzes by a teacher.

// getting quiz questions by students

export const getQuizQuestions = async (req: UserRequest, res: Response) => {
  return res.status(200).json(new ApiResponse(200, {}, "Messge"));
};

// posting student response of a quiz
export const postQuizResponse = async (req: UserRequest, res: Response) => {
  return res.status(200).json(new ApiResponse(200, {}, "Messge"));
};

// deleting a quiz

export const deleteQuiz = async (req: UserRequest, res: Response) => {
  const { course } = req;
  const { quizId } = req.body;

  // find and validate the quiz
  const quiz: QuizType | null = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(400, "Invalid quiz id.");
  }
  if (quiz && quiz.course !== course?._id) {
    throw new ApiError(404, "The quiz does not exists in the course.");
  }

  // delete the quiz
  try {
    await Quiz.findByIdAndDelete(quizId);
  } catch (error: any) {
    throw new ApiError(
      500,
      error.message || "There was an error to delete the quiz.",
    );
  }

  // return the resutl
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        quizzes: await Quiz.find({
          course: course?._id,
        }),
      },
      "The quiz has been deleted.",
    ),
  );
};
