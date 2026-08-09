import React, { useState, useEffect } from "react";

const ActiveTime = ({ doctorName, clinicAdd, expiresAt, onRevokeHandler }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(expiresAt).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const pad = (num) => String(num).padStart(2, "0");
      setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <div className="flex flex-row items-center justify-between p-4 my-2 border border-green-200 bg-green-50/60 rounded-xl shadow-xs">
      <div className="flex flex-col">
        <h2 className="font-semibold text-gray-800 text-base">
          Connected Session with {doctorName}
        </h2>
        <p className="text-xs text-gray-500">{clinicAdd}</p>
      </div>

      <div className="flex flex-row items-center gap-4">
        <button
          onClick={onRevokeHandler}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors cursor-pointer"
        >
          Revoke Access
        </button>

        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500 font-medium">Time remaining:</span>
          <span className="font-mono text-lg font-bold text-gray-800">
            {timeLeft}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActiveTime;