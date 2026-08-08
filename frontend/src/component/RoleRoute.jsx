import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const loginRoutes = { patient: "/patient-login", doctor: "/doctor-login", pharmacy: "/pharmacy-login" };
export default function RoleRoute({ role, children }) {
  const { authReady, isLoggedin, userData } = useContext(AppContext);
  if (!authReady) return null;
  if (!isLoggedin || !userData?.isVerified) return <Navigate to={loginRoutes[role]} replace />;
  if (userData.role !== role) return <Navigate to={loginRoutes[userData.role] || "/"} replace />;
  return children;
}
