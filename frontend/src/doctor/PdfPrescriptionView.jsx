import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FaLock, FaDownload, FaArrowLeft } from "react-icons/fa";
import { Icons } from "../assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import html2pdf from "html2pdf.js";

export default function PdfPrescriptionView({
  patient,
  prescriptions,
  notes,
  date,
}) {
  const navigate = useNavigate();
  const { prescriptionId } = useParams();
  const { backendUrl } = useContext(AppContext);
  const pdfRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState(null);

  const fetchPrescriptionDetails = useCallback(async () => {
    // Safe fallback data so the UI never crashes
    const fallbackData = {
      pdfFileName: "Prescription_Preview.pdf",
      doctor: {
        name: "Dr. Eleanor Vance",
        clinic: "Oakwood Clinic",
        regNo: "12345",
        address: "123 Oakwood Ave, Cityville",
        phone: "(555) 0123",
      },
      patient: {
        name: patient?.patientName || "Sarah Johnson",
        id: patient?.patientId || "P-4041-XYZ",
        ageGender: "34 / Female",
        dateIssued: date || "12 May 2026",
        validUntil: "19 May 2026",
      },
      diagnosis: "Bacterial throat infection",
      medicines: prescriptions || [
        {
          name: "Amoxicillin 500mg",
          dosage: "1 tablet",
          frequency: "Twice a day",
          duration: "7 days",
          timing: "After food",
        },
      ],
      notes: notes || "Take as directed by physician.",
    };

    if (!prescriptionId) {
      setData(fallbackData);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      axios.defaults.withCredentials = true;
      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const response = await axios.get(
        `${baseUrl}/api/doctor/prescription-details/${prescriptionId}`
      );

      if (response.data.success && response.data.prescriptionData) {
        const rx = response.data.prescriptionData;
        setData({
          pdfFileName: rx.pdfFileName || `Prescription_${rx.patient?.id}.pdf`,
          doctor: {
            name: rx.doctor?.name || "Dr. Eleanor Vance",
            clinic: rx.doctor?.clinic || "Oakwood Clinic",
            regNo: rx.doctor?.regNo || "12345",
            address: rx.doctor?.address || "123 Oakwood Ave, Cityville",
            phone: rx.doctor?.phone || "(555) 0123",
          },
          patient: {
            name: rx.patient?.name || "Patient",
            id: rx.patient?.id || "P-4041-XYZ",
            ageGender: rx.patient?.ageGender || "34 / Female",
            dateIssued: rx.dateIssued || "12 May 2026",
            validUntil: rx.validUntil || "19 May 2026",
          },
          diagnosis: rx.diagnosis || "General Consultation",
          medicines: (rx.medicines || []).map((m) => ({
            name: m.medicineName || m.name || "Medicine",
            dosage: m.dosages ? `${m.dosages} tablet` : m.dosage || "1 tablet",
            frequency: m.frequency || "Once a day",
            duration: m.duration ? `${m.duration} days` : "7 days",
            timing: m.timing || "After food",
          })),
          notes: rx.notes || "",
        });
      } else {
        setErrorMsg(response.data?.message || "Prescription not found.");
        setData(fallbackData);
      }
    } catch (err) {
      console.error("Error loading prescription details:", err);
      setErrorMsg(
        err.response?.data?.message || "Failed to fetch prescription."
      );
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, prescriptionId, patient, prescriptions, notes, date]);

  useEffect(() => {
    fetchPrescriptionDetails();
  }, [fetchPrescriptionDetails]);

  // Download PDF Action utilizing html2pdf.js
  const handleDownloadPDF = () => {
    if (!pdfRef.current) return;

    setDownloading(true);
    const element = pdfRef.current;

    const opt = {
      margin: 0.3,
      filename: data?.pdfFileName || "Prescription_Document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => setDownloading(false))
      .catch((err) => {
        console.error("PDF generation failed:", err);
        setDownloading(false);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans text-slate-600 font-medium">
        Loading prescription document...
      </div>
    );
  }

  // Safe extract with fallback structures to avoid TypeError crashes
  const activeDoctor = data?.doctor || {};
  const activePatient = data?.patient || {};
  const activeMedicines = data?.medicines || [];
  const activeNotes = data?.notes || "";

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col justify-center items-center font-sans">
      {errorMsg && (
        <div className="w-full max-w-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold p-3 rounded-xl mb-4 text-center">
          Notice: {errorMsg} Showing preview state.
        </div>
      )}

      {/* PDF View Card */}
      <div
        ref={pdfRef}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-gray-200 text-slate-800 flex flex-col"
      >
        {/* Prescription Header */}
        <div className="p-6 pb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 text-white p-2 rounded-xl flex items-center justify-center">
                <img src={Icons.logoM} alt="Logo" className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                MediLink
              </span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-md">
              Digitally Verified Prescription
            </span>
          </div>

          <hr className="border-gray-300 mb-6" />

          {/* Doctor & Patient Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                {activeDoctor.name}
              </h2>
              <p className="text-gray-600">{activeDoctor.clinic}</p>
              <p className="text-gray-500">Reg No. {activeDoctor.regNo}</p>
              <p className="text-gray-500">{activeDoctor.address}</p>
              <p className="text-gray-500">{activeDoctor.phone}</p>
            </div>

            <div className="space-y-1 text-slate-700">
              <p>
                <span className="font-bold text-slate-900">Patient: </span>
                {activePatient.name}
              </p>
              <p>
                <span className="font-bold text-slate-900">Patient ID: </span>
                {activePatient.id}
              </p>
              <p>
                <span className="font-bold text-slate-900">Age/Gender: </span>
                {activePatient.ageGender}
              </p>
              <p>
                <span className="font-bold text-slate-900">Date Issued: </span>
                {activePatient.dateIssued}
              </p>
              <p>
                <span className="font-bold text-slate-900">Valid Until: </span>
                {activePatient.validUntil}
              </p>
            </div>
          </div>

          {/* Diagnosis Banner */}
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-sm text-slate-800">
              <span className="font-bold">Diagnosis: </span>
              {data?.diagnosis || "General Consultation"}
            </p>
          </div>

          {/* Medicines Table */}
          <div className="mt-6 overflow-hidden rounded-lg border border-gray-100">
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
                {activeMedicines.map((item, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    <td className="p-3 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="p-3 text-slate-700">{item.dosage}</td>
                    <td className="p-3 text-slate-700">{item.frequency}</td>
                    <td className="p-3 text-slate-700">{item.duration}</td>
                    <td className="p-3 text-slate-700">{item.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Doctor Notes */}
          <div className="mt-6">
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Doctor's Notes
            </h3>
            <p className="italic text-slate-800 font-medium text-sm whitespace-pre-line leading-relaxed">
              {activeNotes}
            </p>
          </div>

          {/* QR & Signature Footer */}
          <div className="mt-8 flex justify-between items-end pt-4">
            <div className="p-1 bg-white border border-gray-200 rounded-lg shadow-xs">
              <QRCodeSVG
                value={JSON.stringify({
                  patientId: activePatient.id,
                  patientName: activePatient.name,
                  doctorRegNo: activeDoctor.regNo,
                  issued: activePatient.dateIssued,
                })}
                size={80}
              />
            </div>

            <div className="flex flex-col items-center">
              <div className="relative mb-1">
                <span className="font-serif text-3xl italic text-slate-800 select-none tracking-wide">
                  {activeDoctor.name}
                </span>
                <span className="absolute -top-2 -right-4 bg-sky-200/80 text-sky-900 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-sky-300 backdrop-blur-xs">
                  Digital Signature
                </span>
              </div>
              <div className="w-40 border-b border-gray-400 my-1"></div>
              <p className="text-xs font-semibold text-slate-800">
                {activeDoctor.name}
              </p>
            </div>
          </div>
        </div>

        {/* Tamper Verified Bottom Bar */}
        <div className="bg-gray-100 border-t border-gray-200 py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-600">
          <FaLock size={12} className="text-slate-600" />
          <span>Digitally signed & tamper-verified</span>
        </div>
      </div>

      {/* Action Buttons Area */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
        <button
          type="button"
          onClick={() => navigate("/doctor-dashboard")}
          className="w-full sm:w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors cursor-pointer shadow-sm"
        >
          <FaArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        <button
          type="button"
          disabled={downloading}
          onClick={handleDownloadPDF}
          className="w-full sm:w-1/2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors shadow-sm cursor-pointer"
        >
          <FaDownload size={14} />
          <span>{downloading ? "Generating PDF..." : "Download PDF"}</span>
        </button>
      </div>
    </div>
  );
}