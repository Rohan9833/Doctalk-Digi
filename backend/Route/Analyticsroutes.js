const express = require("express");
const router = express.Router();
const { protect } = require("../Controller/Authmiddleware");
const {
  getDashboardStats,
  getActivityOverTime,
  getMapData,
  getDeviceBreakdown,
  getTopDoctors,
  getCampaignPerformance,
  getAdminDashboard
} = require("../Controller/Analyticscontroller");

console.log("Analytics Routes Loaded");

router.get("/adminDashboard", getAdminDashboard)

router.use(protect);

router.get("/dashboard", getDashboardStats);
router.get("/activity", getActivityOverTime);
router.get("/map", getMapData);
router.get("/devices", getDeviceBreakdown);
router.get("/top-doctors", getTopDoctors);
router.get("/campaign-performance", getCampaignPerformance);

module.exports = router;