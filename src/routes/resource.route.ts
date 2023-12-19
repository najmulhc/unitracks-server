import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.util";
import varifyJWT from "../middlewares/varifyJWT";
import teacherTester from "../middlewares/teacherTester";
import {
  createResource,
  deleteResource,
} from "../controllers/resource.controller";

const router = Router();

router
  .route("/")
  .post(
    asyncHandler(varifyJWT),
    asyncHandler(teacherTester),
    asyncHandler(createResource),
  )
  .delete(
    asyncHandler(varifyJWT),
    asyncHandler(teacherTester),
    asyncHandler(deleteResource),
  );

export default router;
