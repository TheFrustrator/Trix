import React, { useState } from "react";
import NavlinkComponent from "../component/NavlinkComponent";
import { Icons } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { PatientNavlinkItems } from "../assets/patientAssests";
import UserHeaderCard from "../cards/UserHeaderCard";
import { PatientIcons } from "../assets/patientAssests";
import DashBoardFeatureCard from "../cards/DashBoardFeatureCard";
import DoctorVisitHistory from "../component/DoctorVisitHistory";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedVisitId, setSelectedVisitId] = useState(5);

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
      {/* Navigation header / Sidebar container */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-xs">
        <NavlinkComponent
          currentDashboardRole={currentDashboardRole}
          handlePageChange={handlePageChange}
          userNavlinkItem={PatientNavlinkItems}
        />
      </aside>

      {/* Main dashboard content area */}
      <div className="flex-1 w-full flex flex-col p-6 gap-6 overflow-x-hidden">
        {/* Header component  */}
        <div className="flex justify-end">
          <UserHeaderCard
            userName={"Jhon Doe"}
            medicalID={"MED-2026-XXXX"}
            headerIcon={PatientIcons.userIcon}
          />
        </div>

        {/* Main dashboard feature cards grid */}
        <h1 className="text-3xl sm:text-2xl: font-bold text-primary">
          Dashboard
        </h1>
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 pr-6">
          <DashBoardFeatureCard
            subjectName={"Active Condition"}
            conditionIcon={PatientIcons.heartIcon}
            specificationDetails={"Hypertension"}
            state="Managable"
          />
          <DashBoardFeatureCard
            subjectName={"Last Visit"}
            conditionIcon={PatientIcons.doctorIcon}
            specificationDetails={"12 Oct 22026"}
            state="St. Mary Clinic"
          />
          <DashBoardFeatureCard
            subjectName={"Upcoming Refill"}
            conditionIcon={PatientIcons.pharmaIcon}
            specificationDetails={"Amplodpine"}
            state="Relief Date: 27 Oct 2026"
          />
        </div>

        {/* Doctor vist history */}
        <>
          {" "}
          <DoctorVisitHistory />
        </>
      </div>
    </div>
  );
};

export default PatientDashboard;
