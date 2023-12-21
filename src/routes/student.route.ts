import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.util";
import {
  getStudent,
  studentInputPhaseOne,
  studnetInputPhaseTwo,
} from "../controllers/student.controller";
import varifyJWT from "../middlewares/varifyJWT.middleware";
import studentTester from "../middlewares/studentTester.middleware";

const studentRouter = Router();

studentRouter
  .route("/")
  .get(varifyJWT, asyncHandler(studentTester), asyncHandler(getStudent));
studentRouter.post(
  "/auth-phase/one",
  varifyJWT,
  asyncHandler(studentTester),
  asyncHandler(studentInputPhaseOne),
);
studentRouter.post(
  "/auth-phase/two",
  varifyJWT,
  asyncHandler(studentTester),
  asyncHandler(studnetInputPhaseTwo),
);

export default studentRouter;
