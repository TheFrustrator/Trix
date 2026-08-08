import React, { useEffect, useState } from "react";
import PharmacyHeader from "../component/PharmacyHeader";
import { Icons } from "../assets/assets";
import { FaSearchPlus, FaSearch } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";

const PharmacyDashboard = () => {
 const [searchQuery, setSearchQuery] = useState("");
 const navigate = useNavigate()
 
 const handleSearch = (e) => {

  e.preventDefault()
  if(!searchQuery.trim()) return

  navigate("/pharmacy-prescription-view", {
    state: {initialQuery: searchQuery.trim()}
  })
 }

  return (
    <div className="flex flex-col w-full max-h-screen">
      {/* Header component */}
      <PharmacyHeader pharmacyName={"Owkword Community Pharmacy"} />
      {/* Main pharmacy dashboard */}
      <>
        <div className="min-h-[80vh] flex items-center bg-slate-100">
          <div className="flex flex-col gap-3 m-auto items-center p-8 min-w-[525px] sm:min-w-96 border rounded-xl text-primary text-sm shadow-lg bg-white">
            <FaSearchPlus size={48} color="" />
            <h1 className="text-xl font-bold text-primary">
              View Patient Prescription
            </h1>
            <h1 className="text-xs font-normal text-primary">
              Enter a valid Patient ID below to view their active and filled
              prescription
            </h1>

            {/* Patient search icon */}
            <form onSubmit={handleSearch} className="flex flex-row justify-between items-center border border-gray-400 rounded-2xl gap-7">
              <div className="text-slate-500 mx-4 my-2">
                <div className="flex flex-col gap-1 mx-4">
                  <input
                    id="patient-search"
                    type="text"
                    placeholder="e.g., p-4041-XYZ"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-none border-blue-100 rounded-lg p-2 focus:outline-none focus:ring-none focus:ring-white text-slate-700"
                  />
                </div>
                {/* Enter Patient ID (e.g., p-4041-XYZ) */}
              </div>

              {/* Search icon  */}

              <button type="submit"  className="flex flex-row items-center justify-center bg-blue-300 rounded-full my-2 mx-4 gap-1">
                <span className="my-2 ml-2">
                  <FaSearch size={20} color="white" />
                </span>
                <span className="mr-2 my-2">
                  <h1 className="text-sm font-semibold text-white mr-2">
                    Search
                  </h1>
                </span>
              </button>
            </form>

            {/* view recent prescription and Manage pharmacy account */}
           
            {/* <div className="w-full flex flex-row justify-between items-center gap-1.5">
              manage prescription 
              <button className="flex items-center justify-center rounded-md bg-blue-300">
                <div className="flex flow-row mx-2 my-2 items-center gap-1">
                  <FaClockRotateLeft color="white" />
                  <h1 className="text-sm font-normal text-white mr-2">
                    View Recent Prescription
                  </h1>
                </div>
              </button>

              pharmacy account 
              <button className="flex items-center justify-center rounded-md bg-blue-300">
                <div className="flex flow-row mx-2 my-2 items-center gap-1">
                  <FaClockRotateLeft color="white" />
                  <h1 className="text-sm font-normal text-white mr-2">
                    View Recent Prescription
                  </h1>
                </div>
              </button>
            </div> */}


          </div>
        </div>
      </>
    </div>
  );
};

export default PharmacyDashboard;
