const QuizAttempt = require("../Model/QuizAttemptModel");
const QRScan      = require("../Model/QRScanModel");
const Doctor      = require("../Model/DoctorModel");
const Quiz        = require("../Model/QuizModel");
const { v4: uuidv4 } = require("uuid"); // npm i uuid

// ── helpers ───────────────────────────────────────────────
const detectDevice = (ua = "") => {
  if (!ua) return "unknown";
  if (/tablet|ipad/i.test(ua))          return "tablet";
  if (/mobile|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
};

// ════════════════════════════════════════════════
// POST /api/attempts/start
// Called when patient taps "Start Quiz" after scanning QR.
// Body: { doctorId, campaignId, quizId, sessionId? }
// sessionId is generated on the frontend; send it if you
// already have one (so we can link it to the QRScan record).
// ════════════════════════════════════════════════
const startAttempt = async (req, res) => {
  try {
    const { doctorId, campaignId, quizId, sessionId } = req.body;

    if (!doctorId || !campaignId || !quizId) {
      return res.status(400).json({
        success: false,
        error: "doctorId, campaignId and quizId are required",
      });
    }

    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) return res.status(404).json({ success: false, error: "Quiz not found" });

    const ua      = req.headers["user-agent"] || "";
    const ip      = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || null;
    const sid     = sessionId || uuidv4();

    const attempt = await QuizAttempt.create({
      sessionId:      sid,
      doctor:         doctorId,
      campaign:       campaignId,
      quiz:           quizId,
      totalQuestions: quiz.questions.length,
      deviceType:     detectDevice(ua),
      userAgent:      ua,
      ipAddress:      ip,
      status:         "started",
      startedAt:      new Date(),
    });

    // ── Mark the matching QRScan as converted ────────────
    await QRScan.findOneAndUpdate(
      { doctor: doctorId, sessionId: sid, converted: false },
      { $set:  { converted: true, quizAttempt: attempt._id } }
    );

    // ── Increment doctor quiz attempt counter ─────────────
    await Doctor.findByIdAndUpdate(doctorId, {
      $inc: { quizAttempts: 1 },
    });

    res.status(201).json({
      success: true,
      data: {
        attemptId: attempt._id,
        sessionId: sid,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// POST /api/attempts/:id/submit
// Called when patient finishes all questions.
// Body: {
//   score: 3,
//   answers: [
//     { questionNumber: 1, selectedOption: 2, isCorrect: true,  timeTaken: 12 },
//     { questionNumber: 2, selectedOption: 0, isCorrect: false, timeTaken: 30 },
//     ...
//   ],
//   city?: "Mumbai",
//   state?: "Maharashtra"
// }
// ════════════════════════════════════════════════
const submitAttempt = async (req, res) => {
  try {
    const { score, answers, city, state } = req.body;
    const attempt = await QuizAttempt.findById(req.params.id);

    if (!attempt) {
      return res.status(404).json({ success: false, error: "Attempt not found" });
    }

    if (attempt.status === "completed") {
      return res.status(400).json({ success: false, error: "Attempt already submitted" });
    }

    const now       = new Date();
    const timeSpent = Math.floor((now - attempt.startedAt) / 1000); // seconds

    attempt.score       = score || 0;
    attempt.answers     = answers || [];
    attempt.city        = city  || attempt.city  || null;
    attempt.state       = state || attempt.state || null;
    attempt.status      = "completed";
    attempt.completedAt = now;
    attempt.timeSpent   = timeSpent;
    await attempt.save();

    // ── Update doctor completion counter ──────────────────
    await Doctor.findByIdAndUpdate(attempt.doctor, {
      $inc: { completions: 1 },
    });

    res.status(200).json({ success: true, data: { attemptId: attempt._id, score } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// POST /api/attempts/:id/abandon
// Called when patient exits quiz early.
// ════════════════════════════════════════════════
const abandonAttempt = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.id);
    if (!attempt) return res.status(404).json({ success: false, error: "Attempt not found" });

    if (attempt.status !== "started") {
      return res.status(400).json({ success: false, error: "Attempt is not in started state" });
    }

    const now       = new Date();
    const timeSpent = Math.floor((now - attempt.startedAt) / 1000);

    attempt.status    = "abandoned";
    attempt.timeSpent = timeSpent;
    await attempt.save();

    res.status(200).json({ success: true, message: "Attempt marked as abandoned" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ════════════════════════════════════════════════
// GET /api/attempts
// Admin — list all attempts
// Query: ?doctor=<id>&campaign=<id>&status=completed&page=1
// ════════════════════════════════════════════════
const getAllAttempts = async (req, res) => {
  try {
    const { doctor, campaign, status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (doctor)                      filter.doctor   = doctor;
    if (campaign)                    filter.campaign = campaign;
    if (status && status !== "all")  filter.status   = status;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await QuizAttempt.countDocuments(filter);

    const attempts = await QuizAttempt.find(filter)
      .sort({ startedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("doctor",   "name city specialty")
      .populate("campaign", "name")
      .lean();

    res.status(200).json({
      success: true,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
      data:  attempts,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { startAttempt, submitAttempt, abandonAttempt, getAllAttempts };