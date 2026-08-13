const Client = require("../Model/ClientModel");
const Campaign = require("../Model/CampaignModel");
const Doctor = require("../Model/DoctorModel");
const QRScan = require("../Model/QRScanModel");
const QuizAttempt = require("../Model/QuizAttemptModel");

// ── helpers ───────────────────────────────────────────────
const generateClientId = () => "CLT-" + Date.now().toString(36).toUpperCase();

// ════════════════════════════════════════════════
// GET /api/clients
// Query: ?status=active&page=1&limit=10&search=abc
// ════════════════════════════════════════════════
const getAllClients = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { brandName: { $regex: search, $options: "i" } },
        { primaryContact: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Client.countDocuments(filter);

    const clients = await Client.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("createdBy", "name email")
      .lean();

    // ── Attach live campaign/doctor counts ────────────────
    const clientIds = clients.map((c) => c._id);

    const [campaignCounts, doctorCounts] = await Promise.all([
      Campaign.aggregate([
        { $match: { client: { $in: clientIds } } },
        { $group: { _id: "$client", total: { $sum: 1 } } },
      ]),
      Doctor.aggregate([
        { $match: { campaign: { $exists: true } } },
        {
          $lookup: {
            from: "campaigns",
            localField: "campaign",
            foreignField: "_id",
            as: "camp",
          },
        },
        { $unwind: "$camp" },
        { $group: { _id: "$camp.client", total: { $sum: 1 } } },
      ]),
    ]);

    const campMap = Object.fromEntries(
      campaignCounts.map((x) => [x._id.toString(), x.total]),
    );
    const doctorMap = Object.fromEntries(
      doctorCounts.map((x) => [x._id.toString(), x.total]),
    );

    const enriched = clients.map((c) => ({
      ...c,
      campaignCount: campMap[c._id.toString()] || 0,
      doctorCount: doctorMap[c._id.toString()] || 0,
    }));

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
// GET /api/clients/:id
// ════════════════════════════════════════════════
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate("campaigns", "name status therapyArea startDate endDate")
      .populate("createdBy", "name email")
      .lean();

    if (!client)
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });

    res.status(200).json({ success: true, data: client });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// POST /api/clients
// ════════════════════════════════════════════════
const createClient = async (req, res) => {
  try {
    const {
      companyName,
      brandName,
      primaryContact,
      email,
      phone,
      address,
      city,
      state,
      country,
      website,
    } = req.body;

    if (!companyName) {
      return res
        .status(400)
        .json({ success: false, error: "companyName is required" });
    }

    const client = new Client({
      clientId: generateClientId(),
      companyName,
      brandName,
      primaryContact,
      email,
      phone,
      address,
      city,
      state,
      country,
      website,
      logo: req.file?.path || null, // if using multer for logo upload
      createdBy: req.admin?._id || null,
    });

    await client.save();
    res.status(201).json({ success: true, data: client });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// PUT /api/clients/:id
// ════════════════════════════════════════════════
const updateClient = async (req, res) => {
  try {
    const allowed = [
      "companyName",
      "brandName",
      "primaryContact",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "country",
      "website",
      "status",
    ];

    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    if (req.file?.path) updates.logo = req.file.path;

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!client)
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });

    res.status(200).json({ success: true, data: client });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// DELETE /api/clients/:id
// ════════════════════════════════════════════════
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client)
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });

    // Safety: don't delete if active campaigns exist
    const activeCampaigns = await Campaign.countDocuments({
      client: client._id,
      status: "active",
    });
    if (activeCampaigns > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete — ${activeCampaigns} active campaign(s) exist. Pause or archive them first.`,
      });
    }

    await Client.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// GET /api/clients/:id/stats
// Full analytics for the Client Details side panel
// ════════════════════════════════════════════════
const getClientStats = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).lean();
    if (!client)
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });

    // All campaigns for this client
    const campaigns = await Campaign.find(
      { client: client._id },
      "_id status",
    ).lean();
    const campIds = campaigns.map((c) => c._id);

    const [totalDoctors, totalScans, totalAttempts] = await Promise.all([
      Doctor.countDocuments({ campaign: { $in: campIds } }),
      QRScan.countDocuments({ campaign: { $in: campIds } }),
      QuizAttempt.countDocuments({ campaign: { $in: campIds } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter((c) => c.status === "active").length,
        totalDoctors,
        totalScans,
        totalAttempts,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// GET /api/clients/dashboard
// Client Dashboard
// ════════════════════════════════════════════════

const getClientDasboard = async (req, res) => {
  try {
    const { status, search } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const clientId = req.query.clientId;

    const clientMatch = clientId ? { clientId } : {};

    let matchStage = {};

    if (search) {
      matchStage.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { brandName: { $regex: search, $options: "i" } },
        { primaryContact: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (status === "Active") {
      matchStage.status = "active";
    } else if (status === "Inactive") {
      matchStage.status = "inactive";
    }

    if (clientId) {
      matchStage.clientId = clientId;
    }

    const clientPipeline = [
      {
        $facet: {
          // total clients, active and inactive clients for stats card
          totalClients: [
            {
              $group: {
                _id: null,

                count: {
                  $sum: 1,
                },

                activeClients: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "active"] }, 1, 0],
                  },
                },

                inactiveClients: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "inactive"] }, 1, 0],
                  },
                },
              },
            },
          ],

          totalCampaigns: [
            {
              $lookup: {
                from: "campaigns",
                localField: "campaigns",
                foreignField: "_id",
                as: "campaignData",
              },
            },

            {
              $unwind: "$campaignData",
            },

            {
              $group: {
                _id: null,

                totalCampaigns: {
                  $sum: 1,
                },

                activeCampaigns: {
                  $sum: {
                    $cond: [{ $eq: ["$campaignData.status", "active"] }, 1, 0],
                  },
                },

                InActiveCampaigns: {
                  $sum: {
                    $cond: [
                      { $eq: ["$campaignData.status", "inactive"] },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],

          totalDoctors: [
            {
              $lookup: {
                from: "campaigns",
                localField: "campaigns",
                foreignField: "_id",
                as: "campaignData",
              },
            },

            {
              $project: {
                doctorId: {
                  $reduce: {
                    input: "$campaignData.doctors",
                    initialValue: [],
                    in: {
                      $concatArrays: ["$$value", "$$this"],
                    },
                  },
                },
              },
            },

            {
              $lookup: {
                from: "doctors",
                localField: "doctorId",
                foreignField: "_id",
                as: "doctorData",
              },
            },

            {
              $unwind: "$doctorData",
            },

            {
              $group: {
                _id: null,

                totalDoctors: {
                  $sum: 1,
                },

                activeDoctors: {
                  $sum: {
                    $cond: [{ $eq: ["$doctorData.status", "active"] }, 1, 0],
                  },
                },

                InActiveDoctors: {
                  $sum: {
                    $cond: [{ $eq: ["$doctorData.status", "inactive"] }, 1, 0],
                  },
                },
              },
            },
          ],

          // Client Table Data

          clientTable: [
            {
              $match: matchStage,
            },

            {
              $skip: skip,
            },

            {
              $limit: limit,
            },

            {
              $lookup: {
                from: "campaigns",
                localField: "campaigns",
                foreignField: "_id",
                as: "campaignData",
              },
            },

            {
              $addFields: {
                doctorIds: {
                  $setUnion:[
                    {
                  $reduce: {
                    input: {
                      $map: {
                        input: "$campaignData",
                        as: "campaign",
                        in: {
                          $ifNull: ["$$campaign.doctors", []],
                        },
                      },
                    },
                    initialValue: [],
                    in: {
                      $concatArrays: ["$$value", "$$this"],
                    },
                  },
                },
                  ],
                },
              },
            },

            {
              $lookup: {
                from: "doctors",
                localField: "doctorIds",
                foreignField: "_id",
                as: "doctorData"
              }
            },

            {
              $addFields: {
                totalCampaigns: {
                  $size: "$campaignData"
                },
               
                totalDoctors: {
                  $size: "$doctorData"
                },

                totalScans: {
                  $sum: {
                    $map: {
                      input: "$doctorData",
                      as: "doctor",
                      in: {
                        $ifNull: ["$$doctor.totalScans", 0]
                      }
                    }
                  }
                }
              }
            },

            {
              $project: {
                _id: 0,
                clientId: 1,
                companyName: 1,
                brandName: 1,
                primaryContact: 1,
                email: 1,
                phone: 1,
                doctors: 1,
                status: 1,
                city: 1,
                state: 1,
                website: 1,
                address: 1,
                totalCampaigns: 1,
    totalDoctors: 1,
    totalScans: 1
              },
            },
          ],
        },
      },
    ];

    const [dashboard] = await Client.aggregate(clientPipeline);

    return res.status(200).json({
      success: true,
      totalClients: dashboard.totalClients?.[0] || {},
      totalCampaigns: dashboard.totalCampaigns?.[0] || {},
      totalDoctors: dashboard.totalDoctors?.[0] || {},
      clientTable: dashboard.clientTable || [],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json("Something went wrong");
  }
};




const clientForDropdownForForm = async (req, res) => {
  try {
    const clientResponse = await Client.aggregate([
      {
        $group: {
          _id: {
            id: "$_id",
            name: "$companyName"
          }
        }
      }
    ])

    return res.status(200).json({
      success: true,
      dropDown: clientResponse
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error..."
    })
  }
}




module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientStats,
  getClientDasboard,
  clientForDropdownForForm
};
