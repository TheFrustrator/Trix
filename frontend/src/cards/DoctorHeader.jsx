import React from "react";
import { CiLocationOn } from "react-icons/ci";

const DoctorHeader = ({ userName, isVerified, headerIcon, ClinicName }) => {
  return (
    <div className="flex flex-row justify-end items-center py-4 px-5 gap-5">
      {/* Account Icons and data */}
      <div className="flex flow-row px-2 py-1 shadow-sm gap-1 border rounded-xl">
        {/* Image icon portion */}
        <img
          className="w-12 h-12 rounded-full bg-border shadow-md mx-2 my-2"
          src={headerIcon}
          alt=""
        />

        {/* User details portion */}
        <div className="flex flex-col w-full mx-1 my-1">
          <span className="text-primary font-semibold">{userName}</span>
          <div className="my-1 flex justify-between items-center">
            <span className="border rounded-full bg-blue-200">
              {" "}
              <h1 className="font-semibold opacity-55 text-sm my-1 mx-1.5 gap-1">
                {isVerified === true || isVerified === "true"
                  ? "Verified"
                  : "Not Verified"}
              </h1>
            </span>

            <span className="flex flex-row items-center justify-center">
              <CiLocationOn />
              <h1 className="font-semibold opacity-55 text-sm my-1 mx-1 gap-1">
                {ClinicName}
              </h1>
            </span>
          </div>
        </div>
      </div>
      {/* notification item */}
    </div>
  );
};

export default DoctorHeader;
