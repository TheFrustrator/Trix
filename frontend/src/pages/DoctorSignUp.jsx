import React, { useRef, useState } from "react";
import UserLoginHeader from "./../cards/UserLoginHeader";
import UserSighUpHeader from "../cards/userSighUpHeader";
import { Icons } from "../assets/assets";
import HandleUploadCard from "../cards/handleUploadCard";
import { toast } from "react-toastify";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const DoctorSignUp = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLOggedin, getDoctorData } = useContext(AppContext);
  const [isSlidebarOpen, setIsSlidebarOpen] = useState();

  const [name, setName] = useState("");

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

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      axios.defaults.withCredentials = true;

      // Step 1: Register user and set HTTP-only cookie
      const { data: regData } = await axios.post(
        `${backendUrl}/api/auth/doctor-signup`,
        {
          name,
          email,
          phoneNumber,
          password,
          ClinicAdd,
          Specialization,
          uploadLicense,
        },
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
      {/* Sign Up header componenet  */}
      <UserSighUpHeader
        isSlidebarOpen={isSlidebarOpen}
        setIsSlidebarOpen={setIsSlidebarOpen}
      />

      {/* left side image and the form compone */}

      <form
        onSubmit={onSubmitHandler}
        className="min-h-[80vh] flex items-center"
      >
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
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                />
              </div>
              {/* Email Section  */}
              <div className="w-full my-1">
                <p>Email</p>
                <input
                  type="email"
                  placeholder="dummy@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                  />
                </div>
                {/* confirm password  */}
                <div>
                  <p>Confirm Password</p>
                  <input
                    type="password"
                    placeholder="*********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  value={ClinicAdd}
                  onChange={(e) => setClinicAdd(e.target.value)}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                />
              </div>
              <div className="w-full my-1">
                <p>Specialization</p>
                <input
                  type="text"
                  placeholder="Dynacologist"
                  value={Specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
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
