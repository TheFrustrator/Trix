import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    shopAdd: { type: String, required: true },
    uploadLicense: { type: String },
    pharmacyId: { type: String, unique: true },

    isVerified: { type: Boolean, default: false },
    verifyOTP: { type: String, default: "" },
    verifyOTPExpireAt: { type: Number, default: 0 },
    resetOTP: { type: String, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const pharmacyModel =
  mongoose.models.pharmacy || mongoose.model("pharmacy", pharmacySchema);

export default pharmacyModel;