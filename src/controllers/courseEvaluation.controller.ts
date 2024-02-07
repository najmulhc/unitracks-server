import Course from "../models/course.model";
import Assignment from "../models/evaluations/assignment.model";
import FinalScore from "../models/evaluations/finalScore.model";
import MarksDistribution from "../models/evaluations/marksDistribution.model";
import { StudentType, TeacherType, UserRequest } from "../types";
import ApiError from "../utils/ApiError.util";
import ApiResponse from "../utils/ApiResponse.util";
import { Response } from "express";

export const getStudentProfile = async (req: UserRequest, res: Response) => {
  const { _id } = req.student as StudentType;
  if (!_id) {
    throw new ApiError(404, "Student not found");
  }
  const { courseId } = req.params;
  if (!courseId) {
    throw new ApiError(400, "Course id is required");
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const studentProfile = await FinalScore.findOne({
    student: _id,
    course: courseId,
  });
  if (!studentProfile) {
    throw new ApiError(404, "Student profile has not created yet.");
  }

  res.json(
    new ApiResponse(
      200,
      {
        studentProfile,
        course,
      },
      "Successfully found teh student profile.",
    ),
  );
};

export const scheduleAssignment = async (req: UserRequest, res: Response) => {
  const { courseId } = req.params;
  if (!courseId) {
    throw new ApiError(400, "Course id is required");
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const teacher = req?.teacher;

  if (teacher?._id !== course.teacher) {
    throw new ApiError(400, "You do not have the access of the course.");
  }

  const marksDistribution = await MarksDistribution.findOne({
    course: courseId,
  });

  if (!marksDistribution) {
    throw new ApiError(500, "Your course may not have marks distributed yet.");
  }

  if (
    marksDistribution.assignment.count === marksDistribution.assignment.taken
  ) {
    throw new ApiError(
      400,
      "You have already taken the maximum number of assignments.",
    );
  }

  const { assignmentTopic, startingTime, endingTime, description, type } =
    req.body;

  if (!assignmentTopic || !startingTime || endingTime || description || type) {
    throw new ApiError(400, "Incomplete assignment information.");
  }

  if (!["individual", "group"].includes(type)) {
    throw new ApiError(
      400,
      "Invalid type of assignment type given. It can either be individual or group.",
    );
  }

  if (typeof assignmentTopic !== "string" || typeof description !== "string") {
    throw new ApiError(
      400,
      "Invalid type of data given for assignment title or description or both. We accept only string type of data for them.",
    );
  }

  if (typeof startingTime !== "number" || typeof endingTime !== "number") {
    throw new ApiError(
      400,
      "Invalid type of data for assignment start and end time. we accept neumaric value of time in unix system.",
    );
  }

  const createdAssignment = await Assignment.create({
    topic: assignmentTopic,
    description,
    startingTime,
    endingTime,
    type,
    course: course._id,
  });

  if (!createdAssignment) {
    throw new ApiError(500, "There was a problem to create the assignment.");
  }

  const updatedMarksDistribution = MarksDistribution.findByIdAndUpdate(
    marksDistribution._id,
    {
      $set: {
        assignment: {
          ...marksDistribution.assignment,
          taken: marksDistribution.assignment.taken + 1,
        },
      },
    },
  );

  if (!updatedMarksDistribution) {
    await Assignment.findByIdAndDelete(createdAssignment._id);
    throw new ApiError(
      500,
      "There was an error to update the marks distribution document.",
    );
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        assignment: createdAssignment,
        marksDistribution: updatedMarksDistribution,
      },
      "Successfully created the assignment.",
    ),
  );
};
