import React, { useContext } from "react";

import { IoMdNotificationsOutline } from "react-icons/io";

import { IoShieldCheckmark } from "react-icons/io5";

import { useNavigate } from "react-router-dom";

import { AppContext } from "../context/AppContext";

const PharmacyHeader = () => {
  const navigate = useNavigate();

  const { pharmacyData, logout } = useContext(AppContext);

  const handleLogout = async () => {
    await logout("pharmacy");

    navigate("/pharmacy-login", {
      replace: true,
    });
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="flex flex-row justify-between items-center py-4 px-6">
        {/* Logo */}

        <div>
          <h1 className="text-2xl font-bold text-blue-500">MediLink</h1>
        </div>

        {/* Pharmacy Details */}

        <div className="flex flex-row justify-end items-center gap-5">
          <div className="flex flex-row px-3 py-2 shadow-sm gap-2 border rounded-xl">
            <div className="flex flex-col">
              <span className="text-primary font-semibold text-lg">
                {pharmacyData?.shopName || "Pharmacy"}
              </span>

              <span className="text-xs text-gray-500">
                {pharmacyData?.ownerName || ""}
              </span>

              <div className="flex flex-row items-center bg-green-100 rounded-lg px-2 py-1 mt-1">
                <IoShieldCheckmark
                  color={pharmacyData?.isVerified ? "green" : "gray"}
                />

                <span className="font-semibold text-xs ml-1">
                  {pharmacyData?.isVerified
                    ? "Verified Pharmacy"
                    : "Not Verified"}
                </span>
              </div>
            </div>
          </div>

          <button>
            <IoMdNotificationsOutline size={28} />
          </button>

          <button
            onClick={handleLogout}
            className="text-red-500 text-sm font-semibold hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default PharmacyHeader;
