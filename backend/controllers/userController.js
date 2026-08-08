import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        patientID:user.patientID,
        clinicName: user.clinicName,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
