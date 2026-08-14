const express = require("express");
const router = express.Router();
const {
  getQRDashboard,
  getQRScansOverTime,
  createQr,
  getAllQr,
  trackQrScan,
  updateQr,
} = require("../Controller/Qrcodecontroller.js");

// Admin route
router.get("/dashboard", getQRDashboard);
router.get("/qr-scans-over-time", getQRScansOverTime);
router.post("/create", createQr);
router.get("/", getAllQr);
router.post("/qrscan/:shortCode", trackQrScan);
router.get("/edit", updateQr);

module.exports = router;
