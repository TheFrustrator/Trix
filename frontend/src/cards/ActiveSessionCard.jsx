import React from "react";

const ActiveSessionCard = ({
  doctorName,
  clinicAdd,
  timeOutTime,
  onAcceptHandler,
  onDenyHandler,
}) => {
  return (
    <div className="flex flex-row items-center justify-between border border-green-400 rounded-md shadow-none bg-green-400/15 mx-2 my-1 gap-3 hover:shadow-inner">
      {/* name and clinic  */}
      <div className="flex flex-col ml-2.5 my-1">
        <h1 className="font-medium text-md">Connected Session with {doctorName}</h1>
        <h1 className="font-normal text-xs opacity-100">{clinicAdd}</h1>
      </div>
      {/* request time  */}
      <div className="flex flex-row items-center my-2 mx-1 gap-3">
        {" "}
        {/* accepts button */}
        <button
          onClick={onAcceptHandler}
          className="bg-red-600 border-b rounded-lg py-2 px-2 hover:bg-red-300"
        >
          <h1 className="text-xs font-semibold text-white px-1 ">
            Revoke Access
          </h1>
        </button>
        {/* Time Remaining for revoke */}
        <div className="flex flex-col mr-2">
          <h1 className="lg:text-sm text-xs font-normal">
            Time Remaining:
          </h1>
          <h1 className="lg:text-sm text-sm font-bold text-primary flex justify-end">
            {timeOutTime}
          </h1>
        </div>
      </div>

      {/* accepts and deny button */}
    </div>
  );
};

export default ActiveSessionCard;
