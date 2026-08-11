import accessRequestModel from "../models/accessRequestModel.js";
import userModel from "../models/userModel.js";
import { recordRecentPatientVisit } from "./doctorController.js";

// Fetch active/pending requests for the patient
export const getPatientAccessRequests = async (req, res) => {
  try {
    const userId = req.userId || req.body?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find requests matching this patient's ObjectId or patientId
    const requests = await accessRequestModel
      .find({ patientId: userId })
      .populate("doctorId", "name clinicAdd Specialization")
      .sort({ createdAt: -1 });

    return res.json({ success: true, requests });
  } catch (error) {
    console.error("getPatientAccessRequests error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/patient/update-request-status
export const updateAccessRequestStatus = async (req, res) => {
  try {
    const userId = req.userId || req.body?.userId;
    const { requestId, action } = req.body; // action: 'accept', 'deny', or 'revoke'

    if (!userId || !requestId || !action) {
      return res.status(400).json({ success: false, message: "Missing required details" });
    }

    const request = await accessRequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Access request not found" });
    }

    if (action === "accept") {
      request.status = "granted";
      // Grant access for 2 hours (120 minutes)
      request.expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    } else if (action === "deny") {
      request.status = "denied";
    } else if (action === "revoke") {
      request.status = "revoked";
      request.expiresAt = new Date();
    } else {
      return res.status(400).json({ success: false, message: "Invalid action type" });
    }

    await request.save();

    return res.json({
      success: true,
      message: `Access request ${action}ed successfully`,
    });
  } catch (error) {
    console.error("updateAccessRequestStatus error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};