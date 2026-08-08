import React from 'react'
import NavlinkComponent from '../component/NavlinkComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { DoctorNavlinkItems } from '../assets/doctor';

const PrescriptionIssue = () => {
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
    <div>
      <NavlinkComponent
        currentDashboardRole={currentDashboardRole}
        handlePageChange={handlePageChange}
        userNavlinkItem={DoctorNavlinkItems}
      />
    </div>
  )
}

export default PrescriptionIssue