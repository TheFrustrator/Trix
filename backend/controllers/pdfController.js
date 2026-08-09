import prescriptionPdfModel from "../models/prescriptionPdfModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import diagnosisModel from "../models/diagnosisModel.js";
import recentPatientModel from "../models/recentPatientModel.js";
import mongoose from "mongoose";

// SAVE PRESCRIPTION TO DATABASE
export const savePrescription = async (req, res) => {
  try {
    const docId = req.docId || req.body?.docId;
    const { patientCustomId, medicines, notes, date } = req.body;

    if (!docId) {
      return res.status(401).json({ success: false, message: "Doctor unauthenticated" });
    }

    if (!patientCustomId || typeof patientCustomId !== "string") {
      return res.status(400).json({ success: false, message: "Valid Patient ID is required" });
    }

    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ success: false, message: "At least one medicine is required" });
    }

    // Fetch Doctor and Patient details
    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const patient = await userModel.findOne({
      $or: [{ patientId: patientCustomId }, { docId: patientCustomId }],
    });

    const latestDiagnosis = await diagnosisModel
      .findOne({ patientCustomId })
      .sort({ createdAt: -1 });

    // Dates
    const issueDateObj = date ? new Date(date) : new Date();
    const validUntilObj = new Date(issueDateObj.getTime() + 7 * 24 * 60 * 60 * 1000);

    const formattedIssueDate = issueDateObj.toISOString().split("T")[0];
    const formattedValidDate = validUntilObj.toISOString().split("T")[0];

    const cleanCustomId = patientCustomId.replace(/[^a-zA-Z0-9-]/g, "");
    const pdfFileName = `Prescription_${cleanCustomId}_${formattedIssueDate}.pdf`;
    const prescriptionCustomId = `RX-${cleanCustomId}-${Date.now().toString().slice(-4)}`;

    const newPrescription = new prescriptionPdfModel({
      prescriptionCustomId,
      doctorId: docId,
      patientId: patient?._id || null,
      patientCustomId,
      patientName: patient?.name || "Patient",
      patientAgeGender: `${patient?.age || "34"} / ${patient?.gender || "Female"}`,
      diagnosis: latestDiagnosis?.diagnosis || "General Checkup",
      medicines,
      notes: notes || "Take as directed by physician.",
      issueDate: formattedIssueDate,
      validUntilDate: formattedValidDate,
      pdfFileName,
      status: "ACTIVE",
    });

    await newPrescription.save();

    // Upsert to recent patients list
    try {
      await recentPatientModel.findOneAndUpdate(
        { doctorId: docId, patientCustomId },
        {
          patientId: patient?._id || null,
          patientCustomId,
          patientName: patient?.name || "Patient",
          disease: latestDiagnosis?.diagnosis || "Prescription Issued",
          lastVisitDate: new Date(),
        },
        { upsert: true, new: true }
      );
    } catch (e) {
      console.error("Recent patient update error:", e);
    }

    return res.json({
      success: true,
      message: "Prescription saved successfully!",
      prescriptionId: newPrescription._id,
      pdfFileName,
    });
  } catch (error) {
    console.error("savePrescription error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// FETCH PRESCRIPTION DETAILS BY ID
export const getPrescriptionDetails = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    if (!prescriptionId || typeof prescriptionId !== "string") {
      return res.status(400).json({ success: false, message: "Invalid prescription ID" });
    }

    // Check if ID is a valid 24-character ObjectId or a custom RX string
    const isObjectId = mongoose.Types.ObjectId.isValid(prescriptionId);

    const rx = await prescriptionPdfModel
      .findOne({
        $or: [
          ...(isObjectId ? [{ _id: prescriptionId }] : []),
          { prescriptionCustomId: prescriptionId },
        ],
      })
      .populate("doctorId", "name clinicAdd Specialization phoneNumber regNo");

    if (!rx) {
      return res.status(404).json({
        success: false,
        message: "Prescription record not found in database",
      });
    }

    return res.json({
      success: true,
      prescriptionData: {
        id: rx._id,
        prescriptionCustomId: rx.prescriptionCustomId,
        pdfFileName: rx.pdfFileName,
        dateIssued: rx.issueDate,
        validUntil: rx.validUntilDate,
        doctor: {
          name: rx.doctorId?.name || "Dr. Eleanor Vance",
          specialization: rx.doctorId?.Specialization || "MBBS, MD",
          clinic: rx.doctorId?.clinicAdd || "Oakwood Clinic",
          regNo: rx.doctorId?.regNo || "12345",
          address: rx.doctorId?.clinicAdd || "123 Oakwood Ave, Cityville",
          phone: rx.doctorId?.phoneNumber || "(555) 0123",
        },
        patient: {
          name: rx.patientName || "Patient",
          id: rx.patientCustomId || "P-4041-XYZ",
          ageGender: rx.patientAgeGender || "34 / Female",
        },
        diagnosis: rx.diagnosis || "General Checkup",
        medicines: rx.medicines || [],
        notes: rx.notes || "",
        status: rx.status || "ACTIVE",
      },
    });
  } catch (error) {
    console.error("getPrescriptionDetails error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};