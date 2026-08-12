import jwt from "jsonwebtoken";

const pharmacyAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // 1. Extract Bearer token from header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token found in request.",
      });
    }

    // 2. Decode token
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecode || !tokenDecode.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload.",
      });
    }

    // 3. Attach ID to req
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