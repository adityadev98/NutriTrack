import { useState, useEffect, useRef, useContext } from "react";
import { Box, Button, Input, Stack, Text, useToast, Container } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../contexts/UserContext";
import { Sidenav } from "../../Components/Sections";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const toast = useToast();
  const navigate = useNavigate();
  const { loggedUser, setLoggedUser } = useContext(UserContext) ?? {};
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const token = loggedUser?.token; // ✅ Use token for authentication

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[A-Z0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase();
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.includes("")) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/auth/verify-otp",
        { otp: otp.join("") },
        { headers: { Authorization: `Bearer ${token}` } } // ✅ Use token in headers
      );

      const { token: newToken, userType, profileCompleted, userProfile, expiresIn, verified } = response.data;
      const tokenExpiry = Date.now() + expiresIn * 1000;

      if (setLoggedUser) {
        setLoggedUser({
          userid: userProfile.user,
          token: newToken,
          name: userProfile.name,
          profileCompleted,
          userType,
          verified: true,
          tokenExpiry,
        });

        localStorage.setItem("loggedUser", JSON.stringify({
          userid: userProfile.user,
          token: newToken,
          name: userProfile.name,
          profileCompleted,
          userType,
          verified: true,
          tokenExpiry,
        }));
      }

      toast({
        title: "OTP Verified!",
        description: "Your account is now verified.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/dashboard"); // ✅ Redirect to dashboard after successful verification
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid or expired OTP. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendTimer(30);
    await axiosInstance.post(
      "/api/auth/generate-otp",
      {},
      { headers: { Authorization: `Bearer ${token}` } } // ✅ Use token in headers
    );
    toast({
      title: "OTP Sent",
      description: "A new OTP has been sent to your email.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Sidenav>
      <Box className="flex-grow pt-[80px] bg-alternate flex flex-col items-center">
        <Container maxW="md" p={6} boxShadow="md" borderRadius="md" bg="white">
          <Text fontSize="xl" fontWeight="bold" textAlign="center">OTP Verification</Text>
          <Text fontSize="sm" textAlign="center">Enter the 6-digit OTP sent to your email.</Text>

          <Stack direction="row" justify="center" spacing={2} mt={4}>
            {otp.map((_, index) => (
              <Input
                key={index}
                ref={(el) => inputRefs.current[index] = el}
                maxLength={1}
                fontSize="xl"
                width="3rem"
                height="3rem"
                textAlign="center"
                bg="gray.100"
                border="1px solid gray"
                onChange={(e) => handleOtpChange(index, e.target.value)}
              />
            ))}
          </Stack>

          <Button mt={4} colorScheme="blue" isLoading={loading} width="full" onClick={handleVerifyOtp}>
            Verify OTP
          </Button>

          <Button mt={2} variant="link" onClick={handleResendOtp} isDisabled={resendTimer > 0}>
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
          </Button>
        </Container>
      </Box>
    </Sidenav>
  );
};

export default OtpVerification;
