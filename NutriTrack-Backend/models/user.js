import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  userType: { type: String, enum: ["customer", "admin","coach"], default: "customer" }, // Default to "customer"
  googleId: { type: String, unique: true, sparse: true }, // Only for Google Sign-In
  verified: { type: Boolean, default: false }, // Track account verification status
});

const User = mongoose.model("User", UserSchema);
export default User;
