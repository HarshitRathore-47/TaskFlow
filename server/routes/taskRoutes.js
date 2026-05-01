import express from "express";
import { body } from "express-validator";
import {
  createTask,
  deleteTask,
  deleteTasks,
  updateTask,
} from "../controllers/taskController.js";
import { validate } from "../middlewares/validateMiddleware.js";

const taskRouter = express.Router();

taskRouter.post(
  "/",
  [
    body("title").notEmpty().withMessage("Task title is required"),
    body("projectId").notEmpty().withMessage("Project ID is required"),
    body("workspaceId").notEmpty().withMessage("Workspace ID is required"),
    validate,
  ],
  createTask
);

taskRouter.put(
  "/:id",
  [
    body("status")
      .optional()
      .isIn(["TODO", "IN_PROGRESS", "DONE"])
      .withMessage("Invalid status"),
    validate,
  ],
  updateTask
);

taskRouter.delete("/:id", deleteTask);
taskRouter.post("/delete", deleteTasks);

export default taskRouter;
