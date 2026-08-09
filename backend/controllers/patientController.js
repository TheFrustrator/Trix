import accessRequestModel from "../models/accessRequestModel.js";

// Fetch active/pending requests for the patient
export const getPatientAccessRequests = async (req, res) => {
  try {
    const patientId = req.userId || req.body?.userId;

    if (!patientId || typeof patientId !== "string") {
      return res.status(401).json({ success: false, message: "Unauthorized patient account" });
    }

    const now = new Date();

    // Automatically mark expired granted sessions in DB
    await accessRequestModel.updateMany(
      {
        patientId,
        status: "granted",
        expiresAt: { $lte: now },
      },
      { $set: { status: "expired" } }
    );

    // Strictly fetch ONLY pending requests and valid active granted sessions
    const requests = await accessRequestModel
      .find({
        patientId,
        $or: [
          { status: "pending" },
          { status: "granted", expiresAt: { $gt: now } },
        ],
      })
      .populate("doctorId", "name clinicAdd Specialization email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      requests,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Accept, Deny, or Revoke an Access Request
export const updateRequestStatus = async (req, res) => {
  try {
    const patientId = req.userId || req.body?.userId;
    const { requestId, action } = req.body;

    if (!requestId || typeof requestId !== "string" || !action || typeof action !== "string") {
      return res.status(400).json({ success: false, message: "Invalid parameters" });
    }

    const allowedActions = ["accept", "deny", "revoke"];
    if (!allowedActions.includes(action)) {
      return res.status(400).json({ success: false, message: "Action type not permitted" });
    }

    const request = await accessRequestModel.findOne({
      _id: requestId,
      patientId,
    });

    if (!request) {
      return res.status(404).json({ success: false, message: "Access request not found" });
    }

    if (action === "accept") {
      const now = new Date();
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

      request.status = "granted";
      request.grantedAt = now;
      request.expiresAt = twoHoursLater;
    } else if (action === "deny") {
      request.status = "rejected";
    } else if (action === "revoke") {
      request.status = "revoked";
    }

    await request.save();

    return res.json({
      success: true,
      message: `Request ${request.status} successfully`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};