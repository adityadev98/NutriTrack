import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const AdminRoute = () => {
  const { loggedUser } = useContext(UserContext) ?? {};

  return loggedUser && loggedUser.userType === "admin" ? <Outlet /> : <Navigate to="/404" replace />;
};

export default AdminRoute;
