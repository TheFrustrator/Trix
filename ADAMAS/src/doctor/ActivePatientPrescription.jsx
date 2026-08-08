import React, { useState } from "react";
import { GoDash, GoPlus } from "react-icons/go";
import { LuNotebookPen } from "react-icons/lu";
import { FaTrash, FaCheck, FaFilePdf, FaHome, FaRegFilePdf } from "react-icons/fa";

import { Outlet, useNavigate } from "react-router-dom";

import { singlePatientMockData, PatientIcons } from "../assets/patientAssests";
import { PrescriptionPDF } from "../component/PrescriptionPDF";

const ActivePatientPrescription = () => {
  const [medicineName, setMedicineName] = useState("");
  const [dosages, setDosages] = useState("1");
  const [frequency, setFrequency] = useState("Twice");
  const [timing, setTiming] = useState("Before Food");
  const [duration, setDuration] = useState("1");

  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(getTodayDate());

  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionNotes, setPrescriptionNotes] = useState("");

  // State to control modal popup visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const options = ["Once", "Twice", "Thrice a day"];
  const frequencyMap = { Once: 1, Twice: 2, "Thrice a day": 3 };

  const dosagesCount = parseInt(dosages, 10) || 0;
  const durationCount = parseInt(duration, 10) || 0;
  const freqMultiplier = frequencyMap[frequency] || 1;
  const totalQuantity = (
    dosagesCount *
    freqMultiplier *
    durationCount
  ).toString();

  const handleCancelForm = () => {
    setMedicineName("");
    setDosages("1");
    setFrequency("Twice");
    setTiming("Before Food");
    setDuration("1");
  };

  const handleAddMedicine = () => {
    if (!medicineName.trim()) {
      alert("Please enter a medicine name.");
      return;
    }

    const newPrescription = {
      id: Date.now(),
      medicineName,
      dosages,
      frequency,
      timing,
      duration,
      totalQuantity,
    };

    setPrescriptions((prev) => [...prev, newPrescription]);
    handleCancelForm();
  };

  const handleRemovePrescription = (id) => {
    setPrescriptions((prev) => prev.filter((item) => item.id !== id));
  };

  // Submit trigger to show the modal
  const handleSubmitPrescription = () => {
    if (prescriptions.length === 0) {
      alert("Please add at least one medicine item.");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col p-4 relative">
      {/* Header */}
      <div className="flex flex-row gap-1 justify-start items-center">
        <LuNotebookPen size={20} color="black" />
        <h1 className="text-lg font-bold text-primary">Build Prescription</h1>
      </div>

      {/* Grid Inputs */}
      <div className="w-full grid grid-cols-2 lg:grid-cols-7 mt-3 gap-2 items-start justify-center">
        {/* Medicine Name */}
        <div className="flex flex-col mt-1 justify-center items-start">
          <h1 className="text-sm font-medium text-gray-700">Medicine Name</h1>
          <input
            type="text"
            placeholder="Paracetamol 350mg"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            className="border border-blue-100 w-full rounded-xl p-2 mt-1 focus:outline-blue-400 text-sm"
          />
        </div>

        {/* Dosages */}
        <div className="flex flex-col items-start mt-2">
          <h1 className="text-sm font-medium text-gray-700">Dosage (tabs)</h1>
          <div className="flex flex-row gap-0 items-center justify-center border rounded-xl border-blue-200 mt-2">
            <button
              type="button"
              onClick={() => {
                setDosages((prev) => {
                  const current = parseInt(prev, 10) || 1;
                  return current > 1 ? (current - 1).toString() : "1";
                });
              }}
              className="bg-blue-200 rounded-l-xl flex items-center justify-center cursor-pointer"
            >
              <GoDash size={22} className="mx-2 my-1" />
            </button>

            <input
              type="text"
              placeholder="1"
              value={dosages}
              onChange={(e) => setDosages(e.target.value)}
              className="w-10 text-center focus:outline-none bg-transparent text-sm"
            />

            <button
              type="button"
              onClick={() => {
                setDosages((prev) => {
                  const current = parseInt(prev, 10) || 0;
                  return (current + 1).toString();
                });
              }}
              className="bg-blue-200 rounded-r-xl flex items-center justify-center cursor-pointer"
            >
              <GoPlus size={22} className="mx-2 my-1" />
            </button>
          </div>
        </div>

        {/* Frequency */}
        <div className="flex flex-col mt-1 justify-center items-start font-sans">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Frequency
          </label>
          <div className="flex flex-col gap-2.5">
            {options.map((option) => {
              const isSelected = frequency === option;
              return (
                <label
                  key={option}
                  onClick={() => setFrequency(option)}
                  className="flex items-center gap-3 cursor-pointer select-none"
                >
                  <div
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                      isSelected ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        isSelected ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Timing */}
        <div className="flex flex-col items-start mt-2">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Timings
          </label>
          <div className="flex flex-col gap-2 items-start">
            {["Before Food", "After Food", "Bedtime"].map((option) => {
              const isSelected = timing === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTiming(option)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-blue-100/70 text-gray-800 hover:bg-blue-200/70"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration */}
        <div className="flex flex-col mt-1 justify-center items-start">
          <label className="text-sm font-medium text-gray-700">
            Duration (Days)
          </label>
          <input
            type="number"
            placeholder="7"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="lg:w-full w-28 border border-blue-100 rounded-xl p-2 mt-1 focus:outline-blue-400 text-sm"
          />
        </div>

        {/* Total Quantity */}
        <div className="flex flex-col mt-1 justify-center items-start">
          <label className="text-sm font-medium text-gray-700">
            Total Quantity
          </label>
          <div className="lg:w-full w-28 border border-blue-100 bg-blue-100 text-blue-900 font-semibold rounded-xl p-2 mt-1 flex justify-center items-center text-sm">
            {totalQuantity}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-7 justify-center items-stretch w-full">
          <button
            type="button"
            onClick={handleAddMedicine}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            + Add Item
          </button>
          <button
            type="button"
            onClick={handleCancelForm}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* Added Prescriptions Table */}
      {prescriptions.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-md font-bold text-gray-800 mb-2">
            Prescription List
          </h2>
          <div className="flex flex-col gap-2">
            {prescriptions.map((item, idx) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-gray-50 border p-3 rounded-xl text-sm"
              >
                <div>
                  <span className="font-bold text-gray-800">
                    {idx + 1}. {item.medicineName}
                  </span>
                  <span className="text-gray-500 ml-2">
                    ({item.dosages} tab • {item.frequency} • {item.timing} •{" "}
                    {item.duration} days)
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-blue-600">
                    Total: {item.totalQuantity} tabs
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemovePrescription(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prescription Notes and Date Section */}
      <div className="flex flex-row mt-4 justify-between gap-4">
        <div className="flex flex-col items-start justify-center w-full">
          <label className="text-xl text-gray-700 font-semibold">
            Prescription Notes
          </label>
          <div className="w-full h-52 border border-gray-300 rounded-lg shadow-xl hover:border-border mt-2">
            <textarea
              placeholder="Add diagnosis here..."
              onChange={(e) => setPrescriptionNotes(e.target.value)}
              value={prescriptionNotes}
              className="w-full h-52 p-2 mt-1 focus:outline-none text-slate-700 resize-none font-medium text-md"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-start">
          <div className="w-full flex flex-col">
            <h1 className="text-lg text-primary font-semibold">Date</h1>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 mt-1 focus:outline-none text-slate-700 font-medium text-md border rounded-lg border-gray-300"
            />
            <div className="w-full flex flex-row gap-3 mt-4 items-center justify-center">
              <button
                type="button"
                onClick={handleSubmitPrescription}
                className="w-2/3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-md py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Submit Final Prescription
              </button>

              <button className="flex items-start w-1/2 underline text-blue-500 text-sm">
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full flex flex-col items-center shadow-2xl animate-fade-in border border-gray-100">
            {/* Green Check Icon */}
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg mb-4">
              <FaCheck size={30} />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">
              Prescription Submitted Successfully
            </h2>

            {/* Middle Preview Card */}
            <div className="flex flex-row items-center gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-3 w-full mb-8">
              {/* Patient Mini Avatar Preview */}
              <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-xs flex flex-col items-start w-28 text-[10px]">
                <div className="flex items-center gap-1.5 mb-1">
                  <img
                    src={PatientIcons?.userIcon}
                    alt="Patient"
                    className="w-5 h-5 rounded-full object-cover bg-blue-100"
                  />
                  <div>
                    <p className="font-bold text-slate-800 leading-none truncate w-14">
                      {singlePatientMockData?.patientName}
                    </p>
                    <p className="text-[8px] text-gray-400 leading-none">
                      {singlePatientMockData?.patientId}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-slate-700 text-[9px] mt-1">
                  Prescription
                </p>
                <p className="font-semibold text-blue-600 truncate w-full">
                  {prescriptions[0]?.medicineName || "Paracetamol"}
                </p>
                <p className="text-[8px] text-gray-400">
                  Prescription Submitted
                </p>
              </div>

              {/* Patient Info Text */}
              <div className="flex flex-col text-left justify-center text-sm">
                <p className="font-semibold text-slate-800">
                  Patient:{" "}
                  <span className="font-medium text-slate-700">
                    {singlePatientMockData?.patientName} (ID:{" "}
                    {singlePatientMockData?.patientId})
                  </span>
                </p>
                <p className="font-semibold text-slate-800 mt-1">
                  Issued:{" "}
                  <span className="font-medium text-slate-700">{date}</span>
                </p>
                <div className="flex items-center gap-1.5 text-slate-600 mt-2 font-medium">
                  <FaFilePdf className="text-gray-500" size={16} />
                  <span>PDF Icon</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-row gap-3 w-full">
              {/* View/Download PDF Button */}

              <button onClick={() => navigate("/prescription-view")} className="flex-1 bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm transition-colors cursor-pointer">
                      <FaRegFilePdf size={16} />
                      View Pdf
              </button>
              {/* Back to Dashboard Button */}
              <button
                type="button"
                onClick={() => navigate("/active-patient")}
                className="flex-1 bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm transition-colors cursor-pointer"
              >
                <FaHome size={16} />
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ActivePatientPrescription;
