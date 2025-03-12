"use client";

import { useState, useRef } from "react";
import {
  Button,
  Input,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";

import {AxiosError} from "axios";
import axiosInstance from "../../../utils/axiosInstance.ts"; 

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

const ForgotPassword = ({ open, handleClose }: ForgotPasswordProps) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = emailRef.current?.value.trim();

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      // ✅ Call Forgot Password API
      const response = await axiosInstance.post("/api/auth/forgot-password", { email });

      toast({
        title: "Success",
        description: response.data.message || "A password reset link has been sent to your email.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // ✅ Automatically close modal after toast appears
      setTimeout(handleClose, 300);
    } 
    catch (err) {
      // Ensure 'err' is treated as an AxiosError
      const error = err as AxiosError<{ message: string }>;
  
      console.error("Login Error:", error.response?.data?.message);
      // alert(error.response?.data?.message || "Login failed.");
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        status: "error",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
      
      // ✅ Automatically close modal even on error
      setTimeout(handleClose, 300);
    }
    finally {
      setLoading(false);
    }
  };

  if (!open) return null; // Prevents rendering when `open` is false

  return (
    <Modal isOpen={open} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reset Password</ModalHeader>
        <ModalCloseButton 
          color="black" 
          right={4}
          aria-label="Close modal"
          tabIndex={0}
          borderRadius="6px"
          onClick={handleClose}
          _hover={{
            color : "darkred",
            bg: "transparent",
            outline: "2px solid darkred",
            outlineOffset: "2px",
          }}
          _focus={{
            outline: "2px solid var(--bright-green)",
            outlineOffset: "2px",
          }}
        />

        <ModalBody>
          <Text mb={3}>
            Enter your account's email address, and we'll send you a link to reset your password.
          </Text>

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Input ref={emailRef} type="email" placeholder="Email address" required autoFocus />
              <Button type="submit" colorScheme="blue" isLoading={loading}>
                Continue
              </Button>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ForgotPassword;
