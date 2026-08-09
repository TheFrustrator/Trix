import React, { useEffect, useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const RequestAccessModal = ({
  isOpen,
  onClose,
  requestDetails,
  backendUrl,
}) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (!isOpen || !requestDetails?.requestId) return;

    setStatus(requestDetails.status || "pending");

    // If access is already granted, redirect instantly
    if (requestDetails.status === "granted") {
      setTimeout(() => {
        navigate(`/doctor/active-patient/${requestDetails.patientCustomId}`);
      }, 1000);
      return;
    }

    // Poll backend every 3 seconds to check if the patient approved/denied
    const interval = setInterval(async () => {
      try {
        axios.defaults.withCredentials = true;
        const baseUrl = backendUrl?.endsWith("/")
          ? backendUrl.slice(0, -1)
          : backendUrl;

        const { data } = await axios.get(
          `${baseUrl}/api/doctor/check-request-status/${requestDetails.requestId}`
        );

        if (data.success) {
          setStatus(data.status);

          if (data.status === "granted") {
            clearInterval(interval);
            toast.success("Access Granted! Redirecting...");
            setTimeout(() => {
              navigate(`/doctor/active-patient/${data.patientCustomId}`);
            }, 1200);
          } else if (data.status === "rejected") {
            clearInterval(interval);
            toast.error("Patient denied access request.");
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, requestDetails, backendUrl, navigate]);

  // Cancel pending request and notify patient room via backend socket event
  const handleCancelRequest = async () => {
    if (status === "pending" && requestDetails?.requestId) {
      try {
        axios.defaults.withCredentials = true;
        const baseUrl = backendUrl?.endsWith("/")
          ? backendUrl.slice(0, -1)
          : backendUrl;

        await axios.post(`${baseUrl}/api/doctor/cancel-access-request`, {
          requestId: requestDetails.requestId,
        });
      } catch (err) {
        console.error("Error cancelling access request:", err);
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl flex flex-col items-center gap-4 text-center border">
        {/* Animated Status Icons */}
        {status === "pending" && (
          <ImSpinner9 className="w-12 h-12 text-blue-500 animate-spin" />
        )}
        {status === "granted" && (
          <FaCheckCircle className="w-12 h-12 text-green-500 animate-bounce" />
        )}
        {status === "rejected" && (
          <FaTimesCircle className="w-12 h-12 text-red-500" />
        )}

        {/* Modal Heading */}
        <h2 className="text-xl font-bold text-gray-800">
          {status === "pending" && "Waiting for Patient Approval"}
          {status === "granted" && "Access Granted!"}
          {status === "rejected" && "Access Request Denied"}
        </h2>

        {/* Patient Details Preview */}
        <div className="bg-blue-50/60 w-full p-4 rounded-xl border border-blue-100 flex flex-col gap-1 text-sm text-gray-700">
          <p>
            <span className="font-semibold text-gray-900">Patient Name: </span>
            {requestDetails?.patientName || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Patient ID: </span>
            <span className="font-mono text-blue-600">
              {requestDetails?.patientCustomId}
            </span>
          </p>
        </div>

        {/* Subtitle Message */}
        <p className="text-xs text-gray-500">
          {status === "pending" &&
            "A notification has been sent to the patient's device. Please wait while they grant access."}
          {status === "granted" && "Redirecting to active patient file..."}
          {status === "rejected" &&
            "The patient has declined your access request."}
        </p>

        {/* Cancel / Close Action Button */}
        <button
          type="button"
          onClick={handleCancelRequest}
          className="mt-2 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          {status === "pending" ? "Cancel Request" : "Close"}
        </button>
      </div>
    </div>
  );
};

export default RequestAccessModal;