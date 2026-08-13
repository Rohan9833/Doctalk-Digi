const Admin = require("../Model/AdminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_production";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

// Generate token
const signToken = (id) =>
  jwt.sign({ id, type: "admin" }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// Send token in cookie + body
const sendToken = (res, admin, statusCode = 200) => {
  const token = signToken(admin._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      id: admin._id,
      adminId: admin.adminId,
      adminName: admin.adminName,
      BUSINESSUNIT: admin.BUSINESSUNIT,
    },
  });
};

// POST /api/auth/login
// Body: { adminId, password }
const login = async (req, res) => {
  try {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({
        success: false,
        error: "adminId and password are required",
      });
    }

    const admin = await Admin.findOne({
      adminId: adminId.toString().trim(),
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    sendToken(res, admin, 200);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).lean();

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        adminId: admin.adminId,
        adminName: admin.adminName,
        BUSINESSUNIT: admin.BUSINESSUNIT,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/auth/change-password
// Body: { currentPassword, newPassword }
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Both passwords are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters",
      });
    }

    const admin = await Admin.findById(req.admin._id).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



module.exports = { login, logout, getMe, changePassword };