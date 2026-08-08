import React from "react";
import { Icons, userNames, userDetailes } from "../assets/assets";

import LandingPageCard from "../cards/LandingPageCard";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col lg:flex-col md:flex-row bg-secondary">
      {/* Header */}
      <div className="flex flex-row justify-between bg-primary">
        {/* logo  */}
        <div className="flex flex-row mx-8 my-3 lg:mx-10 lg:my-5">
          <img className="w-10 rounded-full " src={Icons.logoM} />
          <h1 className="ml-2 text-2xl text-white">Medi</h1>
          <h1 className="text-2xl text-border">Link</h1>
        </div>
        {/* Signup screen */}
        <div className="flex flex-row mx-8 my-3 lg:mx-10 lg:my-5">
          <button
            onClick={() => navigate("/choosesignup")}
            className="flex items-center px-3 bg-secondary rounded-lg"
          >
            Login/Sign Up
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center  min-h-screen overflow-auto">
        {/* Details  */}
        <div className="flex flex-col  items-center text-center my-8">
          <h1 className="text-blue-950 text-5xl font-bold">
            One ID. Your Complete <br /> Medical Record
          </h1>

          <p className="pt-3 text-xl text-gray-500">
            A secure platfrom connecting pataient, doctors, and pharmacies for{" "}
            <br /> instant, seamless medical record access and collaboration
          </p>
          <div className="mt-6 bg-border rounded-lg items-center">
            <button
              onClick={() => navigate("/choosesignup")}
              className="text-white font-semibold mx-3 my-2"
            >
              Get Started Free
            </button>
          </div>
        </div>
        {/* UserCards  */}
        <div className="flex mt-4 justify-center gap-3 ">
          {/* patient card  */}
          <LandingPageCard
            logo={Icons.patient}
            userName={userNames.patient}
            userDetails={userDetailes.patient}
          />
          {/* doctor card  */}
          <LandingPageCard
            logo={Icons.doctor}
            userName={userNames.doctor}
            userDetails={userDetailes.doctor}
          />
          {/* pharmacy card  */}
          <LandingPageCard
            logo={Icons.pharmacy}
            userName={userNames.pharmacy}
            userDetails={userDetailes.pharmacy}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
