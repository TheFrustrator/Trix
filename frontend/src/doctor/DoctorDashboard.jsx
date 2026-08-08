import React, { useState } from "react";

import NavlinkComponent from "../component/NavlinkComponent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  doctorData,
  DoctorIcon,
  DoctorNavlinkItems,
  patientMockData,
} from "../assets/doctor";
import DoctorHeader from "../cards/DoctorHeader";
import { FaSearch } from "react-icons/fa";
import RecentPatientCard from "../cards/RecentPatientCard";

const DoctorDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
 

  // Find the active role based on the current URL pathname
  const currentDashboardRole =
    DoctorNavlinkItems.find((r) => r.route === location.pathname) ||
    DoctorNavlinkItems[0]; // Fallback to first role if path doesn't match

  const handlePageChange = (DoctorNavlinkItems) => {
    if (
      DoctorNavlinkItems.route &&
      DoctorNavlinkItems.route !== location.pathname
    ) {
      navigate(DoctorNavlinkItems.route);
    }
  };

  return (
    <div className="h-full w-full flex flex-row min-h-screen">
      <aside className="w-64 flex-shrink-0 bg-white shadow-xs">
        <NavlinkComponent
          currentDashboardRole={currentDashboardRole}
          handlePageChange={handlePageChange}
          userNavlinkItem={DoctorNavlinkItems}
        />
      </aside>

      {/* Main dashboard content area */}
      <div className="flex-1 w-full flex flex-col  p-6 gap-6 overflow-x-hidden">
        <div className="w-full flex justify-end">
          <DoctorHeader
            userName={doctorData.name}
            isVerified={doctorData.isVerified}
            headerIcon={DoctorIcon.FDoctorIcon}
            ClinicName={doctorData.clinicName}
          />
        </div>
        {/* search box */}
        <div className="flex flex-row w-full justify-center items-center gap-1 mt-8">
          {/* Search bar */}
          <form
            onSubmit={{}}
            className="flex flex-row lg:w-[1045px] justify-between items-center border border-gray-400 shadow-lg rounded-lg gap-4"
          >
            <div className="flex items-center gap-0 pl-2">
              <FaSearch color="gray" />
              <div className="text-slate-500 mx-4 my-2">
                <div className="flex flex-col gap-1 mx-4">
                  <input
                    id="patient-search"
                    type="text"
                    placeholder="Enter Patient ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-none  border-blue-100 w-fit rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-white text-slate-700"
                  />
                </div>
                {/* Enter Patient ID (e.g., p-4041-XYZ) */}
              </div>
            </div>
          </form>
          {/* Request Button */}
          <button
            type="submit"
            className="flex flex-row items-center justify-center bg-blue-300 rounded-lg my-2 mx-4 gap-1"
          >
            <span className="mx-2 my-2">
              <h1 className="text-sm font-semibold text-white my-2">
                Request Access
              </h1>
            </span>
          </button>
        </div>

        {/* Recent patients */}
        <h1 className="text-3xl sm:text-2xl: font-semibold text-primary pl-4">
          Recent Patient
        </h1>
        {patientMockData.length === 0 ? (
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-primary">
              No Pateint data found! Please check the Patient ID
            </h1>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6 pr-6">
            {patientMockData.map((patient) => (
              <RecentPatientCard
                key={patient.id}
                pateintName={patient.patientName}
                patientId={patient.patientId}
                lastVisitdate={patient.lastVisitDate}
                disease={patient.prescription.mainDisease}
                
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
