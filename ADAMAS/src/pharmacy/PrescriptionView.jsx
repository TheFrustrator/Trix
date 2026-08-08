import React, { useEffect, useState } from "react";
import PharmacyHeader from "../component/PharmacyHeader";
import { FaSearch } from "react-icons/fa";
import { Icons } from "../assets/assets";
import { FaUserDoctor } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import { CiFileOn } from "react-icons/ci";
import { useLocation } from "react-router-dom";
import { pharmactMockData } from "../assets/pharmacyAssests";

const PrescriptionView = () => {
 const location = useLocation();

  // Read initial search query passed from PharmacyDashboard (or fallback to empty string)
  const initialQuery = location.state?.initialQuery || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    setPatients(pharmactMockData);
  }, []);

  // Standardize search query logic (strips special characters like hyphens)
  const rawQuery = searchQuery.trim().toLowerCase();
  const cleanQuery = rawQuery.replace(/[^a-z0-9]/g, "");

  const filteredPatients = patients.filter((patient) => {
    if (!cleanQuery) return false;

    const cleanPatientId = patient.patientId.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanPatientName = patient.name.toLowerCase();

    const matchesId = cleanPatientId.includes(cleanQuery);
    const matchesName = cleanPatientName.includes(rawQuery);

    return matchesId || matchesName;
  });

  return (
    <div className="flex flex-col w-full max-h-screen">
      {/* Header compoment  */}
      <PharmacyHeader pharmacyName={"Owkword Community Pharmacy"} />
      {/* View pharmacy component */}
      <div className="min-h-[80vh] flex  justify-center bg-slate-100">
        <div className="flex flex-col gap-3 items-center bg-slate-100 p-8 min-w-[525px] sm:min-w-96 text-primary text-sm">
          {/* Search bar */}
          <div className="w-full">
            <div className="flex flex-row justify-between items-center border border-gray-400 rounded-2xl gap-7">
              <div className="text-slate-500 mx-4 my-2">
                <div className="flex flex-row items-center gap-2 mx-4">
                  <FaSearch size={20} color="gray" opacity={100} />
                  <input
                    id="patient-search"
                    type="text"
                    placeholder="e.g., P4041XYZ"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-none w-full rounded-lg p-2 bg-slate-100 focus:outline-none"
                  />
                </div>
                {/* Enter Patient ID (e.g., p-4041-XYZ) */}
              </div>

              {/* Search icon  */}

              <button className="flex flex-row items-center justify-center bg-blue-300 rounded-full my-2 mx-4 gap-1">
                <span className="my-2 ml-2">
                  <FaSearch size={20} color="white" />
                </span>
                <span className="mr-2 my-2">
                  <h1 className="text-sm font-semibold text-white mr-2">
                    Search
                  </h1>
                </span>
              </button>
            </div>
          </div>

          {/* prescription view  */}
          {cleanQuery === "" ? (
            <div className="flex items-center justify-center pt-10 text-gray-400">
              <p className="text-base font-medium">
                Enter a Patient ID or Name above to view prescription.
              </p>
            </div>
          ) : filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="w-full flex flex-col justify-between items-start gap-1.5 bg-blue-500/25 rounded-xl border-gray-300"
              >
                <div className="flex flex-row gap-3 justify-between">
                  {/* Pdf viewer  */}
                  <div className="bg-gray-600/20 border-none rounded-md shadow-md mx-3 my-3">
                    <img
                      src={Icons.pdfViewer}
                      alt=""
                      className="w-32 h-40 mx-4 my-1"
                    />
                  </div>
                  {/* Prescription details */}
                  <div className="flex flex-col items-start justify-center">
                    {/* doctoe name */}
                    <div className="flex flex-row items-center justify-start gap-2 my-2">
                      <FaUserDoctor size={24} color="" />
                      <h1 className="text-primary font-semibold text-md">
                        {patient.name}
                      </h1>
                    </div>
                    {/* date of apointment */}
                    <div className="flex flex-row items-center gap-2  my-2">
                      <CiCalendar size={24} color="" />
                      <h1 className="text-primary font-semibold text-md">
                        {patient.date}
                      </h1>
                    </div>
                    {/* validity check */}
                    <div className="flex flex-row items-center gap-2 my-2 bg-green-200 rounded-full">
                      <span className="flex flex-row mx-2 my-1 gap-1">
                        <IoShieldCheckmarkSharp size={24} color="green" />
                        <h1 className="text-primary font-semibold text-md">
                          {patient.isValid === true ? "Valid" : "Not Valid"}
                        </h1>
                      </span>
                    </div>
                  </div>
                </div>

                {/*Download view and Dispensed */}
                <div className="flex flex-row justify-between gap-3 mx-4 mb-4">
                  {/* Download */}
                  <button className="flex items-center justify-center rounded-md bg-blue-500/25">
                    <div className="flex flow-row mx-2 my-2 items-center gap-1">
                      <CiFileOn color="white" />
                      <h1 className="text-sm font-normal text-white mr-2">
                        Download PDF
                      </h1>
                    </div>
                  </button>
                  {/* PrescriptionView */}
                  <button className="flex items-center justify-center rounded-md bg-blue-500/25">
                    <div className="flex flow-row mx-2 my-2 items-center gap-1">
                      <MdOutlineFileDownload color="white" />
                      <h1 className="text-sm font-normal text-white mr-2">
                        Direct View
                      </h1>
                    </div>
                  </button>
                  {/* dispensed */}
                  <button className="flex items-center justify-center rounded-md bg-blue-500/25">
                    <div className="flex flow-row mx-2 my-2 items-center gap-1">
                      <IoShieldCheckmarkSharp color="white" />
                      <h1 className="text-sm font-normal text-white mr-2">
                        Mark as Dispensed
                      </h1>
                    </div>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center pt-11">
              <h1 className="text-xl font-medium text-primary">
                No data found matching {searchQuery}
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionView;
