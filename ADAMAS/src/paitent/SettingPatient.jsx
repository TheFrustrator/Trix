import React from "react";
import NavlinkComponent from "../component/NavlinkComponent";
import { Icons } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { PatientIcons, PatientNavlinkItems } from "../assets/patientAssests";
import UserHeaderCard from "../cards/UserHeaderCard";

const SettingPatient = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Find the active role based on the current URL pathname
  const currentDashboardRole =
    PatientNavlinkItems.find((r) => r.route === location.pathname) ||
    PatientNavlinkItems[0]; // Fallback to first role if path doesn't match

  const handlePageChange = (PatientNavlinkItems) => {
    if (
      PatientNavlinkItems.route &&
      PatientNavlinkItems.route !== location.pathname
    ) {
      navigate(PatientNavlinkItems.route);
    }
  };

  return (
    <div className="h-full w-full flex flex-row min-h-screen">
      <div className='w-64 flex-shrink-0 bg-white shadow-xs'>
        <NavlinkComponent
          currentDashboardRole={currentDashboardRole}
          handlePageChange={handlePageChange}
          userNavlinkItem={PatientNavlinkItems}
        />
      </div>
      <div className='flex-1 w-full flex flex-col p-6 gap-6 overflow-x-hidden'>
        {/* Header component  */}
        <div className="w-full flex justify-end">
          <UserHeaderCard
            userName={"Jhon Doe"}
            medicalID={"MED-2026-XXXX"}
            headerIcon={PatientIcons.userIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingPatient;
