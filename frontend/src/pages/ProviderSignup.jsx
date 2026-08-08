import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserSighUpHeader from "../cards/UserSighUpHeader";
import HandleUploadCard from "../cards/handleUploadCard";
import { Icons } from "../assets/assets";

const ProviderSignup = ({ role }) => {
  const navigate = useNavigate();
  const [isSlidebarOpen, setIsSlidebarOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phoneNumber: "", clinicName: "", specialization: "", shopName: "", ownerName: "", shopAddress: "" });
  const [license, setLicense] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const isDoctor = role === "doctor";
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const setFile = (file) => {
    if (!file) return;
    if (file.size > 1024 * 1024 * 1024) return toast.error("License file must be 1 GB or smaller.");
    setLicense(file);
  };
  const submit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match.");
    if (!license) return toast.error("Upload your license.");
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => key !== "confirmPassword" && data.append(key, value));
    data.append("license", license);
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/${role}-signup`, data, { withCredentials: true });
      if (!response.data.success) return toast.error(response.data.message);
      const otpResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/send-verify-otp`,
        {},
        { withCredentials: true },
      );
      if (!otpResponse.data.success) return toast.error(otpResponse.data.message || "Account created, but the OTP could not be sent.");
      toast.success(response.data.message);
      navigate("/email-verify", { replace: true });
    } catch (error) { toast.error(error.response?.data?.message || "Unable to create account."); }
    finally { setIsSubmitting(false); }
  };
  const field = (name, label, type = "text") => <label className="block my-2"><span>{label}</span><input required name={name} type={type} value={form[name]} onChange={update} className="border border-blue-100 w-full rounded-lg p-2 mt-1" /></label>;
  return <><UserSighUpHeader isSlidebarOpen={isSlidebarOpen} setIsSlidebarOpen={setIsSlidebarOpen} />
    <form onSubmit={submit} className="min-h-[80vh] flex items-center"><div className="flex flex-col gap-2 m-auto p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-primary text-sm shadow-lg"><h1 className="text-3xl font-semibold">Create {isDoctor ? "Doctor" : "Pharmacy"} account</h1><img className="w-44 mx-auto" src={isDoctor ? Icons.doctorSU : Icons.pharmacisSU} alt="" />
      {isDoctor ? <>{field("name", "Full Name")}{field("email", "Email", "email")}{field("phoneNumber", "Phone Number", "tel")}{field("clinicName", "Clinic/Hospital Name")}{field("specialization", "Specialization")}</> : <>{field("shopName", "Shop Name")}{field("ownerName", "Owner Name")}{field("email", "Email", "email")}{field("phoneNumber", "Phone Number", "tel")}{field("shopAddress", "Shop Address")}</>}
      {field("password", "Password", "password")}{field("confirmPassword", "Confirm Password", "password")}
      <HandleUploadCard valueUser={isDoctor ? "Doctor" : "Pharmacy"} uploadLicense={license} setUploadLicense={setLicense} isDragging={isDragging} fileInputRef={fileInputRef} handleDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} handleDragLeave={() => setIsDragging(false)} handleDrop={(e) => { e.preventDefault(); setIsDragging(false); setFile(e.dataTransfer.files?.[0]); }} handleFileChange={(e) => setFile(e.target.files?.[0])} />
      <button disabled={isSubmitting} className="bg-border text-white w-full py-2 rounded-md font-semibold disabled:opacity-60">{isSubmitting ? "Submitting..." : "Submit for Verification"}</button></div></form></>;
};
export default ProviderSignup;
