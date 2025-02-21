"use client";

import { useState, useRef, useEffect } from "react";
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
} from "@chakra-ui/react";
import axios, {AxiosError} from "axios";
import {ForgotPassword} from "../index.ts";
import { logo, google } from "../../../Assets/index.ts";

interface SignInDialogProps {
  open: boolean;
  onClose: () => void;
  openSignUp: () => void; // Function to switch to Sign Up Dialog
}

const SignInDialog = ({ open, onClose, openSignUp}: SignInDialogProps) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // ✅ Input Validation Logic
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

  // ✅ Form Submission Logic
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) return;
  
    try {
      const response = await axios.post("/api/auth/login", {
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      });
  
      const { token, user } = response.data;
  
      console.log("Login successful!", user);
      
      // ✅ Store token in localStorage
      localStorage.setItem("token", token);
  
      // ✅ Close the modal
      onClose();
    } catch (err) {
      // ✅ Ensure 'err' is treated as an AxiosError
      const error = err as AxiosError<{ message: string }>;
  
      console.error("Login Error:", error.response?.data?.message);
      alert(error.response?.data?.message || "Login failed.");
    }
  };

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
          <form onSubmit={handleSubmit}>
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
                      e.preventDefault(); // ✅ Prevents accidental activation of Forgot Password
                      document.getElementById("signInButton")?.click(); // ✅ Manually triggers sign-in
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
                <Input 
                  ref={passwordRef} 
                  type="password" 
                  placeholder="••••••••" 
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
                      e.preventDefault(); // ✅ Prevents accidental activation of Forgot Password
                      document.getElementById("signInButton")?.click(); // ✅ Manually triggers sign-in
                    }
                  }}
                />
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
                onClick={() => setForgotPasswordOpen(true)}
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
                variant="outline" 
                width="full"
                fontSize="15px"
                fontWeight={500}
                leftIcon={<Box as="img" src={google} alt="Google logo" boxSize="16px" />}
                aria-label="Sign in with Google"
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
          <ForgotPassword open={forgotPasswordOpen} handleClose={() => setForgotPasswordOpen(false)} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SignInDialog;
