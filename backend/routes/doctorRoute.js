import express from "express";
import {
  doctorlogin,
  doctorlogout,
  doctorRegister,
  getDoctorData,
  isAuthenticated,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
  createAccessRequest,
  cancelAccessRequest,
  checkAccessRequestStatus,
  saveDiagnosis,
  savePrescription,
  getActiveSessionDetails,
  getActivePatientSummary,
  getRecentPatients,
  getCurrentActiveSession,
} from "../controllers/doctorController.js";
import doctorAuth from "../middleware/doctorMiddleware.js";
import upload from "../controllers/multer.js";

const doctorRouter = express.Router();

doctorRouter.post(
  "/doctor-signup",
  upload.single("uploadLicense"),
  doctorRegister
);
doctorRouter.post("/doctor-login", doctorlogin);
doctorRouter.post("/logout", doctorlogout);
doctorRouter.post("/send-verify-otp", doctorAuth, sendVerifyOtp);
doctorRouter.post("/verify-account", doctorAuth, verifyEmail);
doctorRouter.get("/is-auth", doctorAuth, isAuthenticated);
doctorRouter.post("/send-reset-otp", sendResetOtp);
doctorRouter.post("/reset-password", resetPassword);

// Doctor Access Requests & Medical Records
doctorRouter.post("/request-access", doctorAuth, createAccessRequest);
doctorRouter.post("/cancel-access-request", doctorAuth, cancelAccessRequest);
doctorRouter.get("/check-request-status/:requestId", doctorAuth, checkAccessRequestStatus);
doctorRouter.get("/active-session/:patientCustomId", doctorAuth, getActiveSessionDetails);
doctorRouter.get("/patient-summary/:patientCustomId", doctorAuth, getActivePatientSummary);
doctorRouter.get("/recent-patients", doctorAuth, getRecentPatients);
doctorRouter.get("/current-active-session", doctorAuth, getCurrentActiveSession);

doctorRouter.post("/save-diagnosis", doctorAuth, upload.single("report"), saveDiagnosis);
doctorRouter.post("/save-prescription", doctorAuth, savePrescription);

doctorRouter.get("/doctor-data", doctorAuth, getDoctorData);

export default doctorRouter;