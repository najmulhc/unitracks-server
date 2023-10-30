import { Router } from "express";
import { basicRegister, login } from "../controllers/user.controller";
var userRouter = Router();
userRouter.post("/", basicRegister);
userRouter.post("/login", login);
export default userRouter;
