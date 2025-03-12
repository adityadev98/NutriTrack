import otpGenerator from "otp-generator";

export const generateOtp = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: true,  // ✅ Include uppercase alphabets
    specialChars: false,       // ❌ No special characters
    lowerCaseAlphabets: false, // ❌ No lowercase alphabets
    digits: true,              // ✅ Include numbers
  });
};
