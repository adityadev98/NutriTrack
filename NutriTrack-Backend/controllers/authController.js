import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../models/user.js";
import UserProfile from "../models/UserProfile.js";
import nodemailer from "nodemailer";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "nutritrackapp";

// Temporary storage for reset tokens (for production, use a DB collection)
const resetTokens = {};

// ✅ REGISTER USER
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error, try again later." });
  }
};

// ✅ LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ success: false, message: "Invalid credentials!" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ Check if UserProfile exists, else create one
    let userProfile = await UserProfile.findOne({ user: user._id });
    if (!userProfile) {
      userProfile = new UserProfile({ user: user._id, name: "New User" });
      await userProfile.save();
    }

    res.json({
      success: true,
      message: "Login successful!",
      token,
      userProfile, // Send user profile data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error, try again later." });
  }
};

// ✅ FORGOT PASSWORD (Send Reset Link)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    resetTokens[email] = resetToken; // Store temporarily (Use DB in production)

    // Email reset link
    const resetLink = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
    await sendEmail(email, resetLink);

    res.json({ success: true, message: "Password reset link sent to email!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error, try again later." });
  }
};

// ✅ RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { email, newPassword } = req.body;

    // Verify token
    if (!resetTokens[email] || resetTokens[email] !== token) {
      return res.status(400).json({ success: false, message: "Invalid or expired token!" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Remove token from store
    delete resetTokens[email];

    res.json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error, try again later." });
  }
};

// ✅ Helper Function: Send Email
const sendEmail = async (to, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: "Password Reset",
    text: `Click here to reset your password: ${link}`,
  };

  await transporter.sendMail(mailOptions);
};
