import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

const ProtectedRoute = () => {
  const { loggedUser } = useContext(UserContext) ?? {};

  return loggedUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
