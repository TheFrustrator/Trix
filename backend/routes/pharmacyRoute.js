import express from "express";

import {
  pharmacyRegister,
  pharmacyLogin,
  pharmacyLogout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
  getPharmacyData,
  getPrescriptionForDispense,
  getPrescriptionDetails,
  dispensePrescription,
  getPharmacyDispenseHistory,
} from "../controllers/pharmacyController.js";

import pharmacyAuth from "../middleware/pharmacyMiddleware.js";
import upload from "../controllers/multer.js";


const pharmacyRouter = express.Router();

pharmacyRouter.post(
  "/pharmacy-signup",
  upload.single("uploadLicense"),
  pharmacyRegister,
);
pharmacyRouter.post("/pharmacy-login", pharmacyLogin);
pharmacyRouter.post("/logout", pharmacyLogout);
pharmacyRouter.post("/send-verify-otp", pharmacyAuth, sendVerifyOtp);
pharmacyRouter.post("/verify-account", pharmacyAuth, verifyEmail);
pharmacyRouter.get("/is-auth", pharmacyAuth, isAuthenticated);
pharmacyRouter.post("/send-reset-otp", sendResetOtp);
pharmacyRouter.post("/reset-password", resetPassword);
pharmacyRouter.get("/pharmacy-data", pharmacyAuth, getPharmacyData);
pharmacyRouter.get(
  "/prescription/patient/:patientId",
  pharmacyAuth,
  getPrescriptionForDispense,
);
pharmacyRouter.get(
  "/prescription/:prescriptionId",
  pharmacyAuth,
  getPrescriptionDetails,
);
pharmacyRouter.post("/dispense", pharmacyAuth, dispensePrescription);
pharmacyRouter.get(
  "/dispense-history",
  pharmacyAuth,
  getPharmacyDispenseHistory,
);

export default pharmacyRouter;
