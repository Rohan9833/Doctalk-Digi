const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const { protect } = require("../Controller/Authmiddleware");
const { handleExcelsheetUpload } = require("../Controller/AdminController");
const { bulkUploadDoctors } = require("../Controller/Bulkdoctorcontroller");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.use(protect);

router.post("/upload-excel", upload.single("file"), handleExcelsheetUpload);
router.post("/doctors", upload.single("file"), bulkUploadDoctors);

module.exports = router;