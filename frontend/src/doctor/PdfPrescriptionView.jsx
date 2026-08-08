import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { FaLock, FaDownload, FaArrowLeft } from "react-icons/fa";
import { Icons } from "../assets/assets";
import { prescriptionData } from "../assets/doctor";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PrescriptionPDF } from "../component/PrescriptionPDF";
import { singlePatientMockData } from "../assets/patientAssests";
import { useNavigate } from "react-router-dom";

export default function PdfPrescriptionView({ patient, prescriptions, notes, date }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col justify-center items-center font-sans">
      {/* PDF View Card */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-gray-200 text-slate-800 flex flex-col">
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
            {/* Doctor Info */}
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                {prescriptionData.doctor.name}
              </h2>
              <p className="text-gray-600">{prescriptionData.doctor.clinic}</p>
              <p className="text-gray-500">
                Reg No. {prescriptionData.doctor.regNo}
              </p>
              <p className="text-gray-500">{prescriptionData.doctor.address}</p>
              <p className="text-gray-500">{prescriptionData.doctor.phone}</p>
            </div>

            {/* Patient Info */}
            <div className="space-y-1 text-slate-700">
              <p>
                <span className="font-bold text-slate-900">Patient: </span>
                {prescriptionData.patient.name}
              </p>
              <p>
                <span className="font-bold text-slate-900">Patient ID: </span>
                {prescriptionData.patient.id}
              </p>
              <p>
                <span className="font-bold text-slate-900">Age/Gender: </span>
                {prescriptionData.patient.ageGender}
              </p>
              <p>
                <span className="font-bold text-slate-900">Date Issued: </span>
                {prescriptionData.patient.dateIssued}
              </p>
              <p>
                <span className="font-bold text-slate-900">Valid Until: </span>
                {prescriptionData.patient.validUntil}
              </p>
            </div>
          </div>

          {/* Diagnosis Banner */}
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-sm text-slate-800">
              <span className="font-bold">Diagnosis: </span>
              {prescriptionData.diagnosis}
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
                {prescriptionData.medicines.map((item, idx) => (
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
              {prescriptionData.notes}
            </p>
          </div>

          {/* QR & Signature Footer */}
          <div className="mt-8 flex justify-between items-end pt-4">
            {/* QR Code */}
            <div className="p-1 bg-white border border-gray-200 rounded-lg shadow-xs">
              <QRCodeSVG
                value={JSON.stringify({
                  patientId: prescriptionData.patient.id,
                  patientName: prescriptionData.patient.name,
                  doctorRegNo: prescriptionData.doctor.regNo,
                  issued: prescriptionData.patient.dateIssued,
                })}
                size={80}
              />
            </div>

            {/* Signature Area */}
            <div className="flex flex-col items-center">
              <div className="relative mb-1">
                <span className="font-serif text-3xl italic text-slate-800 select-none tracking-wide">
                  Eleanor Vance
                </span>
                <span className="absolute -top-2 -right-4 bg-sky-200/80 text-sky-900 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-sky-300 backdrop-blur-xs">
                  Digital Signature
                </span>
              </div>
              <div className="w-40 border-b border-gray-400 my-1"></div>
              <p className="text-xs font-semibold text-slate-800">
                Dr. Eleanor Vance
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
        {/* Back to Dashboard Button */}
        <button
          type="button"
          onClick={() => navigate("/doctor-dashboard")}
          className="w-full sm:w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors cursor-pointer shadow-sm"
        >
          <FaArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        {/* Download PDF Link Button */}
        <PDFDownloadLink
          document={
            <PrescriptionPDF
              patient={singlePatientMockData}
              prescriptions={prescriptions}
              notes={notes}
              date={date}
            />
          }
          fileName={`Prescription_${singlePatientMockData.patientId}.pdf`}
          className="w-full sm:w-1/2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors shadow-sm cursor-pointer"
        >
          {({ loading }) => (
            <>
              <FaDownload size={14} />
              <span>{loading ? "Generating PDF..." : "Download PDF"}</span>
            </>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}