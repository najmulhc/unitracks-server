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
import courseStudentTester from "../utils/courseStudentTester.util";
import mongoose from "mongoose";
import AssignmentResponse from "../models/evaluations/assignmentResponse.model";
import Presentation from "../models/evaluations/presentation.model";

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

// ASSIGNMENT PART

// when a teacher will create a new assignment for the course.
export const createAssignment = async (req: UserRequest, res: Response) => {
  const course: CourseType = await courseTeacherTester({
    courseId: req.params.courseId,
    teacherEmail: req?.teacher?.email as string,
  });

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
export const getAllAssignments = async (req: UserRequest, res: Response) => {
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

// get a single assignment by any user wanted.
export const getSingleAssignment = async (req: UserRequest, res: Response) => {
  const course = await findCourse(req.params.courseId);
  const { assignmentId } = req.params;

  if (!assignmentId) {
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
};

// route handler for deleting a course's any assignment by a teacher
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

  const marksDistribution: MarksDistributionType =
    (await MarksDistribution.findOne({
      course: course._id,
    })) as MarksDistribution;

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
    throw new ApiError(
      500,
      "There was a problem to update the marks distribution.",
    );
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

// route handler for updating a course's any assignment by a teacher
export const upadateAssignment = async (req: UserRequest, res: Response) => {
  const course = await courseTeacherTester({
    courseId: req.params.courseId as string,
    teacherEmail: req?.teacher?.email as string,
  });
  const assignment = await Assignment.findById(req.params.assignmentId);
  if (!assignment) {
    throw new ApiError(404, "No assignment found with the given Id.");
  }
  const { updatedInformation } = req.body;

  const updatedCourse = await Assignment.findByIdAndUpdate(
    req.params.assignmentId,
    {
      $set: {
        ...updatedInformation,
      },
    },
    { new: true },
  );

  if (!updatedCourse) {
    throw new ApiError(500, "There was a problem to update the assignment.");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        updatedCourse,
      },
      "Successfully updated the assignment.",
    ),
  );
};

// route handler for submitting a response by a/multiple students.

export const submitAssignment = async (req: UserRequest, res: Response) => {
  const course = await courseStudentTester({
    courseId: req.params.courseId as string,
    studentId: req?.student?._id as mongoose.Schema.Types.ObjectId,
  });
  const { assignmentId } = req.params;
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new ApiError(404, "No assignment found with the given Id.");
  }

  const alreadySubmitted = await AssignmentResponse.findOne({
    assigmentId: assignment._id,
    students: [req?.student?._id as mongoose.Schema.Types.ObjectId],
  });

  if (alreadySubmitted) {
    throw new ApiError(403, "You have already submitted the assignment.");
  }

  // now we have a fresh response submitted that passed all validations. we can now save the response to the database.
};

export const evaluateAssignment = async (req: UserRequest, res: Response) => {
  const course = await courseTeacherTester({
    teacherEmail: req?.teacher?.email as string,
    courseId: req.params.courseId as string,
  });

  const assignmentResponse = await AssignmentResponse.findById(req.params)
};

// PRESENTATION PART

// route handler for creating a new presentation by teacher.
export const createPresentation = async (req: UserRequest, res: Response) => {
  const course = await courseTeacherTester({
    courseId: req.params.courseId as string,
    teacherEmail: req?.teacher?.email as string,
  });

  const marksDistribution = await MarksDistribution.findOne({
    course: course._id,
  });

  if (!marksDistribution) {
    throw new ApiError(500, "Your course may not have marks distributed yet.");
  }

  if (
    marksDistribution.presentation.count ===
    marksDistribution.presentation.taken
  ) {
    throw new ApiError(
      400,
      "You have already taken the maximum number of presentations.",
    );
  }

  const { presentationTopic, startingTime, endingTime, description } = req.body;

  if (!presentationTopic || !startingTime || endingTime || description) {
    throw new ApiError(400, "Incomplete presentation information.");
  }

  if (
    typeof presentationTopic !== "string" ||
    typeof description !== "string"
  ) {
    throw new ApiError(
      400,
      "Invalid type of data given for presentation title or description or both. We accept only string type of data for them.",
    );
  }

  if (typeof startingTime !== "number" || typeof endingTime !== "number") {
    throw new ApiError(
      400,
      "Invalid type of data for presentation start and end time. we accept neumaric value of time in unix system.",
    );
  }

  const createdPresentation = await Presentation.create({
    topic: presentationTopic,
    description,
    startingTime,
    endingTime,
    course: course._id,
  });

  if (!createdPresentation) {
    throw new ApiError(500, "There was a problem to create the presentation.");
  }

  const updatedMarksDistribution = MarksDistribution.findByIdAndUpdate(
    marksDistribution._id,
    {
      $set: {
        presentation: {
          ...marksDistribution.presentation,
          taken: marksDistribution.presentation.taken + 1,
        },
      },
    },
  );

  if (!updatedMarksDistribution) {
    await Presentation.findByIdAndDelete(createdPresentation._id);
    throw new ApiError(
      500,
      "There was an error to update the marks distribution document.",
    );
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        presentation: createdPresentation,
        marksDistribution: updatedMarksDistribution,
      },
      "Successfully created the presentation.",
    ),
  );
};

// route handler for updating a new presentation by teacher.
export const updatePresentation = async (req: UserRequest, res: Response) => {
  const course = await courseTeacherTester({
    courseId: req.params.courseId as string,
    teacherEmail: req?.teacher?.email as string,
  });
  const presentation = await Presentation.findById(req.params.presentationId);

  if (!presentation) {
    throw new ApiError(404, "No presentation found with the given Id.");
  }
  const { updatedPresentationRequest } = req.body;

  const updatedPresentation = await Presentation.findByIdAndUpdate(
    req.params.presentationId,
    {
      $set: {
        ...updatedPresentationRequest,
      },
    },
    { new: true },
  );

  if (!updatedPresentation) {
    throw new ApiError(500, "There was a problem to update the presentation.");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        updatedPresentation,
      },
      "Successfully updated the presentation.",
    ),
  );
};

// route handler for deleting a presentation by teacher
export const deletePresentation = async (req: UserRequest, res: Response) => {
  const course = await courseTeacherTester({
    teacherEmail: req.teacher?.email as string,
    courseId: req.params.courseId as string,
  });
  const presentation = await Presentation.findById(req.params.presentationId);

  if (!presentation) {
    throw new ApiError(404, "No presentation found with the given Id.");
  }

  const deletedPresentation = await Presentation.findByIdAndDelete(
    req.params.presentationId,
  );

  if (!deletedPresentation) {
    throw new ApiError(500, "There was a problem to delete the presentation.");
  }

  const marksDistribution: MarksDistributionType =
    (await MarksDistribution.findOne({
      course: course._id,
    })) as MarksDistribution;

  const updatedMarksDistribution = await MarksDistribution.findOneAndUpdate(
    {
      course: course._id,
    },
    {
      $set: {
        presentation: {
          ...marksDistribution?.presentation,
          taken: marksDistribution?.presentation.taken - 1,
        },
      },
    },
    { new: true },
  );

  if (!updatedMarksDistribution) {
    throw new ApiError(
      500,
      "There was a problem to update the marks distribution.",
    );
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        success: true,
      },
      "successfully deleted the presentation.",
    ),
  );
};

// route handler for getting all the presentations of the course.
export const getAllPresentations = async (req: UserRequest, res: Response) => {
  const course = await findCourse(req.params.courseId);

  const presentations = await Presentation.find({
    course: course._id,
  });

  if (!presentations) {
    throw new ApiError(404, "No presentation are there in this course.");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { presentations },
        "Successfully fetched all presentations.",
      ),
    );
};

// route handler for getting a single presentation of the course. (two usecase, one for teacher and the other for students.)
export const getSinglePresentation = async (
  req: UserRequest,
  res: Response,
) => {
  const presentation = await Presentation.findById(req.params.presentationId);

  if (!presentation) {
    throw new ApiError(404, "No presentation found with the given Id.");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { presentation },
        "Successfully fetched the presentation.",
      ),
    );
};

// route handler for submitting a single presentation response.
export const submitPresentation = async (req: UserRequest, res: Response) => {
  const course = await courseStudentTester({
    courseId: req.params.courseId as string,
    studentId: req?.student?._id as mongoose.Schema.Types.ObjectId,
  });

  const { presentationId } = req.params;
  const presentation = await Presentation.findById(presentationId);

  if (!presentation) {
    throw new ApiError(404, "No presentation found with the given Id.");
  }

  const alreadySubmitted = await AssignmentResponse.findOne({
    presentationId: presentation._id,
    students: [req?.student?._id as mongoose.Schema.Types.ObjectId],
  });

  if (alreadySubmitted) {
    throw new ApiError(403, "You have already submitted the presentation.");
  }

  // now we have a fresh response submitted that passed all validations. we can now save the response to the database.
};

// route handler for evaluating a single presentation response.
export const evaluatePresentation = async (
  req: UserRequest,
  res: Response,
) => {};


