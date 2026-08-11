import React, { useContext, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify";

import PharmacyHeader from "../component/PharmacyHeader";
import { AppContext } from "../context/AppContext";
import { FaCheckCircle, FaSearch } from "react-icons/fa";
import {
  FaCalendarDays,
  FaDownload,
  FaFilePdf,
  FaUserDoctor,
} from "react-icons/fa6";

const formatDate = (date) => {
  if (!date) return "N/A";

  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return date;
  }

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const PrescriptionView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const [dispensing, setDispensing] = useState(false);
  const prescription = location.state?.prescription;
  const patient = location.state?.patient || prescription?.patient;

  if (!prescription) {
    return (
      <>
        <PharmacyHeader />

        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="bg-white border rounded-2xl shadow-sm p-8 text-center max-w-md">
            <FaSearch className="mx-auto text-slate-400 mb-4" size={40} />

            <h1 className="text-xl font-bold text-slate-800">
              No Prescription Selected
            </h1>

            <p className="text-slate-500 mt-2">
              Please search for a patient first.
            </p>

            <button
              onClick={() => navigate("/pharmacy-dashboard")}
              className="mt-6 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            >
              Search Patient
            </button>
          </div>
        </div>
      </>
    );
  }

  const prescriptionId = prescription.id || prescription._id;
  const patientName = prescription.patientName || patient?.name || "Patient";
  const patientCustomId =
    prescription.patientCustomId || patient?.patientCustomId || "N/A";
  const doctorName = prescription.doctor?.name || "Doctor";
  const issueDate = prescription.issueDate;
  const status = prescription.status || "ACTIVE";
  const isDispensed = status === "DISPENSED";
  const handlePdfView = () => {
    if (!prescriptionId) {
      toast.error("Prescription ID is missing.");
      return;
    }

    navigate(`/pharmacy-prescription-view/${prescriptionId}`, {
      state: {
        prescription,
        patient,
      },
    });
  };

  const handleMarkAsDone = async () => {
    if (!prescriptionId) {
      toast.error("Prescription ID is missing.");
      return;
    }

    if (isDispensed) {
      toast.info("This prescription has already been dispensed.");
      return;
    }

    try {
      setDispensing(true);

      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const { data } = await axios.post(
        `${baseUrl}/api/pharmacy/dispense`,
        {
          prescriptionId,
        },
        {
          withCredentials: true,
        },
      );

      if (!data.success) {
        toast.error(
          data.message || "Unable to mark prescription as dispensed.",
        );

        return;
      }

      toast.success("Prescription marked as dispensed.");

      const updatedPrescription = {
        ...prescription,
        status: "DISPENSED",
      };

      navigate("/pharmacy-prescription-view", {
        replace: true,
        state: {
          patient,
          prescription: updatedPrescription,
        },
      });
    } catch (error) {
      console.error("Dispense prescription error:", error);

      console.error("Dispense response:", error.response?.data);

      console.error("Dispense status:", error.response?.status);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to mark prescription as dispensed.",
      );
    } finally {
      setDispensing(false);
    }
  };

  return (
    <>
      <PharmacyHeader />

      <div className="min-h-[80vh] bg-slate-50 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <button
              onClick={() => navigate("/pharmacy-dashboard")}
              className="flex-1 flex items-center gap-3 border border-slate-300 bg-white rounded-2xl px-5 py-4 text-slate-500 hover:border-blue-400 transition"
            >
              <FaSearch size={20} />

              <span>Find another prescription by ID</span>
            </button>

            {/* <button
              onClick={() =>
                navigate("/pharmacy-prescription-history")
              }
              className="px-6 py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
            >
              View Previous 5 Prescriptions
            </button> */}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-sky-100 border border-blue-200 rounded-3xl shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-64">
                  <div className="h-64 bg-blue-100 rounded-2xl flex items-center justify-center border border-blue-200">
                    <div className="w-44 h-52 bg-white rounded-lg shadow-md border border-slate-200 p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-slate-800">
                          Rx
                        </span>

                        <div className="space-y-1">
                          <div className="w-8 h-1 bg-slate-300" />
                          <div className="w-8 h-1 bg-slate-300" />
                          <div className="w-6 h-1 bg-slate-300" />
                        </div>
                      </div>

                      <div className="mt-4 text-[7px] text-slate-600">
                        <p className="font-bold">Re: {patientName}</p>

                        <p>ID: {patientCustomId}</p>
                      </div>

                      <div className="mt-5 space-y-3">
                        <div className="flex justify-between">
                          <div className="w-20 h-1 bg-slate-300" />
                          <div className="w-5 h-1 bg-slate-300" />
                        </div>

                        <div className="flex justify-between">
                          <div className="w-24 h-1 bg-slate-300" />
                          <div className="w-5 h-1 bg-slate-300" />
                        </div>

                        <div className="flex justify-between">
                          <div className="w-16 h-1 bg-slate-300" />
                          <div className="w-5 h-1 bg-slate-300" />
                        </div>
                      </div>

                      <div className="mt-8 space-y-2">
                        <div className="w-full h-1 bg-slate-300" />
                        <div className="w-3/4 h-1 bg-slate-300" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Doctor */}

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <FaUserDoctor size={21} className="text-slate-700" />
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">Doctor</p>

                        <p className="text-xl font-semibold text-slate-800">
                          {doctorName}
                        </p>
                      </div>
                    </div>

                    {/* Date */}

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <FaCalendarDays size={21} className="text-slate-700" />
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">Date</p>

                        <p className="text-xl font-semibold text-slate-800">
                          {formatDate(issueDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Patient */}

                  <div className="mt-6 bg-white/70 rounded-2xl p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Patient</p>

                        <p className="font-semibold text-slate-800">
                          {patientName}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500">Patient ID</p>

                        <p className="font-semibold text-slate-800">
                          {patientCustomId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* STATUS */}

                  <div className="mt-5">
                    {isDispensed ? (
                      <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                        <FaCheckCircle />
                        Dispensed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                        <FaCheckCircle />
                        Valid
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-7">
                    {/* DOWNLOAD / PDF */}

                    <button
                      onClick={handlePdfView}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-600 hover:bg-slate-700 text-white font-semibold transition"
                    >
                      <FaDownload />
                      Download PDF
                    </button>

                    {/* DIRECT VIEW */}

                    <button
                      onClick={handlePdfView}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
                    >
                      <FaFilePdf />
                      Direct View
                    </button>

                    {/* MARK DONE */}

                    <button
                      onClick={handleMarkAsDone}
                      disabled={dispensing || isDispensed}
                      className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
                        isDispensed
                          ? "bg-green-300 text-green-800 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      }`}
                    >
                      <FaCheckCircle />

                      {dispensing
                        ? "Processing..."
                        : isDispensed
                          ? "Already Dispensed"
                          : "Mark as Dispensed"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CHECK FOR THE PREVIOUS 5 PRESCRIPTION - DISCUSSION FETCH MAY IMPLEMENT LATTER */}

          {/* <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <h2 className="text-lg font-bold text-slate-800">
              Prescription Details
            </h2>

            <div className="mt-4">

              <p className="text-sm text-slate-500">
                Diagnosis
              </p>

              <p className="font-semibold text-slate-800 mt-1">
                {prescription.diagnosis ||
                  "N/A"}
              </p>

            </div>

            {prescription.medicines?.length >
              0 && (
              <div className="mt-6">

                <p className="text-sm text-slate-500 mb-3">
                  Medicines
                </p>

                <div className="space-y-2">

                  {prescription.medicines.map(
                    (medicine, index) => (
                      <div
                        key={
                          medicine._id ||
                          medicine.id ||
                          index
                        }
                        className="border border-slate-200 rounded-xl p-4"
                      >

                        <p className="font-semibold text-slate-800">
                          {medicine.medicineName ||
                            medicine.name ||
                            "Medicine"}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {medicine.dosages
                            ? `${medicine.dosages} tablet`
                            : ""}

                          {medicine.frequency
                            ? ` • ${medicine.frequency}`
                            : ""}

                          {medicine.duration
                            ? ` • ${medicine.duration} days`
                            : ""}

                          {medicine.timing
                            ? ` • ${medicine.timing}`
                            : ""}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          </div> */}
        </div>
      </div>
    </>
  );
};

export default PrescriptionView;
