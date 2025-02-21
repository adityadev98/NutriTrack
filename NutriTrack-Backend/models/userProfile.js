import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Links to User
  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  fitnessGoals: { type: String },
  height: {type: Number},
});

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);
export default UserProfile;
