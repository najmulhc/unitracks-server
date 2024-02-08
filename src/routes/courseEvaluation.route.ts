import { Router } from "express";
import varifyJWTMiddleware from "../middlewares/varifyJWT.middleware";
import asyncHandler from "../utils/asyncHandler.util";
import {
  deleteAssignment,
  getAssignments,
  getSingleAssignment,
  getStudentProfile,
  scheduleAssignment,
  submitAssignment,
  upadateAssignment,
} from "../controllers/courseEvaluation.controller";
import studentTester from "../middlewares/studentTester.middleware";
import teacherTester from "../middlewares/teacherTester.middleware";

const router = Router();

router
  .route("/profile/:courseId")
  .get(
    varifyJWTMiddleware,
    asyncHandler(studentTester),
    asyncHandler(getStudentProfile),
  );

router
  .route("/:courseId/assignment")
  .post(varifyJWTMiddleware, asyncHandler(scheduleAssignment))
  .get(varifyJWTMiddleware, asyncHandler(getAssignments));

router
  .route("/:courseId/assignment/:assignmentId")
  .delete(
    varifyJWTMiddleware,
    asyncHandler(teacherTester),
    asyncHandler(deleteAssignment),
  )
  .get(varifyJWTMiddleware, asyncHandler(getSingleAssignment))
  .patch(
    varifyJWTMiddleware,
    asyncHandler(teacherTester),
    asyncHandler(upadateAssignment),
  );

router
  .route("/:courseId/assignment/:assignmentId/submit")
  .post(
    varifyJWTMiddleware,
    asyncHandler(studentTester),
    asyncHandler(submitAssignment),
  );

export default router;
