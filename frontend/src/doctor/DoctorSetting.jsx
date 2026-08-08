import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DoctorNavlinkItems } from "../assets/doctor";
import NavlinkComponent from "../component/NavlinkComponent";

const DoctorSetting = () => {
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
    <div className="">
      {/* Navlink components */}
      <div>
        <NavlinkComponent
          currentDashboardRole={currentDashboardRole}
          handlePageChange={handlePageChange}
          userNavlinkItem={DoctorNavlinkItems}
        />
      </div>

      {/* Right side component */}
      <div>hi</div>
    </div>
  );
};

export default DoctorSetting;
