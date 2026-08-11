import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icons, loginRoles } from "../assets/assets";
import UserLoginHeader from "../cards/UserLoginHeader";
import LoginCard from "../cards/LoginCard";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorLogin = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLOggedin, getDoctorData } = useContext(AppContext);
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

      const { data } = await axios.post(`${baseUrl}/api/doctor/doctor-login`, {
        email,
        password,
      });

      if (data.success) {
        // 1. Fetch doctor data into AppContext first
        await getDoctorData();

        // 2. Set logged in state
        setIsLOggedin(true);

        navigate("/doctor-dashboard", { replace: true });
        toast.success(`Welcome back ${data.name || "Doctor"}`);

        // 3. Navigate directly to doctor dashboard with replace
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
    <div className="">
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
      />
    </div>
  );
};

export default DoctorLogin;