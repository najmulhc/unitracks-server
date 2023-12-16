import { Router } from "express";
import varifyJWT from "../middlewares/varifyJWT";
import { createCourse, getCourses } from "../controllers/course.controller";
import asyncHandler from "../utils/asyncHandler.util";

const router = Router();

router.route("/").post(varifyJWT, asyncHandler(createCourse));
router.route("/my-courses").get(varifyJWT, asyncHandler(getCourses))


export default router;
