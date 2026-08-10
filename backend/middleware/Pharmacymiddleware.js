import jwt from "jsonwebtoken";

const pharmacyAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in again.",
      });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecode.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload.",
      });
    }

    // Attach to request object
    req.pharmacyId = tokenDecode.id;

    next();
  } catch (error) {
    console.error("Pharmacy Auth Error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed. Token invalid or expired.",
    });
  }
};

export default pharmacyAuth;