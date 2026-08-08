import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { patientDetails } from "../patient/details";
import { doctorDetails } from "../doctor/details";
import { pharmacyDetails } from "../pharmacy/details";

const EmailVerify = () => {
  const { backendUrl, getUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const verifyOtp = async (event) => {
    event.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP sent to your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp },
        { withCredentials: true },
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      await getUserData();
      toast.success("Email verified successfully.");
      const { data: userResponse } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
      const dashboardRoutes = {
        patient: patientDetails.dashboardRoute,
        doctor: doctorDetails.dashboardRoute,
        pharmacy: pharmacyDetails.dashboardRoute,
      };
      navigate(dashboardRoutes[userResponse.userData?.role] || "/patient-dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to verify the OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    setIsResending(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {},
        { withCredentials: true },
      );
      data.success
        ? toast.success("A new OTP has been sent to your email.")
        : toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to resend the OTP.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <form
        onSubmit={verifyOtp}
        className="w-full max-w-md rounded-xl border bg-white p-8 shadow-lg"
      >
        <h1 className="text-2xl font-semibold text-primary">Verify your email</h1>
        <p className="mt-2 text-sm text-slate-600">
          We sent a 6-digit verification code to your email address.
        </p>
        <label className="block mt-6 text-sm font-medium text-slate-700" htmlFor="otp">
          Verification code
        </label>
        <input
          id="otp"
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          className="mt-2 w-full rounded-md border p-3 text-center text-xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="000000"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-md bg-border py-3 font-semibold text-white hover:bg-blue-600 disabled:opacity-60"
        >
          {isSubmitting ? "Verifying..." : "Verify email"}
        </button>
        <button
          type="button"
          onClick={resendOtp}
          disabled={isResending}
          className="mt-4 w-full text-sm font-medium text-blue-600 disabled:opacity-60"
        >
          {isResending ? "Sending..." : "Resend OTP"}
        </button>
      </form>
    </main>
  );
};

export default EmailVerify;
