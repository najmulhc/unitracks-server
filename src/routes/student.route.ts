import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.util";
import {
  getStudent,
  studentInputPhaseOne,
} from "../controllers/student.controller";
import varifyJWT from "../middlewares/varifyJWT";

const studentRouter = Router();

studentRouter.route("/").get(varifyJWT, asyncHandler(getStudent));
studentRouter.post(
  "/authphase/one",
  varifyJWT,
  asyncHandler(studentInputPhaseOne),
);

export default studentRouter;
