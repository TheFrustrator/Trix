import jwt from "jsonwebtoken";

const pharmacyAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Check Authorization header (Bearer token from localStorage)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecode || !tokenDecode.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload.",
      });
    }

    // Attach to request
    req.pharmacyId = tokenDecode.id;
    req.userId = tokenDecode.id;

    next();
  } catch (error) {
    console.error("Pharmacy Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed. Token invalid or expired.",
    });
  }
};

export default pharmacyAuth;