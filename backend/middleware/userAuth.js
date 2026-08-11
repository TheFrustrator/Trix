import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Check for token in Authorization header (Bearer token)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again.",
      });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again.",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid or expired token.",
    });
  }
};

export default userAuth;