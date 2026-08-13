const express = require("express");
const router = express.Router();

const {
  mrLogin,
  mrLogout,
  mrMe,
  protectMr,
  getMyDoctors,
  getMyDoctorById,
  addDoctor,
  updateMyDoctor,
  sendConsent,
  getAvailableCampaigns,
  getConsentPage,
  submitConsent,
  confirmConsent,
  addDoctorDetails,
  mrAddDoctor
} = require("../Controller/MrController");
const upload = require("../middleware/multer");

router.post("/doctorDetailsUpload/:id", upload.array("images", 7), addDoctorDetails);
router.post("/mrAddDoctor", mrAddDoctor)

// Auth
router.post("/auth/login", mrLogin);
router.post("/auth/logout", mrLogout);
router.get("/auth/me", protectMr, mrMe);

// MR campaigns
router.get("/campaigns", protectMr, getAvailableCampaigns);

// MR doctors
router.get("/doctors", protectMr, getMyDoctors);
router.get("/doctors/:id", protectMr, getMyDoctorById);
router.post("/doctors", protectMr, addDoctor);
router.put("/doctors/:id", protectMr, updateMyDoctor);
router.post("/doctors/:id/send-consent", protectMr, sendConsent);

// Public consent routes
router.get("/consent/:token", getConsentPage);
router.post("/consent/:token/submit", submitConsent);
router.get("/consent/:token/confirm",  confirmConsent);

module.exports = router;