import React, { useContext, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import NavlinkComponent from "../component/NavlinkComponent";
import { PatientNavlinkItems, PatientIcons } from "../assets/patientAssests";
import UserHeaderCard from "../cards/UserHeaderCard";
import DashBoardFeatureCard from "../cards/DashBoardFeatureCard";
import DoctorVisitHistory from "../component/DoctorVisitHistory";
import { AppContext } from "../context/AppContext";

const formatDate = (isoDateStr) => {
  if (!isoDateStr) return "N/A";
  const d = new Date(isoDateStr);
  if (isNaN(d.getTime())) return isoDateStr; 
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const PatientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, backendUrl } = useContext(AppContext);

  const [selectedVisitId, setSelectedVisitId] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentDashboardRole =
    PatientNavlinkItems.find((r) => r.route === location.pathname) ||
    PatientNavlinkItems[0];

  const handlePageChange = (navItem) => {
    if (navItem?.route && navItem.route !== location.pathname) {
      navigate(navItem.route);
    }
  };

  const fetchDashboardSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      axios.defaults.withCredentials = true;
      const baseUrl = backendUrl?.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;

     
      const response = await axios.get(`${baseUrl}/api/auth/dashboard-summary`);

      if (response.data.success) {
        setDashboard(response.data);
        if (response.data.visits?.length > 0) {
          setSelectedVisitId(response.data.visits[response.data.visits.length - 1].id);
        }
      } else {
        setError(response.data.message || "Could not load dashboard data.");
      }
    } catch (err) {
      console.error("Dashboard summary fetch error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

 
  const activeConditionCard = dashboard?.activeCondition
    ? {
        specificationDetails: dashboard.activeCondition.name,
        state: dashboard.activeCondition.state,
      }
    : { specificationDetails: "No diagnosis yet", state: "—" };

  const lastVisitCard = dashboard?.lastVisit
    ? {
        specificationDetails: formatDate(dashboard.lastVisit.date),
        state: dashboard.lastVisit.clinic,
      }
    : { specificationDetails: "No visits yet", state: "—" };

  const upcomingRefillCard = dashboard?.upcomingRefill
    ? {
        specificationDetails: dashboard.upcomingRefill.medicineName,
        state: `Relief Date: ${formatDate(dashboard.upcomingRefill.reliefDate)}`,
      }
    : { specificationDetails: "No Refill", state: "No refill scheduled" };

  return (
    <div className="h-full w-full flex flex-row min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-xs">
        <NavlinkComponent
          currentDashboardRole={currentDashboardRole}
          handlePageChange={handlePageChange}
          userNavlinkItem={PatientNavlinkItems}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col p-6 gap-6 overflow-x-hidden">
        {/* Header */}
        <div className="flex justify-end">
          <UserHeaderCard headerIcon={PatientIcons.userIcon} />
        </div>

        {/* Dashboard Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          Dashboard
        </h1>

        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">
            {error}
          </div>
        )}

        {/* Feature Cards Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 pr-6">
          <DashBoardFeatureCard
            subjectName="Active Condition"
            conditionIcon={PatientIcons.heartIcon}
            specificationDetails={loading ? "Loading..." : activeConditionCard.specificationDetails}
            state={loading ? "" : activeConditionCard.state}
          />
          <DashBoardFeatureCard
            subjectName="Last Visit"
            conditionIcon={PatientIcons.doctorIcon}
            specificationDetails={loading ? "Loading..." : lastVisitCard.specificationDetails}
            state={loading ? "" : lastVisitCard.state}
          />
          <DashBoardFeatureCard
            subjectName="Upcoming Refill"
            conditionIcon={PatientIcons.pharmaIcon}
            specificationDetails={loading ? "Loading..." : upcomingRefillCard.specificationDetails}
            state={loading ? "" : upcomingRefillCard.state}
          />
        </div>

        {/* Doctor Visit History */}
        <DoctorVisitHistory
          visits={dashboard?.visits || []}
          totalVisits={dashboard?.totalVisits || 0}
          avgGapDays={dashboard?.avgGapDays}
          therapyStartDate={dashboard?.therapyStartDate}
          selectedVisitId={selectedVisitId}
          setSelectedVisitId={setSelectedVisitId}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default PatientDashboard;