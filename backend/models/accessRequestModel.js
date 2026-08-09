import mongoose from "mongoose";

const accessRequestSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
    docCustomId: {
      type: String,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    patientCustomId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "granted", "rejected", "revoked", "expired"],
      default: "pending",
    },
    grantedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const accessRequestModel =
  mongoose.models.accessRequest ||
  mongoose.model("accessRequest", accessRequestSchema);

export default accessRequestModel;