import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  FaArrowLeft,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const PrescriptionView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { backendUrl } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState(
    location.state?.initialQuery || "",
  );

  const [loading, setLoading] = useState(false);

  const searchPrescription = async (
    query = searchQuery,
  ) => {
    const patientId = query?.trim();

    if (!patientId) {
      toast.error("Please enter Patient ID.");
      return;
    }

    try {
      setLoading(true);

      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      console.log(
        "Searching prescription using Patient ID:",
        patientId,
      );

      /*
       * IMPORTANT:
       * We search using PATIENT CUSTOM ID.
       *
       * We do NOT search using prescription ID.
       */
      const response = await axios.get(
        `${baseUrl}/api/pharmacy/prescription/patient/${encodeURIComponent(
          patientId,
        )}`,
        {
          withCredentials: true,
        },
      );

      const result = response.data;

      if (!result.success) {
        toast.error(
          result.message ||
            "Unable to find prescription.",
        );
        return;
      }

      if (!result.patient) {
        toast.error("Patient not found.");
        return;
      }

      if (!result.prescription) {
        toast.error(
          "No prescription found for this patient.",
        );
        return;
      }

      /*
       * IMPORTANT:
       *
       * Only Patient ID is passed to the PDF page.
       *
       * PdfPrescriptionView will again call the backend
       * using this Patient ID and fetch the latest
       * prescription.
       */
      navigate(
        `/prescription-view?patientId=${encodeURIComponent(
          patientId,
        )}`,
      );
    } catch (error) {
      console.error(
        "Search prescription error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to find patient's prescription.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialQuery =
      location.state?.initialQuery;

    if (initialQuery) {
      setSearchQuery(initialQuery);
      searchPrescription(initialQuery);
    }

    // Only run for initial navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}

      <div className="max-w-6xl mx-auto px-5 pt-6">
        <button
          type="button"
          onClick={() =>
            navigate("/pharmacy-dashboard")
          }
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
        >
          <FaArrowLeft />

          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Main */}

      <main className="max-w-6xl mx-auto px-5 py-8">
        <div className="bg-white rounded-xl border p-6">
          <h1 className="text-2xl font-bold text-gray-800">
            View Patient Prescription
          </h1>

          <p className="text-gray-500 mt-1">
            Enter the Patient ID to find their latest
            prescription.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchPrescription();
            }}
            className="flex gap-3 mt-6"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="e.g. P-4041-XYZ"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-500 text-white px-6 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              <FaSearch />

              {loading
                ? "Searching..."
                : "Search"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PrescriptionView;