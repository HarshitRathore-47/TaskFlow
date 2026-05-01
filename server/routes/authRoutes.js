import express from "express";
import { body } from "express-validator";
import { loginUser, registerUser, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    validate,
  ],
  registerUser
);

authRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
  ],
  loginUser
);

authRouter.get("/me", protect, getMe);

export default authRouter;
