import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";

// Wrapper for general authenticated & verified routes
export const ProtectedRoute = () => {
  const { isLoggedin, userData, doctorData } = useContext(AppContext);

  // 1. Check if user/doctor is logged in
  if (!isLoggedin) {
    return <Navigate to="/patient-login" replace />;
  }

  // 2. Check account verification status
  const currentUser = userData || doctorData;
  
  if (currentUser && !currentUser.isVerified) {
    return <Navigate to="/email-verify" replace />;
  }

  // If authenticated and verified, render child routes
  return <Outlet />;
};

// Wrapper for Doctor-only routes
export const DoctorProtectedRoute = () => {
  const { isLoggedin, doctorData } = useContext(AppContext);

  if (!isLoggedin) {
    return <Navigate to="/doctor-login" replace />;
  }

  if (!doctorData) {
    // Logged in, but not a doctor account
    return <Navigate to="/" replace />;
  }

  if (!doctorData.isVerified) {
    return <Navigate to="/email-verify" replace />;
  }

  return <Outlet />;
};