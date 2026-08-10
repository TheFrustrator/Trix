import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const PharmacyProtectedRoute = () => {
  const {
    isLoggedin,
    pharmacyData,
    loading,
  } = useContext(AppContext);

  // Wait until cookie/session verification finishes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600">
            Authenticating pharmacy session...
          </p>
        </div>
      </div>
    );
  }

  // Session finished and pharmacy isn't authenticated
  if (!isLoggedin || !pharmacyData) {
    return (
      <Navigate
        to="/pharmacy-login"
        replace
      />
    );
  }

  return <Outlet />;
};

export default PharmacyProtectedRoute;