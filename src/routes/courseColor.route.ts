import { Router } from "express";
import varifyJWTMiddleware from "../middlewares/varifyJWT.middleware";
import asyncHandler from "../utils/asyncHandler.util";
import {
  createColor,
  deleteColor,
  getAllColors,
} from "../controllers/courseColor.controller";

const router = Router();

router
  .route("/")
  .post(varifyJWTMiddleware, asyncHandler(createColor))
  .get(varifyJWTMiddleware, asyncHandler(getAllColors))
  .delete(varifyJWTMiddleware, asyncHandler(deleteColor));

export default router;
