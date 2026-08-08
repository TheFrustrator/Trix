import React from "react";

const DashBoardFeatureCard = ({
  subjectName,
  conditionIcon,
  specificationDetails,
  state,
}) => {
  return (
    <div className="w-full p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-4">
      <h2 className="text-primary font-semibold text-xl">{subjectName}</h2>
      {/* Account Icons and data */}
      <div className="flex flex-row items-center gap-3">
        <div className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-50 flex items-center justify-center p-2.5 shadow-xs">
        {/* Image icon portion */}
        <img
          className="w-full h-full object-contain"
          src={conditionIcon}
          alt=""
        />
        </div>

        {/* User details portion */}
        <div className="flex flex-col w-full min-w-0">
          <span className="">
            {" "}
            <h1 className="text-primary font-semibold text-md">
              {specificationDetails}
            </h1>
          </span>
          <span>
            <h1 className="font-semibold opacity-55 text-sm mt-0.5">
              {state}
            </h1>
          </span>
        </div>
      </div>
      {/* notification item */}
    </div>
  );
};

export default DashBoardFeatureCard;
