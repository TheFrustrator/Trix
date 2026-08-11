import React from "react";
import { useNavigate } from "react-router-dom";

const UserBasedLoginCard = ({
  logo,
  userName,
  userDetails,
  navigationLink,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm max-w-md">
      {/* Icon/Image Container */}
      <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center rounded-full bg-blue-100">
        <img
          src={logo}
          alt="For Patients"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <h3 className="text-xl font-bold text-[#264067] mb-1">{userName}</h3>

        <p className="text-sm text-gray-600 leading-snug mb-3">{userDetails}</p>
        <button
          className="w-full md:w-full bg-border border rounded-full"
          onClick={() => navigate(navigationLink)}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default UserBasedLoginCard;
