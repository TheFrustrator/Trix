import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import diagnosisModel from "../models/diagnosisModel.js";
import prescriptionPdfModel from "../models/prescriptionPdfModel.js";
import transporter from "../config/nodemailer.js";

// PATIENT REGISTER
export const register = async (req, res) => {
  const { name, email, password, dob, phoneNumber } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const safeName = (name || "PATIENT")
      .replace(/\s+/g, "")
      .slice(0, 3)
      .toUpperCase();
    const safePhone = (phoneNumber || "0000").slice(-4);
    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();

    const generatedPatientID = `${safeName}${safePhone}${randomDigits}PAT`;

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      dob,
      patientId: generatedPatientID,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Medilink",
      text: `Welcome to Medilink, Your account has been created with email id: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// PATIENT LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.json({ success: false, message: "User is not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, token });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// PATIENT LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// SEND VERIFY OTP
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId || req.body?.userId;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOTP = otp;
    user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this. Never share your OTP with anyone.`,
    };

    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "Verification OTP sent to email",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  const userId = req.userId || req.body?.userId;
  const { otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOTP === "" || user.verifyOTP !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOTPExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isVerified = true;
    user.verifyOTP = "";
    user.verifyOTPExpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// CHECK AUTHENTICATED
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// SEND RESET OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    user.resetOTP = hashedOtp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your reset password OTP is ${rawOtp}. Use this code to reset your password. It will expire in 15 minutes.`,
    };

    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
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
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.resetOTP || user.resetOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP has expired or is invalid",
      });
    }

    const isMatch = await bcrypt.compare(otp, user.resetOTP);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOTP = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ---------- PATIENT DASHBOARD SUMMARY ----------
function extractDateFromNotes(notes) {
  if (!notes || typeof notes !== "string") return null;

  const patterns = [
    /\b(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\b/,
    /\b(\d{4}-\d{2}-\d{2})\b/,
    /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/,
  ];

  for (const pattern of patterns) {
    const match = notes.match(pattern);
    if (match) {
      const parsed = new Date(match[1]);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  }
  return null;
}

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.userId || req.body?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const patient = await userModel.findById(userId);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    const patientCustomId = patient.patientId;

    const diagnoses = await diagnosisModel
      .find({ patientCustomId })
      .sort({ date: -1, createdAt: -1 })
      .populate("doctorId", "name clinicAdd Specialization");

    const latestDiagnosis = diagnoses[0] || null;
    const activeCondition = latestDiagnosis
      ? {
          name: latestDiagnosis.diagnosis,
          state: "Ongoing",
        }
      : null;

    const lastVisit = latestDiagnosis
      ? {
          date: latestDiagnosis.date,
          clinic: latestDiagnosis.doctorId?.clinicAdd || "N/A",
          doctorName: latestDiagnosis.doctorId?.name || "N/A",
        }
      : null;

    const latestPrescription = await prescriptionPdfModel
      .findOne({ patientCustomId })
      .sort({ createdAt: -1 });

    let upcomingRefill = null;
    if (latestPrescription) {
      const refillDate = extractDateFromNotes(latestPrescription.notes);
      if (refillDate) {
        upcomingRefill = {
          medicineName:
            latestPrescription.medicines?.[0]?.medicineName || "Medicine",
          reliefDate: refillDate.toISOString().split("T")[0],
        };
      }
    }

    const visits = diagnoses
      .slice()
      .reverse()
      .map((d) => ({
        id: d._id,
        date: d.date,
        doctorName: d.doctorId?.name || "Doctor",
        clinic: d.doctorId?.clinicAdd || "N/A",
        diagnosis: d.diagnosis,
      }));

    let avgGapDays = null;
    if (visits.length > 1) {
      const first = new Date(visits[0].date);
      const last = new Date(visits[visits.length - 1].date);
      const totalDays = Math.round((last - first) / (1000 * 60 * 60 * 24));
      avgGapDays = Math.round(totalDays / (visits.length - 1));
    }

    return res.json({
      success: true,
      activeCondition,
      lastVisit,
      upcomingRefill,
      visits,
      totalVisits: visits.length,
      avgGapDays,
      therapyStartDate: visits[0]?.date || null,
    });
  } catch (error) {
    console.error("getDashboardSummary error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- PATIENT PRESCRIPTION HISTORY ----------
export const getPatientPrescriptions = async (req, res) => {
  try {
    const userId = req.userId || req.body?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const patient = await userModel.findById(userId);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    const patientCustomId = patient.patientId;

    const prescriptions = await prescriptionPdfModel
      .find({ patientCustomId })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("doctorId", "name clinicAdd Specialization");

    const formatted = prescriptions.map((rx) => ({
      id: rx._id,
      rxNumber: rx.prescriptionCustomId,
      doctorName: rx.doctorId?.name || "Doctor",
      specialty: rx.doctorId?.Specialization || "General",
      clinic: rx.doctorId?.clinicAdd || "N/A",
      issueDate: rx.issueDate,
      status: rx.status || "ACTIVE",
      diagnosis: rx.diagnosis || "General Consultation",
      medications: (rx.medicines || []).map((m) => m.medicineName),
    }));

    return res.json({ success: true, prescriptions: formatted });
  } catch (error) {
    console.error("getPatientPrescriptions error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// FETCH PATIENT PRESCRIPTION DETAILS
export const getPatientPrescriptionDetails = async (req, res) => {
  try {
    const userId = req.userId || req.body?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { prescriptionId } = req.params;
    if (!prescriptionId || !prescriptionId.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid prescription ID" });
    }

    const patient = await userModel.findById(userId);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    const rx = await prescriptionPdfModel
      .findById(prescriptionId)
      .populate(
        "doctorId",
        "name clinicAdd Specialization phoneNumber regNo"
      );

    if (!rx) {
      return res
        .status(404)
        .json({ success: false, message: "Prescription record not found" });
    }

    if (rx.patientCustomId !== patient.patientId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to view this prescription",
        });
    }

    const genderLabel = "N/A";

    return res.json({
      success: true,
      prescriptionData: {
        id: rx._id,
        issueDate: rx.issueDate,
        doctor: {
          id: rx.doctorId?._id,
          name: rx.doctorId?.name || "Doctor",
          clinicAdd: rx.doctorId?.clinicAdd || "N/A",
          regNo: rx.doctorId?.regNo || "N/A",
          phone: rx.doctorId?.phoneNumber || "N/A",
        },
        patient: {
          name: patient.name || rx.patientName || "Patient",
          patientCustomId: rx.patientCustomId,
          ageGender: rx.patientAgeGender || `N/A / ${genderLabel}`,
        },
        diagnosis: rx.diagnosis || "General Consultation",
        medicines: rx.medicines || [],
        notes: rx.notes || "",
      },
    });
  } catch (error) {
    console.error("getPatientPrescriptionDetails error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};