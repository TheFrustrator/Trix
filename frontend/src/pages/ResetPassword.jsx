import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendOtp = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, {
        email,
      });
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setOtpSent(true);
      toast.success("A password reset OTP has been sent to your email.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send the OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success("Password reset successfully. Please log in.");
      navigate("/patient-login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reset the password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form
        onSubmit={otpSent ? resetPassword : sendOtp}
        className="w-full max-w-md rounded-xl border bg-white p-8 shadow-lg"
      >
        <h1 className="text-2xl font-semibold text-primary">Reset password</h1>
        <p className="mt-2 text-sm text-slate-600">
          {otpSent
            ? "Enter the OTP from your email and choose a new password."
            : "Enter your account email and we will send a password reset OTP."}
        </p>

        <label className="mt-6 block text-sm font-medium" htmlFor="reset-email">Email</label>
        <input
          id="reset-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={otpSent}
          required
          className="mt-2 w-full rounded-md border p-3 disabled:bg-slate-100"
          placeholder="you@example.com"
        />

        {otpSent && (
          <>
            <label className="mt-4 block text-sm font-medium" htmlFor="reset-otp">OTP</label>
            <input
              id="reset-otp"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              className="mt-2 w-full rounded-md border p-3 text-center tracking-[0.5em]"
              placeholder="000000"
            />
            <label className="mt-4 block text-sm font-medium" htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-md border p-3"
            />
            <label className="mt-4 block text-sm font-medium" htmlFor="confirm-password">Confirm new password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-md border p-3"
            />
          </>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isSubmitting ? "Please wait..." : otpSent ? "Reset password" : "Send OTP"}
        </button>
        {otpSent && (
          <button
            type="button"
            onClick={sendOtp}
            disabled={isSubmitting}
            className="mt-4 w-full text-sm font-medium text-blue-600 disabled:opacity-60"
          >
            Resend OTP
          </button>
        )}
      </form>
    </main>
  );
};

export default ResetPassword;
