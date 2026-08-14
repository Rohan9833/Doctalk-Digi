const Doctor = require("../Model/DoctorModel");
const QRScan = require("../Model/Qrscanmodel");
const QRCode = require("qrcode");
const QR = require("../Model/QRModel");
const Campaign = require("../Model/CampaignModel");
const Quiz = require("../Model/QuizModel");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const getUserDeviceInfo = require("../services/getDeviceService");
const archiver = require("archiver");
const ExcelJS = require("exceljs");


// =====================================================
// get All QR
// =====================================================

const getAllQr = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.max(Number(limit) || 10, 1);
    const skip = (pageNumber - 1) * limitNumber;

    // ==========================================
    // FILTER
    // ==========================================

    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    // ==========================================
    // SEARCH
    // ==========================================

    if (search?.trim()) {
      const doctors = await QR.find()
        .populate({
          path: "doctor",
          match: {
            name: {
              $regex: search.trim(),
              $options: "i",
            },
          },
          select: "_id",
        })
        .select("doctor");

      const doctorIds = doctors
        .filter((item) => item.doctor)
        .map((item) => item.doctor._id);

      filter.$or = [
        {
          shortCode: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          doctor: {
            $in: doctorIds,
          },
        },
      ];
    }

    // ==========================================
    // TOTAL
    // ==========================================

    const total = await QR.countDocuments(filter);

    // ==========================================
    // GET QR DATA
    // ==========================================

    const qrs = await QR.find(filter)
      .populate("doctor", "name doctorId")
      .populate("campaign", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();

    // ==========================================
    // QR SCAN ANALYTICS
    // ==========================================

    const qrIds = qrs.map((qr) => qr._id);

    const scanStats = await QRScan.aggregate([
      {
        $match: {
          qr: {
            $in: qrIds,
          },
        },
      },

      {
        $group: {
          _id: "$qr",

          // ======================================
          // TOTAL SCANS
          // ======================================

          totalScans: {
            $sum: 1,
          },

          // ======================================
          // UNIQUE SCANS
          // ======================================
          // Count only scans where uniqueScan = true

          uniqueScans: {
            $sum: {
              $cond: [{ $eq: ["$uniqueScan", true] }, 1, 0],
            },
          },

          // ======================================
          // LAST SCAN
          // ======================================

          lastScanned: {
            $max: "$scannedAt",
          },
        },
      },
    ]);

    // ==========================================
    // MAP SCAN STATS
    // ==========================================

    const statsMap = new Map();

    scanStats.forEach((item) => {
      statsMap.set(item._id.toString(), {
        totalScans: item.totalScans,
        uniqueScans: item.uniqueScans,
        lastScanned: item.lastScanned,
      });
    });

    // ==========================================
    // FINAL DATA
    // ==========================================

    const data = qrs.map((qr) => {
      const stats = statsMap.get(qr._id.toString()) || {
        totalScans: 0,
        uniqueScans: 0,
        lastScanned: null,
      };

      const baseUrl =
        process.env.QR_BASE_URL || "http://192.168.1.37:2468";

      return {
        id: qr._id,

        // QR
        qrCodeSvg: qr.qrCodeSvg,

        // Doctor
        doctor: qr.doctor
          ? {
              id: qr.doctor._id,
              name: qr.doctor.name,
              doctorId: qr.doctor.doctorId,
            }
          : null,

        // Campaign
        campaign: qr.campaign
          ? {
              id: qr.campaign._id,
              name: qr.campaign.name,
            }
          : null,

        // URLs
        shortCode: qr.shortCode,
        shortUrl: `${baseUrl}/q/${qr.shortCode}`,
        destinationUrl: qr.destinationUrl,

        // Status
        status: qr.status,

        // Analytics
        totalScans: stats.totalScans,
        uniqueScans: stats.uniqueScans,
        lastScanned: stats.lastScanned,

        // Date
        createdAt: qr.createdAt,
      };
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },

      data,
    });
  } catch (error) {
    console.error("Get All QR Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch QR codes.",
      error: error.message,
    });
  }
};
// =====================================================
// CREATE QR
// =====================================================

const createQr = async (req, res) => {
  try {
    // ============================================================
    // STEP 01 - REQUEST RECEIVED
    // ============================================================

    const { doctorId, campaignId, quizId = null } = req.body;

    // ============================================================
    // STEP 02 - VALIDATION
    // ============================================================

    if (!doctorId || !campaignId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID and Campaign ID are required.",
      });
    }

    // ============================================================
    // STEP 03 - FIND DOCTOR
    // ============================================================

    const doctor = await Doctor.findOne({
      doctorId: doctorId,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Invalid Doctor ID.",
      });
    }

    // ============================================================
    // STEP 04 - FIND CAMPAIGN
    // ============================================================

    let campaign = null;

    // ------------------------------------------------------------
    // Try MongoDB _id
    // ------------------------------------------------------------

    if (mongoose.Types.ObjectId.isValid(campaignId)) {
      campaign = await Campaign.findById(campaignId);
    }

    // ------------------------------------------------------------
    // Try custom campaignId
    // ------------------------------------------------------------

    if (!campaign) {
      campaign = await Campaign.findOne({
        campaignId: campaignId,
      });
    }

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Invalid Campaign ID.",
      });
    }

    // ============================================================
    // STEP 05 - FIND QUIZ
    // ============================================================

    let quiz = null;

    if (quizId) {
      if (mongoose.Types.ObjectId.isValid(quizId)) {
        console.log("Trying Quiz.findById()...");

        quiz = await Quiz.findById(quizId);
      }

      if (!quiz) {
        quiz = await Quiz.findOne({
          quizId: quizId,
        });
      }

      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: "Invalid Quiz ID.",
        });
      }
    } else {
    }

    // ============================================================
    // STEP 06 - GENERATE SHORT CODE
    // ============================================================

    let shortCode;
    let existingQr;

    let attempts = 0;

    do {
      attempts++;

      shortCode = Math.random().toString(36).substring(2, 9).toUpperCase();

      existingQr = await QR.findOne({
        shortCode,
      });

      if (attempts > 20) {
        throw new Error("Could not generate unique short code.");
      }
    } while (existingQr);

    // ============================================================
    // STEP 07 - CHECK MONGO CONNECTION
    // ============================================================

    /*
      readyState:

      0 = disconnected
      1 = connected
      2 = connecting
      3 = disconnecting
    */

    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB is not connected.");
    }

    // ============================================================
    // STEP 08 - CREATE QR URL
    // ============================================================

    const baseUrl =
      process.env.QR_BASE_URL ||"192.168.1.15:2468" ;

    const qrUrl = `${baseUrl}/q/${shortCode}`;

    // ============================================================
    // STEP 09 - GENERATE QR DATA URL
    // ============================================================

    const qrCode = await QRCode.toDataURL(qrUrl);

    // ============================================================
    // STEP 10 - GENERATE QR SVG
    // ============================================================

    const qrCodeSvg = await QRCode.toString(qrUrl, {
      type: "svg",
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    console.log("qrcode", qrUrl);

    // ============================================================
    // STEP 11 - PREPARE DATABASE OBJECT
    // ============================================================

    const qrData = {
      doctor: doctor._id,

      campaign: campaign._id,

      quiz: quiz ? quiz._id : null,

      shortCode,

      destinationType: "video",

      destinationUrl: null,

      qrCode,

      qrCodeSvg,

      status: "active",

      expiresAt: null,
    };

    // ============================================================
    // STEP 12 - SAVE TO MONGODB
    // ============================================================

    const qr = await QR.create(qrData);

    // ============================================================
    // STEP 13 - VERIFY FROM DATABASE
    // ============================================================

    const savedQr = await QR.findById(qr._id).lean();

    if (!savedQr) {
      throw new Error(
        "QR was created but could not be found immediately after creation.",
      );
    }

    // ============================================================
    // STEP 14 - RESPONSE
    // ============================================================

    return res.status(201).json({
      success: true,

      message: "QR code generated successfully.",

      qr: {
        id: qr._id,

        doctor: qr.doctor,

        campaign: qr.campaign,

        quiz: qr.quiz,

        shortCode: qr.shortCode,

        qrUrl,

        destinationType: qr.destinationType,

        destinationUrl: qr.destinationUrl,

        status: qr.status,

        qrCode: qr.qrCode,

        qrCodeSvg: qr.qrCodeSvg,

        expiresAt: qr.expiresAt,

        createdAt: qr.createdAt,
      },
    });
  } catch (error) {
    // ============================================================
    // ERROR
    // ============================================================

    console.error("Error Name:", error.name);

    console.error("Error Message:", error.message);

    console.error("Full Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =====================================================
// get QR DASHBOARD
// =====================================================

const getQRDashboard = async (req, res) => {
  try {
    // ==========================================
    // 1. TOTAL QR CODES
    // ==========================================

    const totalQRCodes = await QR.countDocuments();

    // ==========================================
    // 2. TOTAL SCANS
    // ==========================================

    const totalScans = await QRScan.countDocuments();

    // ==========================================
    // 3. UNIQUE SCANS
    // ==========================================
    // Unique scan = unique IP address
    //
    // If the same IP scans multiple times:
    //
    // 192.168.1.10
    // 192.168.1.10
    // 192.168.1.10
    //
    // It will count as ONE unique scan.
    // ==========================================

    const uniqueScansResult = await QRScan.aggregate([
      {
        $match: {
          ipAddress: {
            $exists: true,
            $ne: null,
            $ne: "",
          },
        },
      },
      {
        $group: {
          _id: "$ipAddress",
        },
      },
      {
        $count: "uniqueScans",
      },
    ]);

    const uniqueScans = uniqueScansResult[0]?.uniqueScans || 0;

    // ==========================================
    // 4. LAST SCAN
    // ==========================================

    const lastScan = await QRScan.findOne()
      .sort({ scannedAt: -1 })
      .populate({
        path: "doctor",
        select: "doctorId name city state",
      })
      .populate({
        path: "qr",
        select: "shortCode destinationType destinationUrl",
      })
      .lean();

    // ==========================================
    // 5. RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      data: {
        // ======================================
        // QR STATS
        // ======================================

        totalQRCodes,

        totalScans,

        uniqueScans,

        // ======================================
        // LAST SCAN
        // ======================================

        lastScan: lastScan
          ? {
              scanId: lastScan._id,

              scannedAt: lastScan.scannedAt,

              // IP address of last scan
              ipAddress: lastScan.ipAddress,

              doctor: lastScan.doctor
                ? {
                    id: lastScan.doctor._id,
                    doctorId: lastScan.doctor.doctorId,
                    name: lastScan.doctor.name,
                    city: lastScan.doctor.city,
                    state: lastScan.doctor.state,
                  }
                : null,

              qr: lastScan.qr
                ? {
                    id: lastScan.qr._id,
                    shortCode: lastScan.qr.shortCode,
                    destinationType: lastScan.qr.destinationType,
                    destinationUrl: lastScan.qr.destinationUrl,
                  }
                : null,

              location: {
                city: lastScan.city || null,
                state: lastScan.state || null,
              },
            }
          : null,
      },
    });
  } catch (error) {
    console.error("QR Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch QR dashboard data",
      error: error.message,
    });
  }
};
// ==========================================
// GET QR SCANS OVER TIME
// ==========================================
const getQRScansOverTime = async (req, res) => {
  try {
    const { range = "7d" } = req.query;

    // -------------------------------
    // Calculate date range
    // -------------------------------
    const endDate = new Date();
    const startDate = new Date();

    if (range === "7d") {
      startDate.setDate(startDate.getDate() - 6);
    } else if (range === "1m") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (range === "6m") {
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (range === "1y") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid range. Use 7d, 1m, 6m or 1y",
      });
    }

    // Start of the first day
    startDate.setHours(0, 0, 0, 0);

    // End of today
    endDate.setHours(23, 59, 59, 999);

    // -------------------------------
    // MongoDB aggregation
    // -------------------------------
    const scans = await QRScan.aggregate([
      {
        $match: {
          scannedAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$scannedAt",
            },
          },

          scans: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },

      {
        $project: {
          _id: 0,
          date: "$_id",
          scans: 1,
        },
      },
    ]);

    // -------------------------------
    // Add days having zero scans
    // -------------------------------
    const result = [];

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0];

      const existingData = scans.find((item) => item.date === dateString);

      result.push({
        date: dateString,
        scans: existingData ? existingData.scans : 0,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // -------------------------------
    // Response
    // -------------------------------
    res.status(200).json({
      success: true,
      range,
      data: result,
    });
  } catch (error) {
    console.error("QR scans analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch QR scans analytics",
      error: error.message,
    });
  }
};

// ======================================================
// TRACK QR SCAN
// ======================================================
const trackQrScan = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // ==========================================
    // 1. VALIDATE SHORT CODE
    // ==========================================

    if (!shortCode) {
      return res.status(400).json({
        success: false,
        message: "QR short code is required.",
      });
    }

    // ==========================================
    // 2. FIND QR
    // ==========================================

    const qr = await QR.findOne({
      shortCode: shortCode.trim().toUpperCase(),
      status: "active",
    }).lean();

    if (!qr) {
      return res.status(404).json({
        success: false,
        message: "QR code not found or inactive.",
      });
    }

    // ==========================================
    // 3. GET USER INFORMATION
    // ==========================================

    const deviceInfo = await getUserDeviceInfo(req);

    const ipAddress = deviceInfo.ipAddress || null;

    // ==========================================
    // 4. CHECK IF THIS IS A UNIQUE SCAN
    // ==========================================
    // Unique means:
    //
    // This IP has NEVER scanned this QR before.
    //
    // Same IP + same QR
    //       → uniqueScan = false
    //
    // New IP + same QR
    //       → uniqueScan = true
    //
    // Same IP + different QR
    //       → uniqueScan = true
    // ==========================================

    let uniqueScan = false;

    if (ipAddress) {
      const existingScan = await QRScan.findOne({
        qr: qr._id,
        ipAddress: ipAddress,
      })
        .select("_id")
        .lean();

      uniqueScan = !existingScan;
    }

    // ==========================================
    // 5. GENERATE SESSION ID
    // ==========================================

    const sessionId = uuidv4();

    // ==========================================
    // 6. CREATE COMPLETE QR SCAN
    // ==========================================

    const scan = await QRScan.create({
      // QR relation
      qr: qr._id,

      // Doctor & Campaign relations
      doctor: qr.doctor,
      campaign: qr.campaign,

      // Quiz
      quizAttempt: null,

      // Session
      sessionId,

      // Location
      city: deviceInfo.city || null,
      state: deviceInfo.state || null,

      // Network
      ipAddress,

      // Unique scan
      uniqueScan,

      // Device
      deviceType: deviceInfo.deviceType || "unknown",
      userAgent: deviceInfo.userAgent || "unknown",

      // Conversion
      converted: false,

      // Scan time
      scannedAt: new Date(),
    });

    // ==========================================
    // 7. CHECK DESTINATION URL
    // ==========================================

    if (!qr.destinationUrl) {
      return res.status(200).json({
        success: true,
        message:
          "QR scan registered, but destination URL is not configured.",

        data: {
          id: scan._id,
          qr: scan.qr,
          doctor: scan.doctor,
          campaign: scan.campaign,
          sessionId: scan.sessionId,
          uniqueScan: scan.uniqueScan,
        },
      });
    }

    // ==========================================
    // 8. REDIRECT USER
    // ==========================================

    return res.redirect(qr.destinationUrl);
  } catch (error) {
    console.error("Track QR Scan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process QR scan.",
      error: error.message,
    });
  }
};
// =====================================================
// UPDATE QR
// =====================================================

const updateQr = async (req, res) => {
  try {
    const { qrId } = req.params;

    const {
      doctor,
      campaign,
      destinationType,
      destinationUrl,
      status,
      expiresAt,
    } = req.body;

    // =====================================================
    // VALIDATE QR ID
    // =====================================================

    if (!mongoose.Types.ObjectId.isValid(qrId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR ID",
      });
    }

    // =====================================================
    // FIND QR
    // =====================================================

    const qr = await QR.findById(qrId);

    if (!qr) {
      return res.status(404).json({
        success: false,
        message: "QR code not found",
      });
    }

    // =====================================================
    // UPDATE DOCTOR
    // =====================================================

    if (doctor !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(doctor)) {
        return res.status(400).json({
          success: false,
          message: "Invalid doctor ID",
        });
      }

      const existingDoctor = await Doctor.findById(doctor);

      if (!existingDoctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      }

      qr.doctor = doctor;
    }

    // =====================================================
    // UPDATE CAMPAIGN
    // =====================================================

    if (campaign !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(campaign)) {
        return res.status(400).json({
          success: false,
          message: "Invalid campaign ID",
        });
      }

      const existingCampaign = await Campaign.findById(campaign);

      if (!existingCampaign) {
        return res.status(404).json({
          success: false,
          message: "Campaign not found",
        });
      }

      qr.campaign = campaign;
    }

    // =====================================================
    // UPDATE DESTINATION TYPE
    // =====================================================

    if (destinationType !== undefined) {
      const allowedDestinationTypes = ["video", "quiz", "landing_page"];

      if (!allowedDestinationTypes.includes(destinationType)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid destination type. Allowed values: video, quiz, landing_page",
        });
      }

      qr.destinationType = destinationType;
    }

    // =====================================================
    // UPDATE DESTINATION URL
    // =====================================================

    if (destinationUrl !== undefined) {
      qr.destinationUrl = destinationUrl?.trim() || null;
    }

    // =====================================================
    // UPDATE STATUS
    // =====================================================

    if (status !== undefined) {
      const allowedStatuses = ["active", "inactive", "expired"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Allowed values: active, inactive, expired",
        });
      }

      qr.status = status;
    }

    // =====================================================
    // UPDATE EXPIRY
    // =====================================================

    if (expiresAt !== undefined) {
      if (expiresAt === null || expiresAt === "") {
        qr.expiresAt = null;
      } else {
        const expiryDate = new Date(expiresAt);

        if (Number.isNaN(expiryDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid expiresAt date",
          });
        }

        qr.expiresAt = expiryDate;
      }
    }

    // =====================================================
    // IMPORTANT
    // =====================================================
    // We DO NOT change:
    //
    // qr.shortCode
    // qr.qrCode
    // qr.qrCodeSvg
    //
    // The existing QR image remains exactly the same.
    // Only the destination/data behind the dynamic QR changes.
    // =====================================================

    // =====================================================
    // SAVE QR
    // =====================================================

    await qr.save();

    // =====================================================
    // GET UPDATED QR
    // =====================================================

    const updatedQR = await QR.findById(qr._id)
      .populate("doctor")
      .populate("campaign")
      .populate("quiz");

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      message: "QR code updated successfully",
      data: updatedQR,
    });
  } catch (error) {
    console.error("Update QR Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update QR code",
      error: error.message,
    });
  }
};

// =====================================================
// Export QR Excel
// =====================================================


const exportQrExcel = async (req, res) => {
  try {
    // ==========================================
    // GET ALL QR CODES
    // ==========================================

    const qrs = await QR.find()
      .populate("doctor", "name doctorId")
      .populate("campaign", "name")
      .sort({ createdAt: -1 })
      .lean();

    // ==========================================
    // GET QR IDs
    // ==========================================

    const qrIds = qrs.map((qr) => qr._id);

    // ==========================================
    // GET SCAN ANALYTICS
    // ==========================================

    const scanStats = await QRScan.aggregate([
      {
        $match: {
          qr: {
            $in: qrIds,
          },
        },
      },
      {
        $group: {
          _id: "$qr",

          totalScans: {
            $sum: 1,
          },

          uniqueSessions: {
            $addToSet: "$sessionId",
          },

          lastScanned: {
            $max: "$scannedAt",
          },
        },
      },
    ]);

    // ==========================================
    // CREATE STATS MAP
    // ==========================================

    const statsMap = new Map();

    scanStats.forEach((item) => {
      const uniqueSessions = item.uniqueSessions.filter(
        (session) => session !== null && session !== undefined,
      );

      statsMap.set(item._id.toString(), {
        totalScans: item.totalScans,
        uniqueScans: uniqueSessions.length,
        lastScanned: item.lastScanned,
      });
    });

    // ==========================================
    // BASE URL
    // ==========================================

    const baseUrl = process.env.QR_BASE_URL || "http://192.168.1.37:2468";

    // ==========================================
    // CREATE EXCEL WORKBOOK
    // ==========================================

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "QR Management System";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("QR Codes");

    // ==========================================
    // COLUMNS
    // ==========================================

    worksheet.columns = [
      {
        header: "Doctor Name",
        key: "doctorName",
        width: 25,
      },
      {
        header: "Doctor ID",
        key: "doctorId",
        width: 18,
      },
      {
        header: "Campaign",
        key: "campaign",
        width: 25,
      },
      {
        header: "Short Code",
        key: "shortCode",
        width: 18,
      },
      {
        header: "Short URL",
        key: "shortUrl",
        width: 40,
      },
      {
        header: "Destination Type",
        key: "destinationType",
        width: 20,
      },
      {
        header: "Destination URL",
        key: "destinationUrl",
        width: 50,
      },
      {
        header: "Status",
        key: "status",
        width: 15,
      },
      {
        header: "Total Scans",
        key: "totalScans",
        width: 15,
      },
      {
        header: "Unique Scans",
        key: "uniqueScans",
        width: 15,
      },
      {
        header: "Last Scanned",
        key: "lastScanned",
        width: 22,
      },
      {
        header: "Expiry Date",
        key: "expiresAt",
        width: 22,
      },
      {
        header: "Created At",
        key: "createdAt",
        width: 22,
      },
    ];

    // ==========================================
    // HEADER STYLE
    // ==========================================

    worksheet.getRow(1).font = {
      bold: true,
    };

    worksheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.getRow(1).height = 25;

    // ==========================================
    // ADD QR DATA
    // ==========================================

    qrs.forEach((qr) => {
      const stats = statsMap.get(qr._id.toString()) || {
        totalScans: 0,
        uniqueScans: 0,
        lastScanned: null,
      };

      worksheet.addRow({
        doctorName: qr.doctor?.name || "-",

        doctorId: qr.doctor?.doctorId || "-",

        campaign: qr.campaign?.name || "-",

        shortCode: qr.shortCode || "-",

        shortUrl: `${baseUrl}/q/${qr.shortCode}`,

        destinationType: qr.destinationType || "-",

        destinationUrl: qr.destinationUrl || "-",

        status: qr.status || "-",

        totalScans: stats.totalScans,

        uniqueScans: stats.uniqueScans,

        lastScanned: stats.lastScanned ? new Date(stats.lastScanned) : "-",

        expiresAt: qr.expiresAt ? new Date(qr.expiresAt) : "-",

        createdAt: qr.createdAt ? new Date(qr.createdAt) : "-",
      });
    });

    // ==========================================
    // DATE FORMATTING
    // ==========================================

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        return;
      }

      // Last Scanned
      row.getCell("lastScanned").numFmt = "dd-mmm-yyyy hh:mm AM/PM";

      // Expiry
      row.getCell("expiresAt").numFmt = "dd-mmm-yyyy hh:mm AM/PM";

      // Created At
      row.getCell("createdAt").numFmt = "dd-mmm-yyyy hh:mm AM/PM";
    });

    // ==========================================
    // FREEZE HEADER
    // ==========================================

    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    // ==========================================
    // RESPONSE HEADERS
    // ==========================================

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="qr-codes.xlsx"',
    );

    // ==========================================
    // SEND EXCEL FILE
    // ==========================================

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.error("Export QR Excel Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export QR codes to Excel.",
      error: error.message,
    });
  }
};

// =====================================================
// Download Zip QR
// =====================================================

const downloadAllQrZip = async (req, res) => {
  try {
    // ==========================================
    // GET ALL QR CODES
    // ==========================================

    const qrs = await QR.find({})
      .populate("doctor", "name doctorId")
      .select("qrCodeSvg shortCode doctor")
      .lean();

    if (!qrs.length) {
      return res.status(404).json({
        success: false,
        message: "No QR codes found.",
      });
    }

    // ==========================================
    // ZIP RESPONSE HEADERS
    // ==========================================

    res.setHeader("Content-Type", "application/zip");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="all-qr-codes.zip"',
    );

    // ==========================================
    // CREATE ZIP
    // ==========================================

    const archive = archiver("zip", {
      zlib: {
        level: 9,
      },
    });

    // ==========================================
    // HANDLE ARCHIVE ERROR
    // ==========================================

    archive.on("error", (error) => {
      console.error("QR ZIP Archive Error:", error);

      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: "Failed to create QR ZIP file.",
          error: error.message,
        });
      }

      res.end();
    });

    // ==========================================
    // PIPE ZIP TO RESPONSE
    // ==========================================

    archive.pipe(res);

    // ==========================================
    // ADD EVERY QR IMAGE
    // ==========================================

    qrs.forEach((qr, index) => {
      if (!qr.qrCodeSvg) {
        return;
      }

      // ------------------------------------------
      // REMOVE XML / SVG DATA PREFIX IF PRESENT
      // ------------------------------------------

      let svgData = qr.qrCodeSvg;

      if (svgData.includes("<svg")) {
        const svgStart = svgData.indexOf("<svg");

        svgData = svgData.substring(svgStart);
      }

      // ------------------------------------------
      // CREATE FILE NAME
      // ------------------------------------------

      const doctorName = qr.doctor?.name
        ? qr.doctor.name.replace(/[^a-zA-Z0-9-_]/g, "_")
        : "doctor";

      const shortCode = qr.shortCode || `qr-${index + 1}`;

      const fileName = `${doctorName}_${shortCode}.svg`;

      // ------------------------------------------
      // ADD SVG TO ZIP
      // ------------------------------------------

      archive.append(svgData, {
        name: fileName,
      });
    });

    // ==========================================
    // FINALIZE ZIP
    // ==========================================

    await archive.finalize();
  } catch (error) {
    console.error("Download All QR ZIP Error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to download QR codes.",
        error: error.message,
      });
    }
  }
};

module.exports = {
  getQRDashboard,
  getQRScansOverTime,
  createQr,
  getAllQr,
  trackQrScan,
  updateQr,
  exportQrExcel,
  downloadAllQrZip,
};
