import React, { useContext, useState } from "react";
import UserSighUpHeader from "../cards/userSighUpHeader";
import { Icons } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

import { toast } from "react-toastify";
import axios from "axios";

const PatientSignup = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLOggedin, getUserData } = useContext(AppContext);

  const [isSlidebarOpen, setIsSlidebarOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDOB] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      axios.defaults.withCredentials = true;

      // Step 1: Register user and set HTTP-only cookie
      const { data: regData } = await axios.post(
        `${backendUrl}/api/auth/patient-signup`,
        { name, email, phoneNumber, password, dob },
      );

      if (!regData.success) {
        return toast.error(regData.message || "Registration failed");
      }

      // Step 2: Request verification OTP (cookie will automatically authenticate req.userId)
      const { data: otpData } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
      );

      if (otpData.success) {
        toast.success("Account created! OTP sent to your email.");
        navigate("/email-verify");
      } else {
        toast.error(otpData.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);
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
        <div className="flex flex-col gap-3 m-auto items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-primary text-sm shadow-lg">
          <p className="text-3xl font-semibold mb-5">Signup to MedLink</p>
          <div className="flex flex-row items-center justify-center">
            <div>
              <img
                className="w-full md:w-[300px]"
                src={Icons.patientSU}
                alt="Signup Illustration"
              />
            </div>
            <div>
              <div className="w-full my-1">
                <p>Full Name</p>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                  required
                />
              </div>
              <div className="w-full my-1">
                <p>Email</p>
                <input
                  type="email"
                  placeholder="dummy@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                  required
                />
              </div>
              <div className="w-full my-1">
                <p>Phone Number</p>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="8945069083"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                  required
                />
              </div>
              <div className="flex flex-row w-full my-1 gap-1">
                <div>
                  <p>Password</p>
                  <input
                    type="password"
                    placeholder="*********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <p>Confirm Password</p>
                  <input
                    type="password"
                    placeholder="*********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                    required
                  />
                </div>
              </div>
              <div className="w-full my-1">
                <p>Date of Birth</p>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDOB(e.target.value)}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-border text-white w-full py-2 rounded-md text-base font-semibold my-1 hover:bg-blue-500"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PatientSignup;
