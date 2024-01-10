import { Router } from "express";
import varifyJWTMiddleware from "../middlewares/varifyJWT.middleware";
import { getDashboardInfo } from "../controllers/dashboar.controller";
import asyncHandler from "../utils/asyncHandler.util";

const router = Router();

router.route("/").get(varifyJWTMiddleware, asyncHandler(getDashboardInfo));

export default router;