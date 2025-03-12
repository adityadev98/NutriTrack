import mongoose from "mongoose";

const PasswordResetTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // ✅ Token expires in 1 hour
});

const PasswordResetToken = mongoose.model("PasswordResetToken", PasswordResetTokenSchema);
export default PasswordResetToken;
