import React, { useRef, useState } from "react";
import UserLoginHeader from "./../cards/UserLoginHeader";
import UserSighUpHeader from "../cards/userSighUpHeader";
import { Icons } from "../assets/assets";
import HandleUploadCard from "../cards/handleUploadCard";

const DoctorSignUp = () => {
  const [isSlidebarOpen, setIsSlidebarOpen] = useState();

  const [fullName, setFullName] = useState("");
 
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ClinicAdd, setClinicAdd] = useState("");
  const [Specialization, setSpecialization] = useState("");

  const [uploadLicense, setUploadLicense] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Handle Drag Events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadLicense(e.dataTransfer.files[0]);
    }
  };

  // Handle Manual File Select
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadLicense(e.target.files[0]);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
  };

  return (
    <div>
      {/* Sign Up header componenet  */}
      <UserSighUpHeader
        isSlidebarOpen={isSlidebarOpen}
        setIsSlidebarOpen={setIsSlidebarOpen}
      />

      {/* left side image and the form compone */}
      <div></div>
      <form className="min-h-[80vh] flex items-center">
        <div className="flex flex-col gap-3 m-auto items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-primary text-sm shadow-lg">
          <p className="text-3xl font-semibold mb-5">Create Doctor account</p>
          <div className="flex flex-row items-center justify-center gap-2">
            <div className="">
              <img
                className="w-full md:w-[300px]"
                src={Icons.pharmacisSU}
                alt=""
              />
            </div>
            <div>
              {" "}
              {/* full name section  */}
              <div className="w-full my-1">
                <p>Full Name</p>
                <input
                  type="text"
                  placeholder="Jhon Doe"
                  onChange={(e) => setFullName(e.target.email)}
                  value={fullName}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                />
              </div>
              
              {/* Email Section  */}
              <div className="w-full my-1">
                <p>Email</p>
                <input
                  type="email"
                  placeholder="dummy@gmail.com"
                  onChange={(e) => setEmail(e.target.email)}
                  value={email}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                />
              </div>
              {/* phone number section  */}
              <div className="w-full my-1">
                <p>Phone Number</p>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="8945069083"
                  onChange={(e) => setPhoneNumber(e.target.email)}
                  value={phoneNumber}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                />
              </div>
              {/* password section  */}
              <div className="flex flex-row w-full my-1 gap-1">
                {/* passord  */}
                <div>
                  <p>Password</p>
                  <input
                    type="password"
                    placeholder="*********"
                    onChange={(e) => setPassword(e.target.password)}
                    value={password}
                    className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                  />
                </div>
                {/* confirm password  */}
                <div>
                  <p>Confirm Password</p>
                  <input
                    type="password"
                    placeholder="*********"
                    onChange={(e) => setConfirmPassword(e.target.password)}
                    value={confirmPassword}
                    className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                  />
                </div>
              </div>
              {/* Date of birth section */}
              <div className="w-full my-1">
                <p>Clinic/Hospital Name</p>
                <input
                  type="text"
                  placeholder="N248, kolkata-7000090"
                  onChange={(e) => setClinicAdd(e.target.email)}
                  value={ClinicAdd}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                />
              </div>
              <div className="w-full my-1">
                <p>Specialization</p>
                <input
                  type="text"
                  placeholder="Dynacologist"
                  onChange={(e) => setSpecialization(e.target.email)}
                  value={Specialization}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                />
              </div>
              <div className="w-full my-1">
                <HandleUploadCard
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                  uploadLicense={uploadLicense}
                  setUploadLicense={setUploadLicense}
                  fileInputRef={fileInputRef}
                  handleDragLeave={handleDragLeave}
                  handleDragOver={handleDragOver}
                  handleDrop={handleDrop}
                  handleFileChange={handleFileChange}
                  valueUser="Doctor"
                />
              </div>
              <button className="bg-border text-white w-full py-2 rounded-md text-base font-semibold my-1">
                Submit for Verification
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DoctorSignUp;
