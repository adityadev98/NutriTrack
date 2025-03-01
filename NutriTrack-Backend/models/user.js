import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["customer", "admin"], default: "customer" }, // Default to "customer"
});

const User = mongoose.model("User", UserSchema);
export default User;
