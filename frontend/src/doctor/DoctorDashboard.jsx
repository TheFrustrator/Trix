import React, { useState, useContext } from "react";
import NavlinkComponent from "../component/NavlinkComponent";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DoctorIcon,
  DoctorNavlinkItems,
  patientMockData,
} from "../assets/doctor";
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

  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl } = useContext(AppContext);

  const currentDashboardRole =
    DoctorNavlinkItems.find((r) => r.route === location.pathname) ||
    DoctorNavlinkItems[0];

  const handlePageChange = (navItem) => {
    if (navItem.route && navItem.route !== location.pathname) {
      navigate(navItem.route);
    }
  };

  // Submit Handler for Access Request
  const handleRequestAccess = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      return toast.error("Please enter a valid Patient ID");
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/request-access`,
        {
          patientCustomId: searchQuery.trim(),
        }
      );

      if (data.success) {
        setRequestDetails(data);
        setIsModalOpen(true);
      } else {
        toast.error(data.message || "Failed to send request");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-xs">
        <NavlinkComponent
          currentDashboardRole={currentDashboardRole}
          handlePageChange={handlePageChange}
          userNavlinkItem={DoctorNavlinkItems}
        />
      </aside>

      {/* Main dashboard content area */}
      <div className="flex-1 w-full flex flex-col p-6 gap-6 overflow-x-hidden">
        <div className="w-full flex justify-end">
          <DoctorHeader headerIcon={DoctorIcon.FDoctorIcon} />
        </div>

        {/* Search & Request Access Form */}
        <form
          onSubmit={handleRequestAccess}
          className="flex flex-row w-full justify-center items-center gap-3 mt-8"
        >
          {/* Search bar */}
          <div className="flex flex-row flex-1 max-w-[800px] justify-between items-center border border-gray-300 shadow-sm hover:shadow-md transition-shadow rounded-xl px-4 py-1 bg-white">
            <div className="flex items-center gap-3 w-full">
              <FaSearch color="gray" className="text-lg" />
              <input
                id="patient-search"
                type="text"
                placeholder="Enter Patient ID (e.g. p-4041-XYZ)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 bg-transparent focus:outline-none text-slate-700 font-medium"
              />
            </div>
          </div>

          {/* Request Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            {loading ? "Requesting..." : "Request Access"}
          </button>
        </form>

        {/* Recent patients section */}
        <h1 className="text-2xl font-semibold text-primary pl-4 mt-6">
          Recent Patients
        </h1>
        {patientMockData.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <h1 className="text-lg font-medium text-gray-500">
              No Patient data found! Please check the Patient ID
            </h1>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pr-6">
            {patientMockData.map((patient) => (
              <RecentPatientCard
                key={patient.id}
                pateintName={patient.patientName}
                patientId={patient.patientId}
                lastVisitdate={patient.lastVisitDate}
                disease={patient.prescription.mainDisease}
              />
            ))}
          </div>
        )}
      </div>

      {/* Access Request Status Popup Modal */}
      <RequestAccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        requestDetails={requestDetails}
        backendUrl={backendUrl}
      />
    </div>
  );
};

export default DoctorDashboard;