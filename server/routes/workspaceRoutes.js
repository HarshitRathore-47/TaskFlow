import express from "express";
import { body } from "express-validator";
import {
  addWorkspaceMember,
  createWorkspace,
  deleteWorkspace,
  getWorkspaces,
  updateWorkspace,
} from "../controllers/workspaceController.js";
import { validate } from "../middlewares/validateMiddleware.js";

const workspaceRouter = express.Router();

workspaceRouter.get("/", getWorkspaces);

workspaceRouter.post(
  "/",
  [
    body("name").notEmpty().withMessage("Workspace name is required"),
    body("slug").notEmpty().withMessage("Slug is required"),
    validate,
  ],
  createWorkspace
);

workspaceRouter.put(
  "/",
  [
    body("id").notEmpty().withMessage("Workspace ID is required"),
    validate,
  ],
  updateWorkspace
);

workspaceRouter.delete("/:id", deleteWorkspace);

workspaceRouter.post(
  "/add-member",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("workspaceId").notEmpty().withMessage("Workspace ID is required"),
    validate,
  ],
  addWorkspaceMember
);

export default workspaceRouter;
