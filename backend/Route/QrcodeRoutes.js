const express = require("express");
const router = express.Router();
const {
  getQRDashboard,
  getQRScansOverTime,
  createQr,
  getAllQr,
  trackQrScan,
  updateQr,
  exportQrExcel,
  downloadAllQrZip,
} = require("../Controller/Qrcodecontroller.js");

// Admin route
router.get("/dashboard", getQRDashboard);
router.get("/qr-scans-over-time", getQRScansOverTime);
router.post("/create", createQr);
router.get("/", getAllQr);
router.post("/qrscan/:shortCode", trackQrScan);
router.put("/edit/:qrId", updateQr);
router.get("/export-excel", exportQrExcel);
router.get("/download-all", downloadAllQrZip);

module.exports = router;
