import React, { useContext, useState } from "react";
import UserLoginHeader from "../cards/UserLoginHeader";
import LoginCard from "../cards/LoginCard";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PharmacyLogin = () => {
  const [isSlidebarOpen, setIsSlidebarOpen] = useState(false);
  const { backendUrl, pharmacyLoginSuccess } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const { data } = await axios.post(
        `${baseUrl}/api/pharmacy/pharmacy-login`,
        { email, password }
      );

      if (data.success) {
        // Save token & refresh pharmacy context state
        await pharmacyLoginSuccess(data.token);

        toast.success(`Welcome back ${data.name || "Pharmacy"}`);
        navigate("/pharmacy-dashboard", { replace: true });
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
      />
    </div>
  );
};

export default PharmacyLogin;