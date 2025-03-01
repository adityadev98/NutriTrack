import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

const PublicRoute = () => {
  const { loggedUser } = useContext(UserContext) ?? {};

  return loggedUser ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
