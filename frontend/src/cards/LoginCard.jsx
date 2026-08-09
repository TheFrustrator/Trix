import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginCard = ({email,password,setEmail,setPassword, onSubmitHandler}) => {

  const navigate = useNavigate()
 
  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-primary text-sm shadow-lg">
        <p className="text-3xl font-semibold mb-5">Login to MedLink</p>
        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            placeholder="dummy@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-blue-100 w-full rounded-lg p-2 mt-1"
          />
        </div>
        <div className="w-full gap-2">
          <p>Password</p>
          <input
            type="password"
            placeholder="*********"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-blue-100 w-full rounded-lg p-2 mt-1"
          />
          <span onClick={() => navigate('/reset-password')} className="text-black hover:underline cursor-pointer text-xs">Forget Password</span>
        </div>
        <button className="bg-border text-white w-full py-2 rounded-md text-base">
          Login
        </button>
        
      </div>
      
    </form>
  );
};

export default LoginCard;
