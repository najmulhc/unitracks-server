import { Router } from "express";
import {
  basicRegister,
  beAnAdmin,
  login,
} from "../controllers/user.controller";
import varifyJWT from "../middlewares/varifyJWT";

const userRouter = Router();

userRouter.post("/", basicRegister);
userRouter.post("/login", login);
userRouter.post("/be-an-admin",varifyJWT , beAnAdmin);

export default userRouter;
