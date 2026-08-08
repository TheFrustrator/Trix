import React from "react";
import { DoctorIcon } from "../assets/doctor";
import { FaEye, FaRegCalendarCheck } from "react-icons/fa";

const MedicalDetails = () => {
  return (
    <div className="w-[400px] flex flex-col items-center justify-start bg-gray-50 border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      {/* doctor details */}
      <div className="w-full flex flex-row items-center p-4 gap-3 border-b border-gray-200">
        <img
          src={DoctorIcon.FDoctorIcon}
          alt="Doctor"
          className="w-14 h-14 rounded-full bg-blue-100 shrink-0"
        />
        <div className="flex flex-col">
          <h1 className="text-lg text-black font-semibold leading-tight">
            Dr. Alexander Wright
          </h1>
          <h1 className="text-sm font-bold text-green-600 leading-tight">
            Cardiology
          </h1>
          <h1 className="text-sm font-semibold text-gray-500 leading-tight">
            Metropolitan Heart Institute
          </h1>
        </div>
      </div>

      {/* Patient Condition */}
      <div className="w-full flex flex-col p-4">
        {/* date and active status */}
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row items-center justify-start gap-2">
            <FaRegCalendarCheck size={18} className="text-green-600" />
            <h1 className="text-sm text-gray-500 font-semibold">
              Feb 18, 2026
            </h1>
          </div>
          <span className="inline-flex items-center justify-center bg-green-200 px-3 py-1 border border-green-600 rounded-full text-xs font-semibold text-green-800">
            Active
          </span>
        </div>

        {/* Diagnosis */}
        <span className="flex flex-col mt-3">
          <h1 className="text-sm text-gray-500 font-semibold uppercase">
            DIAGNOSIS
          </h1>
          <h1 className="text-sm text-black font-semibold">
            Hypertension Stage 1
          </h1>
        </span>

        <h1 className="text-sm text-gray-500 font-semibold uppercase mt-3">
          medications
        </h1>
        <div className="flex flex-row gap-2 items-center justify-start mt-1.5">
          <span className="border bg-gray-100 rounded-xl px-2 py-1">
            Lisinopril (10mg)
          </span>
        </div>

        <button className="w-full flex flex-row items-center justify-between mt-5">
          <span className="text-gray-400 font-semibold text-xs">Rx #90142-2026</span>
          <div className="flex flex-row gap-1.5 border rounded-full px-2 py-1 items-center">
<FaEye size={16} color="green"/>
<h1 className="text-xs font-semibold text-green-700">View Prescription</h1>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MedicalDetails;
