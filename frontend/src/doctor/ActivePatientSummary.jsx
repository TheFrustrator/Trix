import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { PatientIcons } from "../assets/patientAssests";
import { GoAlertFill } from "react-icons/go";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const ActivePatientSummary = () => {
  const { patientCustomId } = useParams();
  const { backendUrl } = useContext(AppContext);

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatientSummary = useCallback(async () => {
    if (!patientCustomId) return;

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const { data } = await axios.get(
        `${baseUrl}/api/doctor/patient-summary/${patientCustomId}`
      );

      if (data.success && data.patient) {
        setPatient(data.patient);
      } else {
        setError(data.message || "Failed to load patient details.");
      }
    } catch (err) {
      console.error("Fetch summary error:", err);
      setError(
        err.response?.data?.message || err.message || "Error loading patient summary"
      );
    } finally {
      setLoading(false);
    }
  }, [backendUrl, patientCustomId]);

  useEffect(() => {
    fetchPatientSummary();
  }, [fetchPatientSummary]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12 text-slate-500 font-medium">
        Loading patient summary...
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="w-full flex items-center justify-center py-12 text-red-500 font-medium">
        {error || "Patient records unavailable."}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center py-2 px-2">
      {/* Patient Details Banner Card */}
      <div className="w-full flex flex-row items-center bg-slate-100/80 border border-gray-200 rounded-2xl p-4 shadow-xs gap-6">
        <div className="flex-shrink-0">
          <img
            src={PatientIcons.userIcon}
            alt="Patient Avatar"
            className="w-14 h-14 bg-blue-200/60 rounded-full object-cover p-0.5"
          />
        </div>

        <div className="grid lg:grid-cols-4 grid-cols-3 w-full gap-4 items-center">
          {/* Patient Name */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500">Name</span>
            <span className="text-sm font-bold text-slate-800 mt-1">
              {patient.patientName || "N/A"}
            </span>
          </div>

          {/* Patient ID */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500">ID</span>
            <span className="text-sm font-semibold text-slate-700 font-mono mt-1">
              {patient.patientId || patientCustomId}
            </span>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500">Contact</span>
            <span className="text-sm font-semibold text-slate-700 mt-1">
              {patient.contact || "N/A"}
            </span>
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500">
              Date of Birth
            </span>
            <span className="text-sm font-semibold text-slate-700 mt-1">
              {patient.dateOfBirth || patient.dob || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Observations Section */}
      <div className="w-full mt-4 flex flex-col md:flex-row justify-between gap-4">
        {/* Known Allergies Card */}
        <div className="w-full flex flex-col justify-start bg-red-50 border rounded-xl border-red-200 shadow-xs p-3">
          <h2 className="font-bold text-sm text-red-800 pb-2 border-b border-red-200/80">
            IMPORTANT: KNOWN ALLERGIES
          </h2>
          <div className="flex flex-col gap-2.5 justify-start mt-3">
            {patient.allergies?.slice(0, 3).map((allergy, idx) => (
              <div
                key={allergy.id || idx}
                className="flex items-center gap-2.5 text-sm text-red-900 font-semibold"
              >
                <GoAlertFill className="text-red-500 flex-shrink-0" size={16} />
                <span>
                  {allergy.name} -{" "}
                  <span className="font-medium text-red-700">
                    {allergy.severity}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Condensed History Card */}
        <div className="w-full flex flex-col justify-start bg-white border rounded-xl border-gray-200 shadow-xs p-3">
          <h2 className="font-bold text-sm text-slate-800 pb-2 border-b border-gray-200">
            Condensed History List
          </h2>
          <div className="flex flex-col gap-2.5 justify-start mt-3">
            {patient.condensedHistory?.slice(0, 3).map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex flex-col text-sm text-slate-800 font-medium border-b border-gray-100 last:border-0 pb-1.5"
              >
                <span className="font-semibold text-slate-900">{item.title}</span>
                <span className="text-xs text-slate-500">{item.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivePatientSummary;