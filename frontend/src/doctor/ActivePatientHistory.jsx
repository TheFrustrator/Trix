import React, { useRef, useState } from "react";
import { LuNotebookPen } from "react-icons/lu";
import { PiThermometerHot } from "react-icons/pi";

import AttachtReport from "../cards/AttachtReport";
import { useNavigate } from "react-router-dom";

const ActivePatientHistory = () => {
  const [addNewDiagnosis, setAddNewDiagnosis] = useState("");
  const [diagnosisNotes, setDiagnosisNotes] = useState("");

  const [uploadLicense, setUploadLicense] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate()

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const [selectedDate ,setSelectDate] = useState(getTodayDate());

  // Handle Drag Events
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

  // Handle Manual File Select
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadLicense(e.target.files[0]);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
  };
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 pr-6">
      {/* Add New Diagnosis */}
      <div className="w-full flex flex-col py-2">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-lg font-bold text-primary">Add New Diagnosis</h1>
          <PiThermometerHot size={20} color="gray" />
        </div>
        <div className="w-full h-52 border border-gray-300 rounded-lg shadow-xl hover:border-border mt-2">
          <textarea
            type="text"
            placeholder="Add diagnosis here..."
            onChange={(e) => setAddNewDiagnosis(e.target.value)}
            value={addNewDiagnosis}
            className="w-full h-52 p-2 mt-1 focus:outline-none text-slate-700 resize-none font-medium text-md"
          />
        </div>
      </div>
      {/* Dignosis notice */}
      <div className="w-full flex flex-col py-2">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-lg font-bold text-primary">Diagnosis Notes</h1>
          <LuNotebookPen size={20} color="gray" />
        </div>
        <div className="w-full h-52 border border-gray-300 rounded-lg shadow-xl hover:border-border mt-2">
          <textarea
            type="text"
            placeholder="Add diagnosis here..."
            onChange={(e) => setDiagnosisNotes(e.target.value)}
            value={diagnosisNotes}
            className="w-full h-52 p-2 mt-1 focus:outline-none text-slate-700 resize-none font-medium text-md"
          />
        </div>
      </div>
      {/* Attach report / scans */}
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
      {/* Date */}
      <div className="w-full flex flex-col">
        <h1 className="text-lg text-primary font-semibold">Date</h1>
        <input
          value={selectedDate}
          onChange={(e) => selectedDate(e.target.value)}
          className="w-full p-2 mt-1 focus:outline-none text-slate-700 resize-none font-medium text-md border rounded-lg border-gray-300"
        />
        <div className="w-full flex flex-row gap-3 mt-4 items-center justify-center">
          <button className="w-full bg-blue-300 rounded-lg mx-1 text-white font-semibold text-lg">Save Diagnosis</button>
          <button className="underline text-blue-300" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ActivePatientHistory;
