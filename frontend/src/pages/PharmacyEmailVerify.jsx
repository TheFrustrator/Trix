import React, { useContext, useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import axios from "axios";

import { AppContext } from "../context/AppContext";

const PharmacyEmailVerify = () => {
  const navigate = useNavigate();

  const { backendUrl, isLoggedin, pharmacyData, getPharmacyData } =
    useContext(AppContext);

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  const [timer, setTimer] = useState(60);

  const inputRefs = useRef([]);

  axios.defaults.withCredentials = true;


  useEffect(() => {
    if (isLoggedin && pharmacyData && pharmacyData.isVerified) {
      navigate("/pharmacy-dashboard", {
        replace: true,
      });
    }
  }, [isLoggedin, pharmacyData, navigate]);

  useEffect(() => {
    let interval = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer]);



  const handleInputChange = (e, index) => {
    const value = e.target.value;

    e.target.value = value.replace(/\D/g, "");

    if (e.target.value.length > 0 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };


  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
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

      inputRefs.current[5]?.focus();
    } else {
      toast.error("Please paste a valid 6-digit numeric OTP.");
    }
  };


  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const otpArray = inputRefs.current.map((el) => el?.value || "");

      const otp = otpArray.join("");

      if (otp.length !== 6) {
        return toast.error("Please enter the complete 6-digit OTP code.");
      }

      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/pharmacy/verify-account`,
        {
          otp,
        },
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        toast.success(data.message || "Email verified successfully!");

        const success = await getPharmacyData();

        if (success) {
          navigate("/pharmacy-dashboard", {
            replace: true,
          });
        } else {
          navigate("/pharmacy-login", {
            replace: true,
          });
        }
      } else {
        toast.error(data.message || "Verification failed.");
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


  const handleResendOtp = async () => {
    if (timer > 0) {
      return;
    }

    try {
      setResending(true);

      const { data } = await axios.post(
        `${backendUrl}/api/pharmacy/send-verify-otp`,
        {},
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        toast.success(data.message || "New OTP sent to your email.");

        setTimer(60);
      } else {
        toast.error(data.message || "Unable to send OTP.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not resend OTP.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg border border-blue-100 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-2">Pharmacy Email Verification</h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the 6-digit verification code sent to your registered pharmacy
          email address.
        </p>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the code?
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={timer > 0 || resending}
              className={`font-semibold ml-1 ${
                timer > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:underline"
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

export default PharmacyEmailVerify;
