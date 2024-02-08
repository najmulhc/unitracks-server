import Course from "../models/course.model";
import Assignment from "../models/evaluations/assignment.model";
import FinalScore from "../models/evaluations/finalScore.model";
import MarksDistribution from "../models/evaluations/marksDistribution.model";
import {
  CourseType,
  MarksDistribution as MarksDistributionType,
  
  StudentType,
  TeacherType,
  UserRequest,
} from "../types";
import ApiError from "../utils/ApiError.util";
import ApiResponse from "../utils/ApiResponse.util";
import { Response } from "express";
import findCourse from "../utils/findCourse.util";
import courseTeacherTester from "../utils/courseTeacherTester";

export const getStudentProfile = async (req: UserRequest, res: Response) => {
  const { _id } = req.student as StudentType;
  if (!_id) {
    throw new ApiError(404, "Student not found");
  }
  const course: CourseType = await findCourse(req.params.courseId);

  const studentProfile = await FinalScore.findOne({
    student: _id,
    course: course._id,
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

// when a teacher will create a new assignment for the course.
export const scheduleAssignment = async (req: UserRequest, res: Response) => {
  const course: CourseType = await findCourse(req.params.courseId);
  const teacher = req?.teacher;

  if (teacher?._id !== course.teacher) {
    throw new ApiError(400, "You do not have the access of the course.");
  }

  const marksDistribution = await MarksDistribution.findOne({
    course: course._id,
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

// to get all the assignments of the course.
export const getAssignments = async (req: UserRequest, res: Response) => {
  const course = await findCourse(req.params.courseId);
  const assignments = await Assignment.find({ course: course._id });
  if (!assignments) {
    throw new ApiError(404, "No assignments found for the course.");
  }

  // if the requester is a student, we need to give them the list of assignments, with how many of them are submitted.

  res.status(200).json(
    new ApiResponse(
      200,
      {
        assignments,
      },
      "Successfully fetched all the assignments of the course.",
    ),
  );
};

// get a single assignment 
export const getSingleAssignment = async (req: UserRequest, res: Response) => {
  const course = await findCourse(req.params.courseId);
  const {assignmentId} = req.params;

  if(!assignmentId) {
    throw new ApiError(400, "No assignment Id is provided.");
  }

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new ApiError(404, "No assignment found with the given Id.");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        assignment,
      },
      "Successfully fetched the assignment.",
    ),
  );
}

export const deleteAssignment = async (req: UserRequest, res: Response) => {
  const teacher: TeacherType = req?.teacher as TeacherType;
  const course = await courseTeacherTester({
    courseId: req.params.courseId as string,
    teacherEmail: teacher.email,
  });

  const { assignmentId } = req.params;
  if (!assignmentId) {
    throw new ApiError(400, "No assignment Id is provided.");
  }
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new ApiError(404, "No assignment found with the given Id.");
  }

  const deletedAssignment = await Assignment.findByIdAndDelete(assignmentId);

  if (!deletedAssignment) {
    throw new ApiError(500, "There was a problem to delete the assignment.");
  }

  const marksDistribution: MarksDistributionType = (await MarksDistribution.findOne(
    {
      course: course._id,
    },
  )) as MarksDistribution;

  const updatedMarksDistribution = await MarksDistribution.findOneAndUpdate(
    {
      course: course._id,
    },
    {
      $set: {
        assignment: {
          ...marksDistribution?.assignment,
          taken: marksDistribution?.assignment.taken - 1,
        },
      },
    },
    { new: true },
  );

  if (!updatedMarksDistribution) {
    throw new ApiError(500, "There was a problem to update the marks distribution.");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        success: true,
      },
      "successfully deleted the assignment.",
    ),
  );
};
