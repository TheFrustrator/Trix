import React, { useContext, useState } from "react";
import UserSighUpHeader from "../cards/userSighUpHeader";
import { Icons } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const PatientSignup = () => {
  const navigate = useNavigate();
  const { backendUrl, loginSuccess } = useContext(AppContext);

  const [isSlidebarOpen, setIsSlidebarOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDOB] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      // Step 1: Register patient user
      const { data: regData } = await axios.post(
        `${baseUrl}/api/auth/patient-signup`,
        { name, email, phoneNumber, password, dob }
      );

      if (!regData.success) {
        setLoading(false);
        return toast.error(regData.message || "Registration failed");
      }

      // Step 2: Store token locally & refresh user session
      await loginSuccess(regData.token);

      // Step 3: Request verification OTP for the new user
      const { data: otpData } = await axios.post(
        `${baseUrl}/api/auth/send-verify-otp`
      );

      if (otpData.success) {
        toast.success("Account created! OTP sent to your email.");
        navigate("/patient-email-verify");
      } else {
        toast.error(otpData.message || "Failed to send OTP.");
        navigate("/patient-email-verify");
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

  return (
    <div>
      <UserSighUpHeader
        isSlidebarOpen={isSlidebarOpen}
        setIsSlidebarOpen={setIsSlidebarOpen}
      />

      <form
        onSubmit={onSubmitHandler}
        className="min-h-[80vh] flex items-center"
      >
        <div className="flex flex-col gap-3 m-auto items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-primary text-sm shadow-lg bg-white">
          <p className="text-3xl font-semibold mb-5">Signup to MediLink</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div>
              <img
                className="w-full md:w-[280px]"
                src={Icons.patientSU}
                alt="Signup Illustration"
              />
            </div>
            <div>
              <div className="w-full my-1">
                <p className="font-semibold text-slate-700">Full Name</p>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1 focus:outline-blue-400"
                  required
                />
              </div>
              <div className="w-full my-1">
                <p className="font-semibold text-slate-700">Email</p>
                <input
                  type="email"
                  placeholder="dummy@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1 focus:outline-blue-400"
                  required
                />
              </div>
              <div className="w-full my-1">
                <p className="font-semibold text-slate-700">Phone Number</p>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="8945069083"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1 focus:outline-blue-400"
                  required
                />
              </div>
              <div className="flex flex-row w-full my-1 gap-2">
                <div className="w-1/2">
                  <p className="font-semibold text-slate-700">Password</p>
                  <input
                    type="password"
                    placeholder="*********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-blue-100 w-full rounded-lg p-2 mt-1 focus:outline-blue-400"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <p className="font-semibold text-slate-700">
                    Confirm Password
                  </p>
                  <input
                    type="password"
                    placeholder="*********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border border-blue-100 w-full rounded-lg p-2 mt-1 focus:outline-blue-400"
                    required
                  />
                </div>
              </div>
              <div className="w-full my-1">
                <p className="font-semibold text-slate-700">Date of Birth</p>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDOB(e.target.value)}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1 focus:outline-blue-400"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white w-full py-2.5 rounded-md text-base font-semibold mt-3 hover:bg-blue-600 transition-colors disabled:bg-blue-300 cursor-pointer"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PatientSignup;