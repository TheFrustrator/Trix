import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FaLock, FaDownload, FaArrowLeft } from "react-icons/fa";
import { Icons } from "../assets/assets";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function PdfPrescriptionView() {
  const navigate = useNavigate();
  const { prescriptionId } = useParams();
  const [searchParams] = useSearchParams();
  const { backendUrl } = useContext(AppContext);
  const pdfRef = useRef(null);

  // ?role=patient means this was opened from the patient's Prescription
  // History page — everything else (no param, or role=doctor) keeps the
  // original doctor behavior so existing doctor links keep working.
  const role = searchParams.get("role") === "patient" ? "patient" : "doctor";
  const apiBase = role === "patient" ? "/api/auth" : "/api/doctor";
  const dashboardRoute = role === "patient" ? "/patient-dashboard" : "/doctor-dashboard";

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchPrescription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      axios.defaults.withCredentials = true;
      const baseUrl = backendUrl?.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;

      const response = await axios.get(`${baseUrl}${apiBase}/prescription-details/${prescriptionId}`);

      if (response.data.success && response.data.prescriptionData) {
        setData(response.data.prescriptionData);
      } else {
        setError(response.data.message || "Prescription data was empty in the server response.");
      }
    } catch (err) {
      console.error("Fetch prescription error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load prescription.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, prescriptionId, apiBase]);

  useEffect(() => {
    fetchPrescription();
  }, [fetchPrescription]);

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF({ unit: "in", format: "letter", orientation: "portrait" });

      const pageWidth = pdf.internal.pageSize.getWidth() - 0.6;
      const pageHeight = (canvas.height * pageWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0.3, 0.3, pageWidth, pageHeight);

      const fileName = `Prescription_${data?.patient?.patientCustomId || "Rx"}_${data?.issueDate || "Date"}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans text-slate-600 font-medium">
        Loading prescription document...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans text-slate-600 gap-4">
        <p>{error || "Prescription details could not be found."}</p>
        <button
          type="button"
          onClick={() => navigate(dashboardRoute)}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const doctor = data.doctor;
  const patient = data.patient;
  const medicines = data.medicines || [];

  const qrPayload = JSON.stringify({
    doctorName: doctor.name,
    doctorId: doctor.id,
    patientCustomId: patient.patientCustomId,
    patientName: patient.name,
    issueDate: data.issueDate,
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col justify-center items-center font-sans">
      <div
        ref={pdfRef}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-gray-200 text-slate-800 flex flex-col p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5">
            <div className="text-white p-2 rounded-xl flex items-center justify-center">
              <img src={Icons.logoM} alt="Logo" className="w-8 h-8" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">MediLink</span>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-md">
            Digitally Verified Prescription
          </span>
        </div>

        <hr className="border-gray-200 mb-6" />

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <h2 className="font-bold text-slate-900 text-base">{doctor.name}</h2>
            <p className="text-gray-600">{doctor.clinicAdd}</p>
            <p className="text-gray-500">Reg No. {doctor.regNo}</p>
            <p className="text-gray-500">Contact: {doctor.phone}</p>
          </div>

          <div className="space-y-1 text-slate-700">
            <p><span className="font-bold text-slate-900">Patient Name: </span>{patient.name}</p>
            <p><span className="font-bold text-slate-900">Patient ID: </span><span className="font-mono">{patient.patientCustomId}</span></p>
            <p><span className="font-bold text-slate-900">Age / Gender: </span>{patient.ageGender}</p>
            <p><span className="font-bold text-slate-900">Date Issued: </span>{data.issueDate}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6">
          <p className="text-sm text-slate-800">
            <span className="font-bold">Diagnosis: </span>{data.diagnosis}
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 mb-6">
          {medicines.length === 0 ? (
            <p className="p-4 text-xs text-slate-500 text-center">No medicines recorded for this prescription.</p>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-slate-900 font-bold border-b border-gray-200">
                  <th className="p-3">Medicine</th>
                  <th className="p-3">Dosage</th>
                  <th className="p-3">Frequency</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Timing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {medicines.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="p-3 font-semibold text-slate-900">{item.medicineName || item.name}</td>
                    <td className="p-3 text-slate-700">{item.dosages || item.dosage} tab</td>
                    <td className="p-3 text-slate-700">{item.frequency}</td>
                    <td className="p-3 text-slate-700">{item.duration} days</td>
                    <td className="p-3 text-slate-700">{item.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-slate-900 text-sm mb-1">Doctor's Notes</h3>
          <p className="italic text-slate-800 text-sm whitespace-pre-line leading-relaxed">{data.notes}</p>
        </div>

        <div className="flex justify-between items-end pt-4 border-t border-gray-100">
          <div className="p-1 bg-white border border-gray-200 rounded-lg shadow-xs">
            <QRCodeSVG value={qrPayload} size={85} />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-serif text-3xl italic text-slate-800 select-none tracking-wide mb-1">{doctor.name}</span>
            <div className="w-40 border-b border-gray-400 my-1"></div>
            <p className="text-xs font-semibold text-slate-800">{doctor.name}</p>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 border border-gray-200 py-2 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-slate-600">
          <FaLock size={12} />
          <span>Digitally signed & tamper-verified</span>
        </div>
      </div>

      <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
        <button
          type="button"
          onClick={() => navigate(dashboardRoute)}
          className="w-full sm:w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors cursor-pointer"
        >
          <FaArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        <button
          type="button"
          disabled={downloading}
          onClick={handleDownloadPDF}
          className="w-full sm:w-1/2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors cursor-pointer"
        >
          <FaDownload size={14} />
          <span>{downloading ? "Generating PDF..." : "Download PDF"}</span>
        </button>
      </div>
    </div>
  );
}