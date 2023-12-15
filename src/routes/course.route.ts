import { Router } from "express";
import varifyJWT from "../middlewares/varifyJWT";
import { createCourse } from "../controllers/course.controller";

const router = Router();

router.route("/").post(varifyJWT, createCourse)

export default router;
