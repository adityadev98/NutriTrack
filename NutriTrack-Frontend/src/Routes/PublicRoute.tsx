import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const PublicRoute = () => {
  const { loggedUser } = useContext(UserContext) ?? {};

  if (!loggedUser) return <Outlet />; // Allow public access

  return loggedUser.userType === "admin"
    ? <Navigate to="/admin-dashboard" replace />
    : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
