import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import accessRequestModel from "../models/accessRequestModel.js";
import userModel from "../models/userModel.js";

export const doctorRegister = async (req, res) => {
  const { name, email, password, phoneNumber, clinicAdd, Specialization } = req.body;

  if (!name || !email || !password || !phoneNumber || !clinicAdd) {
    return res.json({ success: false, message: "Missing Details" });
  }

  const uploadLicense = req.file ? req.file.path : null;

  try {
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const safeName = (name || "DOCTOR")
      .replace(/\s+/g, "")
      .slice(0, 3)
      .toUpperCase();
    const safePhone = (phoneNumber || "0000").slice(-4);
    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();

    const generatedDoctorID = `${safeName}${safePhone}${randomDigits}DOC`;

    const doctor = new doctorModel({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      clinicAdd,
      Specialization,
      uploadLicense,
      docId: generatedDoctorID,
    });
    await doctor.save();

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Medilink",
      text: `Welcome to Medilink, Your Doctor account has been created with email id: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Doctor registered successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const doctorlogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    if (!doctor.isVerified) {
      return res.json({ success: false, message: "Doctor is not verified" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const doctorlogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const docId = req.docId || req.body?.docId;

    if (!docId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.json({ success: false, message: "User not found" });
    }

    if (doctor.isVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    doctor.verifyOTP = otp;
    doctor.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await doctor.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: doctor.email,
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

export const verifyEmail = async (req, res) => {
  const docId = req.docId || req.body?.docId;
  const { otp } = req.body;

  if (!docId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "User not found" });
    }

    if (doctor.verifyOTP === "" || doctor.verifyOTP !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (doctor.verifyOTPExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    doctor.isVerified = true;
    doctor.verifyOTP = "";
    doctor.verifyOTPExpireAt = 0;

    await doctor.save();
    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    doctor.resetOTP = hashedOtp;
    doctor.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await doctor.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: doctor.email,
      subject: "Password Reset OTP",
      text: `Your reset password OTP is ${rawOtp}. Use this code to reset your password. It will expire in 15 minutes.`,
    };

    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP, and New Password are required",
    });
  }

  try {
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!doctor.resetOTP || doctor.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP has expired or is invalid" });
    }

    const isMatch = await bcrypt.compare(otp, doctor.resetOTP);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    doctor.password = hashedPassword;
    doctor.resetOTP = "";
    doctor.resetOtpExpireAt = 0;

    await doctor.save();

    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const createAccessRequest = async (req, res) => {
  try {
    const docId = req.docId || req.body?.docId;
    const { patientCustomId } = req.body;

    if (!docId || typeof docId !== "string") {
      return res.status(401).json({ success: false, message: "Unauthorized Doctor Account" });
    }

    if (!patientCustomId || typeof patientCustomId !== "string") {
      return res.status(400).json({ success: false, message: "Patient ID is required" });
    }

    const sanitizedCustomId = patientCustomId.trim();

    const patient = await userModel.findOne({
      $or: [{ patientId: sanitizedCustomId }, { docId: sanitizedCustomId }],
    });

    if (!patient) {
      return res.json({ success: false, message: "No Patient found with this ID" });
    }

    const targetRoomId = patient.patientId || patient.docId;

    let existingRequest = await accessRequestModel.findOne({
      doctorId: docId,
      patientId: patient._id,
      status: { $in: ["pending", "granted"] },
    });

    if (existingRequest) {
      const populatedExisting = await accessRequestModel
        .findById(existingRequest._id)
        .populate("doctorId", "name clinicAdd Specialization");

      const io = req.app.get("io");
      if (io && existingRequest.status === "pending") {
        io.to(targetRoomId).emit("new-access-request", {
          _id: populatedExisting._id,
          doctorId: populatedExisting.doctorId,
          createdAt: populatedExisting.createdAt,
          status: "pending",
        });
      }

      return res.json({
        success: true,
        alreadyExists: true,
        requestId: existingRequest._id,
        patientName: patient.name,
        patientCustomId: targetRoomId,
        status: existingRequest.status,
        message: `Request is currently ${existingRequest.status}`,
      });
    }

    const newRequest = new accessRequestModel({
      doctorId: docId,
      patientId: patient._id,
      patientCustomId: targetRoomId,
      status: "pending",
    });

    await newRequest.save();

    const populatedRequest = await accessRequestModel
      .findById(newRequest._id)
      .populate("doctorId", "name clinicAdd Specialization");

    // Real-time Emit over WebSocket
    const io = req.app.get("io");
    if (io) {
      io.to(targetRoomId).emit("new-access-request", {
        _id: populatedRequest._id,
        doctorId: populatedRequest.doctorId,
        createdAt: populatedRequest.createdAt,
        status: "pending",
      });
    }

    return res.json({
      success: true,
      requestId: newRequest._id,
      patientName: patient.name,
      patientCustomId: targetRoomId,
      status: "pending",
      message: "Access request sent successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const checkAccessRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!requestId || typeof requestId !== "string") {
      return res.status(400).json({ success: false, message: "Invalid request ID" });
    }

    const request = await accessRequestModel.findById(requestId);

    if (!request) {
      return res.json({ success: false, message: "Request not found" });
    }

    return res.json({
      success: true,
      status: request.status,
      patientCustomId: request.patientCustomId,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorData = async (req, res) => {
  try {
    const doctorId = req.docId || req.body?.docId;
    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        name: doctor.name,
        isVerified: doctor.isVerified,
        docId: doctor.docId,
        phoneNumber: doctor.phoneNumber,
        email: doctor.email,
        clinicAdd: doctor.clinicAdd,
        Specialization: doctor.Specialization,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};