import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60); // Resend cooldown timer in seconds
  const inputRefs = useRef([]);

  // Ensure default axios settings send cookies
  axios.defaults.withCredentials = true;

  // Protect route & handle auto-redirection
  useEffect(() => {
    if (isLoggedin && userData && userData.isVerified) {
      navigate("/patient-dashboard");
    }
  }, [isLoggedin, userData, navigate]);

  // Resend OTP countdown timer logic
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Individual digit input handler with auto-advance
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length > 0 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Keyboard navigation for Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle full OTP paste action across all inputs
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      pasteData.split("").forEach((char, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = char;
        }
      });
      inputRefs.current[5].focus();
    } else {
      toast.error("Please paste a valid 6-digit numeric OTP.");
    }
  };

  // Submit OTP handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");

      if (otp.length !== 6) {
        return toast.error("Please enter the complete 6-digit OTP code.");
      }

      setLoading(true);

      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const { data } = await axios.post(`${baseUrl}/api/doctor/verify-account`, {
        otp,
      });

      if (data.success) {
        toast.success(data.message || "Email verified successfully!");
        await getUserData(); // Refresh global Context state
        navigate("/doctor-dashboard");
      } else {
        toast.error(data.message || "Verification failed.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Trigger resend OTP action
  const handleResendOtp = async () => {
    if (timer > 0) return;

    try {
      setResending(true);
      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const { data } = await axios.post(`${baseUrl}/api/doctor/send-verify-otp`);

      if (data.success) {
        toast.success(data.message || "New OTP sent to your email.");
        setTimer(60); // Reset 60-second cooldown timer
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Could not resend OTP. Please try again later.";

      toast.error(errorMessage);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg border border-blue-100 w-full max-w-md text-primary"
      >
        <h1 className="text-2xl font-bold mb-2">Email Verification</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the 6-digit verification code sent to your registered email address.
        </p>

        {/* 6-Digit OTP Box Inputs */}
        <div
          className="flex justify-between gap-2 mb-6 w-full max-w-xs"
          onPaste={handlePaste}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                required
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-xl font-semibold border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
              />
            ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-border text-white py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        {/* Resend OTP Section */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={timer > 0 || resending}
              className={`font-semibold ml-1 ${
                timer > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:underline cursor-pointer"
              }`}
            >
              {resending
                ? "Sending..."
                : timer > 0
                ? `Resend in ${timer}s`
                : "Resend OTP"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default EmailVerify;