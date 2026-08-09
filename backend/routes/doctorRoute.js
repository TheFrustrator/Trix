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
} from "../controllers/doctorController.js";
import doctorAuth from "../middleware/doctorMiddleware.js";
import upload from "../controllers/multer.js";

const doctorRouter = express.Router();

// doctorRouter.post("/doctor-signup", doctorRegister);
doctorRouter.post("/doctor-signup", upload.single("uploadLicense"), doctorRegister);
doctorRouter.post("/doctor-login", doctorlogin);
doctorRouter.post("/logout", doctorlogout);
doctorRouter.post("/send-verify-otp", doctorAuth, sendVerifyOtp);
doctorRouter.post("/verify-account", doctorAuth, verifyEmail);
doctorRouter.get("/is-auth", doctorAuth, isAuthenticated);
doctorRouter.post("/send-reset-otp", sendResetOtp);
doctorRouter.post("/reset-password", resetPassword);

doctorRouter.get("/doctor-data", doctorAuth, getDoctorData);

export default doctorRouter;
