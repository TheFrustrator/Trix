import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";

// Patient Route Guard
export const ProtectedRoute = () => {
  const { isLoggedin, userData, loading } = useContext(AppContext);

  // 1. Wait if AppContext is still checking authentication or fetching user profile
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-slate-600 font-medium">
        Authenticating session...
      </div>
    );
  }

  // 2. Redirect ONLY if checks have finished AND the user is not authenticated/found
  if (!isLoggedin || !userData) {
    return <Navigate to="/patient-login" replace />;
  }

  return <Outlet />;
};

// Doctor Route Guard
export const DoctorProtectedRoute = () => {
  const { isLoggedin, doctorData, loading } = useContext(AppContext);

  // 1. Wait if AppContext is still checking authentication or fetching doctor profile
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-slate-600 font-medium">
        Authenticating doctor session...
      </div>
    );
  }

  // 2. Redirect ONLY if checks have finished AND doctor profile is missing
  if (!isLoggedin || !doctorData) {
    return <Navigate to="/doctor-login" replace />;
  }

  return <Outlet />;
};