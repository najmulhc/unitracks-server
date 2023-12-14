import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.util";
import {
  getStudent,
  studentInputPhaseOne,
  studnetInputPhaseTwo,
} from "../controllers/student.controller";
import varifyJWT from "../middlewares/varifyJWT";
import studentTester from "../middlewares/studentTester";

const studentRouter = Router();

studentRouter
  .route("/")
  .get(varifyJWT, asyncHandler(studentTester), asyncHandler(getStudent));
studentRouter.post(
  "/authphase/one",
  varifyJWT,
  asyncHandler(studentTester),
  asyncHandler(studentInputPhaseOne),
);
studentRouter.post(
  "/authphase/two",
  varifyJWT,
  asyncHandler(studentTester),
  asyncHandler(studnetInputPhaseTwo),
);

export default studentRouter;
