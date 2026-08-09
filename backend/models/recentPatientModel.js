import mongoose from "mongoose";

const recentPatientSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
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
    patientName: {
      type: String,
      required: true,
    },
    disease: {
      type: String,
      default: "General Consultation",
    },
    lastVisitDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate entries per doctor-patient pair
recentPatientSchema.index({ doctorId: 1, patientId: 1 }, { unique: true });

const recentPatientModel =
  mongoose.models.recentPatient ||
  mongoose.model("recentPatient", recentPatientSchema);

export default recentPatientModel;