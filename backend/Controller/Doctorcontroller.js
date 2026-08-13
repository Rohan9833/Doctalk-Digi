const Doctor = require("../Model/DoctorModel");
const Campaign = require("../Model/CampaignModel");
const QRScan = require("../Model/QRScanModel");
const QuizAttempt = require("../Model/QuizAttemptModel");
const QRCode = require("qrcode"); // npm i qrcode

// ── helpers ───────────────────────────────────────────────
const generateDoctorId = () => "DOC-" + Date.now().toString(36).toUpperCase();

// Short code for QR URL: "ML9823" style
const generateShortCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

// Detect device type from user-agent string
const detectDevice = (ua = "") => {
  if (!ua) return "unknown";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
};

// ════════════════════════════════════════════════
// GET /api/doctors
// Query: ?status=active&campaign=<id>&city=Mumbai&
//        specialty=Gastro&page=1&limit=10&search=lele
// ════════════════════════════════════════════════
const getAllDoctors = async (req, res) => {
  try {
    const {
      status,
      campaign,
      city,
      specialty,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (campaign) filter.campaign = campaign;
    if (city && city !== "all") filter.city = { $regex: city, $options: "i" };
    if (specialty && specialty !== "all")
      filter.specialty = { $regex: specialty, $options: "i" };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialty: { $regex: search, $options: "i" } },
        { clinic: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Doctor.countDocuments(filter);

    const doctors = await Doctor.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("campaign", "name therapyArea brand")
      .populate("mr", "mrName mrId HQ")
      .lean();

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: doctors,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
const exportDoctors = async (req, res) => {
  try {
    const {
      status,
      campaign,
      city,
      specialty,
      search,
    } = req.query;

    // ==========================================
    // BUILD FILTER
    // ==========================================

    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (campaign) {
      filter.campaign = campaign;
    }

    if (city && city !== "all") {
      filter.city = {
        $regex: city,
        $options: "i",
      };
    }

    if (specialty && specialty !== "all") {
      filter.specialty = {
        $regex: specialty,
        $options: "i",
      };
    }

    // ==========================================
    // SEARCH
    // ==========================================

    if (search && search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          specialty: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          clinic: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          city: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // ==========================================
    // GET ALL DOCTORS
    // NO PAGINATION
    // ==========================================

    const doctors = await Doctor.find(filter)
      .sort({ createdAt: -1 })
      .populate("campaign", "name therapyArea brand")
      .populate("mr", "mrName mrId HQ")
      .lean();

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,
      total: doctors.length,
      data: doctors,
    });
  } catch (err) {
    console.error("Export Doctors Error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};


// ════════════════════════════════════════════════
// GET /api/doctors/:id
// ════════════════════════════════════════════════
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("campaign", "name therapyArea brand quiz")
      .populate("mr", "mrName mrId HQ region")
      .lean();

    if (!doctor)
      return res
        .status(404)
        .json({ success: false, error: "Doctor not found" });

    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// POST /api/doctors
// ════════════════════════════════════════════════
const createDoctor = async (req, res) => {
  try {
    const {
      name,
      specialty,
      qualification,
      registrationNumber,
      email,
      mobile,
      address,
      clinic,
      city,
      state,
      campaignIds,
      status,
    } = req.body;

    if (!name)
      return res
        .status(400)
        .json({ success: false, error: "name is required" });

    const campaigns = await Campaign.find({
      _id: { $in: campaignIds },
    }).select("_id");

    if (campaigns.length !== campaignIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more campaign IDs are invalid",
      });
    }

    // Build slug — ensure uniqueness
    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    let slug = baseSlug;
    let slugTaken = await Doctor.findOne({ pageSlug: slug });
    let counter = 1;
    while (slugTaken) {
      slug = `${baseSlug}-${counter++}`;
      slugTaken = await Doctor.findOne({ pageSlug: slug });
    }

    const doctor = await Doctor.create({
      doctorId: generateDoctorId(),
      name,
      specialty,
      clinic,
      qualification,
      registrationNumber,
      email,
      mobile,
      address,
      campaign: campaignIds,
      status,
      city,
      state,
      pageSlug: slug,
      photo: req.file?.path || null,
    });

    // Link doctor to campaign
    await Campaign.updateMany(
      {
        _id: { $in: campaignIds },
      },
      {
        $addToSet: {
          doctors: doctor._id,
        },
      },
    );

    res.status(201).json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// PUT /api/doctors/:id
// ════════════════════════════════════════════════
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const newCampaigns = req.body.campaignIds || [];

    const oldCampaigns = (doctor.campaign || []).map(String);

    const removedCampaigns = oldCampaigns.filter(
      (campaign) => !newCampaigns.includes(campaign),
    );

    const addedCampaigns = newCampaigns.filter(
      (campaignId) => !oldCampaigns.includes(campaignId),
    );

    if(removedCampaigns.length) {
          await Campaign.updateMany(
      {
        _id: { $in: removedCampaigns },
      },

      {
        $pull: {
          doctors: doctor._id,
        },
      },
    );
    }

    if(addedCampaigns.length) {
          await Campaign.updateMany(
      {
        _id: { $in: addedCampaigns },
      },

      {
        $addToSet: {
          doctors: doctor._id,
        },
      },
    );

    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,

      {
        name: req.body.name,
        specialty: req.body.specialty,
        qualification: req.body.qualification,
        registrationNumber: req.body.registrationNumber,
        email: req.body.email,
        mobile: req.body.mobile,
        clinic: req.body.clinic,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        campaign: newCampaigns,
        status: req.body.status,
      },

      {
        new: true,
        runValidators: true,
      },
    );


    return res.status(200).json({
  success: true,
  message: "Doctor updated successfully",
  doctor: updatedDoctor,
});
  } catch (error) {
      console.error(error);

  return res.status(500).json({
    success: false,
    message: error.message,
  });
  }
};

// ════════════════════════════════════════════════
// DELETE /api/doctors/:id
// ════════════════════════════════════════════════
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor)
      return res
        .status(404)
        .json({ success: false, error: "Doctor not found" });

    // Remove from campaign
    if (doctor.campaign) {
      await Campaign.findByIdAndUpdate(doctor.campaign, {
        $pull: { doctors: doctor._id },
      });
    }

    await Doctor.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// POST /api/doctors/:id/generate-qr
// Generates QR code PNG (base64) and short URL
// ════════════════════════════════════════════════
const generateQR = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor)
      return res
        .status(404)
        .json({ success: false, error: "Doctor not found" });

    const shortCode = generateShortCode();
    const BASE_URL = process.env.BASE_URL || "https://quiz.pharma.com";
    console.log("BASE_URL from env:", process.env.BASE_URL);
    const shortUrl = `${BASE_URL}/q/${shortCode}`;
    const fullUrl = `${BASE_URL}/dr/${doctor.pageSlug}`;

    // Generate QR as base64 PNG
    const qrBase64 = await QRCode.toDataURL(fullUrl, {
      width: 400,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });

    // Generate QR as SVG string
    const qrSvg = await QRCode.toString(fullUrl, { type: "svg" });

    // Save to doctor (in production save to S3 and store URL)
    doctor.qrCode = qrBase64; // swap for S3 URL in prod
    doctor.qrCodeSvg = qrSvg;
    doctor.shortUrl = shortUrl;
    doctor.qrStatus = "active";
    await doctor.save();

    res.status(200).json({
      success: true,
      data: {
        qrCode: qrBase64,
        qrSvg,
        shortUrl,
        fullUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// GET /api/doctors/:id/scans
// Scan history for a doctor (used in "View Scans" panel)
// ════════════════════════════════════════════════
const getDoctorScans = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const total = await QRScan.countDocuments({ doctor: req.params.id });
    const scans = await QRScan.find({ doctor: req.params.id })
      .sort({ scannedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: scans,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// GET /api/doctors/page/:slug   ← PUBLIC ROUTE
// This is what loads when a patient scans the QR.
// Returns doctor info + quiz questions + video URLs.
// ════════════════════════════════════════════════
const getDoctorPage = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      pageSlug: req.params.slug,
      pageStatus: "published",
      status: "active",
    })
      .populate({
        path: "campaign",
        populate: { path: "quiz" },
      })
      .lean();

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, error: "Page not found or not published" });
    }

    // ── Log the QR scan ───────────────────────────────────
    const ua = req.headers["user-agent"] || "";
    const ip =
      req.headers["x-forwarded-for"] || req.socket?.remoteAddress || null;

    await QRScan.create({ //dsaasdad
      doctor: doctor._id,
      campaign: doctor.campaign._id,
      deviceType: detectDevice(ua),
      userAgent: ua,
      ipAddress: ip,
      scannedAt: new Date(),
    });

    // ── Increment doctor scan counter ─────────────────────
    await Doctor.findByIdAndUpdate(doctor._id, {
      $inc: { totalScans: 1 },
      $set: { lastScanned: new Date() },
    });

    // ── Return everything the quiz app needs ──────────────
    res.status(200).json({
      success: true,
      data: {
        doctor: {
          id: doctor._id,
          name: doctor.name,
          photo: doctor.photo,
          specialty: doctor.specialty,
          clinic: doctor.clinic,
          city: doctor.city,
          videos: doctor.videos,
        },
        quiz: doctor.campaign?.quiz || null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getDoctorDashboardData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const { search, currentTab, city, status, specialties } = req.query;

    let matchStage = {};

    if (currentTab === "Active") {
      matchStage.status = "active";
    } else if (currentTab === "Inactive") {
      matchStage.videoStatus = "pending";
    } else if (currentTab === "Draft Pages") {
      matchStage.pageStatus = "pending";
    }

    if (specialties && specialties !== "All Specialities") {
      matchStage.specialty = specialties;
    }

    if (city && city !== "All Cities") {
      matchStage.city = city;
    }

    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialty: { $regex: search, $options: "i" } },
        { clinic: { $regex: search, $options: "i" } },
      ];
    }

    const result = await Doctor.aggregate([
      {
        $facet: {
          data: [
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "campaigns",
                localField: "campaign",
                foreignField: "_id",
                as: "campaignDetails",
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                doctorId: 1,
                specialty: 1,
                city: 1,
                state: 1,
                email: 1,
                registrationNumber: "$registrationNo",
                qualification: 1,
                address: 1,
                mobile: 1,
                clinic: 1,
                pageUrl: 1,
                qrCode: 1,
                qrCodeSvg: 1,
                campaign: 1,
                campaignDetails: {
                  _id: 1,
                  name: 1,
                },
                status: 1,
                quizAttempts: 1,
                imageFilePath: 1,
                totalScans: 1,
                uniqueScans: 1,
              },
            },
          ],

          cities: [
            {
              $group: {
                _id: "$city",
              },
            },

            {
              $project: {
                _id: 0,
                city: "$_id",
              },
            },
          ],

          specialties: [
            {
              $group: {
                _id: "$specialty",
              },
            },

            {
              $project: {
                _id: 0,
                specialty: "$_id",
              },
            },
          ],

          statuses: [
            {
              $group: {
                _id: "$status",
              },
            },

            {
              $project: {
                _id: 0,
                status: "$_id",
              },
            },
          ],

          stats: [
            {
              $group: {
                _id: null,

                totalDoctors: {
                  $sum: 1,
                },

                publishedPages: {
                  $sum: {
                    $cond: [{ $eq: ["$pageStatus", "published"] }, 1, 0],
                  },
                },

                status: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "active"] }, 1, 0],
                  },
                },

                videoStatuses: {
                  $sum: {
                    $cond: [{ $eq: ["$videoStatus", "pending"] }, 1, 0],
                  },
                },
              },
            },
          ],

          metaData: [
            {
              $count: "totalCount",
            },
          ],
        },
      },
    ]);

    const doctorsData = result[0]?.data || [];
    const totalRecords = result[0]?.metaData[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalRecords / limit);
    const cities = result[0]?.cities || [];

    const specialti = result[0]?.specialties || [];

    const statuses = result[0]?.statuses || [];
    const stats = result[0]?.stats?.[0] || {};

    res.status(200).json({
      success: true,
      doctorsData,
      totalRecords,
      totalPages,
      cities,
      statuses,
      specialti,
      stats,
      currentPage: page,
    });
  } catch (error) {
    console.error("Dashboard Filter Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Error loading filtered dashboar.",
    });
  }
};

module.exports = {
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
};

