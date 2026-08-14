const Campaign = require("../Model/CampaignModel");
const Client = require("../Model/ClientModel");
const Doctor = require("../Model/DoctorModel");
const QRScan = require("../Model/QRScanModel");
const QuizAttempt = require("../Model/QuizAttemptModel");
const XLSX = require("xlsx");

// ── helpers ───────────────────────────────────────────────
const generateCampaignId = () =>
  "CMP-" + Date.now().toString(36).toUpperCase();

// ════════════════════════════════════════════════
// GET /api/campaigns
// Query: ?status=active&client=<id>&page=1&limit=10&search=gerd
// ════════════════════════════════════════════════
const getAllCampaigns = async (req, res) => {
  console.log("Fetching campaigns with filters:", req.query);
  try {
    const { status, client, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (client) filter.client = client;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { therapyArea: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Campaign.countDocuments(filter);

    const campaigns = await Campaign.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("client", "companyName brandName logo")
      .populate("quiz", "name version status")
      .populate("createdBy", "name")
      .lean();

    // ── Attach live stats per campaign ────────────────────
    const campIds = campaigns.map((c) => c._id);

    const [scanCounts, attemptCounts, doctorCounts] = await Promise.all([
      QRScan.aggregate([
        { $match: { campaign: { $in: campIds } } },
        { $group: { _id: "$campaign", total: { $sum: 1 } } },
      ]),
      QuizAttempt.aggregate([
        { $match: { campaign: { $in: campIds } } },
        {
          $group: {
            _id: "$campaign",
            total: { $sum: 1 },
            completions: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
            avgScore: { $avg: "$score" },
          }
        },
      ]),
      Doctor.aggregate([
        { $match: { campaign: { $in: campIds } } },
        { $group: { _id: "$campaign", total: { $sum: 1 } } },
      ]),
    ]);

    const scanMap = Object.fromEntries(scanCounts.map((x) => [x._id.toString(), x.total]));
    const attemptMap = Object.fromEntries(attemptCounts.map((x) => [x._id.toString(), x]));
    const doctorMap = Object.fromEntries(doctorCounts.map((x) => [x._id.toString(), x.total]));

    const enriched = campaigns.map((c) => {
      const id = c._id.toString();
      const att = attemptMap[id] || {};
      const comp = att.completions || 0;
      const tot = att.total || 0;
      return {
        ...c,
        doctorCount: doctorMap[id] || 0,
        totalScans: scanMap[id] || 0,
        quizAttempts: tot,
        completions: comp,
        completionRate: tot > 0 ? +((comp / tot) * 100).toFixed(1) : 0,
        avgScore: att.avgScore ? +(att.avgScore).toFixed(1) : 0,
      };
    });

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: enriched,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// GET /api/campaigns/:id
// ════════════════════════════════════════════════
const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("client", "companyName brandName logo")
      .populate("quiz", "name version questions status timePerQuestion")
      .populate("createdBy", "name email")
      .lean();

    if (!campaign) return res.status(404).json({ success: false, error: "Campaign not found" });

    // ── Progress overview (for the side panel) ───────────
    const [doctorCount, scanCount, attemptAgg] = await Promise.all([
      Doctor.countDocuments({ campaign: campaign._id }),
      QRScan.countDocuments({ campaign: campaign._id }),
      QuizAttempt.aggregate([
        { $match: { campaign: campaign._id } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completions: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
            avgScore: { $avg: "$score" },
          }
        },
      ]),
    ]);

    const agg = attemptAgg[0] || {};
    const comp = agg.completions || 0;
    const tot = agg.total || 0;

    res.status(200).json({
      success: true,
      data: {
        ...campaign,
        stats: {
          doctorCount,
          totalScans: scanCount,
          quizAttempts: tot,
          completions: comp,
          completionRate: tot > 0 ? +((comp / tot) * 100).toFixed(1) : 0,
          avgScore: agg.avgScore ? +agg.avgScore.toFixed(1) : 0,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// POST /api/campaigns
// ════════════════════════════════════════════════
// const createCampaign = async (req, res) => {
//   try {
//     const {
//       name, therapyArea, brand, description,
//       startDate, endDate, targetDoctors, client, quiz,
//     } = req.body;

//     if (!name)   return res.status(400).json({ success: false, error: "name is required" });
//     if (!client) return res.status(400).json({ success: false, error: "client is required" });

//     const clientDoc = await Client.findById(client);
//     if (!clientDoc) return res.status(404).json({ success: false, error: "Client not found" });

//     const campaign = new Campaign({
//       campaignId: generateCampaignId(),
//       name,
//       therapyArea,
//       brand,
//       description,
//       startDate,
//       endDate,
//       targetDoctors: targetDoctors || 0,
//       client,
//       quiz:      quiz || null,
//       thumbnail: req.file?.path || null,
//       createdBy: req.admin?._id || null,
//     });

//     await campaign.save();

//     // Link back to client
//     await Client.findByIdAndUpdate(client, {
//       $addToSet: { campaigns: campaign._id },
//     });

//     res.status(201).json({ success: true, data: campaign });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// ════════════════════════════════════════════════
// PUT /api/campaigns/:id
// ════════════════════════════════════════════════
// const updateCampaign = async (req, res) => {
//   try {
//     const allowed = [
//       "name", "therapyArea", "brand", "description",
//       "startDate", "endDate", "targetDoctors", "status", "quiz",
//     ];

//     const updates = {};
//     allowed.forEach((key) => {
//       if (req.body[key] !== undefined) updates[key] = req.body[key];
//     });

//     if (req.file?.path) updates.thumbnail = req.file.path;

//     const campaign = await Campaign.findByIdAndUpdate(
//       req.params.id,
//       { $set: updates },
//       { new: true, runValidators: true }
//     ).populate("client", "companyName brandName");

//     if (!campaign) return res.status(404).json({ success: false, error: "Campaign not found" });

//     res.status(200).json({ success: true, data: campaign });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// ════════════════════════════════════════════════
// DELETE /api/campaigns/:id
// ════════════════════════════════════════════════
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, error: "Campaign not found" });

    if (campaign.status === "active") {
      return res.status(400).json({
        success: false,
        error: "Cannot delete an active campaign. Pause or archive it first.",
      });
    }

    // Remove from client's campaigns array
    await Client.findByIdAndUpdate(campaign.client, {
      $pull: { campaigns: campaign._id },
    });

    await Campaign.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Campaign deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// GET /api/campaigns/:id/stats
// Detailed stats for Campaign Overview side panel
// ════════════════════════════════════════════════
const getCampaignStats = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).lean();
    if (!campaign) return res.status(404).json({ success: false, error: "Campaign not found" });

    const [doctorCount, scanCount, attemptAgg, locationBreakdown] = await Promise.all([

      Doctor.countDocuments({ campaign: campaign._id }),

      QRScan.countDocuments({ campaign: campaign._id }),

      QuizAttempt.aggregate([
        { $match: { campaign: campaign._id } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completions: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
            avgScore: { $avg: "$score" },
          }
        },
      ]),

      // Scans grouped by state
      QRScan.aggregate([
        { $match: { campaign: campaign._id } },
        { $group: { _id: "$state", scans: { $sum: 1 } } },
        { $sort: { scans: -1 } },
        { $limit: 10 },
      ]),
    ]);

    const agg = attemptAgg[0] || {};
    const comp = agg.completions || 0;
    const tot = agg.total || 0;

    res.status(200).json({
      success: true,
      data: {
        doctorsOnboarded: doctorCount,
        targetDoctors: campaign.targetDoctors,
        doctorProgress: campaign.targetDoctors > 0
          ? +((doctorCount / campaign.targetDoctors) * 100).toFixed(1)
          : 0,
        totalScans: scanCount,
        quizAttempts: tot,
        completions: comp,
        completionRate: tot > 0 ? +((comp / tot) * 100).toFixed(1) : 0,
        avgScore: agg.avgScore ? +agg.avgScore.toFixed(1) : 0,
        locationBreakdown,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


const getCampaignDashBoardData = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;

  const skip = (page - 1) * limit;

  try {
    const [
      campaignData,
      totalCampaigns,
      totalDoctors,
      totalQrScans,
      campaignPerformance,
    ] = await Promise.all([

      // ============================
      // CAMPAIGNS
      // ============================
      Campaign.find()
        .select(
          "name therapyArea description brand doctors quiz startDate endDate status"
        )
        .populate("quiz", "name version")
        .populate("client", "companyName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      // ============================
      // TOTAL CAMPAIGNS
      // ============================
      Campaign.countDocuments(),

      // ============================
      // TOTAL DOCTORS
      // ============================
      Doctor.countDocuments(),

      // ============================
      // TOTAL QR SCANS
      // ============================
      QRScan.countDocuments(),

      // ============================
      // CAMPAIGN PERFORMANCE
      // ============================
      Doctor.aggregate([
        // Doctors which have at least one campaign
        {
          $match: {
            campaign: {
              $exists: true,
              $ne: [],
            },
          },
        },

        // One doctor document for every campaign
        {
          $unwind: "$campaign",
        },

        // Group doctors by campaign
        {
          $group: {
            _id: "$campaign",

            // Total completions for campaign
            completions: {
              $sum: "$completions",
            },

            // Used for weighted average score
            weightedScore: {
              $sum: {
                $multiply: [
                  "$avgScore",
                  "$completions",
                ],
              },
            },
          },
        },

        // Calculate campaign average score
        {
          $project: {
            _id: 1,

            completions: 1,

            avgScore: {
              $cond: [
                {
                  $gt: ["$completions", 0],
                },
                {
                  $divide: [
                    "$weightedScore",
                    "$completions",
                  ],
                },
                0,
              ],
            },
          },
        },
      ]),
    ]);


    // ============================================
    // Create campaign performance lookup
    // ============================================

    const performanceMap = Object.fromEntries(
      campaignPerformance.map((item) => [
        item._id.toString(),
        item,
      ])
    );


    // ============================================
    // Add performance to each campaign
    // ============================================

    const enrichedCampaignData = campaignData.map(
      (campaign) => {

        const performance =
          performanceMap[campaign._id.toString()];

        return {
          ...campaign,

          completions:
            performance?.completions || 0,

          avgScore: performance
            ? Number(
              performance.avgScore.toFixed(1)
            )
            : 0,
        };
      }
    );


    // ============================================
    // RESPONSE
    // ============================================

    res.status(200).json({
      success: true,

      campaignData: enrichedCampaignData,

      totalCampaigns,

      currentPages: page,

      totalPages: Math.ceil(
        totalCampaigns / limit
      ),

      totalDoctors,

      totalQrScans,
    });

  } catch (error) {

    console.error(
      "Campaign Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createCampaigns = async (req, res) => {
  try {
    const { name, therapyArea, brand, description, clientId, status } = req.body;



    if (!name || !clientId) {
      return res.status(400).json({
        success: false,
        message: "Name and clientId are required"
      });
    }

    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }

    const customCampaignId = generateCampaignId();

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);


    await Campaign.create({
      campaignId: customCampaignId,
      name,
      therapyArea,
      brand,
      description,
      startDate: new Date(),
      endDate,
      client: clientId,
      status: status?.toLowerCase() || "active",
    })

    return res.status(201).json({
      success: true,
      message: "Campaign created Successfully"
    })
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}


const updateCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) return res.status(404).json({ success: false, message: "Campaign not found." })

    const oldClientId = campaign.client;

    const { name, therapyArea, brand, description, clientId, status } = req.body;

    if (!name || !clientId) {
      return res.status(400).json({
        success: false,
        message: "Name and clientId are required"
      });
    }


    if (clientId !== oldClientId.toString()) {
      await Client.findByIdAndUpdate(
        oldClientId,

        {
          $pull: {
            campaigns: campaign._id
          }
        }
      )

      await Client.findByIdAndUpdate(
        clientId,

        {
          $addToSet: {
            campaigns: campaign._id
          }
        }
      )
    }


    await Campaign.findByIdAndUpdate(
      campaignId,
      {
        name,
        therapyArea,
        brand,
        description,
        client: clientId,
        status: status?.toLowerCase() || "active",
      }, {
      new: true
    })

    return res.status(200).json({
      success: true,
      message: "Campaign updated Successfully"
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal servor error."
    })
  }
}

const campaignSelector = async (req, res) => {
  try {
    const campaignResponse = await Campaign.find(
      {},
      {
        _id: 1,
        name: 1,
        topic: "$therapyArea",
      },
      {

      }
    ).sort({ name: 1 }).lean()

    return res.status(200).json({
      success: true,
      campaignSelector: campaignResponse
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    })
  }
}




// =====================================================
// EXPORT ACTIVE CAMPAIGNS TO EXCEL
// =====================================================

// =====================================================
// EXPORT ALL CAMPAIGNS TO EXCEL
// =====================================================

const exportAllCampaigns = async (req, res) => {
  try {
    // =================================================
    // GET ALL CAMPAIGNS
    // =================================================

    const campaigns = await Campaign.find({})
      .populate("client")
      .populate("quiz")
      .populate("doctors")
      .populate("createdBy")
      .lean();

    // =================================================
    // CONVERT CAMPAIGNS TO EXCEL DATA
    // =================================================

    const excelData = campaigns.map((campaign) => ({
      "Campaign ID": campaign.campaignId || "",

      Name: campaign.name || "",

      "Therapy Area": campaign.therapyArea || "",

      Brand: campaign.brand || "",

      Description: campaign.description || "",

      Thumbnail: campaign.thumbnail || "",

      "Start Date": campaign.startDate
        ? new Date(campaign.startDate).toLocaleDateString()
        : "",

      "End Date": campaign.endDate
        ? new Date(campaign.endDate).toLocaleDateString()
        : "",

      Status: campaign.status || "",

      "Target Doctors": campaign.targetDoctors || 0,

      // =================================================
      // CLIENT
      // =================================================

      "Client ID": campaign.client?._id
        ? campaign.client._id.toString()
        : "",

      "Client Name": campaign.client?.name || "",

      "Client Email": campaign.client?.email || "",

      // =================================================
      // QUIZZES
      // =================================================

      "Quiz IDs": Array.isArray(campaign.quiz)
        ? campaign.quiz
            .map((quiz) =>
              quiz?._id
                ? quiz._id.toString()
                : ""
            )
            .filter(Boolean)
            .join(", ")
        : "",

      "Quiz Names": Array.isArray(campaign.quiz)
        ? campaign.quiz
            .map((quiz) => quiz?.name || "")
            .filter(Boolean)
            .join(", ")
        : "",

      // =================================================
      // DOCTORS
      // =================================================

      "Doctor IDs": Array.isArray(campaign.doctors)
        ? campaign.doctors
            .map((doctor) =>
              doctor?._id
                ? doctor._id.toString()
                : ""
            )
            .filter(Boolean)
            .join(", ")
        : "",

      "Doctor Names": Array.isArray(campaign.doctors)
        ? campaign.doctors
            .map((doctor) => doctor?.name || "")
            .filter(Boolean)
            .join(", ")
        : "",

      // =================================================
      // CREATED BY
      // =================================================

      "Created By ID": campaign.createdBy?._id
        ? campaign.createdBy._id.toString()
        : "",

      "Created By Name":
        campaign.createdBy?.name || "",

      "Created By Email":
        campaign.createdBy?.email || "",

      // =================================================
      // TIMESTAMPS
      // =================================================

      "Created At": campaign.createdAt
        ? new Date(
            campaign.createdAt
          ).toLocaleString()
        : "",

      "Updated At": campaign.updatedAt
        ? new Date(
            campaign.updatedAt
          ).toLocaleString()
        : "",
    }));

    // =================================================
    // CREATE WORKSHEET
    // =================================================

    const worksheet = XLSX.utils.json_to_sheet(
      excelData
    );

    // =================================================
    // COLUMN WIDTH
    // =================================================

    const columns = Object.keys(
      excelData[0] || {}
    );

    worksheet["!cols"] = columns.map((column) => ({
      wch: Math.min(
        Math.max(column.length + 5, 15),
        40
      ),
    }));

    // =================================================
    // CREATE WORKBOOK
    // =================================================

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "All Campaigns"
    );

    // =================================================
    // CREATE XLSX BUFFER
    // =================================================

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // =================================================
    // DOWNLOAD FILE
    // =================================================

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="all-campaigns.xlsx"'
    );

    return res.send(excelBuffer);
  } catch (error) {
    console.error(
      "Export all campaigns error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to export campaigns",
      error: error.message,
    });
  }
};



module.exports = {
  getAllCampaigns,
  getCampaignById,
  // createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignStats,
  getCampaignDashBoardData,
  createCampaigns,
  campaignSelector,
  exportAllCampaigns
};