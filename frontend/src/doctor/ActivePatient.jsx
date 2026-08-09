import React, { useEffect, useState, useContext } from "react";
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { DoctorIcon, DoctorNavlinkItems } from "../assets/doctor";
import NavlinkComponent from "../component/NavlinkComponent";
import DoctorHeader from "../cards/DoctorHeader";
import { IoIosLock } from "react-icons/io";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const ActivePatient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patientCustomId } = useParams();
  const { backendUrl } = useContext(AppContext);

  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [expiresAt, setExpiresAt] = useState(null);

  const currentDashboardRole =
    DoctorNavlinkItems.find((r) => r.route === location.pathname) ||
    DoctorNavlinkItems[0];

  const handlePageChange = (item) => {
    if (item.route && item.route !== location.pathname) {
      navigate(item.route);
    }
  };

  // Fetch Session Expiration
  useEffect(() => {
    const fetchSession = async () => {
      try {
        axios.defaults.withCredentials = true;
        const baseUrl = backendUrl?.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
        const { data } = await axios.get(`${baseUrl}/api/doctor/active-session/${patientCustomId}`);

        if (data.success && data.expiresAt) {
          setExpiresAt(data.expiresAt);
        }
      } catch (err) {
        console.error("Session error:", err);
      }
    };

    if (patientCustomId) fetchSession();
  }, [backendUrl, patientCustomId]);

  // Live Timer Countdown
  useEffect(() => {
    if (!expiresAt) return;

    const timer = setInterval(() => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(timer);
        return;
      }
      const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      const pad = (n) => String(n).padStart(2, "0");
      setTimeLeft(`${pad(hrs)}:${pad(mins)}:${pad(secs)}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <div className="h-full w-full flex flex-row min-h-screen bg-slate-50/50">
      <aside className="w-64 flex-shrink-0 bg-white shadow-xs">
        <NavlinkComponent
          currentDashboardRole={currentDashboardRole}
          handlePageChange={handlePageChange}
          userNavlinkItem={DoctorNavlinkItems}
        />
      </aside>

      <div className="flex-1 w-full flex flex-col p-6 gap-6 overflow-x-hidden">
        <div className="w-full flex justify-end">
          <DoctorHeader headerIcon={DoctorIcon.FDoctorIcon} />
        </div>

        {/* Lock bar */}
        <div className="flex flex-row items-center w-full px-3 my-1 bg-green-100/80 border border-green-600 rounded-lg h-11 shadow-xs">
          <div className="flex flex-row items-center w-full justify-between gap-3 mx-1">
            <div className="flex flex-row gap-2 items-center">
              <IoIosLock size={22} className="text-green-700" />
              <h1 className="text-sm font-semibold text-slate-800">
                Access Granted - expires in <span className="font-mono font-bold text-green-800">{timeLeft}</span>
              </h1>
            </div>

            <button
              onClick={() => navigate("prescription")}
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg px-3 py-1 text-xs font-semibold cursor-pointer shadow-xs transition-colors"
            >
              Prescribe Now
            </button>
          </div>
        </div>

        {/* Horizontal Sub-Tabs */}
        <div className="flex flex-row gap-6 border-b border-gray-200 pt-2">
          <NavLink
            to="summary"
            className={({ isActive }) =>
              `pb-2 text-sm font-semibold transition-all ${
                isActive
                  ? "border-b-2 border-slate-700 text-slate-800 -mb-[1px]"
                  : "text-slate-400 hover:text-slate-600 border-b-2 border-transparent"
              }`
            }
          >
            Summary
          </NavLink>

          <NavLink
            to="history"
            className={({ isActive }) =>
              `pb-2 text-sm font-semibold transition-all ${
                isActive
                  ? "border-b-2 border-slate-700 text-slate-800 -mb-[1px]"
                  : "text-slate-400 hover:text-slate-600 border-b-2 border-transparent"
              }`
            }
          >
            History
          </NavLink>

          <NavLink
            to="prescription"
            className={({ isActive }) =>
              `pb-2 text-sm font-semibold transition-all ${
                isActive
                  ? "border-b-2 border-slate-700 text-slate-800 -mb-[1px]"
                  : "text-slate-400 hover:text-slate-600 border-b-2 border-transparent"
              }`
            }
          >
            Prescriptions
          </NavLink>
        </div>

        <div className="mt-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ActivePatient;