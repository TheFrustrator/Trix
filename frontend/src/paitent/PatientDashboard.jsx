import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavlinkComponent from "../component/NavlinkComponent";
import { PatientNavlinkItems, PatientIcons } from "../assets/patientAssests";
import UserHeaderCard from "../cards/UserHeaderCard";
import DashBoardFeatureCard from "../cards/DashBoardFeatureCard";
import DoctorVisitHistory from "../component/DoctorVisitHistory";
import { AppContext } from "../context/AppContext";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useContext(AppContext);

  const [selectedVisitId, setSelectedVisitId] = useState(5);

  // Find the active nav item based on the current URL pathname
  const currentDashboardRole =
    PatientNavlinkItems.find((r) => r.route === location.pathname) ||
    PatientNavlinkItems[0]; // Fallback to first item

  // Renamed parameter to avoid shadowing the global PatientNavlinkItems array
  const handlePageChange = (navItem) => {
    if (navItem?.route && navItem.route !== location.pathname) {
      navigate(navItem.route);
    }
  };

  return (
    <div className="h-full w-full flex flex-row min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-xs">
        <NavlinkComponent
          currentDashboardRole={currentDashboardRole}
          handlePageChange={handlePageChange}
          userNavlinkItem={PatientNavlinkItems}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col p-6 gap-6 overflow-x-hidden">
        {/* Header */}
        <div className="flex justify-end">
         <UserHeaderCard headerIcon={PatientIcons.userIcon} />
        </div>

        {/* Dashboard Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          Dashboard
        </h1>

        {/* Feature Cards Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 pr-6">
          <DashBoardFeatureCard
            subjectName="Active Condition"
            conditionIcon={PatientIcons.heartIcon}
            specificationDetails="Hypertension"
            state="Manageable"
          />
          <DashBoardFeatureCard
            subjectName="Last Visit"
            conditionIcon={PatientIcons.doctorIcon}
            specificationDetails="12 Oct 2026"
            state="St. Mary Clinic"
          />
          <DashBoardFeatureCard
            subjectName="Upcoming Refill"
            conditionIcon={PatientIcons.pharmaIcon}
            specificationDetails="Amlodipine"
            state="Relief Date: 27 Oct 2026"
          />
        </div>

        {/* Doctor Visit History */}
        <DoctorVisitHistory selectedVisitId={selectedVisitId} setSelectedVisitId={setSelectedVisitId} />
      </div>
    </div>
  );
};

export default PatientDashboard;