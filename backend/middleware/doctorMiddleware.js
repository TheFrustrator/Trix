import jwt from "jsonwebtoken";

const doctorAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Not authorized. Please log in again." });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      req.docId = tokenDecode.id;
      req.body = req.body || {};
      req.body.docId = tokenDecode.id;
    } else {
      return res.json({ success: false, message: "Not authorized. Please log in again." });
    }

    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default doctorAuth;