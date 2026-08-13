const express = require("express");
const router = express.Router();
const { login, logout, getMe, changePassword } = require("../Controller/Authcontroller");
const { protect } = require("../Controller/Authmiddleware");

router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protect, getMe);
router.post("/change-password", protect, changePassword);

module.exports = router;