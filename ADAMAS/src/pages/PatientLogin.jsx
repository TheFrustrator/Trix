import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icons, loginRoles, userRoles } from "../assets/assets";
import UserLoginHeader from "../cards/UserLoginHeader";
import LoginCard from "../cards/LoginCard";

const PatientLogin = () => {
  const [isSlidebarOpen, setIsSlidebarOpen] = useState(false);

   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmitHandler = async (event) => {
    event.preventDefault();
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
      />
    </div>
  );
};

export default PatientLogin;
