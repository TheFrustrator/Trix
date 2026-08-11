import React, { useRef, useState, useContext } from "react";
import { LuNotebookPen } from "react-icons/lu";
import { PiThermometerHot } from "react-icons/pi";
import AttachtReport from "../cards/AttachtReport";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ActivePatientHistory = () => {
  const { patientCustomId } = useParams();
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [addNewDiagnosis, setAddNewDiagnosis] = useState("");
  const [diagnosisNotes, setDiagnosisNotes] = useState("");
  const [uploadLicense, setUploadLicense] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadLicense(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadLicense(e.target.files[0]);
    }
  };

  const handleSaveDiagnosis = async (e) => {
    e.preventDefault();

    if (!patientCustomId) {
      return toast.error("Invalid or missing Patient ID parameter.");
    }

    if (!addNewDiagnosis.trim()) {
      return toast.error("Please enter diagnosis details.");
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const formData = new FormData();
      formData.append("patientCustomId", patientCustomId);
      formData.append("diagnosis", addNewDiagnosis);
      formData.append("notes", diagnosisNotes);
      formData.append("date", selectedDate);
      if (uploadLicense) {
        formData.append("report", uploadLicense);
      }

      const token = localStorage.getItem("token");

      // Post FormData without manual content-type headers so Axios injects boundary strings
      const { data } = await axios.post(
        `${baseUrl}/api/doctor/save-diagnosis`,
        formData,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (data.success) {
        toast.success("Diagnosis saved successfully!");
        setAddNewDiagnosis("");
        setDiagnosisNotes("");
        setUploadLicense(null);
      } else {
        toast.error(data.message || "Failed to save diagnosis.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save diagnosis."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSaveDiagnosis}
      className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 pr-6"
    >
      <div className="w-full flex flex-col py-1">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-base font-bold text-slate-800">
            Add New Diagnosis
          </h1>
          <PiThermometerHot size={20} className="text-gray-400" />
        </div>
        <div className="w-full h-48 border border-gray-300 rounded-xl shadow-xs hover:border-blue-400 bg-white mt-2">
          <textarea
            placeholder="Add diagnosis here..."
            onChange={(e) => setAddNewDiagnosis(e.target.value)}
            value={addNewDiagnosis}
            className="w-full h-full p-3 focus:outline-none text-slate-700 resize-none font-medium text-sm rounded-xl"
          />
        </div>
      </div>

      <div className="w-full flex flex-col py-1">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-base font-bold text-slate-800">
            Diagnosis Notes
          </h1>
          <LuNotebookPen size={20} className="text-gray-400" />
        </div>
        <div className="w-full h-48 border border-gray-300 rounded-xl shadow-xs hover:border-blue-400 bg-white mt-2">
          <textarea
            placeholder="Add notes here..."
            onChange={(e) => setDiagnosisNotes(e.target.value)}
            value={diagnosisNotes}
            className="w-full h-full p-3 focus:outline-none text-slate-700 resize-none font-medium text-sm rounded-xl"
          />
        </div>
      </div>

      <div>
        <AttachtReport
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          uploadLicense={uploadLicense}
          setUploadLicense={setUploadLicense}
          fileInputRef={fileInputRef}
          handleDragLeave={handleDragLeave}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleFileChange={handleFileChange}
          valueUser="Doctor"
        />
      </div>

      <div className="w-full flex flex-col justify-between">
        <div>
          <h1 className="text-sm font-semibold text-slate-800 mb-1">Date</h1>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2.5 focus:outline-none text-slate-700 font-medium text-sm border rounded-xl border-gray-300 bg-white"
          />
        </div>

        <div className="w-full flex flex-row gap-3 mt-6 items-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-xl cursor-pointer shadow-xs text-sm"
          >
            {loading ? "Saving..." : "Save Diagnosis"}
          </button>
          <button
            type="button"
            className="underline text-blue-500 text-sm cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default ActivePatientHistory;