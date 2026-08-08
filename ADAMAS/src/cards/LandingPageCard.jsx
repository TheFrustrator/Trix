import React from "react";
import { Icons } from "../assets/assets";

const LandingPageCard = ({ logo, userName, userDetails }) => {
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

        <a
          href="#learn-more"
          className="text-sm font-semibold text-[#5B9BD5] hover:underline self-start"
        >
          Learn More
        </a>
      </div>
    </div>
  );
};

export default LandingPageCard;
