import { Router } from "express";
import varifyJWT from "../middlewares/varifyJWT.middleware";
import asyncHandler from "../utils/asyncHandler.util";
import {
  getAllTeachers,
  getTeacher,
  postTeacher,
} from "../controllers/teacher.controller";

const router = Router();

router
  .route("/")
  .get(varifyJWT, asyncHandler(getTeacher))
  .patch(asyncHandler(varifyJWT), asyncHandler(postTeacher));

router.route("/all").get(varifyJWT, asyncHandler(getAllTeachers));

export default router;
