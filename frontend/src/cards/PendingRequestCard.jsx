import React from "react";

const PendingRequestCard = ({ doctorName, clinicAdd, requestTime,onAcceptHandler,onDenyHandler }) => {
  return (
    <div className="flex flex-row items-center justify-between border rounded-md shadow-none mx-2 my-1 gap-3 hover:shadow-xl">
      {/* name and clinic  */}
      <div className="flex flex-col ml-2.5 my-1">
        <h1 className="font-medium text-md">{doctorName}</h1>
        <h1 className="font-thin text-xs opacity-55">{clinicAdd}</h1>
      </div>
      {/* request time  */}
      <div className="flex flex-row">
        <h1 className="lg:text-sm text-xs font-normal">Request Time:{requestTime} ago</h1>
      </div>
      {/* accepts and deny button */}
      <div className="flex flex-row gap-2 mr-2.5">
        {/* accepts button */}
        <button onClick={onAcceptHandler} className="bg-green-600 border-b rounded-lg py-1 px-1 lg:w-[85px] w-[65px] text-white hover:bg-green-200 hover:text-white">
          Accept
        </button>
        {/* deny button  */}
        <button onClick={onDenyHandler} className="bg-red-600 border-b rounded-lg py-1 px-1 lg:w-[85px] w-[65px] text-white hover:bg-red-300 hover:text-white">
          Deny
        </button>
      </div>
    </div>
  );
};

export default PendingRequestCard;
