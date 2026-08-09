import React, { useState, useEffect, useMemo } from "react";

const ActiveSessionCard = ({
  doctorName,
  clinicAdd,
  expiresAt,
  onRevokeHandler,
}) => {
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  const targetTimestamp = useMemo(() => {
    return expiresAt ? new Date(expiresAt).getTime() : 0;
  }, [expiresAt]);

  useEffect(() => {
    if (!targetTimestamp) return;

    const calculateRemainingTime = () => {
      const now = Date.now();
      const difference = targetTimestamp - now;

      if (difference <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const pad = (n) => String(n).padStart(2, "0");
      setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    calculateRemainingTime();
    const intervalId = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [targetTimestamp]);

  return (
    <div className="flex flex-row items-center justify-between border border-green-400 rounded-md bg-green-400/15 mx-2 my-1 p-2 gap-3 hover:shadow-inner transition-all">
      {/* Doctor & Clinic details */}
      <div className="flex flex-col ml-2.5 my-1">
        <h1 className="font-medium text-md text-slate-800">
          Connected Session with {doctorName || "Dr. Unknown"}
        </h1>
        <h2 className="font-normal text-xs text-slate-500">
          {clinicAdd || "Clinic Details Unavailable"}
        </h2>
      </div>

      {/* Revoke Access Action and Live Countdown */}
      <div className="flex flex-row items-center my-2 mx-1 gap-3">
        <button
          type="button"
          onClick={onRevokeHandler}
          className="bg-red-600 border-b rounded-lg py-2 px-3 hover:bg-red-700 transition-colors cursor-pointer"
        >
          <span className="text-xs font-semibold text-white">
            Revoke Access
          </span>
        </button>

        <div className="flex flex-col mr-2 text-right">
          <span className="lg:text-sm text-xs font-normal text-slate-500">
            Time Remaining:
          </span>
          <span className="lg:text-sm text-sm font-bold text-primary font-mono">
            {timeLeft}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActiveSessionCard;