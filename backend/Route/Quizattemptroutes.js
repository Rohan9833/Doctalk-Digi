const express = require("express");
const router = express.Router();
const { protect } = require("../Controller/Authmiddleware");
const {
  startAttempt,
  submitAttempt,
  abandonAttempt,
  getAllAttempts,
} = require("../Controller/Quizattemptcontroller");

// Public patient routes
router.post("/start", startAttempt);
router.post("/:id/submit", submitAttempt);
router.post("/:id/abandon", abandonAttempt);

// Admin route
router.get("/", protect, getAllAttempts);

module.exports = router;