import { Router } from "express";
import varifyJWT from "../middlewares/varifyJWT.middleware";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourses,
} from "../controllers/course.controller";
import asyncHandler from "../utils/asyncHandler.util";
import adminTester from "../middlewares/adminTester.middleware";

const router = Router();

router.route("/").post(varifyJWT, asyncHandler(createCourse));
router.route("/my-courses").get(varifyJWT, asyncHandler(getCourses));
router
  .route("/get-all-courses")
  .get(varifyJWT, asyncHandler(adminTester), asyncHandler(getAllCourses));

router.route("/:courseId").get(varifyJWT, asyncHandler(getCourseById));

export default router;
