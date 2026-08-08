import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  activeLink,
  doctorData,
  DoctorIcon,
  DoctorNavlinkItems,
} from "../assets/doctor";
import NavlinkComponent from "../component/NavlinkComponent";
import DoctorHeader from "./../cards/DoctorHeader";
import { IoIosLock } from "react-icons/io";

const ActivePatient = () => {
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
        {" "}
        <NavlinkComponent
          currentDashboardRole={currentDashboardRole}
          handlePageChange={handlePageChange}
          userNavlinkItem={DoctorNavlinkItems}
        />
      </aside>

      {/* Main component */}
      <div className="flex-1 w-full flex flex-col p-6 gap-6 overflow-x-hidden">
        {/* Right side header component */}
        <div className="w-full flex justify-end">
          <DoctorHeader
            userName={doctorData.name}
            isVerified={doctorData.isVerified}
            headerIcon={DoctorIcon.FDoctorIcon}
            ClinicName={doctorData.clinicName}
          />
        </div>

        {/* Acees bar  */}
        <div className="flex flex-row items-center w-full px-3 my-2 bg-green-100 border border-green-600 rounded-lg h-10">
          <div className="flex flex-row items-center w-full justify-between gap-3 ml-2 my-1">
            <div className="flex flex-row gap-1 items-center">
              {" "}
              <IoIosLock size={24} color="green" />
              <h1 className="text-md font-medium text-primary">
                Access Granted - expires in 01:58:32
              </h1>
            </div>

            <div className="bg-blue-400 rounded-lg">
              <button className="mx-1.5 my-0.5 text-white">
                Prescribe Now
              </button>
            </div>
          </div>
        </div>

        {/* Link - summary, history, Prescription */}
        {/* Horizontal Sub-Tabs Navigation */}
        <div className="flex flex-row gap-6 border-b border-gray-200 pt-2">
          <NavLink
            to="summary"
            className={({ isActive }) =>
              `pb-2 text-sm font-semibold transition-all ${
                isActive
                  ? "border-b-2 border-slate-600 text-slate-800 -mb-[1px]"
                  : "text-slate-400 hover:text-slate-600 border-b-2 border-transparent"
              }`
            }
          >
            Summary
          </NavLink>

          <NavLink
            to="history"
            className={({ isActive }) =>
              `pb-2 text-sm font-semibold transition-all ${
                isActive
                  ? "border-b-2 border-slate-600 text-slate-800 -mb-[1px]"
                  : "text-slate-400 hover:text-slate-600 border-b-2 border-transparent"
              }`
            }
          >
            History
          </NavLink>

          <NavLink
            to="prescription"
            className={({ isActive }) =>
              `pb-2 text-sm font-semibold transition-all ${
                isActive
                  ? "border-b-2 border-slate-600 text-slate-800 -mb-[1px]"
                  : "text-slate-400 hover:text-slate-600 border-b-2 border-transparent"
              }`
            }
          >
            Prescriptions
          </NavLink>
        </div>

        {/* Nested Tab Content Renders Here */}
        <div className="mt-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ActivePatient;
