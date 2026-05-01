import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../configs/prisma.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Get Me
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ message: "Could not retrieve profile" });
  }
};
