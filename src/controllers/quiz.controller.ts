import Course from "../models/course.model";
import Quiz from "../models/quiz.model";
import Teacher from "../models/teacher.model";
import ApiError from "../utils/ApiError";
import { Request, Response } from "express";
import ApiResponse from "../utils/ApiResponse";
import { UserRequest } from "../types";

export const createNewQuiz = async (req: Request, res: Response) => {
  // varification  of authorization
  const { role, email, courseId }: any = req.body;

  if (role !== "teacher") {
    throw new ApiError(400, "You do not have permission to create a course.");
  }

  const teacher = await Teacher.findOne({
    email,
  });

  if (!teacher) {
    throw new ApiError(400, "Teacher does not exists.");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(400, "The course does not exists.");
  }
  //@ts-ignore
  if (course.teacher !== teacher._id) {
    throw new ApiError(400, "The teacher does not takes the course.");
  }

  // varification of given information
  const { quizName }: any = req.body;
  if (!quizName) {
    throw new ApiError(400, "No quiz name given.");
  }

  // create simple quiz object and store it to db.
  const quiz = await Quiz.create({
    teacher: teacher._id,
    course: course._id,
    name: quizName,
  });

  if (!quiz) {
    throw new ApiError(500, "There was an error creating the quiz.");
  }

  const result = { success: true, quiz };

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

export const deleteQuiz = async (req: Request, res: Response) => {
  // test teacher and if he ownes the quiz
  // get quiz id and test if it exists with proper validation
  // delete the quiz
  // return the resutl
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "The quiz has been deleted."));
};
