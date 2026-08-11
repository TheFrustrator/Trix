import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icons, navigationLinks, userNames, userRoles } from "../assets/assets";
import UserBasedLoginCard from "../cards/userBasedLoginCard";

const ChooseSighUp = () => {

  const [authMode, setAuthMode] = useState("login");
  return (
    <div className="min-h-screen bg-[#F3F6FA] flex flex-col items-center  px-4 py-12 relative overflow-hidden">
      {/* Top Segmented Control (Login / Sign Up Toggle) */}
      <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200/80 flex items-center mb-12 z-10">
        <button
          onClick={() => setAuthMode("login")}
          className={`px-8 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
            authMode === "login"
              ? "bg-[#264067] text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 bg-transparent"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setAuthMode("signup")}
          className={`px-8 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
            authMode === "signup"
              ? "bg-[#264067] text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 bg-transparent"
          }`}
        >
          Sign Up
        </button>
      </div>
      <h1 className="font-bold text-primary text-5xl">Continue as</h1>
      {/* image section  */}
      <div className="flex items-center rounded-full  w-32 h-32 my-16 bg-blue-100">
        <img src={Icons.doctorLogo} alt="" />
      </div>

      <div className="flex flex-row justify-between mt-[-8.5%] gap-3">
        {authMode === "login" ? (
          // login screens

          <div className="flex flex-row justify-between lg:mt-9 mt-[-3.3%] gap-3">
            <UserBasedLoginCard
              logo={Icons.patient}
              userName={userNames.patient}
              userDetails={userRoles.patientDescription}
              navigationLink={navigationLinks.patientLogin}
            />
            <UserBasedLoginCard
              logo={Icons.doctor}
              userName={userNames.doctor}
              userDetails={userRoles.doctorDescription}
              navigationLink={navigationLinks.doctortLogin}
            />
            <UserBasedLoginCard
              logo={Icons.pharmacy}
              userName={userNames.pharmacy}
              userDetails={userRoles.pharmacyDescription}
              navigationLink={navigationLinks.pharmacyLogin}
            />
          </div>
        ) : (
          // signup screen
          <div className="flex flex-row justify-between lg:mt-9 mt-[-3.3%] gap-3">
            <UserBasedLoginCard
              logo={Icons.patient}
              userName={userNames.patient}
              userDetails={userRoles.patientDescription}
              navigationLink={navigationLinks.patientSignUp}
            />
            <UserBasedLoginCard
              logo={Icons.doctor}
              userName={userNames.doctor}
              userDetails={userRoles.doctorDescription}
              navigationLink={navigationLinks.doctortSignup}
            />
            <UserBasedLoginCard
              logo={Icons.pharmacy}
              userName={userNames.pharmacy}
              userDetails={userRoles.pharmacyDescription}
              navigationLink={navigationLinks.pharmacySignup}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChooseSighUp;
