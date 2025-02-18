import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  Divider,
  FormControl,
  FormLabel,
} from "@mui/material";
import AppTheme from "../Components/shared-theme/AppTheme";
import ColorModeSelect from "../Components/shared-theme/ColorModeSelect";
import { GoogleIcon, SitemarkIcon } from "../Components/shared-theme/SignUp_CustomIcons";

interface SignUpDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SignUpDialog({ open, onClose }: SignUpDialogProps) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const name = document.getElementById("name") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 8 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
    });
    onClose(); // Close the dialog after successful submission
  };

  return (
    <AppTheme>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: "center" }}>Sign Up</DialogTitle>
        <DialogContent>
          <ColorModeSelect sx={{ position: "absolute", top: "1rem", right: "1rem" }} />
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
            <SitemarkIcon />
            <FormControl>
              <FormLabel htmlFor="name">Full Name</FormLabel>
              <TextField required fullWidth id="name" placeholder="John Doe" name="name" error={nameError} helperText={nameErrorMessage} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField required fullWidth id="email" placeholder="your@email.com" name="email" autoComplete="email" error={emailError} helperText={emailErrorMessage} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField required fullWidth type="password" id="password" name="password" placeholder="••••••••" error={passwordError} helperText={passwordErrorMessage} />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              Sign up
            </Button>
            <Divider>
              <Typography sx={{ color: "text.secondary" }}>or</Typography>
            </Divider>
            <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={() => alert("Sign up with Google")}>
              Sign up with Google
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Button color="primary" onClick={onClose}>
                Sign in
              </Button>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AppTheme>
  );
}
