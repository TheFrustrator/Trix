import React, { useState, useEffect, useContext, useCallback } from "react";
import NavlinkComponent from "../component/NavlinkComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { DoctorIcon, DoctorNavlinkItems } from "../assets/doctor";
import DoctorHeader from "../cards/DoctorHeader";
import RecentPatientCard from "../cards/RecentPatientCard";

import { FaSearch } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import RequestAccessModal from "../component/RequestAccessModal";

const DoctorDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestDetails, setRequestDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const [recentPatients, setRecentPatients] = useState([]);
  const [fetchingPatients, setFetchingPatients] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, checkActiveSession } = useContext(AppContext);

  const currentDashboardRole =
    DoctorNavlinkItems.find((r) => r.route === location.pathname) ||
    DoctorNavlinkItems[0];

  const getBaseUrl = useCallback(() => {
    return backendUrl?.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
  }, [backendUrl]);

  const handlePageChange = async (navItem) => {
    const isActivePatientRoute =
      navItem.route === "/active-patient" ||
      navItem.name?.toLowerCase().includes("active");

    if (isActivePatientRoute) {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(
          `${getBaseUrl()}/api/doctor/current-active-session`
        );

        if (data.success && data.hasActiveSession && data.patientCustomId) {
          navigate(`/doctor/active-patient/${data.patientCustomId}/summary`);
        } else {
          toast.warning("No active session found. Please request access first.");
        }
      } catch (err) {
        toast.error("Failed to check active session status.");
      }
      return;
    }

    if (navItem.route && navItem.route !== location.pathname) {
      navigate(navItem.route);
    }
  };

  // Fetch up to 6 recent patients
  const fetchRecentPatients = useCallback(async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(
        `${getBaseUrl()}/api/doctor/recent-patients`
      );

      if (data.success && Array.isArray(data.patients)) {
        setRecentPatients(data.patients);
      }
    } catch (error) {
      console.error("Error fetching recent patients:", error);
    } finally {
      setFetchingPatients(false);
    }
  }, [getBaseUrl]);

  useEffect(() => {
    fetchRecentPatients();
    if (checkActiveSession) {
      checkActiveSession();
    }
  }, [fetchRecentPatients, checkActiveSession]);

  // Unified Request Access Handler (Used by Form and Card Clicks)
  const executeAccessRequest = async (targetPatientId) => {
    if (!targetPatientId || !targetPatientId.trim()) {
      return toast.error("Please enter or select a valid Patient ID");
    }

    const patientIdToRequest = targetPatientId.trim();

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      // 1. Check if an active session already exists for this patient
      const sessionRes = await axios.get(
        `${getBaseUrl()}/api/doctor/active-session/${patientIdToRequest}`
      );

      if (sessionRes.data?.success && sessionRes.data?.expiresAt) {
        // Session is already active! Direct navigate without showing access modal
        toast.success("Active session found! Opening patient file...");
        navigate(`/doctor/active-patient/${patientIdToRequest}/summary`);
        return;
      }

      // 2. If no active session, post access request
      const { data } = await axios.post(
        `${getBaseUrl()}/api/doctor/request-access`,
        { patientCustomId: patientIdToRequest }
      );

      if (data.success) {
        setRequestDetails(data);
        setIsModalOpen(true);
      } else {
        toast.error(data.message || "Failed to send access request");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to request access";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeAccessRequest(searchQuery);
  };

  return (
    <div className="h-full w-full flex flex-row min-h-screen bg-slate-50/50">
      <aside className="w-64 flex-shrink-0 bg-white shadow-xs">
        <NavlinkComponent
          currentDashboardRole={currentDashboardRole}
          handlePageChange={handlePageChange}
          userNavlinkItem={DoctorNavlinkItems}
        />
      </aside>

      <div className="flex-1 w-full flex flex-col p-6 gap-6 overflow-x-hidden">
        <div className="w-full flex justify-end">
          <DoctorHeader headerIcon={DoctorIcon.FDoctorIcon} />
        </div>

        {/* Search Bar Form */}
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-row w-full justify-center items-center gap-3 mt-4"
        >
          <div className="flex flex-row flex-1 max-w-[800px] justify-between items-center border border-gray-300 shadow-xs hover:shadow-md transition-shadow rounded-xl px-4 py-1 bg-white">
            <div className="flex items-center gap-3 w-full">
              <FaSearch color="gray" className="text-lg" />
              <input
                id="patient-search"
                type="text"
                placeholder="Enter Patient ID (e.g. P4041XYZ)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 bg-transparent focus:outline-none text-slate-700 font-medium text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer text-sm"
          >
            {loading ? "Requesting..." : "Request Access"}
          </button>
        </form>

        {/* Recent Patients Section */}
        <div className="flex flex-col gap-4 mt-4">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight pl-2">
            Recent Patients
          </h1>

          {fetchingPatients ? (
            <div className="py-10 text-center text-slate-500 font-medium">
              Loading recent patients...
            </div>
          ) : recentPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-slate-600 font-semibold text-base">
                No recent patient data found! Please check the Patient ID.
              </h2>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {recentPatients.map((patient) => (
                <RecentPatientCard
                  key={patient._id}
                  patientName={patient.patientName}
                  patientCustomId={patient.patientCustomId}
                  patientId={patient.patientCustomId}
                  lastVisitdate={patient.lastVisitDate}
                  disease={patient.disease}
                  onRequestAccess={executeAccessRequest}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Access Request Status Popup Modal */}
      <RequestAccessModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchRecentPatients();
        }}
        requestDetails={requestDetails}
        backendUrl={backendUrl}
      />
    </div>
  );
};

export default DoctorDashboard;