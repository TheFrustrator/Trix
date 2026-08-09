import React, { useState, useEffect, useMemo, useContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PatientIcons,
  PatientNavlinkItems,
} from "../assets/patientAssests";
import NavlinkComponent from "../component/NavlinkComponent";
import UserHeaderCard from "../cards/UserHeaderCard";
import PendingRequestCard from "../cards/PendingRequestCard";
import ActiveSessionCard from "../cards/ActiveSessionCard";
import { AppContext } from "../context/AppContext";
import { socket } from "../utils/socket";
import axios from "axios";
import { toast } from "react-toastify";

// Icons
import { FiSearch } from "react-icons/fi";
import { FaRegCalendarCheck, FaRegCalendarAlt } from "react-icons/fa";
import { IoEyeOutline, IoClose } from "react-icons/io5";
import { BiRotateLeft } from "react-icons/bi";
import { prescriptionsData } from "../assets/doctor";

function MedicalHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, userData } = useContext(AppContext);

  // Real-time Access Request State
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

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

  // Fetch requests from backend
  const fetchAccessRequests = useCallback(async () => {
    try {
      axios.defaults.withCredentials = true;
      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const { data } = await axios.get(`${baseUrl}/api/patient/access-requests`);

      if (data.success && Array.isArray(data.requests)) {
        const now = new Date();
        const pending = data.requests.filter((r) => r.status === "pending");
        const active = data.requests.filter(
          (r) => r.status === "granted" && new Date(r.expiresAt) > now
        );

        setPendingRequests(pending);
        setActiveSessions(active);
      }
    } catch (error) {
      console.error("Failed to fetch access requests:", error);
    } finally {
      setRequestsLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchAccessRequests();
  }, [fetchAccessRequests]);

  // WebSocket listeners
  useEffect(() => {
    const patientRoomId = userData?.patientId || userData?.docId;
    if (!patientRoomId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-patient-room", patientRoomId);

    const handleNewAccessRequest = (newRequest) => {
      if (newRequest && newRequest._id) {
        toast.info(
          `New access request received from ${
            newRequest.doctorId?.name || "a Healthcare Provider"
          }`
        );

        setPendingRequests((prev) => {
          const exists = prev.some((r) => r._id === newRequest._id);
          if (exists) return prev;
          return [newRequest, ...prev];
        });
      }
    };

    socket.on("new-access-request", handleNewAccessRequest);

    return () => {
      socket.off("new-access-request", handleNewAccessRequest);
      socket.disconnect();
    };
  }, [userData]);

  // Action handlers
  const handleStatusUpdate = async (requestId, action) => {
    if (!requestId || typeof requestId !== "string") {
      return toast.error("Invalid Request ID");
    }

    try {
      axios.defaults.withCredentials = true;
      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const { data } = await axios.post(
        `${baseUrl}/api/patient/update-request-status`,
        { requestId, action }
      );

      if (data.success) {
        toast.success(data.message || "Request updated successfully");
        fetchAccessRequests();
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred";
      toast.error(errorMessage);
    }
  };

  // Prescription filtering
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

        {/* ACCESS REQUESTS MANAGEMENT SECTION */}
        <div className="w-full flex flex-col gap-4">
          <h1 className="font-bold lg:text-3xl sm:text-xl text-primary">
            Access Requests
          </h1>

          {requestsLoading ? (
            <div className="py-6 text-center text-slate-500 font-medium">
              Loading access requests...
            </div>
          ) : (
            <>
              {/* Pending Requests Container */}
              {pendingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center border rounded-lg shadow-sm p-6 bg-white mx-1">
                  <h1 className="font-semibold text-green-500 text-xl mt-2">
                    You don't have any access requests.
                  </h1>
                  <h2 className="font-thin text-gray-500 text-sm mb-2">
                    Visit nearest clinic to activate
                  </h2>
                </div>
              ) : (
                <div className="flex flex-col border rounded-md shadow-md mx-1 p-2 bg-white">
                  <h1 className="text-sm font-semibold text-primary mx-2 mt-1 mb-2">
                    Pending Requests
                  </h1>
                  <div className="flex flex-col gap-2">
                    {pendingRequests.map((item) => (
                      <PendingRequestCard
                        key={item._id}
                        doctorName={item.doctorId?.name || "Dr. Unknown"}
                        clinicAdd={
                          item.doctorId?.clinicAdd || "Clinic Unavailable"
                        }
                        requestTime={new Date(
                          item.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        onAcceptHandler={() =>
                          handleStatusUpdate(item._id, "accept")
                        }
                        onDenyHandler={() =>
                          handleStatusUpdate(item._id, "deny")
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Active Sessions Container */}
              {activeSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center border rounded-lg shadow-sm p-6 bg-white mx-1">
                  <h1 className="font-semibold text-green-500 text-xl mt-2">
                    You don't have any active session.
                  </h1>
                  <h2 className="font-thin text-gray-500 text-sm mb-2">
                    Visit nearest clinic to activate
                  </h2>
                </div>
              ) : (
                <div className="flex flex-col border rounded-md shadow-md mx-1 p-2 bg-white">
                  <div className="flex flex-row py-2 pr-2 justify-between items-center mb-1">
                    <h1 className="text-lg font-semibold text-primary mx-3 mt-1 mb-0">
                      Active Sessions
                    </h1>
                    <span className="text-xs rounded-full bg-green-500/40 px-3 py-1 flex items-center">
                      <h2 className="text-green-800 font-semibold">Active</h2>
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {activeSessions.map((session) => (
                      <ActiveSessionCard
                        key={session._id}
                        doctorName={session.doctorId?.name || "Dr. Unknown"}
                        clinicAdd={
                          session.doctorId?.clinicAdd || "Clinic Unavailable"
                        }
                        expiresAt={session.expiresAt}
                        onRevokeHandler={() =>
                          handleStatusUpdate(session._id, "revoke")
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* PRESCRIPTION HISTORY SECTION */}
        <div className="w-full flex flex-col gap-6 mt-4">
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