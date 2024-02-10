import { Router } from "express";
import varifyJWTMiddleware from "../middlewares/varifyJWT.middleware";
import asyncHandler from "../utils/asyncHandler.util";
import {
  createAssignment,
  createPresentation,
  deleteAssignment,
  evaluatePresentation,
  getAllAssignments,
  getAllPresentations,
  getSingleAssignment,
  getSinglePresentation,
  getStudentProfile,
  submitAssignment,
  upadateAssignment,
  updatePresentation,
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


// for assignments
router
  .route("/:courseId/assignment")
  .post(
    varifyJWTMiddleware,
    asyncHandler(teacherTester),
    asyncHandler(createAssignment),
  )
  .get(varifyJWTMiddleware, asyncHandler(getAllAssignments));

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

// for presentations
router
  .route("/:courseId/presentation")
  .post(
    varifyJWTMiddleware,
    asyncHandler(teacherTester),
    asyncHandler(createPresentation),
  )
  .get(varifyJWTMiddleware, asyncHandler(getAllPresentations));

router
  .route("/:courseId/presentation/:presentationId")
  .get(varifyJWTMiddleware, asyncHandler(getSinglePresentation))
  .patch(
    varifyJWTMiddleware,
    asyncHandler(teacherTester),
    asyncHandler(updatePresentation),
  )
  .delete(
    varifyJWTMiddleware,
    asyncHandler(teacherTester),
    asyncHandler(deleteAssignment),
  );

router
  .route("/:courseId/presentation/:presentationId/submit")
  .post(
    varifyJWTMiddleware,
    asyncHandler(studentTester),
    asyncHandler(submitAssignment),
  );

router
  .route("/:courseId/presentation/:presentationId/evaluate")
  .patch(
    varifyJWTMiddleware,
    asyncHandler(teacherTester),
    asyncHandler(evaluatePresentation),
  );

export default router;
