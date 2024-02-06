import { Router } from "express";
import varifyJWTMiddleware from "../middlewares/varifyJWT.middleware";
import asyncHandler from "../utils/asyncHandler.util";
import { getStudentProfile } from "../controllers/courseEvaluation.controller";
import studentTester from "../middlewares/studentTester.middleware";

const router = Router();

router
  .route("/profile/:courseId")
  .get(
    varifyJWTMiddleware,
    asyncHandler(studentTester),
    asyncHandler(getStudentProfile),
  );

export default router;
