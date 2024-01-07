import { Router } from "express";
import varifyJWT from "../middlewares/varifyJWT.middleware";
import {
  assignTeacher,
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getCourses,
  uploadCourseCoverImage,
  uploadTextBook,
} from "../controllers/course.controller";
import asyncHandler from "../utils/asyncHandler.util";
import adminTester from "../middlewares/adminTester.middleware";
import upload from "../middlewares/multer.middleware";

const router = Router();

router.use(varifyJWT);

router.route("/").post(asyncHandler(createCourse));
router.route("/my-courses").get(asyncHandler(getCourses));
router
  .route("/get-all-courses")
  .get(asyncHandler(adminTester), asyncHandler(getAllCourses));

router
  .route("/:courseId")
  .get(asyncHandler(getCourseById))
  .delete(asyncHandler(deleteCourse));
router
  .route("/assign-teacher/:courseId")
  .patch(asyncHandler(adminTester), asyncHandler(assignTeacher));
router
  .route("/cover-image")
  .patch(upload.single("coverImage"), asyncHandler(uploadCourseCoverImage));
router.route("/textbook").post(asyncHandler(uploadTextBook));

export default router;
