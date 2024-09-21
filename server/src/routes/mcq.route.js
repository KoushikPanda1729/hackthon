import { Router } from "express";
import {
  createMCQ,
  deleteMCQ,
  getAllMCQs,
  updateMCQ,
} from "../controllers/mcq.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import isAdmin from "./../middlewares/isAdmin.middleware.js";

const mcqRouter = Router();

// MCQ routes
mcqRouter.route("/mcqs").post(verifyJWT, isAdmin, createMCQ);
mcqRouter.route("/mcqs").get(verifyJWT, getAllMCQs);
mcqRouter.route("/mcqs/:id").put(verifyJWT, isAdmin, updateMCQ);
mcqRouter.route("/mcqs/:id").delete(verifyJWT, isAdmin, deleteMCQ);

export default mcqRouter;
