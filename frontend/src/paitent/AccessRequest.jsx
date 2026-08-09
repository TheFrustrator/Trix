import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PatientIcons, PatientNavlinkItems } from "../assets/patientAssests";
import NavlinkComponent from "../component/NavlinkComponent";
import UserHeaderCard from "../cards/UserHeaderCard";
import PendingRequestCard from "../cards/PendingRequestCard";
import ActiveSessionCard from "../cards/ActiveSessionCard";
import { AppContext } from "../context/AppContext";
import { socket } from "../utils/socket";
import axios from "axios";
import { toast } from "react-toastify";

function MedicalHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, userData } = useContext(AppContext);

  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDashboardRole =
    PatientNavlinkItems.find((r) => r.route === location.pathname) ||
    PatientNavlinkItems[0];

  const handlePageChange = (item) => {
    if (item.route && item.route !== location.pathname) {
      navigate(item.route);
    }
  };

  // Fetch initial request list
  const fetchAccessRequests = useCallback(async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(
        `${backendUrl}/api/patient/access-requests`
      );

      if (data.success) {
        const pending = data.requests.filter((r) => r.status === "pending");
        const active = data.requests.filter(
          (r) => r.status === "granted" && new Date(r.expiresAt) > new Date()
        );

        setPendingRequests(pending);
        setActiveSessions(active);
      }
    } catch (error) {
      console.error("Error fetching access requests:", error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchAccessRequests();
  }, [fetchAccessRequests]);

  // Realtime Socket Listening
  useEffect(() => {
    if (!userData?.patientId) return;

    // Connect socket and join user room
    socket.connect();
    socket.emit("join-patient-room", userData.patientId);

    // Listen for incoming realtime access requests from doctors
    socket.on("new-access-request", (newReq) => {
      toast.info(`New access request from ${newReq.doctorId?.name || "a Doctor"}`);

      // Add incoming request to pending list in real time
      setPendingRequests((prev) => [newReq, ...prev]);
    });

    return () => {
      socket.off("new-access-request");
      socket.disconnect();
    };
  }, [userData?.patientId]);

  // Action Handler for Accept, Deny, and Revoke
  const handleStatusUpdate = async (requestId, action) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/patient/update-request-status`,
        { requestId, action }
      );

      if (data.success) {
        toast.success(data.message);
        fetchAccessRequests(); // Refresh lists after action
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="h-full w-full flex flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-white shadow-xs">
        <NavlinkComponent
          currentDashboardRole={currentDashboardRole}
          handlePageChange={handlePageChange}
          userNavlinkItem={PatientNavlinkItems}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col p-6 gap-6 overflow-x-hidden">
        {/* Header */}
        <div className="w-full flex justify-end">
          <UserHeaderCard headerIcon={PatientIcons.userIcon} />
        </div>

        <h1 className="font-bold lg:text-3xl sm:text-xl text-primary">
          Access Requests
        </h1>

        {loading ? (
          <div className="py-10 text-center text-gray-500 font-medium">
            Loading requests...
          </div>
        ) : (
          <>
            {/* Pending Requests Section */}
            {pendingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center border rounded-lg shadow-sm p-6 bg-white mx-1">
                <h1 className="font-semibold text-green-500 text-xl mt-2">
                  You don't have any access requests.
                </h1>
                <h1 className="font-thin text-gray-500 text-sm mb-2">
                  Visit nearest clinic to activate access
                </h1>
              </div>
            ) : (
              <div className="flex flex-col border rounded-xl shadow-md p-4 bg-white mx-1">
                <h1 className="text-base font-semibold text-primary mb-2">
                  Pending Requests
                </h1>
                <div className="flex flex-col gap-2">
                  {pendingRequests.map((item) => (
                    <PendingRequestCard
                      key={item._id}
                      doctorName={item.doctorId?.name || "Dr. Unknown"}
                      clinicAdd={item.doctorId?.clinicAdd || "Clinic Unavailable"}
                      requestTime={new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      onAcceptHandler={() => handleStatusUpdate(item._id, "accept")}
                      onDenyHandler={() => handleStatusUpdate(item._id, "deny")}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Active Sessions Section */}
            {activeSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center border rounded-lg shadow-sm p-6 bg-white mx-1">
                <h1 className="font-semibold text-green-500 text-xl mt-2">
                  You don't have any active sessions.
                </h1>
                <h1 className="font-thin text-gray-500 text-sm mb-2">
                  Visit nearest clinic to activate
                </h1>
              </div>
            ) : (
              <div className="flex flex-col border rounded-xl shadow-md p-4 bg-white mx-1">
                <div className="flex flex-row py-1 justify-between items-center mb-2">
                  <h1 className="text-base font-semibold text-primary">
                    Active Sessions
                  </h1>
                  <span className="text-xs rounded-full bg-green-500/20 px-3 py-1 flex items-center">
                    <h1 className="text-green-800 font-semibold">Active</h1>
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {activeSessions.map((session) => (
                    <ActiveSessionCard
                      key={session._id}
                      doctorName={session.doctorId?.name || "Dr. Unknown"}
                      clinicAdd={session.doctorId?.clinicAdd || "Clinic Unavailable"}
                      expiresAt={session.expiresAt}
                      onRevokeHandler={() => handleStatusUpdate(session._id, "revoke")}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MedicalHistory;