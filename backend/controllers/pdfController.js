import prescriptionPdfModel from "../models/prescriptionPdfModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import diagnosisModel from "../models/diagnosisModel.js";
import recentPatientModel from "../models/recentPatientModel.js";
import mongoose from "mongoose";

// ---------- SAVE PRESCRIPTION ----------
// This is now the ONLY savePrescription in the codebase.
// It writes to prescriptionPdfModel — the same model getCombinedPrescriptionDetails reads from.
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

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // patientCustomId is matched against userModel.patientId — that's the only
    // field your userSchema actually has for this purpose.
    const patient = await userModel.findOne({ patientId: patientCustomId });

    const latestDiagnosis = await diagnosisModel
      .findOne({ patientCustomId })
      .sort({ createdAt: -1 });

    const issueDateObj = date ? new Date(date) : new Date();
    const validUntilObj = new Date(issueDateObj.getTime() + 7 * 24 * 60 * 60 * 1000);
    const formattedIssueDate = issueDateObj.toISOString().split("T")[0];
    const formattedValidDate = validUntilObj.toISOString().split("T")[0];

    const cleanCustomId = patientCustomId.replace(/[^a-zA-Z0-9-]/g, "");
    const pdfFileName = `Prescription_${cleanCustomId}_${formattedIssueDate}.pdf`;
    const prescriptionCustomId = `RX-${cleanCustomId}-${Date.now().toString().slice(-4)}`;

    // patientAgeGender is stored as a formatted string on this model, so build
    // it once here from what we actually have. Your userModel has no `gender`
    // field, so gender always falls back to "N/A" until you add one.
    const ageLabel = patient?.dob ? calculateAge(patient.dob) : "N/A";
    const genderLabel = "N/A"; // ⚠️ userModel has no gender field — add one if you need this populated

    // Medicines already arrive from the frontend with the exact keys the
    // schema requires (medicineName, dosages, frequency, timing, duration,
    // totalQuantity), so no renaming needed — but we validate each item so a
    // malformed row fails loudly instead of silently saving as blank.
    for (const [i, m] of medicines.entries()) {
      if (!m.medicineName || !m.dosages || !m.frequency || !m.timing || !m.duration || !m.totalQuantity) {
        return res.status(400).json({
          success: false,
          message: `Medicine item ${i + 1} is missing a required field`,
        });
      }
    }

    const newPrescription = new prescriptionPdfModel({
      prescriptionCustomId,
      doctorId: docId,
      patientId: patient?._id || null,
      patientCustomId,
      patientName: patient?.name || "Patient",
      patientAgeGender: `${ageLabel} / ${genderLabel}`,
      diagnosis: latestDiagnosis?.diagnosis || "General Checkup",
      medicines, // matches schema keys exactly — see model
      notes: notes || "Take as directed by physician.",
      issueDate: formattedIssueDate,
      validUntilDate: formattedValidDate,
      pdfFileName,
      status: "ACTIVE",
    });

    const saved = await newPrescription.save();

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
      prescriptionId: saved._id,
      pdfFileName,
    });
  } catch (error) {
    console.error("savePrescription error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- FETCH BY ID OR CUSTOM RX STRING ----------
export const getPrescriptionDetails = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    if (!prescriptionId || typeof prescriptionId !== "string") {
      return res.status(400).json({ success: false, message: "Invalid prescription ID" });
    }

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
      return res.status(404).json({ success: false, message: "Prescription record not found in database" });
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

// ---------- LIST ALL PRESCRIPTIONS FOR A PATIENT ----------
export const getPrescriptionsByPatientId = async (req, res) => {
  try {
    const { patientCustomId } = req.params;

    const prescriptions = await prescriptionPdfModel
      .find({ patientCustomId })
      .populate("doctorId", "name clinicAdd Specialization")
      .sort({ createdAt: -1 });

    return res.json({ success: true, prescriptions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- MAIN: COMBINED FETCH (what PdfPrescriptionView.jsx actually calls) ----------
function calculateAge(dob) {
  if (!dob) return "N/A";
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return "N/A";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? `${age} Y` : "N/A";
}

export const getCombinedPrescriptionDetails = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    if (!prescriptionId || !mongoose.Types.ObjectId.isValid(prescriptionId)) {
      return res.status(400).json({ success: false, message: "Invalid prescription ID" });
    }

    const prescription = await prescriptionPdfModel.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription record not found" });
    }

    const { doctorId, patientCustomId, medicines, notes, issueDate, createdAt } = prescription;

    const doctor = await doctorModel.findById(doctorId);

    // userModel's only patient-identifying field is `patientId` — match on that only.
    const patient = await userModel.findOne({ patientId: patientCustomId });

    const latestDiagnosisDoc = await diagnosisModel
      .findOne({ patientCustomId })
      .sort({ createdAt: -1 });

    const formattedIssueDate =
      issueDate || (createdAt ? new Date(createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);

    const patientAge = calculateAge(patient?.dob);
    // ⚠️ userModel has no `gender` field in the schema you shared — this will
    // always read "N/A" until you add `gender` to userSchema and populate it.
    const gender = patient?.gender || "N/A";

    return res.json({
      success: true,
      prescriptionData: {
        id: prescription._id,
        issueDate: formattedIssueDate,
        doctor: {
          id: doctor?._id || doctorId,
          name: doctor?.name || "Dr. Eleanor Vance",
          clinicAdd: doctor?.clinicAdd || "Oakwood Clinic",
          regNo: doctor?.regNo || "12345",
          phone: doctor?.phoneNumber || "N/A",
        },
        patient: {
          name: patient?.name || prescription.patientName || "Patient",
          patientCustomId: patientCustomId || "N/A",
          age: patientAge,
          gender: gender,
          ageGender: `${patientAge} / ${gender}`,
        },
        diagnosis: latestDiagnosisDoc?.diagnosis || prescription.diagnosis || "General Consultation",
        medicines: Array.isArray(medicines) ? medicines : [],
        notes: notes || latestDiagnosisDoc?.notes || "Take medications as prescribed.",
      },
    });
  } catch (error) {
    console.error("Error building prescription payload:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};