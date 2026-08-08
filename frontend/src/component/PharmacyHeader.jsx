import React from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoShieldCheckmark } from "react-icons/io5";
import { Icons } from "../assets/assets";

const PharmacyHeader = ({ pharmacyName }) => {
  return (
    <>
      <div className="flex flex-row justify-between items-center mt-3 border-b shadow-sm">
        {/* logo and app name */}
        <div className="flex flow-row gap-0 justify-center items-center ml-6">
          <img
            className="w-14 rounded-full"
            src={Icons.logoM}
            alt="MediLink Logo"
          />
           <h1 className="text-2xl font-bold text-primary">MediLink</h1>
        </div>

        {/* pharmacy details and notification icon */}
        <div className="flex flex-row justify-end items-center py-4 px-5 gap-5">
          {/* Account Icons and data */}
          <div className="flex flow-row px-2 py-1 shadow-sm gap-1 border rounded-xl">
            {/* Image icon portion */}

            {/* User details portion */}
            <div className="flex flex-col mx-1 my-1">
              <span className="text-primary font-semibold text-lg">
                {pharmacyName}
              </span>

              <div className="flex flex-row items-center justify-end mx-1 my-1 bg-green-100 rounded-lg">
                <IoShieldCheckmark color="green" />
                <h1 className="font-semibold opacity-55 text-sm my-1 mx-1">
                  Verified Pharmacy
                </h1>
              </div>
            </div>
          </div>
          {/* notification item */}
          <div className="">
            <IoMdNotificationsOutline size={28} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PharmacyHeader;
