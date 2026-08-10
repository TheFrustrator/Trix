import mongoose from "mongoose";

const prescriptionPdfSchema = new mongoose.Schema(
  {
    prescriptionCustomId: {
      type: String,
      required: true,
      unique: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    patientCustomId: {
      type: String,
      required: true,
      index: true,
    },

    patientName: {
      type: String,
      required: true,
    },

    patientAgeGender: {
      type: String,
      default: "34 / Female",
    },

    diagnosis: {
      type: String,
      default: "General Consultation",
    },

    medicines: [
      {
        medicineName: {
          type: String,
          required: true,
        },

        dosages: {
          type: String,
          required: true,
        },

        frequency: {
          type: String,
          required: true,
        },

        timing: {
          type: String,
          required: true,
        },

        duration: {
          type: String,
          required: true,
        },

        totalQuantity: {
          type: String,
          required: true,
        },
      },
    ],

    notes: {
      type: String,
      default: "",
    },

    issueDate: {
      type: String,
      required: true,
    },

    validUntilDate: {
      type: String,
      required: true,
    },

    pdfFileName: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "DISPENSED", "EXPIRED"],
      default: "ACTIVE",
    },

    // Pharmacy information
    dispensedByPharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pharmacy",
      default: null,
    },

    dispensedAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  },
);

const prescriptionPdfModel =
  mongoose.models.prescriptionPdf ||
  mongoose.model("prescriptionPdf", prescriptionPdfSchema);

export default prescriptionPdfModel;