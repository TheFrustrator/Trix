import React, { useContext, useState, useEffect, useCallback, useMemo } from "react";
import NavlinkComponent from "../component/NavlinkComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { PatientIcons, PatientNavlinkItems } from "../assets/patientAssests";
import UserHeaderCard from "../cards/UserHeaderCard";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { FiSearch, FiEye } from "react-icons/fi";
import { FaRegCalendarAlt, FaRegFileAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BiRotateLeft } from "react-icons/bi";

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

const getInitials = (name) => {
  if (!name) return "DR";
  const parts = name.replace(/^Dr\.?\s*/i, "").trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
};

const formatDate = (isoDateStr) => {
  if (!isoDateStr) return "N/A";
  const d = new Date(isoDateStr);
  if (isNaN(d.getTime())) return isoDateStr;
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
};

const withinTimeFilter = (issueDateStr, filter) => {
  if (filter === "all") return true;
  const issueDate = new Date(issueDateStr);
  if (isNaN(issueDate.getTime())) return true;
  const now = new Date();
  const diffDays = (now - issueDate) / (1000 * 60 * 60 * 24);
  if (filter === "30days") return diffDays <= 30;
  if (filter === "6months") return diffDays <= 183;
  if (filter === "1year") return diffDays <= 365;
  return true;
};

const MedicalHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, backendUrl } = useContext(AppContext);

  const currentDashboardRole =
    PatientNavlinkItems.find((r) => r.route === location.pathname) ||
    PatientNavlinkItems[0];

  const handlePageChange = (navItem) => {
    if (navItem?.route && navItem.route !== location.pathname) {
      navigate(navItem.route);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      axios.defaults.withCredentials = true;
      const baseUrl = backendUrl?.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;

      // ⚠️ CHECK THIS: adjust "/api/user" if authRouter is mounted under a
      // different base path in your server entry file.
      const response = await axios.get(`${baseUrl}/api/auth/prescriptions`);

      if (response.data.success) {
        setPrescriptions(response.data.prescriptions || []);
      } else {
        setError(response.data.message || "Could not load prescriptions.");
      }
    } catch (err) {
      console.error("Fetch prescriptions error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load prescriptions.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  // Stats reflect the full recent-6 set, unaffected by search/time filter
  const totalCount = prescriptions.length;
  const activeCount = prescriptions.filter((p) => p.status === "ACTIVE").length;
  const pastCount = totalCount - activeCount;

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((item) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        item.doctorName.toLowerCase().includes(term) ||
        item.specialty.toLowerCase().includes(term) ||
        item.diagnosis.toLowerCase().includes(term) ||
        item.medications.some((med) => med.toLowerCase().includes(term));

      const matchesTime = withinTimeFilter(item.issueDate, timeFilter);

      return matchesSearch && matchesTime;
    });
  }, [prescriptions, searchTerm, timeFilter]);

  const handleReset = () => {
    setSearchTerm("");
    setTimeFilter("all");
  };

  const timeFilterLabel = {
    "6months": "Last 6 Months",
    "30days": "Last 30 Days",
    "1year": "Last 1 Year",
    all: "All Time",
  };

  const handleViewPrescription = (id) => {
    navigate(`/prescription-view/${id}?role=patient`);
  };

  return (
    <div className="h-full w-full flex flex-row min-h-screen">
      <div className="w-64 flex-shrink-0 bg-white shadow-xs">
        <NavlinkComponent
          currentDashboardRole={currentDashboardRole}
          handlePageChange={handlePageChange}
          userNavlinkItem={PatientNavlinkItems}
        />
      </div>
      <div className="flex-1 w-full flex flex-col p-6 gap-6 overflow-x-hidden">
        {/* Header */}
         <UserHeaderCard
              userName={userData?.name || "Patient"}
              medicalID={userData?.patientId || "N/A"}
              headerIcon={PatientIcons.userIcon}
            />
        <div className="w-full flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Prescription History</h1>
            <p className="text-sm text-slate-500 mt-1">
              View, search, and download your past medical prescriptions and doctor instructions.
            </p>
          </div>
          <div className="flex items-center gap-6">
           
            <div className="flex items-center gap-6 bg-white border border-slate-200 rounded-2xl px-5 py-3">
              <div className="text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Total</p>
                <p className="text-xl font-bold text-slate-900">{totalCount}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Active</p>
                <p className="text-xl font-bold text-emerald-600">{activeCount}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Past</p>
                <p className="text-xl font-bold text-slate-500">{pastCount}</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">
            {error}
          </div>
        )}

        {/* search bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
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
                <option value="all">All Time</option>
                <option value="30days">Last 30 Days</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last 1 Year</option>
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-slate-400">Active Filters:</span>
              {timeFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs font-semibold">
                  {timeFilterLabel[timeFilter]}
                  <button onClick={() => setTimeFilter("all")} className="hover:text-emerald-900 transition">
                    <IoClose className="text-sm" />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs font-semibold">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="hover:text-emerald-900 transition">
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

        {/* Prescription cards */}
        {loading ? (
          <p className="text-sm text-slate-400">Loading prescriptions...</p>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center gap-2 text-slate-400">
            <FaRegFileAlt size={28} />
            <p className="text-sm">No prescriptions match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredPrescriptions.map((pres, idx) => {
              const isActive = pres.status === "ACTIVE";
              return (
                <div
                  key={pres.id}
                  className="flex flex-col gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-blue-200 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}
                      >
                        {getInitials(pres.doctorName)}
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">{pres.doctorName}</h2>
                        <p className="text-xs font-semibold text-emerald-600">{pres.specialty}</p>
                        <p className="text-xs text-slate-400">{pres.clinic}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-500">
                      <FaRegCalendarAlt size={11} />
                      {formatDate(pres.issueDate)}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {isActive ? "ACTIVE" : "PAST"}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Diagnosis</p>
                    <p className="text-sm font-bold text-slate-800">{pres.diagnosis}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Medications</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pres.medications.length === 0 ? (
                        <span className="text-xs text-slate-400">None recorded</span>
                      ) : (
                        pres.medications.map((med, i) => (
                          <span key={i} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-lg">
                            {med}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400">Rx #{pres.rxNumber}</span>
                    <button
                      type="button"
                      onClick={() => handleViewPrescription(pres.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <FiEye size={13} />
                      View Prescription
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;