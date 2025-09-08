import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

//Login Controller
export const loginController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error, please try again later" });
  }
};

// Signup Controller
export const signupController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }

    // Hash password 
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ success: true, msg: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error, please try again later" });
  }
};

// Auth Check Controller
export const authCheck = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error in auth check:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error, please try again later" });
  }
};
