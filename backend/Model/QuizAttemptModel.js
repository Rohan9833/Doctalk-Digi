const mongoose = require("mongoose");

// ── Per-question answer ───────────────────────────────────
const answerSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true,
    },
    selectedOption: {
      type: Number,
      default: null, // null = no answer (timed out)
      min: 0,
      max: 3,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    timeTaken: {
      type: Number,
      default: 0, // seconds taken to answer
    },
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    // ── Session ───────────────────────────────────────────
    sessionId: {
      type: String,
      required: true,
      trim: true,
    }, // anonymous browser fingerprint / UUID generated on QR scan

    // ── Relations ─────────────────────────────────────────
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    // ── Location (from IP or browser) ────────────────────
    city: {
      type: String,
      trim: true,
      default: null,
    },
    state: {
      type: String,
      trim: true,
      default: null,
    },
    ipAddress: {
      type: String,
      trim: true,
      default: null,
    },

    // ── Device ────────────────────────────────────────────
    deviceType: {
      type: String,
      enum: ["mobile", "desktop", "tablet", "unknown"],
      default: "unknown",
    },
    userAgent: {
      type: String,
      default: null,
    },

    // ── Results ───────────────────────────────────────────
    score: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    answers: [answerSchema],

    // ── Status ────────────────────────────────────────────
    status: {
      type: String,
      enum: ["started", "completed", "abandoned"],
      default: "started",
    },

    // ── Timing ────────────────────────────────────────────
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    timeSpent: {
      type: Number,
      default: 0, // total seconds from start to finish
    },
  },
  {
    timestamps: true,
  }
);

// ── Index for fast analytics queries ─────────────────────
quizAttemptSchema.index({ doctor: 1, createdAt: -1 });
quizAttemptSchema.index({ campaign: 1, createdAt: -1 });
quizAttemptSchema.index({ state: 1 });
quizAttemptSchema.index({ status: 1 });

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);