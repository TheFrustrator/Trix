import jwt from "jsonwebtoken";

const doctorAuth = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Check Authorization header for Bearer token
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized as a doctor. Please log in again.",
      });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      req.doctorId = tokenDecode.id;
      req.userId = tokenDecode.id;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload.",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Session expired or invalid token.",
    });
  }
};

export default doctorAuth;