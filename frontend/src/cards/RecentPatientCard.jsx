import React from "react";
import { DoctorIcon } from "../assets/doctor";
import { CiCalendar } from "react-icons/ci";
import { FaRegFilePdf } from "react-icons/fa6";

const RecentPatientCard = ({
  patientName,
  pateintName, // Compatibility fallback
  patientId,
  patientCustomId,
  lastVisitdate,
  disease,
  onRequestAccess,
}) => {
  const displayName = patientName || pateintName || "Patient";
  const customId = patientCustomId || patientId;

  const handlePrescriptionRequestClick = (e) => {
    e.stopPropagation();

    if (onRequestAccess && customId) {
      onRequestAccess(customId);
    }
  };

  return (
    <div className="w-full sm:w-72 flex flex-col bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow p-3 mx-auto">
      {/* Header Icons */}
      <div className="flex flex-row justify-between items-center mb-2">
        <span className="rounded-full bg-blue-100 p-1">
          <img
            src={DoctorIcon.FDoctorIcon}
            alt="Doctor Icon"
            className="w-8 h-8 rounded-full"
          />
        </span>
        <CiCalendar size={28} color="gray" />
      </div>

      {/* Patient Name & ID */}
      <div className="flex flex-col my-1">
        <h1 className="text-base font-bold text-slate-800 truncate">
          {displayName}
        </h1>
        <h2 className="text-xs font-semibold text-slate-500">
          ID: {customId}
        </h2>
      </div>

      {/* Prescription Request Trigger Button */}
      <button
        type="button"
        onClick={handlePrescriptionRequestClick}
        className="w-full rounded-xl bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white my-3 py-2 px-3 flex flex-row items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
      >
        <span className="text-sm font-semibold text-white">
          Prescription Request
        </span>
        <FaRegFilePdf color="white" size={14} />
      </button>

      {/* Visit Details */}
      <div className="flex flex-col mt-1 gap-0.5">
        <h3 className="text-xs font-semibold text-slate-700">
          Last Visit: <span className="font-bold">{lastVisitdate}</span>
        </h3>
        <h3 className="text-xs font-semibold text-slate-700 truncate">
          Prescription:{" "}
          <span className="font-medium text-slate-600">{disease}</span>
        </h3>
      </div>
    </div>
  );
};

export default RecentPatientCard;