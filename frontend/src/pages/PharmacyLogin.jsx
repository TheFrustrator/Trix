import React, { useState } from 'react'
import UserLoginHeader from '../cards/UserLoginHeader'
import LoginCard from '../cards/LoginCard';

const PharmacyLogin = () => {
   const [isSlidebarOpen, setIsSlidebarOpen] = useState(false);

     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const onSubmitHandler = async (event) => {
       event.preventDefault();
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
      />
    </div>
  )
}

export default PharmacyLogin