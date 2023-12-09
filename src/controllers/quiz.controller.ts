// creating a new quiz

import Course from "../models/course.model";
import Quiz from "../models/quiz.model";
import Teacher from "../models/teacher.model";
import ApiError from "../utils/ApiError";

export const createNewQuiz = async (req: Request, res) => {
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
  return res.json(result);
};

// adding questions to the quiz

// getting a quiz by id.

// getting quizzes by course for a student.

// getting all quizzes by a teacher.

// getting quiz questions by students

// posting student response of a quiz

// deleting a quiz
