import React, { useContext, useRef, useState } from "react";
import UserSighUpHeader from "../cards/userSighUpHeader";
import { Icons } from "../assets/assets";
import HandleUploadCard from "../cards/handleUploadCard";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const PharmacySignUp = () => {
  const [isSlidebarOpen, setIsSlidebarOpen] = useState(false);
  const { backendUrl, pharmacyLoginSuccess } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shopAdd, setShopAdd] = useState("");

  const [uploadLicense, setUploadLicense] = useState(null); // Stores raw File object
  const [licenseFileName, setLicenseFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processSelectedFile = (file) => {
    if (!file) return;
    setUploadLicense(file);
    setLicenseFileName(file.name);
  };

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
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    if (!uploadLicense) {
      return toast.error("Please upload a medical license!");
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      // Prepare Multipart Form Data for Multer
      const formData = new FormData();
      formData.append("shopName", shopName);
      formData.append("ownerName", ownerName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phoneNumber", phoneNumber);
      formData.append("shopAdd", shopAdd);
      formData.append("uploadLicense", uploadLicense);

      // Step 1: Register pharmacy
      const { data: regData } = await axios.post(
        `${baseUrl}/api/pharmacy/pharmacy-signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!regData.success) {
        setLoading(false);
        return toast.error(regData.message || "Registration failed");
      }

      // Step 2: Store token locally & refresh pharmacy session
      await pharmacyLoginSuccess(regData.token);

      // Step 3: Request verification OTP
      const { data: otpData } = await axios.post(
        `${baseUrl}/api/pharmacy/send-verify-otp`
      );

      if (otpData.success) {
        toast.success("Account created! OTP sent to your email.");
        navigate("/pharmacy-email-verify");
      } else {
        toast.error(otpData.message || "Failed to send OTP.");
        navigate("/pharmacy-email-verify");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
        <div className="flex flex-col gap-3 m-auto items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-primary text-sm shadow-lg bg-white">
          <p className="text-3xl font-semibold mb-5">Create Pharmacy account</p>
          <div className="flex flex-row items-center justify-center gap-2">
            <div>
              <img
                className="w-full md:w-[300px]"
                src={Icons.pharmacisSU}
                alt="Pharmacy Signup"
              />
            </div>
            <div>
              <div className="w-full my-1">
                <p>Shop Name</p>
                <input
                  type="text"
                  placeholder="BJT Pharma"
                  onChange={(e) => setShopName(e.target.value)}
                  value={shopName}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                  required
                />
              </div>
              <div className="w-full my-1">
                <p>Owner Name</p>
                <input
                  type="text"
                  placeholder="BJT Pharma"
                  onChange={(e) => setOwnerName(e.target.value)}
                  value={ownerName}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                  required
                />
              </div>
              <div className="w-full my-1">
                <p>Email</p>
                <input
                  type="email"
                  placeholder="dummy@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
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
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  value={phoneNumber}
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
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <p>Confirm Password</p>
                  <input
                    type="password"
                    placeholder="*********"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                    required
                  />
                </div>
              </div>
              <div className="w-full my-1">
                <p>Shop Address</p>
                <input
                  type="text"
                  placeholder="N248, kolkata-7000090"
                  onChange={(e) => setShopAdd(e.target.value)}
                  value={shopAdd}
                  className="border border-blue-100 w-full rounded-lg p-2 mt-1"
                  required
                />
              </div>
              <div className="w-full my-1">
                <HandleUploadCard
                  uploadLicense={uploadLicense}
                  setUploadLicense={setUploadLicense}
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                  fileInputRef={fileInputRef}
                  handleDragLeave={handleDragLeave}
                  handleDragOver={handleDragOver}
                  handleDrop={handleDrop}
                  handleFileChange={handleFileChange}
                  valueUser="Pharmacy"
                  fileName={licenseFileName}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white w-full py-2.5 rounded-md text-base font-semibold mt-3 hover:bg-blue-600 transition-colors disabled:bg-blue-300 cursor-pointer"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PharmacySignUp;