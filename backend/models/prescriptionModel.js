import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
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
    medicines: [
      {
        medicineName: { type: String, required: true },
        dosages: { type: String, required: true },
        frequency: { type: String, required: true },
        timing: { type: String, required: true },
        duration: { type: String, required: true },
        totalQuantity: { type: String, required: true },
      },
    ],
    notes: {
      type: String,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const prescriptionModel =
  mongoose.models.prescription ||
  mongoose.model("prescription", prescriptionSchema);

export default prescriptionModel;