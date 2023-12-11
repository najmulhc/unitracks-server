import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.util";
import {
  getStudent,
  studentInputPhaseOne,
  studnetInputPhaseTwo,
} from "../controllers/student.controller";
import varifyJWT from "../middlewares/varifyJWT";

const studentRouter = Router();

studentRouter.route("/").get(varifyJWT, asyncHandler(getStudent));
studentRouter.post(
  "/authphase/one",
  varifyJWT,
  asyncHandler(studentInputPhaseOne),
);
studentRouter.post(
  "/authphase/two",
  varifyJWT,
  asyncHandler(studnetInputPhaseTwo),
);

export default studentRouter;
