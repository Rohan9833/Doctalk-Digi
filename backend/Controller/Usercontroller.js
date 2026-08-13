const Tlm = require("../Model/tlmModel");
const Slm = require("../Model/slmModel");
const Flm = require("../Model/flmModel");
const Mr = require("../Model/mrModel");

exports.getAllUsers = async (req, res) => {
  try {
    // ==========================================
    // PAGINATION
    // ==========================================

    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const allowedLimits = [10, 20, 50];

    let limit = parseInt(req.query.limit) || 10;

    if (!allowedLimits.includes(limit)) {
      limit = 10;
    }

    // ==========================================
    // FETCH ALL USERS
    // ==========================================

    const [tlms, slms, flms, mrs] =
      await Promise.all([
        Tlm.find({})
          .select(
            "tlmId tlmName BUSINESSUNIT region zone"
          )
          .lean(),

        Slm.find({})
          .select(
            "slmId slmName BUSINESSUNIT region zone"
          )
          .lean(),

        Flm.find({})
          .select(
            "flmId flmName BUSINESSUNIT region zone"
          )
          .lean(),

        Mr.find({})
          .select(
            "mrId mrName BUSINESSUNIT region zone"
          )
          .lean(),
      ]);

    // ==========================================
    // NORMALIZE USERS
    // ==========================================

    const tlmUsers = tlms.map((user) => ({
      id: user._id,
      user: user.tlmName,
      userId: user.tlmId,
      role: "TLM",
      businessUnit: user.BUSINESSUNIT,
      region: user.region,
      zone: user.zone,
    }));

    const slmUsers = slms.map((user) => ({
      id: user._id,
      user: user.slmName,
      userId: user.slmId,
      role: "SLM",
      businessUnit: user.BUSINESSUNIT,
      region: user.region,
      zone: user.zone,
    }));

    const flmUsers = flms.map((user) => ({
      id: user._id,
      user: user.flmName,
      userId: user.flmId,
      role: "FLM",
      businessUnit: user.BUSINESSUNIT,
      region: user.region,
      zone: user.zone,
    }));

    const mrUsers = mrs.map((user) => ({
      id: user._id,
      user: user.mrName,
      userId: user.mrId,
      role: "MR",
      businessUnit: user.BUSINESSUNIT,
      region: user.region,
      zone: user.zone,
    }));

    // ==========================================
    // COMBINE
    // ==========================================

    const users = [
      ...tlmUsers,
      ...slmUsers,
      ...flmUsers,
      ...mrUsers,
    ];

    // ==========================================
    // TOTAL
    // ==========================================

    const totalUsers = users.length;

    // ==========================================
    // PAGINATION CALCULATION
    // ==========================================

    const totalPages = Math.ceil(
      totalUsers / limit
    );

    // Prevent page from going beyond available pages
    const currentPage =
      totalPages === 0
        ? 1
        : Math.min(page, totalPages);

    const startIndex =
      (currentPage - 1) * limit;

    const endIndex =
      startIndex + limit;

    const paginatedUsers = users.slice(
      startIndex,
      endIndex
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",

      users: paginatedUsers,

      // ========================================
      // USER COUNTS
      // ========================================

      counts: {
        TLM: tlms.length,
        SLM: slms.length,
        FLM: flms.length,
        MR: mrs.length,
        total: totalUsers,
      },

      // ========================================
      // PAGINATION
      // ========================================

      pagination: {
        currentPage,
        limit,
        totalUsers,
        totalPages,

        hasNextPage:
          currentPage < totalPages,

        hasPreviousPage:
          currentPage > 1,
      },
    });
  } catch (error) {
    console.error(
      "Get all users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};