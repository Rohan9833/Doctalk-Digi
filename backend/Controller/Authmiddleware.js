const jwt   = require("jsonwebtoken");
const Admin = require("../Model/AdminModel");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_production";

// ════════════════════════════════════════════════
// protect
// Verifies JWT from cookie OR Authorization header.
// Attaches req.admin for use in all protected controllers.
// ════════════════════════════════════════════════
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Try cookie first
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    // 2. Fall back to Authorization: Bearer <token>
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated. Please log in.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check admin still exists
    const admin = await Admin.findById(decoded.id).lean();
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: "Admin account no longer exists.",
      });
    }

    // Attach to request
    req.admin = admin;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, error: "Session expired. Please log in again." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, error: "Invalid token." });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// restrictTo(...roles)
// Usage: router.delete("/:id", protect, restrictTo("superadmin"), deleteClient)
// ════════════════════════════════════════════════
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };