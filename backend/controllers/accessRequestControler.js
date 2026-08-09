import accessRequestModel from "../models/accessRequestModel.js";
import userModel from '../models/userModel.js'

// Create a new access request
export const createAccessRequest = async (req, res) => {
  try {
    const docId = req.docId || req.body?.docId;
    const { patientCustomId } = req.body;

    if (!patientCustomId) {
      return res.json({ success: false, message: "Patient ID is required" });
    }

    // Find patient by custom ID (e.g., patientId field in user model)
    const patient = await userModel.findOne({ patientId: patientCustomId });

    if (!patient) {
      return res.json({
        success: false,
        message: "No Patient found with this ID",
      });
    }

    // Check for existing pending/granted request
    const existingRequest = await accessRequestModel.findOne({
      doctorId: docId,
      patientId: patient._id,
      status: { $in: ["pending", "granted", "revoke"] },
    });

    if (existingRequest) {
      return res.json({
        success: true,
        alreadyExists: true,
        status: existingRequest.status,
        requestId: existingRequest._id,
        patientName: patient.name,
        patientCustomId: patient.patientId,
        message: `Request already ${existingRequest.status}`,
      });
    }

    // Create new access request
    const newRequest = new accessRequestModel({
      doctorId: docId,
      patientId: patient._id,
      patientCustomId: patient.patientId,
      status: "pending",
    });

    await newRequest.save();

    return res.json({
      success: true,
      requestId: newRequest._id,
      patientName: patient.name,
      patientCustomId: patient.patientId,
      status: "pending",
      message: "Access request sent successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Poll/Check status of a request
export const checkAccessRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;

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
    return res.json({ success: false, message: error.message });
  }
};