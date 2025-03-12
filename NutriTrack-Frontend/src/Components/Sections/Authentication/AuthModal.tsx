import { useState } from "react";
import SignInDialog from "./SignInDialog";
import SignUpDialog from "./SignUpDialog";
import ForgotPassword from "./ForgotPassword";

interface AuthModalProps {
  openSignIn: boolean;
  setOpenSignIn: (value: boolean) => void;
  openSignUp: boolean;
  setOpenSignUp: (value: boolean) => void;
}

const AuthModal = ({ openSignIn, setOpenSignIn, openSignUp, setOpenSignUp }: AuthModalProps) => {
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // ✅ Ensure openForgotPassword function is always defined
  const handleForgotPasswordOpen = () => {
    setOpenSignIn(false); // Close Sign In
    setForgotPasswordOpen(true); // Open Forgot Password
  };

  return (
    <>
      {/* Sign In Dialog */}
      <SignInDialog
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        openSignUp={() => {
          setOpenSignIn(false);
          setOpenSignUp(true);
        }}
        openForgotPassword={handleForgotPasswordOpen}
      />

      {/* Sign Up Dialog */}
      <SignUpDialog
        open={openSignUp}
        onClose={() => setOpenSignUp(false)}
        openSignIn={() => {
          setOpenSignUp(false);
          setOpenSignIn(true);
        }}
      />

      {/* Forgot Password Dialog */}
      <ForgotPassword
        open={forgotPasswordOpen}
        handleClose={() => setForgotPasswordOpen(false)}
      />
    </>
  );
};

export default AuthModal;