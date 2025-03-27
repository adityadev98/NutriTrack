"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Stack,
  Box,
  Text,
  Divider,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  InputGroup, 
  InputRightElement,
} from "@chakra-ui/react";
import {AxiosError} from "axios";
import axiosInstance from "../../../utils/axiosInstance.ts"; 
import { UserContext } from "../../../contexts/UserContext"; 
import { useGoogleLogin } from "@react-oauth/google";
// import {ForgotPassword} from "../index.ts";
import { logo, google } from "../../../assets/index.ts";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface SignInDialogProps {
  open: boolean;
  onClose: () => void;
  openSignUp: () => void; // Function to switch to Sign Up Dialog
  openForgotPassword: () => void;
}

const SignInDialog = ({ open, onClose, openSignUp, openForgotPassword}: SignInDialogProps) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [visibleField, setVisibleField] = useState<string | null>(null);
  // const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const toast = useToast();
  const { setLoggedUser } = useContext(UserContext) ?? {};
  const navigate = useNavigate();
  // Input Validation Logic
  const validateInputs = () => {
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  // Form Submission Logic
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) return;
    
    // console.log("setLoggedUser exists:", !!setLoggedUser);

    try {
      // console.log("Making API call to /api/auth/login");
      const response = await axiosInstance.post('/api/auth/login', {
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      });
  
      const { token, userType, profileCompleted, userProfile, expiresIn, verified} = response.data;
      console.log("Login successful!", userProfile.user);

      const tokenExpiry = Date.now() + expiresIn * 1000; // Convert seconds to milliseconds

      // Update the loggedUser state
      // Ensure setLoggedUser exists before calling it
      if (setLoggedUser) {
        setLoggedUser({
          userid: userProfile.user,
          token,
          name: userProfile.name,
          profileCompleted,
          userType,
          verified,
          tokenExpiry,  // Store expiry timestamp
        });    
        localStorage.setItem("loggedUser", JSON.stringify({
          userid: userProfile.user,
          token,
          name: userProfile.name,
          profileCompleted,
          userType,
          verified,
          tokenExpiry, // Store in localStorage
        }));

        localStorage.setItem("token", token); // Store token separately for requests
        localStorage.setItem("user", userProfile.user);  // Store userProfile.user in localStorage

      } else {
        console.error("UserContext is not available.");
      }

    // ✅ If user is not verified, call the OTP API before redirecting
    if (!verified) {
      try {
        console.log("User not verified, sending OTP...");
        await axiosInstance.post(
          "/api/auth/generate-otp",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("OTP sent successfully!");
      } catch (otpError) {
        console.error("Error sending OTP:", otpError);
      }

      navigate("/otp-verification", { replace: true });
      return;
    }

    // Redirect logic after login
    if (userType === "admin") {
      navigate("/admin-dashboard", { replace: true });
    } else if (userType === "coach") {
      navigate("/coach-dashboard", { replace: true });
    } else if (!profileCompleted) {
      navigate("/profile-setup", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
      // Close the modal
      onClose();
    } catch (err) {
      // Ensure 'err' is treated as an AxiosError
      const error = err as AxiosError<{ message: string }>;
  
      console.error("Login Error:", error.response?.data?.message);
      // alert(error.response?.data?.message || "Login failed.");
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    //console.log("Google Login Credential Response:", credentialResponse); // ✅ Debugging

    const accessToken = credentialResponse.access_token;

    if (!accessToken) {
      console.error("Google Login Failed: No access token received");
      toast({
        title: "Google Login Failed",
        description: "No access token received from Google. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return; // ✅ Stops further execution
    }
  
    try {
      const response = await axiosInstance.post("/api/auth/google/signin", {
        access_token: accessToken,
      });
  
      const { token, userType, profileCompleted, userProfile, expiresIn,verified} = response.data;
      console.log("Login with Google successful!", userProfile.user);

      const tokenExpiry = Date.now() + expiresIn * 1000; // Convert seconds to milliseconds

      // Update the loggedUser state
      // Ensure setLoggedUser exists before calling it
      if (setLoggedUser) {
        setLoggedUser({
          userid: userProfile.user,
          token,
          name: userProfile.name,
          profileCompleted,
          userType,
          verified,
          tokenExpiry,  // Store expiry timestamp
        });    
        localStorage.setItem("loggedUser", JSON.stringify({
          userid: userProfile.user,
          token,
          name: userProfile.name,
          profileCompleted,
          userType,
          tokenExpiry, // Store in localStorage
        }));

        localStorage.setItem("token", token); // Store token separately for requests
        localStorage.setItem("user", userProfile.user);  // Store userProfile.user in localStorage

      } else {
        console.error("UserContext is not available.");
      }
  
      toast({
        title: "Login Successful!",
        description: "You have signed in using Google.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
  
      // Redirect logic after login
      if (userType === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (userType === "coach") {
        navigate("/coach-dashboard", { replace: true });
      } else if (!profileCompleted) {
        navigate("/profile-setup", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      onClose(); // ✅ Close modal after login
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Google Login Error:", error.response?.data?.message);
      toast({
        title: "Google Login Failed",
        description: error.response?.data?.message || "Unable to log in using Google. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const googleSignin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess, // ✅ Callback function for successful Google sign-up
    onError: () => console.log("Google Sign-Up Failed"), // ✅ Handle errors
  });
  useEffect(() => {
    if (open) {
      // Reset errors when the modal opens
      setEmailError(false);
      setEmailErrorMessage("");
      setPasswordError(false);
      setPasswordErrorMessage("");
  
      // Clear input fields
      if (emailRef.current) emailRef.current.value = "";
      if (passwordRef.current) passwordRef.current.value = "";
    }
  }, [open]);

  if (!open) return null; // Prevents unnecessary renders

  return (
    <Modal isOpen={open} onClose={onClose} closeOnOverlayClick={false} isCentered> 
      <ModalOverlay />
      <ModalContent borderRadius="16px">
        {/* Header with Logo and Dark Green Background */}
        <ModalHeader 
          bg="var(--dark-green)" 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          py={4} 
          position="relative"
          borderTopLeftRadius="12px" 
          borderTopRightRadius="12px"
          borderBottomLeftRadius="0"
          borderBottomRightRadius="0"          
        >
          <a 
            href="/" 
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            aria-label="Go to NutriTrack homepage"
          >
            <img src={logo} alt="NutriTrack" width={124} height={32} />
          </a>
        </ModalHeader>
        <ModalCloseButton 
          color="white" 
          right={4}
          transform="translateY(25%)"
          aria-label="Close modal"
          tabIndex={0}
          borderRadius="6px"
          _hover={{
            bg: 'rgba(255, 255, 255, 0.1)',
          }}
          _focus={{
            outline: "2px solid var(--bright-green)",
            outlineOffset: "2px",
          }}
        />

        {/* Sign In Form */}
        <ModalBody pb={6} pt={6} fontFamily="Rubik, sans-serif">
          <form onSubmit={handleSubmit} id="signInForm" data-testid="signInForm">
            <Stack spacing={4}>
              {/* Email Input */}
              <Box>
                <Text fontSize="15px" fontWeight={600} mb={1}>Email</Text>
                <Input 
                  ref={emailRef} 
                  placeholder="your@email.com" 
                  isInvalid={emailError} 
                  errorBorderColor="red.300"
                  aria-label="Email address"
                  aria-describedby={emailError ? "email-error" : undefined}
                  _focus={{
                    outline: "2px solid var(--bright-green)",
                    outlineOffset: "2px",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevents accidental activation of Forgot Password
                      document.getElementById("signInButton")?.click(); // Manually triggers sign-in
                    }
                  }}
                />
                {emailError && (
                  <Text id="email-error" fontSize="xs" color="red.500" role="alert">{emailErrorMessage}</Text>
                )}
              </Box>

              {/* Password Input */}
              <Box>
                <Text fontSize="15px" fontWeight={600} mb={1}>Password</Text>
                <InputGroup>
                  <Input 
                    ref={passwordRef} 
                    type={visibleField === "password" ? "text" : "password"} 
                    placeholder="Enter your password"
                    isInvalid={passwordError} 
                    errorBorderColor="red.300"
                    aria-label="Password"
                    aria-describedby={passwordError ? "password-error" : undefined}
                    _focus={{
                      outline: "2px solid var(--bright-green)",
                      outlineOffset: "2px",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // Prevents accidental activation of Forgot Password
                        document.getElementById("signInButton")?.click(); // Manually triggers sign-in
                      }
                    }}
                  />
                    <InputRightElement width="3rem">
                      <Button
                          h="1.5rem"
                          size="sm"
                          bg="white" // ✅ Default white background
                          _hover={{ bg: "green.300" }} // ✅ Changes to green on hover
                          _focus={{ boxShadow: "none" }}
                          onClick={() => setVisibleField(visibleField === "password" ? null : "password")}
                          variant="ghost"
                      >
                          {visibleField === "password" ? <FaEyeSlash /> : <FaEye />}  {/* ✅ Toggle eye icon */}
                      </Button>
                  </InputRightElement>
                </InputGroup>
                {passwordError && (
                  <Text id="password-error" fontSize="xs" color="red.500" role="alert">{passwordErrorMessage}</Text>
                )}
              </Box>

              {/* Forgot Password Link */}
              <Link 
                as="button" 
                fontSize="15px"
                fontWeight={600}
                color="blue.500" 
                onClick={() => {
                  onClose();
                  openForgotPassword();
                }}
                tabIndex={0}
                aria-label="Forgot your password"
                _focus={{
                  outline: "2px solid var(--bright-green)",
                  outlineOffset: "2px",
                }}
                _hover={{
                  textDecoration: "underline",
                  boxShadow: "none",
                  bg: "transparent"
                }}
              >
                Forgot your password?
              </Link>
              

              {/* Sign In Button */}
              <Button 
                id="signInButton"
                type="submit" 
                colorScheme="blue" 
                width="full"
                fontSize="15px"
                fontWeight={600}
                aria-label="Sign in with email"
                _focus={{
                  outline: "2px solid var(--bright-green)",
                  outlineOffset: "2px",
                }}
              >
                Sign in
              </Button>

              <Divider aria-hidden="true" />
              <Text textAlign="center" fontSize="15px" fontWeight={600} color="gray.600">or</Text>

              {/* Sign In with Google */}
              <Button 
                onClick={() => googleSignin()}
                variant="outline" 
                width="full"
                fontSize="15px"
                fontWeight={500}
                leftIcon={<Box as="img" src={google} alt="Google logo" boxSize="16px" />}
                aria-label="Sign in with Google"
                outline="1px solid rgba(156, 156, 156, 0.53)"
                _focus={{
                  outline: "2px solid var(--bright-green)",
                  outlineOffset: "2px",
                }}
                _hover={{
                  bg: 'rgba(0, 0, 0, 0.05)',
                }}
              >
                Sign in with Google
              </Button>
              {/* Sign Up Link */}
              <Text textAlign="center" fontSize="15px" fontWeight={400}>
                Don't have an account?{" "}
                <Button 
                  variant="link" 
                  colorScheme="blue" 
                  onClick={() => {
                    onClose();    // Close SignIn Dialog
                    openSignUp(); // Open SignUp Dialog
                  }}
                  fontSize="15px"
                  fontWeight={600}
                  aria-label="Sign up for a new account"
                  _focus={{
                    outline: "2px solid var(--bright-green)",
                    outlineOffset: "2px",
                  }}
                  _hover={{
                    textDecoration: "underline",
                    boxShadow: "none",
                    bg: "transparent"
                  }}
                >
                  Sign up
                </Button>
              </Text>
            </Stack>
          </form>
          {/* <ForgotPassword open={forgotPasswordOpen} handleClose={() => setForgotPasswordOpen(false)} /> */}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SignInDialog;