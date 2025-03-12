import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {AxiosError} from "axios";
import {Navbar, Footer} from "../Components/Sections";
import {
    Box,
    Text,
    Button,
    Input,
    Stack,
    useToast,
    Progress,
    InputGroup, 
    InputRightElement,
  } from '@chakra-ui/react'
import zxcvbn from "zxcvbn";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>(); // ✅ Get token from URL
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [visibleField, setVisibleField] = useState<string | null>(null);

    // Validate Inputs
    const validateInputs = () => {
        const password = passwordRef.current?.value || "";
        const confirmPassword = confirmPasswordRef.current?.value || "";
        let isValid = true;

        // Password Strength Validation
        if (passwordStrength < 3) { // Only allow "Good" (3) and "Strong" (4) passwords
        setPasswordError(true);
        setPasswordErrorMessage("Password is too weak. Try adding more unique characters.");
        isValid = false;
        }

        // Password Validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
        if (!password || !passwordRegex.test(password)) {
        setPasswordError(true);
        setPasswordErrorMessage("Password must be 8+ chars, include an uppercase letter, a number & a symbol.");
        isValid = false;
        } else {
        setPasswordError(false);
        setPasswordErrorMessage("");
        }

        // Confirm Password Validation
        if (confirmPassword !== password) {
        setConfirmPasswordError(true);
        setConfirmPasswordErrorMessage("Passwords do not match.");
        isValid = false;
        } else {
        setConfirmPasswordError(false);
        setConfirmPasswordErrorMessage("");
        }

        return isValid;
    };

    const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateInputs()) return;

        setLoading(true);

        try {
        const response = await axiosInstance.post(`/api/auth/reset-password/${token}`, {
            newPassword: passwordRef.current?.value,
        });

        toast({
            title: "Success",
            description: response.data.message || "Password reset successful! You can now log in.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
        });

        navigate("/login"); // ✅ Redirect to login after success
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            toast({
                title: "Error",
                description: error.response?.data?.message || "Something went wrong. Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        } finally {
        setLoading(false);
        }
    };

      // Handle Password Strength
    const checkPasswordStrength = (password: string) => {
        const result = zxcvbn(password);
        setPasswordStrength(result.score); // Score is from 0 (weak) to 4 (strong)
    
        if (result.score < 3) { // Only allow "Good" (3) and "Strong" (4) passwords
        setPasswordError(true);
        setPasswordErrorMessage("Password is too weak. Try adding more unique characters.");
        //return false;  
        } else {
        setPasswordError(false);
        setPasswordErrorMessage("");
        }
    }; 

    return (

    <Box className="w-full min-h-screen flex flex-col">
          
        {/* ✅ Fixed Navbar */}
        <Box className="fixed top-0 left-0 w-full z-50 bg-navbar">
            <Navbar />
        </Box>

        {/* ✅ Ensures content starts below the navbar */}
        <Box className="flex-grow pt-[80px] bg-alternate">  
            <Box maxW="400px" mx="auto" mt="50px" p="20px" borderRadius="8px" boxShadow="md" bg="var(--dark-green)" color={"var(--soft-white)"}>
                <Text fontSize="xl" fontWeight="bold" mb="4">
                    Reset Password
                </Text>
                <Stack spacing={4}>
                    <form onSubmit={handleResetPassword} id="ResetPasswordForm" data-testid="ResetPasswordForm">
                        <Stack spacing={4}>
                            {/* Password Input */}
                            <Box>
                                <Text fontSize="15px" fontWeight={600} mb={1}>Password</Text>
                                <InputGroup>
                                    <Input 
                                    ref={passwordRef} 
                                    type={visibleField === "password" ? "text" : "password"}
                                    placeholder="Enter new password"
                                    isInvalid={passwordError} 
                                    errorBorderColor="red.300"
                                    onChange={(e) => checkPasswordStrength(e.target.value)}
                                    aria-label="Password"
                                    aria-describedby={passwordError ? "password-error" : undefined}
                                    _focus={{
                                        outline: "2px solid var(--bright-green)",
                                        outlineOffset: "2px",
                                    }}
                                    />
                                    <InputRightElement width="3rem">
                                        <Button
                                            h="1.5rem"
                                            size="sm"
                                            bg="white" // ✅ Default white background
                                            _hover={{ 
                                                bg: 'var(--bright-green)'
                                            }}  // ✅ Changes to green on hover
                                            _focus={{ boxShadow: "none" }}
                                            onClick={() => setVisibleField(visibleField === "password" ? null : "password")}
                                            variant="ghost"
                                        >
                                            {visibleField === "password" ? <FaEyeSlash /> : <FaEye />}  {/* ✅ Toggle eye icon */}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            {/* Password Stregth Checker */}
                                {passwordRef.current?.value && (
                                <Box mt={3}> {/* Adds padding above the progress bar */}
                                    <Progress 
                                    value={(passwordStrength + 1) * 20} // Convert score (0-4) to percentage (0-100)
                                    size="sm" 
                                    colorScheme={["red", "orange", "yellow", "green", "green"][passwordStrength]} 
                                    />
                                    <Text fontSize="xs" color={["red", "orange", "yellow", "green", "green"][passwordStrength]}>
                                    {["Very Weak", "Weak", "Fair", "Good", "Strong"][passwordStrength]}
                                    </Text>
                                </Box>
                                )}



                                {passwordError && <Text fontSize="xs" color="red.500">{passwordErrorMessage}</Text>}
                            </Box>

                            {/* Confirm Password Input */}
                            <Box>
                                <Text fontSize="15px" fontWeight={600} mb={1}>Confirm Password</Text>
                                <InputGroup>
                                    <Input 
                                    ref={confirmPasswordRef} 
                                    type={visibleField === "confirmPassword" ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    isInvalid={confirmPasswordError} errorBorderColor="red.300" 
                                    aria-label="Confirm Password"
                                    aria-describedby={passwordError ? "password-error" : undefined}
                                    _focus={{
                                    outline: "2px solid var(--bright-green)",
                                    outlineOffset: "2px",
                                    }}
                                    />
                                    <InputRightElement width="3rem">
                                        <Button
                                            h="1.5rem"
                                            size="sm"
                                            bg="white" // ✅ Default white background
                                            _hover={{ bg: 'var(--bright-green)' }} 
                                            _focus={{ boxShadow: "none" }}
                                            onClick={() => setVisibleField(visibleField === "confirmPassword" ? null : "confirmPassword")}
                                            variant="ghost"
                                        >
                                            {visibleField === "confirmPassword" ? <FaEyeSlash /> : <FaEye />}  {/* ✅ Toggle eye icon */}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                {confirmPasswordError && <Text fontSize="xs" color="red.500">{confirmPasswordErrorMessage}</Text>}
                            </Box>
                            {/* Reset Password Button */}
                            <Button 
                                type="submit" 
                                colorScheme="blue" 
                                width="full"
                                fontSize="15px"
                                fontWeight={600}
                                isLoading={loading}
                                aria-label="Sign up with email"
                                _focus={{
                                outline: "2px solid var(--bright-green)",
                                outlineOffset: "2px",
                                }}
                            >
                                Reset Password
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Box>
        </Box>
        {/* ✅ Footer stays at bottom */}
        <Box className="w-full mt-auto bg-footer">
            <Footer />
        </Box>
    </Box>

  );
};

export default ResetPassword;
