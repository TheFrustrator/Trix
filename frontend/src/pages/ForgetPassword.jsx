import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);
  axios.defaults.withCredentials = true;

  // Handle individual digit entries in the 6-digit OTP fields
  const handleInputChange = (e, index) => {
    if (e.target.value.length > 0 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

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
      toast.error("Please paste a valid 6-digit OTP.");
    }
  };

  // Step 1: Submit Email to receive OTP
  const onSubmitEmailHandler = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");

    try {
      setLoading(true);
      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const { data } = await axios.post(`${baseUrl}/api/auth/send-reset-otp`, {
        email,
      });

      if (data.success) {
        toast.success(data.message);
        setIsEmailSubmitted(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to send OTP.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP and New Password
  const onSubmitResetHandler = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    const otp = inputRefs.current.map((input) => input.value).join("");
    if (otp.length !== 6) {
      return toast.error("Please enter the complete 6-digit OTP.");
    }

    try {
      setLoading(true);
      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const { data } = await axios.post(`${baseUrl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });

      if (data.success) {
        toast.success("Password reset successfully! Please login.");
        navigate("/patient-login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {!isEmailSubmitted ? (
        /* Form Stage 1: Send Reset OTP */
        <form
          onSubmit={onSubmitEmailHandler}
          className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg border border-blue-100 w-full max-w-md text-primary"
        >
          <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your registered email address to receive a password reset
            code.
          </p>

          <div className="w-full mb-4">
            <p className="text-sm font-medium mb-1">Email Address</p>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-blue-200 w-full rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-border text-white py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? "Sending Code..." : "Send Reset Code"}
          </button>
        </form>
      ) : (
        /* Form Stage 2: Verify OTP & New Password */
        <form
          onSubmit={onSubmitResetHandler}
          className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg border border-blue-100 w-full max-w-md text-primary"
        >
          <h1 className="text-2xl font-bold mb-2">New Password</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter the 6-digit OTP sent to{" "}
            <span className="font-semibold">{email}</span> and set a new
            password.
          </p>

          {/* OTP Box Inputs */}
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
                  className="w-12 h-12 text-center text-xl font-semibold border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              ))}
          </div>

          {/* New Password Inputs */}
          <div className="w-full mb-3">
            <p className="text-sm font-medium mb-1">New Password</p>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-blue-200 w-full rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="w-full mb-6">
            <p className="text-sm font-medium mb-1">Confirm New Password</p>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-blue-200 w-full rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-border text-white py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgetPassword;
