import { Router } from "express";
import varifyJWTMiddleware from "../middlewares/varifyJWT.middleware";
import studentTester from "../middlewares/studentTester.middleware";
import asyncHandler from "../utils/asyncHandler.util";
import {
  getNotifications,
  seeNotifications,
} from "../controllers/notificationController";

const router = Router();

router
  .route("/")
  .get(
    varifyJWTMiddleware,
    asyncHandler(studentTester),
    asyncHandler(getNotifications),
  );
router.post(
  "/see",
  varifyJWTMiddleware,
  asyncHandler(studentTester),
  asyncHandler(seeNotifications),
);

export default router;
