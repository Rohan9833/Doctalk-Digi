const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect, restrictTo } = require("../Controller/Authmiddleware");
const {
  getDoctor,
  createAndSaveDoctorQr,
  doActionOnQr,
} = require("../Controller/edit.js");
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  generateQR,
  getDoctorScans,
  getDoctorPage,
  getDoctorDashboardData,
  exportDoctors,
} = require("../Controller/Doctorcontroller");
const { downloadDoctorImages } = require("../Controller/fileDownload.js");

const upload = multer({ storage: multer.memoryStorage() });

// Public patient-facing page
router.get("/page/:slug", getDoctorPage);
router.get("/getDoctorDashboard", getDoctorDashboardData);
router.get("/saveQr/:doctorId", createAndSaveDoctorQr);

router.get("/list", getDoctor);
router.get("/change/:doctorId", doActionOnQr);
router.get("/getDoctorDashboard", getDoctorDashboardData);
router.delete("/:id", deleteDoctor);
router.put("/:id", updateDoctor);
router.get("/:id/download-images", downloadDoctorImages);

router.post("/createDoctor", createDoctor);

// Protect all admin doctor routes below this
router.use(protect);

router.get("/", getAllDoctors);
router.get("/export", exportDoctors);
router.get("/list", getDoctor);
router.get("/:id", getDoctorById);
router.get("/:id/scans", getDoctorScans);
router.post("/", upload.single("photo"), createDoctor);
router.put("/:id", upload.single("photo"), updateDoctor);
router.post("/:id/generate-qr", generateQR);
// router.delete("/:id", restrictTo("superadmin", "admin"), deleteDoctor);
router.get("/list", getDoctor);

module.exports = router;
