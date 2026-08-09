import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  accessRequestData,
  activeSessionData,
  PatientIcons,
  PatientNavlinkItems,
} from "../assets/patientAssests";
import NavlinkComponent from "../component/NavlinkComponent";
import UserHeaderCard from "../cards/UserHeaderCard";
import PendingRequestCard from "../cards/PendingRequestCard";
import ActiveSessionCard from "../cards/ActiveSessionCard";

function MedicalHistory() {
  const navigate = useNavigate();
  const location = useLocation();

  // Find the active role based on the current URL pathname
  const currentDashboardRole =
    PatientNavlinkItems.find((r) => r.route === location.pathname) ||
    PatientNavlinkItems[0]; // Fallback to first role if path doesn't match

  const handlePageChange = (PatientNavlinkItems) => {
    if (
      PatientNavlinkItems.route &&
      PatientNavlinkItems.route !== location.pathname
    ) {
      navigate(PatientNavlinkItems.route);
    }
  };

  const onAcceptHandler = () => {
    {
    }
  };
  const onDenyHandler = () => {
    {
    }
  };
  return (
    <div className="h-full w-full flex flex-row min-h-screen">
      <div className="w-64 flex-shrink-0 bg-white shadow-xs">
        <NavlinkComponent
          currentDashboardRole={currentDashboardRole}
          handlePageChange={handlePageChange}
          userNavlinkItem={PatientNavlinkItems}
        />
      </div>
      <div className="flex-1 w-full flex flex-col p-6 gap-6 overflow-x-hidden">
        {/* Header component  */}
        <div className="w-full flex justify-end">
          <UserHeaderCard headerIcon={PatientIcons.userIcon} />
        </div>

        <h1 className="font-bold lg:text-3xl sm:text-xl text-primary">
          Access Requests
        </h1>

        {/* The main components of access request */}
        <>
          {accessRequestData.length === 0 ? (
            <div className="flex flex-col items-center justify-center border rounded-lg shadow-xl mx-2 my-2">
              <h1 className="font-semibold text-green-500 text-xl mt-2">
                You don't have a access requests.
              </h1>

              <h1 className="font-thin text-gray-500 text-sm mb-2">
                Visit Nearest clinic to activate{" "}
              </h1>
            </div>
          ) : (
            <div className="flex flex-col border rounded-md shadow-md mx-1">
              <h1 className="text-sm font-semibold text-primary mx-2 mt-1">
                Pending Requests
              </h1>
              <div className="flex flex-col my-2">
                {accessRequestData.map((item) => (
                  <div key={item.key}>
                    <PendingRequestCard
                      doctorName={item.name}
                      clinicAdd={item.clinName}
                      requestTime={item.requestTime}
                      onAcceptHandler={onAcceptHandler}
                      onDenyHandler={onDenyHandler}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>

        <>
          {activeSessionData.length === 0 ? (
            <div className="flex flex-col items-center justify-center border rounded-lg shadow-xl mx-2 my-2">
              <h1 className="font-semibold text-green-500 text-xl mt-2">
                You don't have any active session.
              </h1>

              <h1 className="font-thin text-gray-500 text-sm mb-2">
                Visit Nearest clinic to activate{" "}
              </h1>
            </div>
          ) : (
            <div className="flex flex-col border rounded-md shadow-md mx-1">
              <div className="flex flex-row py-2 pr-2 justify-between">
                <h1 className="text-lg font-semibold text-primary mx-3 mt-1 mb-0">
                  Active Sessions
                </h1>
                <span className="text-xs rounded-full bg-green-500/40 flex items-center">
                  <h1 className="mx-2 my-1 text-green-800 font-semibold">
                    Active
                  </h1>
                </span>
              </div>

              <div className="flex flex-col my-0">
                {activeSessionData.map((role) => (
                  <div key={role.key}>
                    <ActiveSessionCard
                      doctorName={role.sessionDoctor}
                      clinicAdd={role.clinicAdd}
                      timeOutTime={role.timeRemaining}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
}

export default MedicalHistory;
