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


// ============================================================
// AUTH
// ============================================================

pharmacyRouter.post(
  "/pharmacy-signup",
  upload.single("uploadLicense"),
  pharmacyRegister
);

pharmacyRouter.post(
  "/pharmacy-login",
  pharmacyLogin
);

pharmacyRouter.post(
  "/logout",
  pharmacyLogout
);

pharmacyRouter.post(
  "/send-verify-otp",
  pharmacyAuth,
  sendVerifyOtp
);

pharmacyRouter.post(
  "/verify-account",
  pharmacyAuth,
  verifyEmail
);

pharmacyRouter.get(
  "/is-auth",
  pharmacyAuth,
  isAuthenticated
);

pharmacyRouter.post(
  "/send-reset-otp",
  sendResetOtp
);

pharmacyRouter.post(
  "/reset-password",
  resetPassword
);


// ============================================================
// PROFILE
// ============================================================

pharmacyRouter.get(
  "/pharmacy-data",
  pharmacyAuth,
  getPharmacyData
);


// ============================================================
// PRESCRIPTION
// ============================================================

/*
 * STEP 1
 *
 * Pharmacist enters Patient Custom ID.
 *
 * Example:
 *
 * GET
 * /api/pharmacy/prescription/patient/P-4041-XYZ
 *
 * This finds the latest prescription.
 */
pharmacyRouter.get(
  "/prescription/patient/:patientId",
  pharmacyAuth,
  getPrescriptionForDispense
);


/*
 * STEP 2
 *
 * PDF page gets the MongoDB prescription _id.
 *
 * Example:
 *
 * GET
 * /api/pharmacy/prescription/66a123...
 *
 * This returns the complete prescription.
 */
pharmacyRouter.get(
  "/prescription/:prescriptionId",
  pharmacyAuth,
  getPrescriptionDetails
);


// ============================================================
// DISPENSE
// ============================================================

pharmacyRouter.post(
  "/dispense",
  pharmacyAuth,
  dispensePrescription
);


// ============================================================
// HISTORY
// ============================================================

pharmacyRouter.get(
  "/dispense-history",
  pharmacyAuth,
  getPharmacyDispenseHistory
);

export default pharmacyRouter;