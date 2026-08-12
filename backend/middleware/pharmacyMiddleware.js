import jwt from "jsonwebtoken";

const pharmacyAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // 1. Extract Bearer token from Authorization header (localStorage)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Reject if no token is present
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in again.",
      });
    }

    // 3. Verify token
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecode.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload.",
      });
    }

    // 4. Attach decoded IDs to request object
    req.pharmacyId = tokenDecode.id;
    req.userId = tokenDecode.id; // Secondary alias for controllers checking req.userId

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
