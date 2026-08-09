import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PatientIcons,
  PatientNavlinkItems,
} from "../assets/patientAssests";
import NavlinkComponent from "../component/NavlinkComponent";
import UserHeaderCard from "../cards/UserHeaderCard";

// Icons
import { FiSearch } from "react-icons/fi";
import { FaRegCalendarCheck, FaRegCalendarAlt } from "react-icons/fa";
import { IoEyeOutline, IoClose } from "react-icons/io5";
import { BiRotateLeft } from "react-icons/bi";
import { prescriptionsData } from "../assets/doctor";

function MedicalHistory() {
  const navigate = useNavigate();
  const location = useLocation();

  // Prescription History Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  const currentDashboardRole = useMemo(() => {
    return (
      PatientNavlinkItems.find((r) => r.route === location.pathname) ||
      PatientNavlinkItems[0]
    );
  }, [location.pathname]);

  const handlePageChange = (item) => {
    if (item.route && item.route !== location.pathname) {
      navigate(item.route);
    }
  };

  // Prescription filtering logic
  const filteredPrescriptions = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return prescriptionsData.filter((item) => {
      const matchesSearch =
        !term ||
        item.doctorName.toLowerCase().includes(term) ||
        item.specialty.toLowerCase().includes(term) ||
        item.diagnosis.toLowerCase().includes(term) ||
        item.medications.some((med) => med.toLowerCase().includes(term));

      const matchesTime =
        timeFilter === "all" ? true : item.timeFrame === timeFilter;

      return matchesSearch && matchesTime;
    });
  }, [searchTerm, timeFilter]);

  const totalCount = prescriptionsData.length;
  const activeCount = prescriptionsData.filter(
    (p) => p.status === "ACTIVE"
  ).length;
  const pastCount = prescriptionsData.filter((p) => p.status === "PAST").length;

  const handleResetFilters = () => {
    setSearchTerm("");
    setTimeFilter("all");
  };

  return (
    <div className="h-full w-full flex flex-row min-h-screen bg-slate-50/50">
      {/* Sidebar Navigation */}
      <div className="w-64 flex-shrink-0 bg-white shadow-xs">
        <NavlinkComponent
          currentDashboardRole={currentDashboardRole}
          handlePageChange={handlePageChange}
          userNavlinkItem={PatientNavlinkItems}
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 w-full flex flex-col p-6 gap-6 overflow-x-hidden">
        {/* User Header */}
        <div className="w-full flex justify-end">
          <UserHeaderCard headerIcon={PatientIcons.userIcon} />
        </div>

        {/* PRESCRIPTION HISTORY SECTION */}
        <div className="w-full flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Prescription History
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                View, search, and download your past medical prescriptions and
                doctor instructions.
              </p>
            </div>

            {/* Stats Overview */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-6 py-3 shadow-xs gap-8 self-start md:self-auto">
              <div className="text-center">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
                  TOTAL
                </span>
                <span className="text-2xl font-bold text-slate-800">
                  {totalCount}
                </span>
              </div>
              <div className="h-8 w-[1px] bg-slate-200" />
              <div className="text-center">
                <span className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase block">
                  ACTIVE
                </span>
                <span className="text-2xl font-bold text-emerald-600">
                  {activeCount}
                </span>
              </div>
              <div className="h-8 w-[1px] bg-slate-200" />
              <div className="text-center">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
                  PAST
                </span>
                <span className="text-2xl font-bold text-slate-800">
                  {pastCount}
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center gap-3">
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

            {/* Active Filter Chips */}
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
                      type="button"
                      onClick={() => setTimeFilter("all")}
                      className="hover:text-emerald-900 transition cursor-pointer"
                    >
                      <IoClose className="text-sm" />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs font-semibold">
                    "{searchTerm}"
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="hover:text-emerald-900 transition cursor-pointer"
                    >
                      <IoClose className="text-sm" />
                    </button>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition cursor-pointer"
              >
                <BiRotateLeft className="text-base" />
                Reset Filters
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPrescriptions.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <img
                      src={p.avatar}
                      alt={p.doctorName}
                      className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-100"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">
                        {p.doctorName}
                      </h3>
                      <p className="text-xs font-bold text-emerald-600 mt-0.5">
                        {p.specialty}
                      </p>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">
                        {p.facility}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                      <FaRegCalendarCheck className="text-emerald-600 text-sm" />
                      <span>{p.date}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
                        p.status === "ACTIVE"
                          ? "bg-emerald-100/60 text-emerald-800 border-emerald-300"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      DIAGNOSIS
                    </span>
                    <p className="text-sm font-bold text-slate-800">
                      {p.diagnosis}
                    </p>
                  </div>

                  <div className="mb-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      MEDICATIONS
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {p.medications.map((med, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200/60"
                        >
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-mono">{p.rxNumber}</span>
                  <button
                    type="button"
                    onClick={() => navigate("/prescription-view")}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition cursor-pointer"
                  >
                    <IoEyeOutline className="text-emerald-600 text-sm" />
                    View Prescription
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPrescriptions.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 font-medium">
                No prescriptions found matching your search.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 text-xs text-emerald-600 font-semibold hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicalHistory;