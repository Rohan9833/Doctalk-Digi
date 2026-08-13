const mongoose = require("mongoose");

const sceneSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────
    name: {
      type: String,
      required: true,
      trim: true,
    }, // "Opening Scene - Dr. Amit Verma"

    type: {
      type: String,
      required: true,
      enum: [
        "opening",       // intro video
        "question",      // question being asked
        "correct",       // correct answer reaction
        "incorrect",     // incorrect answer reaction
        "result_good",   // score >= 2
        "result_best",   // score >= 4
        "result_bad",    // score < 2
        "cancel",        // exit/cancel video
      ],
    },

    // ── Which question (null for opening/result/cancel) ──
    questionNumber: {
      type: Number,
      default: null, // 1-5 for question/correct/incorrect types
    },

    // ── File ──────────────────────────────────────────────
    url: {
      type: String,
      default: null, // cloud storage URL (S3 / Cloudinary)
    },
    fileSize: {
      type: Number,
      default: null, // bytes
    },
    duration: {
      type: Number,
      default: null, // seconds
    },

    // ── Pipeline Status ───────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "processing", "ready", "failed"],
      default: "pending",
    },
    failureReason: {
      type: String,
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },

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
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ── Index for fetching all scenes of a doctor ────────────
sceneSchema.index({ doctor: 1, type: 1 });

module.exports = mongoose.model("Scene", sceneSchema);