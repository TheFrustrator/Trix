import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLoginHeader from "../cards/UserLoginHeader";
import LoginCard from "../cards/LoginCard";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const PatientLogin = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLOggedin, getUserData } = useContext(AppContext);
  const [isSlidebarOpen, setIsSlidebarOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/patient-login",
        { email, password },
      );

      if (data.success) {
        setIsLOggedin(true);
        getUserData();
        navigate("/patient-dashboard");
        toast.success(`Welcome back ${data.name}`);
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

export default PatientLogin;
