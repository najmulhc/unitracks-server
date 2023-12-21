import { Router } from "express";
import {
  basicRegister,
  beAnAdmin,
  deleteUser,
  getAllUsers,
  login,
  loginWithToken,
  setUserRole,
} from "../controllers/user.controller";
import varifyJWT from "../middlewares/varifyJWT.middleware";
import asyncHandler from "../utils/asyncHandler.util";

const userRouter = Router();

userRouter.post("/register", asyncHandler(basicRegister));
userRouter.post("/login", asyncHandler(login));
userRouter.post("/be-an-admin", varifyJWT, asyncHandler(beAnAdmin));
userRouter.get("/", varifyJWT, asyncHandler(loginWithToken));
userRouter.get("/get-all-users", varifyJWT, asyncHandler(getAllUsers));
userRouter.patch("/update-user-role", varifyJWT, asyncHandler(setUserRole));
userRouter.delete("/", varifyJWT, asyncHandler(deleteUser));

export default userRouter;
