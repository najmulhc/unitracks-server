import { Router } from "express";
import { basicRegister } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/", basicRegister);

export default userRouter;
