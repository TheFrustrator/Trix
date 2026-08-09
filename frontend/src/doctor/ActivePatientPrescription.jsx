import React, { useState, useContext } from "react";
import { GoDash, GoPlus } from "react-icons/go";
import { LuNotebookPen } from "react-icons/lu";
import { FaTrash, FaCheck, FaFilePdf, FaHome, FaRegFilePdf } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { singlePatientMockData, PatientIcons } from "../assets/patientAssests";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ActivePatientPrescription = () => {
  const { patientCustomId } = useParams();
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [medicineName, setMedicineName] = useState("");
  const [dosages, setDosages] = useState("1");
  const [frequency, setFrequency] = useState("Twice");
  const [timing, setTiming] = useState("Before Food");
  const [duration, setDuration] = useState("7");

  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(getTodayDate());

  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionNotes, setPrescriptionNotes] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const options = ["Once", "Twice", "Thrice a day"];
  const frequencyMap = { Once: 1, Twice: 2, "Thrice a day": 3 };

  const dosagesCount = parseInt(dosages, 10) || 0;
  const durationCount = parseInt(duration, 10) || 0;
  const freqMultiplier = frequencyMap[frequency] || 1;
  const totalQuantity = (dosagesCount * freqMultiplier * durationCount).toString();

  const handleCancelForm = () => {
    setMedicineName("");
    setDosages("1");
    setFrequency("Twice");
    setTiming("Before Food");
    setDuration("7");
  };

  const handleAddMedicine = () => {
    if (!medicineName.trim()) {
      return toast.error("Please enter a medicine name.");
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

  const handleSubmitPrescription = async () => {
    if (prescriptions.length === 0) {
      return toast.error("Please add at least one medicine item.");
    }

    try {
      setSubmitting(true);
      axios.defaults.withCredentials = true;
      const baseUrl = backendUrl?.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;

      const { data } = await axios.post(`${baseUrl}/api/doctor/save-prescription`, {
        patientCustomId,
        medicines: prescriptions,
        notes: prescriptionNotes,
        date,
      });

      if (data.success) {
        setIsModalOpen(true);
      } else {
        toast.error(data.message || "Failed to submit prescription");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col p-2 relative">
      <div className="flex flex-row gap-2 items-center">
        <LuNotebookPen size={20} className="text-slate-800" />
        <h1 className="text-base font-bold text-slate-800">Build Prescription</h1>
      </div>

      {/* Grid Inputs */}
      <div className="w-full grid grid-cols-2 lg:grid-cols-7 mt-3 gap-3 items-start justify-center">
        <div className="flex flex-col justify-center items-start">
          <label className="text-xs font-semibold text-slate-700">Medicine Name</label>
          <input
            type="text"
            placeholder="Amoxicillin 500mg"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            className="border border-blue-100 w-full rounded-xl p-2 mt-1 focus:outline-blue-400 text-xs bg-white"
          />
        </div>

        <div className="flex flex-col items-start">
          <label className="text-xs font-semibold text-slate-700">Dosage (tabs)</label>
          <div className="flex flex-row gap-0 items-center justify-center border rounded-xl border-blue-200 mt-1 bg-white">
            <button
              type="button"
              onClick={() => {
                const current = parseInt(dosages, 10) || 1;
                setDosages(current > 1 ? (current - 1).toString() : "1");
              }}
              className="bg-blue-100 hover:bg-blue-200 rounded-l-xl flex items-center justify-center cursor-pointer"
            >
              <GoDash size={18} className="mx-2 my-1" />
            </button>
            <input
              type="text"
              value={dosages}
              onChange={(e) => setDosages(e.target.value)}
              className="w-8 text-center focus:outline-none bg-transparent text-xs font-bold"
            />
            <button
              type="button"
              onClick={() => {
                const current = parseInt(dosages, 10) || 0;
                setDosages((current + 1).toString());
              }}
              className="bg-blue-100 hover:bg-blue-200 rounded-r-xl flex items-center justify-center cursor-pointer"
            >
              <GoPlus size={18} className="mx-2 my-1" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-start font-sans">
          <label className="text-xs font-semibold text-slate-700 mb-1">Frequency</label>
          <div className="flex flex-col gap-1.5">
            {options.map((option) => {
              const isSelected = frequency === option;
              return (
                <label
                  key={option}
                  onClick={() => setFrequency(option)}
                  className="flex items-center gap-2 cursor-pointer select-none text-xs"
                >
                  <div className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${isSelected ? "bg-blue-500" : "bg-gray-300"}`}>
                    <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${isSelected ? "translate-x-3.5" : "translate-x-0"}`} />
                  </div>
                  <span className="font-medium text-slate-800">{option}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-start">
          <label className="text-xs font-semibold text-slate-700 mb-1">Timings</label>
          <div className="flex flex-col gap-1 items-start">
            {["Before Food", "After Food", "Bedtime"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTiming(option)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                  timing === option ? "bg-blue-500 text-white shadow-xs" : "bg-blue-50 text-slate-700 hover:bg-blue-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start">
          <label className="text-xs font-semibold text-slate-700">Duration (Days)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border border-blue-100 rounded-xl p-2 mt-1 focus:outline-blue-400 text-xs bg-white"
          />
        </div>

        <div className="flex flex-col items-start">
          <label className="text-xs font-semibold text-slate-700">Total Quantity</label>
          <div className="w-full border border-blue-100 bg-blue-50 text-blue-900 font-bold rounded-xl p-2 mt-1 flex justify-center items-center text-xs">
            {totalQuantity}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mt-5 justify-center items-stretch w-full">
          <button
            type="button"
            onClick={handleAddMedicine}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs py-2 px-3 rounded-xl cursor-pointer shadow-xs"
          >
            + Add Item
          </button>
          <button
            type="button"
            onClick={handleCancelForm}
            className="bg-gray-100 hover:bg-gray-200 text-slate-600 font-semibold text-xs py-1.5 px-3 rounded-xl cursor-pointer"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* Added Prescriptions Table */}
      {prescriptions.length > 0 && (
        <div className="mt-5 border-t pt-3">
          <h2 className="text-xs font-bold text-slate-800 mb-2">Prescription Item List</h2>
          <div className="flex flex-col gap-2">
            {prescriptions.map((item, idx) => (
              <div key={item.id} className="flex justify-between items-center bg-slate-50 border p-2.5 rounded-xl text-xs">
                <div>
                  <span className="font-bold text-slate-800">{idx + 1}. {item.medicineName}</span>
                  <span className="text-slate-500 ml-2">({item.dosages} tab • {item.frequency} • {item.timing} • {item.duration} days)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-blue-600">Total: {item.totalQuantity} tabs</span>
                  <button type="button" onClick={() => handleRemovePrescription(item.id)} className="text-red-500 hover:bg-red-100 p-1.5 rounded-lg cursor-pointer">
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes & Actions */}
      <div className="flex flex-row mt-4 justify-between gap-4">
        <div className="flex flex-col items-start w-full">
          <label className="text-sm font-semibold text-slate-800">Prescription Notes</label>
          <textarea
            placeholder="Add general notes or diet instructions..."
            onChange={(e) => setPrescriptionNotes(e.target.value)}
            value={prescriptionNotes}
            className="w-full h-32 p-2.5 mt-1 border border-gray-300 rounded-xl focus:outline-none text-slate-700 resize-none font-medium text-xs bg-white"
          />
        </div>

        <div className="w-full flex flex-col justify-between">
          <div>
            <label className="text-sm font-semibold text-slate-800">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 mt-1 focus:outline-none text-slate-700 font-medium text-xs border rounded-xl border-gray-300 bg-white"
            />
          </div>

          <div className="w-full flex flex-row gap-3 mt-4 items-center">
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmitPrescription}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs py-2.5 rounded-xl cursor-pointer shadow-xs"
            >
              {submitting ? "Submitting..." : "Submit Final Prescription"}
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full flex flex-col items-center shadow-2xl border border-gray-100">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg mb-3">
              <FaCheck size={26} />
            </div>

            <h2 className="text-xl font-bold text-slate-800 text-center mb-4">
              Prescription Submitted Successfully
            </h2>

            <div className="flex flex-row items-center gap-4 bg-slate-50 border border-gray-200 rounded-2xl p-3 w-full mb-6">
              <div className="flex flex-col text-left justify-center text-xs">
                <p className="font-semibold text-slate-800">
                  Patient ID: <span className="font-medium text-slate-700">{patientCustomId}</span>
                </p>
                <p className="font-semibold text-slate-800 mt-1">
                  Issued Date: <span className="font-medium text-slate-700">{date}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-3 w-full">
              <button
                onClick={() => navigate("/prescription-view")}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-xs cursor-pointer"
              >
                <FaRegFilePdf size={14} />
                View PDF
              </button>

              <button
                type="button"
                onClick={() => navigate("/doctor-dashboard")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-700 font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <FaHome size={14} />
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