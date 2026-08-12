import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import prescriptionPdfModel from "../models/prescriptionPdfModel.js";
import userModel from "../models/userModel.js";
import pharmacyModel from "../models/pharmacyModel.js";
import doctorModel from "../models/doctorModel.js";
import transporter from "../config/nodemailer.js";

// Helper function to safely find pharmacy by Mongo ObjectId OR custom pharmacyId string
const findPharmacyById = async (id) => {
  if (!id) return null;

  const conditions = [{ pharmacyId: id }];

  if (mongoose.Types.ObjectId.isValid(id)) {
    conditions.push({ _id: id });
  }

  return await pharmacyModel.findOne({ $or: conditions });
};

// PHARMACY SIGNIN / REGISTER
export const pharmacyRegister = async (req, res) => {
  const { shopName, ownerName, email, password, phoneNumber, shopAdd } =
    req.body;

  if (
    !shopName ||
    !ownerName ||
    !email ||
    !password ||
    !phoneNumber ||
    !shopAdd
  ) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }

  // Handle license upload safely for memoryStorage (Base64) or diskStorage (path)
  let uploadLicense = null;
  if (req.file) {
    if (req.file.buffer) {
      uploadLicense = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    } else {
      uploadLicense = req.file.path || req.file.filename || null;
    }
  }

  try {
    const existingPharmacy = await pharmacyModel.findOne({ email });

    if (existingPharmacy) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const safeName = (shopName || "PHARM")
      .replace(/\s+/g, "")
      .slice(0, 3)
      .toUpperCase();

    const safePhone = (phoneNumber || "0000").slice(-4);
    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
    const generatedPharmacyID = `${safeName}${safePhone}${randomDigits}PHM`;

    const pharmacy = new pharmacyModel({
      shopName,
      ownerName,
      email,
      password: hashedPassword,
      phoneNumber,
      shopAdd,
      uploadLicense,
      pharmacyId: generatedPharmacyID,
    });

    await pharmacy.save();

    const token = jwt.sign(
      { id: pharmacy._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Medilink",
      text: `Welcome to Medilink. Your Pharmacy account has been created with email id: ${email}`,
    });

    return res.json({
      success: true,
      token,
      pharmacyId: pharmacy._id,
      message: "Pharmacy registered successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// PHARMACY LOGIN
export const pharmacyLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const pharmacy = await pharmacyModel.findOne({ email });

    if (!pharmacy) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!pharmacy.isVerified) {
      return res.json({
        success: false,
        message: "Pharmacy is not verified",
      });
    }

    const isMatch = await bcrypt.compare(password, pharmacy.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: pharmacy._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      token,
      pharmacyId: pharmacy._id,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// PHARMACY LOGOUT
export const pharmacyLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// SEND OTP TO REGISTERED EMAIL
export const sendVerifyOtp = async (req, res) => {
  try {
    const pharmacyId = req.pharmacyId || req.userId || req.body?.pharmacyId;

    if (!pharmacyId) {
      return res.status(401).json({
        success: false,
        message: "User ID is required",
      });
    }

    const pharmacy = await findPharmacyById(pharmacyId);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy account not found",
      });
    }

    if (pharmacy.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    pharmacy.verifyOTP = otp;
    pharmacy.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await pharmacy.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: pharmacy.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this code. Never share your OTP with anyone.`,
    });

    return res.json({
      success: true,
      message: "Verification OTP sent to email",
    });
  } catch (error) {
    console.error("sendVerifyOtp error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// VERIFY EMAIL VIA OTP
export const verifyEmail = async (req, res) => {
  const pharmacyId = req.pharmacyId || req.userId || req.body?.pharmacyId;
  const { otp } = req.body;

  if (!pharmacyId || !otp) {
    return res.status(400).json({
      success: false,
      message: "Missing Details",
    });
  }

  try {
    const pharmacy = await findPharmacyById(pharmacyId);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy account not found",
      });
    }

    if (!pharmacy.verifyOTP || pharmacy.verifyOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (pharmacy.verifyOTPExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    pharmacy.isVerified = true;
    pharmacy.verifyOTP = "";
    pharmacy.verifyOTPExpireAt = 0;

    await pharmacy.save();

    return res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// FETCH PHARMACY DATA FOR APPCONTEXT
export const getPharmacyData = async (req, res) => {
  try {
    const pharmacyId = req.pharmacyId || req.userId || req.body?.pharmacyId;

    if (!pharmacyId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const pharmacy = await findPharmacyById(pharmacyId);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy account not found",
      });
    }

    return res.json({
      success: true,
      userData: {
        shopName: pharmacy.shopName,
        ownerName: pharmacy.ownerName,
        isVerified: pharmacy.isVerified,
        pharmacyId: pharmacy.pharmacyId,
        phoneNumber: pharmacy.phoneNumber,
        email: pharmacy.email,
        shopAdd: pharmacy.shopAdd,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CHECK AUTHENTICATION FOR SECURE ROUTES
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({
      success: true,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// SEND OTP FOR RESET PASSWORD
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const pharmacy = await pharmacyModel.findOne({ email });

    if (!pharmacy) {
      return res.json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    pharmacy.resetOTP = hashedOtp;
    pharmacy.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await pharmacy.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: pharmacy.email,
      subject: "Password Reset OTP",
      text: `Your reset password OTP is ${rawOtp}. Use this code to reset your password. It will expire in 15 minutes.`,
    });

    return res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP, and New Password are required",
    });
  }

  try {
    const pharmacy = await pharmacyModel.findOne({ email });

    if (!pharmacy) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (!pharmacy.resetOTP || pharmacy.resetOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP has expired or is invalid",
      });
    }

    const isMatch = await bcrypt.compare(otp, pharmacy.resetOTP);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }

    pharmacy.password = await bcrypt.hash(newPassword, 10);
    pharmacy.resetOTP = "";
    pharmacy.resetOtpExpireAt = 0;

    await pharmacy.save();

    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// GET PRESCRIPTION FOR DISPENSING
export const getPrescriptionForDispense = async (req, res) => {
  try {
    const pharmacyId = req.pharmacyId;

    if (!pharmacyId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login again.",
      });
    }

    const { patientId } = req.params;

    if (!patientId || typeof patientId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required.",
      });
    }

    const cleanPatientId = patientId.trim();

    const latestPrescription = await prescriptionPdfModel
      .findOne({
        patientCustomId: cleanPatientId,
      })
      .populate("doctorId", "name clinicAdd Specialization phoneNumber regNo")
      .populate("patientId", "name patientId phoneNumber")
      .sort({
        createdAt: -1,
      });

    if (!latestPrescription) {
      return res.status(404).json({
        success: false,
        message: "No prescription found for this Patient ID.",
      });
    }

    const patient = {
      id: latestPrescription.patientId?._id || null,
      name:
        latestPrescription.patientId?.name ||
        latestPrescription.patientName ||
        "Patient",
      patientCustomId: latestPrescription.patientCustomId,
      phoneNumber: latestPrescription.patientId?.phoneNumber || "N/A",
      ageGender: latestPrescription.patientAgeGender || "N/A",
    };

    const doctor = {
      id: latestPrescription.doctorId?._id || null,
      name: latestPrescription.doctorId?.name || "Doctor",
      clinicAdd: latestPrescription.doctorId?.clinicAdd || "N/A",
      specialization: latestPrescription.doctorId?.Specialization || "N/A",
      phone: latestPrescription.doctorId?.phoneNumber || "N/A",
      regNo: latestPrescription.doctorId?.regNo || "N/A",
    };

    const prescription = {
      _id: latestPrescription._id,
      id: latestPrescription._id,
      prescriptionCustomId: latestPrescription.prescriptionCustomId,
      patientCustomId: latestPrescription.patientCustomId,
      patientName: latestPrescription.patientName,
      patientAgeGender: latestPrescription.patientAgeGender,
      diagnosis: latestPrescription.diagnosis,
      medicines: latestPrescription.medicines,
      notes: latestPrescription.notes,
      issueDate: latestPrescription.issueDate,
      validUntilDate: latestPrescription.validUntilDate,
      pdfFileName: latestPrescription.pdfFileName,
      status: latestPrescription.status,
      doctor,
      patient,
    };

    return res.status(200).json({
      success: true,
      patient,
      prescription,
    });
  } catch (error) {
    console.error("getPrescriptionForDispense error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

// GET DETAILED PRESCRIPTION INFORMATION
export const getPrescriptionDetails = async (req, res) => {
  try {
    const pharmacyId = req.pharmacyId;

    if (!pharmacyId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login again.",
      });
    }

    const { prescriptionId } = req.params;

    if (!prescriptionId) {
      return res.status(400).json({
        success: false,
        message: "Prescription ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(prescriptionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prescription ID.",
      });
    }

    const prescription = await prescriptionPdfModel
      .findById(prescriptionId)
      .populate("doctorId", "name clinicAdd Specialization phoneNumber regNo")
      .populate("patientId", "name patientCustomId phoneNumber age gender");

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    const doctor = prescription.doctorId;
    const patient = prescription.patientId;

    return res.status(200).json({
      success: true,
      prescriptionData: {
        id: prescription._id,
        prescriptionCustomId: prescription.prescriptionCustomId,
        patientCustomId: prescription.patientCustomId,
        patientName: prescription.patientName,
        patientAgeGender: prescription.patientAgeGender,
        diagnosis: prescription.diagnosis,
        medicines: prescription.medicines || [],
        notes: prescription.notes || "",
        issueDate: prescription.issueDate,
        validUntilDate: prescription.validUntilDate,
        pdfFileName: prescription.pdfFileName,
        status: prescription.status,
        dispensedAt: prescription.dispensedAt || null,
        doctor: {
          id: doctor?._id || null,
          name: doctor?.name || "Doctor",
          clinicAdd: doctor?.clinicAdd || "N/A",
          specialization: doctor?.Specialization || "N/A",
          phone: doctor?.phoneNumber || "N/A",
          regNo: doctor?.regNo || "N/A",
        },
        patient: {
          id: patient?._id || prescription.patientId || null,
          name: patient?.name || prescription.patientName || "Patient",
          patientCustomId: prescription.patientCustomId,
          phoneNumber: patient?.phoneNumber || "N/A",
          ageGender: prescription.patientAgeGender || "N/A",
        },
      },
    });
  } catch (error) {
    console.error("getPrescriptionDetails error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch prescription.",
    });
  }
};

// DISPENSE PRESCRIPTION
export const dispensePrescription = async (req, res) => {
  try {
    const pharmacyId = req.pharmacyId || req.body?.pharmacyId;

    if (!pharmacyId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const { prescriptionId } = req.body;

    if (!prescriptionId || !prescriptionId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prescription ID.",
      });
    }

    const rx = await prescriptionPdfModel.findById(prescriptionId);

    if (!rx) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    if (rx.status === "DISPENSED") {
      return res.json({
        success: false,
        message: "This prescription has already been dispensed.",
      });
    }

    if (rx.status === "EXPIRED") {
      return res.json({
        success: false,
        message: "This prescription is expired and cannot be dispensed.",
      });
    }

    rx.status = "DISPENSED";
    rx.dispensedByPharmacyId = pharmacyId;
    rx.dispensedAt = new Date();

    await rx.save();

    return res.json({
      success: true,
      message: "Prescription marked as dispensed.",
      prescriptionId: rx._id,
    });
  } catch (error) {
    console.error("dispensePrescription error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

// GET PHARMACY DISPENSE HISTORY
export const getPharmacyDispenseHistory = async (req, res) => {
  try {
    const pharmacyId = req.pharmacyId || req.body?.pharmacyId;

    if (!pharmacyId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const dispensed = await prescriptionPdfModel
      .find({
        dispensedByPharmacyId: pharmacyId,
        status: "DISPENSED",
      })
      .sort({
        dispensedAt: -1,
      })
      .limit(20)
      .populate("doctorId", "name clinicAdd");

    const formatted = dispensed.map((rx) => ({
      id: rx._id,
      rxNumber: rx.prescriptionCustomId,
      patientName: rx.patientName,
      patientCustomId: rx.patientCustomId,
      doctorName: rx.doctorId?.name || "Doctor",
      dispensedAt: rx.dispensedAt,
      medications: (rx.medicines || []).map(
        (medicine) => medicine.medicineName
      ),
    }));

    return res.status(200).json({
      success: true,
      dispensed: formatted,
    });
  } catch (error) {
    console.error("getPharmacyDispenseHistory error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch dispense history.",
    });
  }
};