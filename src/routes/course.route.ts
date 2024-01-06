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

router.route("/").post(varifyJWT, asyncHandler(createCourse));
router.route("/my-courses").get(varifyJWT, asyncHandler(getCourses));
router
  .route("/get-all-courses")
  .get(varifyJWT, asyncHandler(adminTester), asyncHandler(getAllCourses));

router
  .route("/:courseId")
  .get(varifyJWT, asyncHandler(getCourseById))
  .delete(varifyJWT, asyncHandler(deleteCourse));
router
  .route("/assign-teacher/:courseId")
  .patch(varifyJWT,asyncHandler(adminTester) ,asyncHandler(assignTeacher));
router
  .route("/cover-image")
  .patch(
    varifyJWT,
    upload.single("coverImage"),
    asyncHandler(uploadCourseCoverImage),
  );
router.route("/textbook").post(varifyJWT, asyncHandler(uploadTextBook));

export default router;
