import express from "express";
import { body } from "express-validator";
import {
  addMember,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { validate } from "../middlewares/validateMiddleware.js";

const projectRouter = express.Router();

projectRouter.post(
  "/",
  [
    body("name").notEmpty().withMessage("Project name is required"),
    body("workspaceId").notEmpty().withMessage("Workspace ID is required"),
    validate,
  ],
  createProject
);

projectRouter.put(
  "/",
  [
    body("id").notEmpty().withMessage("Project ID is required"),
    validate,
  ],
  updateProject
);

projectRouter.delete("/:id", deleteProject);

projectRouter.post(
  "/:projectId/addMember",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    validate,
  ],
  addMember
);

export default projectRouter;
