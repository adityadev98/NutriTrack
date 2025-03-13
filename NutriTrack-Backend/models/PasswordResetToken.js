import mongoose from "mongoose";

const PasswordResetTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 1800 }, // ✅ Token expires in 30mins
});

const PasswordResetToken = mongoose.model("PasswordResetToken", PasswordResetTokenSchema);
export default PasswordResetToken;
