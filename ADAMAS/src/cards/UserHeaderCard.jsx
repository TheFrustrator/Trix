import React from "react";

import { IoMdNotificationsOutline } from "react-icons/io";

const UserHeaderCard = ({ userName, medicalID, headerIcon }) => {
  return (
    <div className="flex flex-row justify-end items-center py-4 px-5 gap-5">
      {/* Account Icons and data */}
      <div className="flex flow-row px-2 py-1 shadow-sm gap-1 border rounded-xl">
        {/* Image icon portion */}
        <img
          className="rounded-full bg-border shadow-md mx-2 my-2"
          src={headerIcon}
          alt=""
        />

        {/* User details portion */}
        <div className="flex flex-col w-full mx-1 my-1">
          <span className="text-primary font-semibold">{userName}</span>
          <span className="my-1 justify-center items-center border rounded-md bg-blue-100">
            <h1 className="font-semibold opacity-55 text-sm my-1 mx-1">
              {medicalID}
            </h1>
          </span>
        </div>
      </div>
      {/* notification item */}
      <div className="">
        <IoMdNotificationsOutline size={28} />
      </div>
    </div>
  );
};

export default UserHeaderCard;
