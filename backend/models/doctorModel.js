import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },
  clinicAdd: {
    type: String,
    required: true,
  },
  Specialization: {
    type: String,
    required: true,
  },
  uploadLicense: {
    type: String,
    required: true,
  },
  docId: {
    type: String,
  },

  verifyOTP: {
    type: String,
    default: "",
  },
  verifyOTPExpireAt: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetOTP: {
    type: String,
    default: "",
  },
  resetOtpExpireAt: {
    type: Number,
    default: 0,
  },
});

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;
