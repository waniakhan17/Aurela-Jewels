const jwt = require("jsonwebtoken");
require("dotenv").config();

function adminAuth(req, res, next) {
  try {
    //check if req.cookies exist
    const token = req.cookies && req.cookies.token ? req.cookies.token : null;
    console.log(token);
    console.log("Cookies received:", req.cookies);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    next();
  } catch (err) {
    console.error("Admin authentication error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = adminAuth;
