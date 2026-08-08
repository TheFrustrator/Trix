import React, { useMemo, useState } from "react";
import NavlinkComponent from "../component/NavlinkComponent";
import { Icons } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { PatientIcons, PatientNavlinkItems, prescriptionsDetails } from "../assets/patientAssests";
import UserHeaderCard from "../cards/UserHeaderCard";
import { prescriptionsData } from "../assets/doctor";
import { FiSearch } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BiRotateLeft } from "react-icons/bi";

const PrescriptionPatient = () => {
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

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("6months");

  // Find the active role based on the current URL pathname

  // Filter logic
  const filteredPrescriptions = useMemo(() => {
    return prescriptionsData.filter((item) => {
      const matchesSearch =
        item.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.medications.some((med) =>
          med.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesTime =
        timeFilter === "all" ? true : item.timeFrame === timeFilter;

      return matchesSearch && matchesTime;
    });
  }, [searchTerm, timeFilter]);

  const handleReset = () => {
    setSearchTerm("");
    setTimeFilter("all");
  };

  return (
    <div className="h-full w-full flex flex-row min-h-screen">
      {/* navlink component */}
      <div className="w-64 flex-shrink-0 bg-white shadow-xs">
        <NavlinkComponent
          currentDashboardRole={currentDashboardRole}
          handlePageChange={handlePageChange}
          userNavlinkItem={PatientNavlinkItems}
        />
      </div>
      <div className="flex-1 w-full flex flex-col p-6 gap-6 overflow-x-hidden">
        {/* Header component  */}
        <div className="w-full flex justify-end">
          <UserHeaderCard
            userName={"Jhon Doe"}
            medicalID={"MED-2026-XXXX"}
            headerIcon={PatientIcons.userIcon}
          />
        </div>

        {/* search bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Search by Doctor, Drug Name, or Diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 placeholder-slate-400 transition"
              />
            </div>

            {/* Time Dropdown Filter */}
            <div className="relative w-full sm:w-56">
              <FaRegCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer transition"
              >
                <option value="6months">Last 6 Months</option>
                <option value="30days">Last 30 Days</option>
                <option value="1year">Last 1 Year</option>
                <option value="all">All Time</option>
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Active Filters Row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-slate-400">
                Active Filters:
              </span>
              {timeFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs font-semibold">
                  {timeFilter === "6months"
                    ? "Last 6 Months"
                    : timeFilter === "30days"
                      ? "Last 30 Days"
                      : "Last 1 Year"}
                  <button
                    onClick={() => setTimeFilter("all")}
                    className="hover:text-emerald-900 transition"
                  >
                    <IoClose className="text-sm" />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs font-semibold">
                  "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-emerald-900 transition"
                  >
                    <IoClose className="text-sm" />
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition"
            >
              <BiRotateLeft className="text-base" />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Prescription view component */}
        <div className="grid grid-cols-3 items-center justify-center gap-2">
          {prescriptionsDetails.map((pres) => (
            <div key={pres.id} className="flex flex-col items-start justify-center gap-1 border border-slate-300 shadow-2xl hover:border-blue-100">
              <h1>{pres.doctorName}</h1>
              <h1>{}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPatient;
