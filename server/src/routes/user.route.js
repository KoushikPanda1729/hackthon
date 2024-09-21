import { Router } from "express";
import {
  logInUser,
  refreshAccessToken,
  signUpUser,
  userLoggOut,
} from "../controllers/user.controller.js";
import verifyJWT from "./../middlewares/auth.middleware.js";

const userRouter = Router();
userRouter.route("/sign-up").post(signUpUser);
userRouter.route("/login").post(logInUser);
userRouter.route("/logout").post(verifyJWT, userLoggOut);
userRouter.route("/refresh-token").get(verifyJWT, refreshAccessToken);
export default userRouter;
