import { Router } from "express";
import {
  basicRegister,
  beAnAdmin,
  getAllUsers,
  login,
  loginWithToken,
  setUserRole,
} from "../controllers/user.controller";
import varifyJWT from "../middlewares/varifyJWT";

const userRouter = Router();

userRouter.post("/", basicRegister);
userRouter.post("/login", login);
userRouter.post("/be-an-admin", varifyJWT, beAnAdmin);
userRouter.get("/", varifyJWT, loginWithToken);
userRouter.get("/get-all-users", varifyJWT, getAllUsers);
userRouter.patch("/update-user-role", varifyJWT, setUserRole);

export default userRouter;
