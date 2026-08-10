import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export const ProtectedRoute = () => {
  const { isLoggedin, userData, loading } = useContext(AppContext);

  // IMPORTANT:
  // Don't redirect while authentication is being restored.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600">
            Authenticating session...
          </p>
        </div>
      </div>
    );
  }

  // Authentication check has finished
  if (!isLoggedin || !userData) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};


export const DoctorProtectedRoute = () => {
  const { isLoggedin, doctorData, loading } = useContext(AppContext);

  // Don't redirect until authentication restoration is complete
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600">
            Authenticating doctor session...
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedin || !doctorData) {
    return <Navigate to="/doctor/login" replace />;
  }

  return <Outlet />;
};