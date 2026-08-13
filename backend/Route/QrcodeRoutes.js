const express = require("express");
const router = express.Router();
const
  { getQRDashboard, getQRScansOverTime,createQr,getAllQr, }
    = require("../Controller/Qrcodecontroller.js");


// Admin route
router.get("/dashboard", getQRDashboard);
router.get("/qr-scans", getQRScansOverTime);
router.post("/create", createQr);
router.get("/", getAllQr);


module.exports = router;