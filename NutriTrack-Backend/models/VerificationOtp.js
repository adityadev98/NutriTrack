import mongoose from "mongoose";

const VerificationOtpSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // ✅ Associate OTP with userID
  otp: { type: String, required: true }, // The generated OTP
  expiresAt: { type: Date, required: true }, // Expiration timestamp
});

const VerificationOtp = mongoose.model("VerificationOtp", VerificationOtpSchema);
export default VerificationOtp;
