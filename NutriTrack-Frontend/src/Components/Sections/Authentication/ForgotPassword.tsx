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

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

const ForgotPassword = ({ open, handleClose }: ForgotPasswordProps) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Success",
        description: "A password reset link has been sent to your email.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      handleClose();
    }, 1500);
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
