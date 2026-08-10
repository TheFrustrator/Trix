import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
  getDashboardSummary,
  getPatientPrescriptions,
  getPatientPrescriptionDetails,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/patient-signup", register);
authRouter.post("/patient-login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);

// Patient dashboard data
authRouter.get("/dashboard-summary", userAuth, getDashboardSummary);

// Patient prescription history
authRouter.get("/prescriptions", userAuth, getPatientPrescriptions);
authRouter.get("/prescription-details/:prescriptionId", userAuth, getPatientPrescriptionDetails);

export default authRouter;