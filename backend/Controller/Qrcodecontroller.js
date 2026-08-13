const Doctor = require("../Model/DoctorModel");
const QRScan = require("../Model/Qrscanmodel");
const QRCode = require("qrcode");
const QR = require("../Model/QRModel");
const Campaign = require("../Model/CampaignModel");
const Quiz = require("../Model/QuizModel");

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

    const mongoose = require("mongoose");

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

    const baseUrl = process.env.QR_BASE_URL || "http://192.168.1.37:2468";


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
const getQRDashboard = async (req, res) => {
  try {
    // ==========================================
    // 1. TOTAL QR CODES
    // ==========================================

    const totalQRCodes = await Doctor.countDocuments({
      qrCode: { $exists: true, $ne: null, $ne: "" },
    });

    // ==========================================
    // 2. TOTAL SCANS
    // ==========================================

    const totalScansResult = await Doctor.aggregate([
      {
        $match: {
          qrCode: { $exists: true, $ne: null, $ne: "" },
        },
      },
      {
        $group: {
          _id: null,
          totalScans: {
            $sum: "$totalScans",
          },
        },
      },
    ]);

    const totalScans = totalScansResult[0]?.totalScans || 0;

    // ==========================================
    // 3. UNIQUE SCANS
    // ==========================================

    const uniqueScansResult = await Doctor.aggregate([
      {
        $match: {
          qrCode: { $exists: true, $ne: null, $ne: "" },
        },
      },
      {
        $group: {
          _id: null,
          uniqueScans: {
            $sum: "$uniqueScans",
          },
        },
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
        select: "doctorId name city state qrCode qrStatus",
      })
      .lean();

    // ==========================================
    // 5. RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      data: {
        totalQRCodes,

        totalScans,

        uniqueScans,

        lastScan: lastScan
          ? {
              scanId: lastScan._id,

              scannedAt: lastScan.scannedAt,

              doctor: lastScan.doctor
                ? {
                    id: lastScan.doctor._id,
                    doctorId: lastScan.doctor.doctorId,
                    name: lastScan.doctor.name,
                    city: lastScan.doctor.city,
                    state: lastScan.doctor.state,
                  }
                : null,

              location: {
                city: lastScan.city,
                state: lastScan.state,
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

module.exports = {
  getQRDashboard,
  getQRScansOverTime,
  createQr
};
