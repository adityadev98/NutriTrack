import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const PublicRoute = () => {
  const { loggedUser } = useContext(UserContext) ?? {};

  if (!loggedUser) return <Outlet />; // Allow public access

  // ✅ Redirect users based on their type
  if (loggedUser.userType === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (loggedUser.userType === "coach") {
    return <Navigate to="/coach-dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
