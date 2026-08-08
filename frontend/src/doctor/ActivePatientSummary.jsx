import React from "react";
import { PatientIcons, singlePatientMockData } from "../assets/patientAssests";
import { GoAlertFill } from "react-icons/go";

const ActivePatientSummary = () => {
  const patient = singlePatientMockData;

  return (
    <div className="w-full flex flex-col items-center py-2 px-2">
      {/* Patient Details Card */}
      <div className="w-full flex flex-row items-center bg-slate-100/80 border border-gray-200 rounded-2xl p-4 shadow-sm gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={PatientIcons.userIcon}
            alt="Patient Avatar"
            className="w-14 h-14 bg-blue-200/60 rounded-full object-cover p-0.5"
          />
        </div>

        {/* Aligned Details Grid */}
        <div className="grid lg:grid-cols-4 grid-cols-3 w-full gap-4 items-center">
          {/* Name */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-500">Name</span>
            <span className="text-sm font-bold text-slate-800 mt-1">
              {patient.patientName}
            </span>
          </div>

          {/* Patient ID */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-500">ID</span>
            <span className="text-sm font-semibold text-slate-700 font-mono mt-1">
              {patient.patientId}
            </span>
          </div>

          {/*Contact */}
          <div className="flex flex-col ">
            <span className="text-sm font-semibold text-slate-500">
              Contact
            </span>
            <span className="text-sm font-semibold text-slate-700 mt-1">
              {patient.contact}
            </span>
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-500">
              Date of Birth
            </span>
            <span className="text-sm font-semibold text-slate-700 mt-1">
              {patient.dateOfBirth}
            </span>
          </div>
        </div>
      </div>

      {/* Observations Section Placeholder */}
      <div className="w-full mt-4 flex flow-row justify-between gap-2">
        {/* known alergies */}
        <div className="lg:w-full flex flex-col justify-start bg-red-200 border rounded-md border-red-600 shadow-sm">
          <h1 className="font-semibold text-md text-red-800 px-2 py-2 border-b-2 border-red-100/100">
            IMPORTANT: KNOWN ALLERGIES
          </h1>
          <span className="flex flex-col gap-2.5 justify-start pl-2 my-2">
            {patient.allergies?.slice(0, 3).map((allergy) => (
              <div
                key={allergy.id}
                className="flex items-center gap-2.5 text-sm text-red-900 font-semibold"
              >
                <GoAlertFill
                  className="text-red-500 flex-shrink-0"
                  size={16}
                />
                <span>
                  {allergy.name} -{" "}
                  <span className="font-medium text-red-900">
                    {allergy.severity}
                  </span>
                </span>
              </div>
            ))}
          </span>
        </div>

        {/* condensed history list */}
         <div className="lg:w-full flex flex-col justify-start border rounded-md border-gray-200 shadow-md">
          <h1 className="font-semibold text-md text-primary px-2 py-2 border-b-2 border-slate-200">
            Condensed History List
          </h1>
          <span className="flex flex-col gap-2.5 justify-start pl-2 my-2">
            {patient.allergies?.slice(0, 3).map((allergy) => (
              <div
                key={allergy.id}
                className="flex items-center gap-2.5 text-sm text-primary font-semibold"
              >
                
                <span>
                  {allergy.name} -{" "}
                  <span className="font-medium text-primary">
                    {allergy.severity}
                  </span>
                </span>
              </div>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivePatientSummary;
