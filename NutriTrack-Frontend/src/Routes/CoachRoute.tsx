import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const CoachRoute = () => {
  const { loggedUser } = useContext(UserContext) ?? {};

  return loggedUser && loggedUser.userType === "coach" ? <Outlet /> : <Navigate to="/404" replace />;
};

export default CoachRoute;
