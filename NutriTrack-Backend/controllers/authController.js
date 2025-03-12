import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { sendEmail } from "../utils/sendEmail.js";

import { User, userProfile as UserProfile, PasswordResetToken } from "../models/index.js";
// import FormData from "form-data"; 
// import nodemailer from "nodemailer";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "nutritrackapp";

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL ; 

// Temporary storage for reset tokens (for production, use a DB collection)
const resetTokens = {};

// REGISTER USER
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {

      // ✅ If user exists & has a Google ID, ask them to Sign in with Google
      if (existingUser.googleId) {
        return res.status(400).json({
          success: false,
          message: "This email is registered using Google. Please sign in with Google.",
        });
      }

      // ✅ If user exists but is a normal user, return standard error
      return res
        .status(400)
        .json({ success: false, message: "Email already registered!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const newUser = new User({
      email,
      password: hashedPassword,
      userType: "customer",
    });
    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error, try again later." });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // ✅ If user has a Google ID, ask them to sign in with Google
    if (user.googleId) {
      return res.status(400).json({
        success: false,
        message: "This email is registered using Google. Please sign in with Google.",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid credentials!" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    // Check if UserProfile exists, else create one
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
      userType: user.userType, // Return userType
      profileCompleted: userProfile.profileCompleted, // Return profile completion status
      expiresIn: 3600, // Include token expiry duration (in seconds),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error, try again later." });
  }
};

// ✅ Forgot Password (Send Reset Link)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    // ✅ Prevent Google Sign-In users from resetting passwords
    if (user.googleId) {
      return res.status(400).json({
        success: false,
        message: "This account was created using Google Sign-In. Please reset your password through Google.",
      });
    }

    // ✅ Generate a reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // ✅ Remove any existing reset token for this email
    await PasswordResetToken.deleteOne({ email });

    // ✅ Save the new token in the database
    const newToken = new PasswordResetToken({ email, token: resetToken });
    await newToken.save();

    // ✅ Create the reset link dynamically from .env
    const resetLink = `${FRONTEND_BASE_URL}/reset-password/${resetToken}`;

    // ✅ Send the email using the HTML template
    await sendEmail(email, "Password Reset Request", "forgotPassword.html", {
      RESET_LINK: resetLink,
    });

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
    const { newPassword } = req.body;

    // ✅ Find the token in the database
    const resetTokenEntry = await PasswordResetToken.findOne({ token });

    if (!resetTokenEntry) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token." });
    }

    // ✅ Find the user associated with this token
    const user = await User.findOne({ email: resetTokenEntry.email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    // ✅ Check if new password is the same as the old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password. Please choose a different password.",
      });
    }

    // ✅ Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // ✅ Save the updated user password
    await user.save();

    // ✅ Delete the reset token after use
    await PasswordResetToken.deleteOne({ token });

    res.json({ success: true, message: "Password reset successful! You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error, try again later." });
  }
};

// Refresh Token Route
export const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Generate a new token with the same user data
    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, userType: decoded.userType },
      JWT_SECRET,
      { expiresIn: "1h" }, // Reset to another 1 hour
    );

    res.json({ token: newToken, expiresIn: 3600 }); // Return new token & expiry
  });
};

// ✅ Google Sign-Up Controller
export const googleSignup = async (req, res) => {
  try {
    // ✅ Ensure req.user is not null
    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "Google authentication failed: No user data received.",
      });
    }

    let user = req.user;

    // ✅ Extract Google Profile Data
    const googleId = user.googleId || user.id;
    const email = user.email || req.body.email;

    // ❌ If email is missing, return error
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google authentication failed: Email is required.",
      });
    }

    // ✅ Check if User Already Exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // ✅ If the user already exists but has NO `googleId`, ask them to log in with a password
      if (!existingUser.googleId) {
        return res.status(400).json({
          success: false,
          message: "This email is already registered by NutriTrack authentication. Please log in using your password.",
        });
      }

      // ✅ If user already exists with Google, return appropriate message
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in with Google.",
      });
    }

    // ✅ Create New Google User
    const newUser = new User({
      googleId,
      email,
      userType: "customer",
    });
    await newUser.save();

    // ✅ Create User Profile (Same as Login)
    const newUserProfile = new UserProfile({
      user: newUser._id,
      name: "New User",
    });
    await newUserProfile.save();

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, userType: newUser.userType },
      JWT_SECRET,
      { expiresIn: "1h" }
    );    

    return res.json({
      success: true,
      message: "Google sign-up successful",
      token,
      user: newUser,
      userProfile: newUserProfile, // ✅ Return profile data
      userType: newUser.userType,
      profileCompleted: newUserProfile.profileCompleted, // ✅ Return profile status
      expiresIn: 3600, // ✅ Include token expiry duration (in seconds)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ✅ Google Sign-In Controller
export const googleSignin = async (req, res) => {
  try {
    // ✅ Ensure req.user is not null
    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "Google authentication failed: No user data received.",
      });
    }

    let user = req.user;

    // ✅ Extract Google Profile Data
    const googleId = user.googleId || user.id;
    const email = user.email || req.body.email;

    // ❌ If email is missing, return error
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google authentication failed: Email is required.",
      });
    }

    // ✅ Check if User Exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist. Please sign up with Google first.",
      });
    }

    // ✅ If user exists but has NO Google ID, prevent Google login
    if (!existingUser.googleId) {
      return res.status(400).json({
        success: false,
        message: "This email is not registered using Google. Please log in using your password.",
      });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email, userType: existingUser.userType },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Check if UserProfile exists, else create one
    let userProfile = await UserProfile.findOne({ user: user._id });
    if (!userProfile) {
      userProfile = new UserProfile({ user: user._id, name: "New User" });
      await userProfile.save();
    }

    res.json({
      success: true,
      message: "Google Login successful!",
      token,
      userProfile, // Send user profile data
      userType: user.userType, // Return userType
      profileCompleted: userProfile.profileCompleted, // Return profile completion status
      expiresIn: 3600, // Include token expiry duration (in seconds),
    });
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
