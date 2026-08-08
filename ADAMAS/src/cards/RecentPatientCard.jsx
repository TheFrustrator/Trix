import React from "react";
import { doctorData, DoctorIcon } from "../assets/doctor";
import { CiCalendar } from "react-icons/ci";
import { FaRegFilePdf } from "react-icons/fa6"
import { useNavigate, useParams } from "react-router-dom";

const RecentPatientCard = ({pateintName, patientId, lastVisitdate, disease, onSelectPatient}) => {
  const navigate = useNavigate()
  // const handleCardClick = () => {
  //   // Navigate to route with ID parameter
  //   navigate(`/patient-prescription/${patientId}`);
    
  //   // Optional: invoke parent callback if state needs to update simultaneously
  //   if (onSelectPatient) {
  //     onSelectPatient(patientId);
  //   }
  // };

  return (
    <div className="w-72 flex flex-col mx-auto my-auto border border-gray-200 rounded-xl shadow-xl">
      {/* user icon and detail icon */}
      <div className="flex flex-row justify-between gap-16">
        <span className="rounded-full bg-blue-100 ml-2 mt-2">
          <img src={DoctorIcon.FDoctorIcon} alt="" className="w-8" />
        </span>
        <CiCalendar size={32} color="gray" className="mr-2 mt-2" />
      </div>

      {/* Recent patient  */}
      <div className="flex flex-col mx-2 my-1">
        <h1 className="text-lg font-semibold">{pateintName}</h1>
        <h1 className="text-sm font-medium text-slate-500">ID: {patientId}</h1>
      </div>
      {/* prescription request */}
      <button onClick={{}} className="rounded-full bg-blue-300 my-2 mx-2 flex flex-row items-center justify-center gap-2">
        <h1 className="text-xl font-md text-white my-1">Prescription Request</h1>
        <FaRegFilePdf color="white" size={16} className="my-1"/>
      </button>

      {/* Last visit date and prescription */}
      <div className="flex flex-col mx-3 mb-5">
        <h1 className="text-xl font-medium text-gray-700">Last Visit: {lastVisitdate}</h1>
        <h1 className="text-md font-medium text-gray-700">Prescription: {disease}</h1>
      </div>
    </div>
  );
};

export default RecentPatientCard;
