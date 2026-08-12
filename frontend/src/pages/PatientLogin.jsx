import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLoginHeader from "../cards/UserLoginHeader";
import LoginCard from "../cards/LoginCard";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const PatientLogin = () => {
  const navigate = useNavigate();
  const { backendUrl, loginSuccess } = useContext(AppContext);
  const [isSlidebarOpen, setIsSlidebarOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const { data } = await axios.post(`${baseUrl}/api/auth/patient-login`, {
        email,
        password,
      });

      if (data.success) {
        // Save token & refresh context state
        await loginSuccess(data.token);

        navigate("/patient-dashboard", { replace: true });
        toast.success(`Welcome back ${data.name || "Patient"}`);
      } else {
        toast.error(data.message || "Login failed.");
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
      <UserLoginHeader
        isSlidebarOpen={isSlidebarOpen}
        setIsSlidebarOpen={setIsSlidebarOpen}
      />
      <LoginCard
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmitHandler={onSubmitHandler}
        resetPassword="/reset-password-patient"
      />
    </div>
  );
};

export default PatientLogin;