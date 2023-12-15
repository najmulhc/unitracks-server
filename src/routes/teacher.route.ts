import { Router } from "express";
import varifyJWT from "../middlewares/varifyJWT";
import asyncHandler from "../utils/asyncHandler.util";
import { getTeacher, postTeacher } from "../controllers/teacher.controller";

const router = Router();

router
  .route("/")
  .get(asyncHandler(varifyJWT), asyncHandler(getTeacher))
  .post(asyncHandler(varifyJWT), asyncHandler(postTeacher));

export default router;
