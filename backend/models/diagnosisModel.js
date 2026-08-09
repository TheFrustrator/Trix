import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
    patientCustomId: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    reportPath: {
      type: String,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const diagnosisModel =
  mongoose.models.diagnosis || mongoose.model("diagnosis", diagnosisSchema);

export default diagnosisModel;