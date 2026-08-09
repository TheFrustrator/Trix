import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    // FIX: Read userId directly attached by userAuth middleware
    const userId = req.userId || req.body?.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        isVerified: user.isVerified,
        patientId: user.patientId,
        dob: user.dob,
        email: user.email,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};