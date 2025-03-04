import {User, userProfile as UserProfile } from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();

export const profileSetup = async (req, res) => {
  try {
    const { name, age, gender, activityLevel, height, weight } = req.body;
    console.log("Received data:", {
      name,
      age,
      gender,
      activityLevel,
      height,
      weight,
    });

    console.log("User ID:", req.user.id);

    let userProfile = await UserProfile.findOne({ user: req.user.id });

    if (userProfile) {
      userProfile.name = name;
      userProfile.age = age;
      userProfile.gender = gender;
      userProfile.activityLevel = activityLevel;
      userProfile.height = height;
      userProfile.weight = weight;
      userProfile.profileCompleted = true;
    } else {
      userProfile = new UserProfile({
        user: req.user.id,
        name,
        age,
        gender,
        activityLevel,
        height,
        weight,
        profileCompleted: true,
      });
    }

    await userProfile.save();
    // await User.findByIdAndUpdate(User, { profileCompleted: true });
    await User.findByIdAndUpdate(req.user.id, { profileCompleted: true });

    res.status(200).json({
      success: true,
      message: "Profile setup successful",
      userProfile,
    });
  } catch (error) {
    console.error("Error in profile setup:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred during profile setup",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    console.log("Fetching Profile for User ID:", req.user.id);

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const userProfile = await UserProfile.findOne({ user: req.user.id });
    if (!userProfile) {
      return res
        .status(404)
        .json({ success: false, message: "User profile not found." });
    }

    res.status(200).json({ success: true, user, userProfile });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
