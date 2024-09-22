import { Router } from "express";
import {
  createMCQ,
  deleteMCQ,
  getAllMCQs,
  createResultReport,
  updateMCQ,
  getAllResultReport,
  createResultReportForAdmin,
} from "../controllers/mcq.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import isAdmin from "./../middlewares/isAdmin.middleware.js";

const mcqRouter = Router();

mcqRouter.route("/mcqs").post(verifyJWT, isAdmin, createMCQ);
mcqRouter.route("/mcqs").get(verifyJWT, getAllMCQs);
mcqRouter.route("/mcqs/:id").put(verifyJWT, isAdmin, updateMCQ);
mcqRouter.route("/mcqs/:id").delete(verifyJWT, isAdmin, deleteMCQ);
mcqRouter.route("/mcqs/all-result-admin").get(verifyJWT, isAdmin,getAllResultReport);
mcqRouter.route("/mcqs/result").post(verifyJWT, createResultReport);
mcqRouter
  .route("/mcqs/admin-result")
  .post(verifyJWT, createResultReportForAdmin);

export default mcqRouter;
