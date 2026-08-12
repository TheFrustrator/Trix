import jwt from "jsonwebtoken";

const pharmacyAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

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

    req.pharmacyId = tokenDecode.id;
    req.userId = tokenDecode.id;

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