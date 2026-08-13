const Quiz = require("../Model/QuizModel");
const Campaign = require("../Model/CampaignModel");
const { response } = require("express");

const generateQuizId = () => "QZ-" + Date.now().toString(36).toUpperCase();

// ════════════════════════════════════════════════
// GET /api/quizzes
// Query: ?status=active&campaign=<id>&page=1&limit=10
// ════════════════════════════════════════════════
const getAllQuizzes = async (req, res) => {
  try {
    const { status, campaign, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (campaign) filter.campaign = campaign;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { topic: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Quiz.countDocuments(filter);

    const quizzes = await Quiz.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("campaign", "name therapyArea")
      .populate("createdBy", "name")
      .lean();

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: quizzes,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// GET /api/quizzes/:id
// ════════════════════════════════════════════════
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate("campaign", "name therapyArea brand")
      .populate("createdBy", "name email")
      .lean();

    if (!quiz)
      return res.status(404).json({ success: false, error: "Quiz not found" });

    res.status(200).json({ success: true, data: quiz });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// POST /api/quizzes
// Body: {
//   name, topic, version?, campaign?,
//   timePerQuestion?,
//   questions: [
//     {
//       questionNumber: 1,
//       questionText: "...",
//       options: ["A","B","C","D"],
//       correctAnswer: 0,
//       explanation: "..."
//     }, ...
//   ]
// }
// ════════════════════════════════════════════════
const createQuiz = async (req, res) => {
  try {
    const { name, topic, version, campaign, timePerQuestion, questions } =
      req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, error: "name is required" });
    }
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "At least one question is required" });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText) {
        return res
          .status(400)
          .json({
            success: false,
            error: `Question ${i + 1}: questionText is required`,
          });
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        return res
          .status(400)
          .json({
            success: false,
            error: `Question ${i + 1}: must have exactly 4 options`,
          });
      }
      if (
        q.correctAnswer === undefined ||
        q.correctAnswer < 0 ||
        q.correctAnswer > 3
      ) {
        return res
          .status(400)
          .json({
            success: false,
            error: `Question ${i + 1}: correctAnswer must be 0-3`,
          });
      }
    }

    const quiz = new Quiz({
      quizId: generateQuizId(),
      name,
      topic,
      version: version || "v1.0",
      campaign: campaign || null,
      timePerQuestion: timePerQuestion || 44,
      questions,
      createdBy: req.admin?._id || null,
    });

    await quiz.save();

    // If campaign provided, link quiz to it
    if (campaign) {
      await Campaign.findByIdAndUpdate(campaign, { $set: { quiz: quiz._id } });
    }

    res.status(201).json({ success: true, data: quiz });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// PUT /api/quizzes/:id
// Can update top-level fields AND individual questions
// ════════════════════════════════════════════════
const updateQuiz = async (req, res) => {
  try {
    const allowed = [
      "name",
      "topic",
      "version",
      "timePerQuestion",
      "status",
      "questions",
    ];

    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    // If updating questions, re-validate
    if (updates.questions) {
      for (let i = 0; i < updates.questions.length; i++) {
        const q = updates.questions[i];
        if (!q.questionText) {
          return res
            .status(400)
            .json({
              success: false,
              error: `Question ${i + 1}: questionText is required`,
            });
        }
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          return res
            .status(400)
            .json({
              success: false,
              error: `Question ${i + 1}: must have exactly 4 options`,
            });
        }
        if (
          q.correctAnswer === undefined ||
          q.correctAnswer < 0 ||
          q.correctAnswer > 3
        ) {
          return res
            .status(400)
            .json({
              success: false,
              error: `Question ${i + 1}: correctAnswer must be 0-3`,
            });
        }
      }
    }

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!quiz)
      return res.status(404).json({ success: false, error: "Quiz not found" });

    res.status(200).json({ success: true, data: quiz });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// DELETE /api/quizzes/:id
// ════════════════════════════════════════════════
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz)
      return res.status(404).json({ success: false, error: "Quiz not found" });

    if (quiz.status === "active") {
      return res.status(400).json({
        success: false,
        error: "Cannot delete an active quiz. Archive it first.",
      });
    }

    // Unlink from campaign if attached
    if (quiz.campaign) {
      await Campaign.findByIdAndUpdate(quiz.campaign, { $set: { quiz: null } });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// PATCH /api/quizzes/:id/questions/:questionNumber
// Update a single question without sending all questions
// ════════════════════════════════════════════════
const updateSingleQuestion = async (req, res) => {
  try {
    const { questionNumber } = req.params;
    const { questionText, options, correctAnswer, explanation } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz)
      return res.status(404).json({ success: false, error: "Quiz not found" });

    const qIndex = quiz.questions.findIndex(
      (q) => q.questionNumber === Number(questionNumber),
    );

    if (qIndex === -1) {
      return res
        .status(404)
        .json({
          success: false,
          error: `Question ${questionNumber} not found`,
        });
    }

    if (questionText !== undefined)
      quiz.questions[qIndex].questionText = questionText;
    if (options !== undefined) quiz.questions[qIndex].options = options;
    if (correctAnswer !== undefined)
      quiz.questions[qIndex].correctAnswer = correctAnswer;
    if (explanation !== undefined)
      quiz.questions[qIndex].explanation = explanation;

    await quiz.save();
    res.status(200).json({ success: true, data: quiz.questions[qIndex] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const createNewQuiz = async (req, res) => {
  console.log("BODY =", req.body);
  try {
    const { name, topic, version, timePerQuestion, campaign, questions, status } =
      req.body;

    if (!name)
      return res
        .status(500)
        .json({ success: false, message: "name is required" });



    if (!questions || !Array.isArray(questions) || questions.length === 0)
      return res
        .status(500)
        .json({ success: false, message: "Atleast one question is required." });

    for (let i = 0; i < questions.length; i++) {
      let q = questions[i];

      if (!q.question)
        return res
          .status(500)
          .json({
            success: false,
            message: `Question ${i + 1} text is required.`,
          });
      if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
        return res
          .status(500)
          .json({
            success: false,
            message: `Question ${i + 1} 4 question is required.`,
          });
      }
      if (
        q.correctAnswer === undefined ||
        q.correctAnswer < 0 ||
        q.correctAnswer > 3
      ) {
        return res
          .status(500)
          .json({
            success: false,
            message: `Question ${i + 1} correct answer must be 0 - 3`,
          });
      }

      q.correctAnswer = Number(q.correctAnswer);
    }

    const quiz = await Quiz.create({
      quizId: generateQuizId(),
      name,
      topic,
      version: version || "v1.0",
      campaign: campaign || null,
      timePerQuestion: timePerQuestion || 44,
      questions,
      createdBy: req.admin?._id || null,
      status,
    });

    await Campaign.findByIdAndUpdate(campaign, { $push: { quiz: quiz._id } });

    return res
      .status(200)
      .json({ success: true, message: "Quiz created successfully" });
  } catch (error) {
    console.error("QUIZ CREATE ERROR:");
    console.error(error);
    console.error(error.message);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// const getQuizDashBoardData = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const { search, therapyArea, client, status, filters } = req.query;
//     const skip = (page - 1) * limit;

//     let matchStage = {};

//     if (therapyArea && therapyArea !== "All") {
//       matchStage.therapyArea = therapyArea;
//     }

//     if (client && client !== "All") {
//       matchStage.client = client;
//     }

//     if (status && status !== "All") {
//       matchStage.status = status;
//     }

//     if (search) {
//       matchStage.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { topic: { $regex: search, $options: "i" } },
//         { quizId: { $regex: search, $options: "i" } },
//       ];
//     }

//     console.log(matchStage);

//     const result = await Quiz.aggregate([
//       {
//         $facet: {
//           //Quiz data by stats
//           quizzesDataForStats: [
//             {
//               $group: {
//                 _id: null,

//                 totalQuizzes: {
//                   $sum: 1,
//                 },

//                 totalActiveQuizzes: {
//                   $sum: {
//                     $cond: [{ $eq: ["$status", "active"] }, 1, 0],
//                   },
//                 },

//                 totalInactiveQuizzes: {
//                   $sum: {
//                     $cond: [{ $eq: ["$status", "inactive"] }, 1, 0],
//                   },
//                 },

//                 totalDraftQuizzes: {
//                   $sum: {
//                     $cond: [{ $eq: ["$status", "draft"] }, 1, 0],
//                   },
//                 },
//               },
//             },
//           ],

//           questionDataForStats: [
//             {
//               $group: {
//                 _id: null,

//                 totalQuizzes: {
//                   $sum: 1,
//                 },
//               },
//             },
//           ],

//           quizTable: [
//             {
//               $match: matchStage,
//             },

//             {
//               $lookup: {
//                 from: "campaigns",
//                 localField: "campaign",
//                 foreignField: "_id",
//                 as: "campaignData",
//               },
//             },

//             {
//               $unwind: {
//                 path: "$campaignData",
//                 preserveNullAndEmptyArrays: true,
//               },
//             },

//             {
//               $lookup: {
//                 from: "clients",
//                 localField: "campaignData.client",
//                 foreignField: "_id",
//                 as: "clientData",
//               },
//             },

//             {
//               $unwind: {
//                 path: "$clientData",
//                 preserveNullAndEmptyArrays: true,
//               },
//             },

//             {
//               $project: {
//                 quizId: 1,
//                 quizName: "$name",

//                 therapyArea: "$campaignData.therapyArea",

//                 client: "$clientData.companyName",

//                 question: {
//                   $size: {
//                     $ifNull: ["$questions", []],
//                   },
//                 },

//                 version: 1,
//                 status: 1,

//                 linkedCampaign: "$campaignData.name",

//                 lastUpdatedAt: "$updatedAt",

//                 description: "$campaignData.description",
//               },
//             },

//             { $skip: skip },
//             { $limit: limit },
//           ],

//           therapyAreaForDropdown: [
//             {
//               $lookup: {
//                 from: "campaigns",
//                 localField: "campaign",
//                 foreignField: "_id",
//                 as: "campaignData",
//               },
//             },

//             {
//               $unwind: "$campaignData",
//             },

//             {
//               $group: {
//                 _id: "$campaignData.therapyArea",
//               },
//             },
//           ],

//           clientForDropdown: [
//             {
//               $lookup: {
//                 from: "campaigns",
//                 localField: "campaign",
//                 foreignField: "_id",
//                 as: "campaignData",
//               },
//             },

//             {
//               $unwind: "$campaignData",
//             },

//             {
//               $lookup: {
//                 from: "clients",
//                 localField: "campaignData.client",
//                 foreignField: "_id",
//                 as: "clientData",
//               },
//             },

//             {
//               $unwind: "$clientData",
//             },

//             {
//               $group: {
//                 _id: "$clientData.companyName",
//               },
//             },
//           ],

//           statusForDropdown: [
//             {
//               $group: {
//                 _id: "$status",
//               },
//             },
//           ],
//         },
//       },
//     ]);

//     const response = result[0];

//     return res.status(200).json({
//       success: true,
//       quizzesDataForStats: response.quizzesDataForStats[0],
//       questionDataForStats: response.questionDataForStats[0],
//       quizTable: response.quizTable,
//       therapyAreaForDropdown: response.therapyAreaForDropdown,
//       clientForDropdown: response.clientForDropdown,
//       statusForDropdown: response.statusForDropdown,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Internal Sever Error...",
//     });
//   }
// };
const getQuizDashBoardData = async (req, res) => {
  try {
    // ==========================================
    // PAGINATION
    // ==========================================

    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // ==========================================
    // QUERY PARAMS
    // ==========================================

    const {
      search,
      therapyArea,
      client,
      status,
    } = req.query;

    // ==========================================
    // QUIZ FILTER
    // ==========================================

    const quizMatch = {};

    // Search Quiz fields

    if (search && search.trim()) {
      quizMatch.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },

        {
          topic: {
            $regex: search.trim(),
            $options: "i",
          },
        },

        {
          quizId: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // Status belongs to Quiz

    if (status && status !== "All") {
      quizMatch.status = status;
    }

    // ==========================================
    // COMMON LOOKUPS
    // ==========================================

    const commonPipeline = [
      // ----------------------------------------
      // QUIZ FILTER
      // ----------------------------------------

      {
        $match: quizMatch,
      },

      // ----------------------------------------
      // CAMPAIGN
      // ----------------------------------------

      {
        $lookup: {
          from: "campaigns",

          localField: "campaign",

          foreignField: "_id",

          as: "campaignData",
        },
      },

      {
        $unwind: {
          path: "$campaignData",

          preserveNullAndEmptyArrays: true,
        },
      },

      // ----------------------------------------
      // CLIENT
      // ----------------------------------------

      {
        $lookup: {
          from: "clients",

          localField: "campaignData.client",

          foreignField: "_id",

          as: "clientData",
        },
      },

      {
        $unwind: {
          path: "$clientData",

          preserveNullAndEmptyArrays: true,
        },
      },

      // ----------------------------------------
      // CAMPAIGN FILTERS
      // ----------------------------------------

      {
        $match: {
          ...(therapyArea &&
            therapyArea !== "All"
            ? {
              "campaignData.therapyArea":
                therapyArea,
            }
            : {}),

          ...(client && client !== "All"
            ? {
              "clientData.companyName":
                client,
            }
            : {}),
        },
      },
    ];

    // ==========================================
    // AGGREGATION
    // ==========================================

    const result = await Quiz.aggregate([

      ...commonPipeline,

      {
        $facet: {

          // ======================================
          // QUIZ STATS
          // ======================================

          quizzesDataForStats: [

            {
              $group: {
                _id: null,

                totalQuizzes: {
                  $sum: 1,
                },

                totalActiveQuizzes: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          "$status",
                          "active",
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },

                totalInactiveQuizzes: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          "$status",
                          "inactive",
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },

                totalDraftQuizzes: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          "$status",
                          "draft",
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },

          ],

          // ======================================
          // QUESTION STATS
          // ======================================

          questionDataForStats: [

            {
              $group: {
                _id: null,

                totalQuestions: {
                  $sum: {
                    $size: {
                      $ifNull: [
                        "$questions",
                        [],
                      ],
                    },
                  },
                },
              },
            },

          ],

          // ======================================
          // TOTAL QUIZZES
          // ======================================

          totalQuizzes: [

            {
              $count: "count",
            },

          ],

          // ======================================
          // QUIZ TABLE
          // ======================================

          quizTable: [

            {
              $project: {

                _id: 1,

                quizId: 1,

                quizName: "$name",

                therapyArea:
                  "$campaignData.therapyArea",

                client:
                  "$clientData.companyName",

                question: {
                  $size: {
                    $ifNull: [
                      "$questions",
                      [],
                    ],
                  },
                },

                version: 1,

                status: 1,

                linkedCampaign:
                  "$campaignData.name",

                lastUpdatedAt:
                  "$updatedAt",

                description:
                  "$campaignData.description",

              },
            },

            // Pagination

            {
              $skip: skip,
            },

            {
              $limit: limit,
            },

          ],

          // ======================================
          // THERAPY AREA DROPDOWN
          // ======================================

          therapyAreaForDropdown: [

            {
              $group: {
                _id:
                  "$campaignData.therapyArea",
              },
            },

            {
              $match: {
                _id: {
                  $ne: null,
                },
              },
            },

            {
              $sort: {
                _id: 1,
              },
            },

          ],

          // ======================================
          // CLIENT DROPDOWN
          // ======================================

          clientForDropdown: [

            {
              $group: {
                _id:
                  "$clientData.companyName",
              },
            },

            {
              $match: {
                _id: {
                  $ne: null,
                },
              },
            },

            {
              $sort: {
                _id: 1,
              },
            },

          ],

          // ======================================
          // STATUS DROPDOWN
          // ======================================

          statusForDropdown: [

            {
              $group: {
                _id: "$status",
              },
            },

            {
              $match: {
                _id: {
                  $ne: null,
                },
              },
            },

            {
              $sort: {
                _id: 1,
              },
            },

          ],

        },
      },

    ]);

    // ==========================================
    // RESPONSE
    // ==========================================

    const response = result[0];

    const totalQuizzes =
      response.totalQuizzes?.[0]?.count || 0;

    const totalPages =
      Math.ceil(totalQuizzes / limit);

    return res.status(200).json({

      success: true,

      quizzesDataForStats:
        response.quizzesDataForStats?.[0] || {
          totalQuizzes: 0,
          totalActiveQuizzes: 0,
          totalInactiveQuizzes: 0,
          totalDraftQuizzes: 0,
        },

      questionDataForStats:
        response.questionDataForStats?.[0] || {
          totalQuestions: 0,
        },

      quizTable:
        response.quizTable || [],

      therapyAreaForDropdown:
        response.therapyAreaForDropdown || [],

      clientForDropdown:
        response.clientForDropdown || [],

      statusForDropdown:
        response.statusForDropdown || [],

      // Pagination

      totalQuizzes,

      currentPage: page,

      totalPages,

      limit,

    });

  } catch (error) {

    console.error(
      "Quiz Dashboard Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Internal Server Error",

      error:
        error.message,

    });
  }
};

module.exports = {
  getQuizDashBoardData,
};

module.exports = {
  getAllQuizzes,
  getQuizById,
  createNewQuiz,
  updateQuiz,
  deleteQuiz,
  updateSingleQuestion,
  getQuizDashBoardData,
};
