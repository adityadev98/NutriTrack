import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const ProtectedRoute = () => {
  const { loggedUser } = useContext(UserContext) ?? {};
  const location = useLocation();

  if (!loggedUser) return <Navigate to="/login" replace />;
  
  // ✅ Redirect unverified users to OTP Verification
  if (!loggedUser.verified && location.pathname !== "/otp-verification") {
    return <Navigate to="/otp-verification" replace />;
  }

  // If profile is NOT completed, allow access only to "/profile-setup"
  if (loggedUser.verified && !loggedUser.profileCompleted && location.pathname !== "/profile-setup") {
    return <Navigate to="/profile-setup" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
