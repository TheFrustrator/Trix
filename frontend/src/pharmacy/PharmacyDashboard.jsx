import React, { useContext, useState } from "react";
import PharmacyHeader from "../component/PharmacyHeader";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const PharmacyDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { backendUrl } = useContext(AppContext);

  const handleSearch = async (e) => {
    e.preventDefault();

    const patientId = searchQuery.trim();

    if (!patientId) {
      toast.error("Please enter Patient ID.");
      return;
    }

    try {
      setLoading(true);

      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const { data } = await axios.get(
        `${baseUrl}/api/pharmacy/prescription/patient/${encodeURIComponent(
          patientId,
        )}`,
        {
          withCredentials: true,
        },
      );

      if (!data.success) {
        toast.error(data.message || "Patient verification failed.");
        return;
      }

      if (!data.patient) {
        toast.error("Patient not found.");
        return;
      }

      if (!data.prescription) {
        toast.error("No prescription found for this patient.");
        return;
      }

      toast.success("Patient prescription found.");

      navigate("/pharmacy-prescription-view", {
        state: {
          patient: data.patient,
          prescription: data.prescription,
        },
      });
    } catch (error) {
      console.error("Patient prescription search error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to find prescription.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PharmacyHeader />

      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-800">
              View Patient Prescription
            </h1>

            <p className="text-gray-500 mt-2">
              Enter a valid Patient ID below to view their latest prescription.
            </p>

            {/* SEARCH */}

            <form
              onSubmit={handleSearch}
              className="flex flex-row justify-between items-center border border-gray-400 rounded-2xl gap-3 mt-6"
            >
              <div className="flex-1 text-slate-500 mx-2 my-2">
                <input
                  id="patient-search"
                  type="text"
                  placeholder="e.g., SUD90831730PAT"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                  className="w-full border-none rounded-lg p-2 focus:outline-none focus:ring-0 text-slate-700 disabled:bg-gray-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex flex-row items-center justify-center bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full my-2 mx-4 gap-1 transition-colors"
              >
                <span className="my-2 ml-2">
                  <FaSearch size={20} color="white" />
                </span>

                <span className="mr-2 my-2">
                  <h1 className="text-sm font-semibold text-white mr-2">
                    {loading ? "Searching..." : "Search"}
                  </h1>
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PharmacyDashboard;
