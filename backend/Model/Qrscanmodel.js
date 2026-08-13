const mongoose = require("mongoose");

const qrScanSchema = new mongoose.Schema(
  {
    // ── Relations ─────────────────────────────────────────

    // QR reference
    // Used to identify exactly which QR was scanned.
    // Optional for backward compatibility with old scan records.
    qr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QR",
      default: null,
    },

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

    // ── Session link ──────────────────────────────────────
    // If patient goes on to start quiz, we link the attempt
    quizAttempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizAttempt",
      default: null,
    },

    sessionId: {
      type: String,
      trim: true,
      default: null,
    },

    // ── Location ──────────────────────────────────────────
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

    // ── Conversion ────────────────────────────────────────
    // Did this scan lead to a quiz attempt?
    converted: {
      type: Boolean,
      default: false,
    },

    // ── Scan Time ─────────────────────────────────────────
    scannedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes ───────────────────────────────────────────────

// Existing indexes - KEEPING THEM
qrScanSchema.index({
  doctor: 1,
  scannedAt: -1,
});

qrScanSchema.index({
  campaign: 1,
  scannedAt: -1,
});

qrScanSchema.index({
  state: 1,
  city: 1,
});

qrScanSchema.index({
  ipAddress: 1,
});

// NEW: QR-specific analytics index
qrScanSchema.index({
  qr: 1,
  scannedAt: -1,
});

// Optional: useful for unique-scan queries
qrScanSchema.index({
  qr: 1,
  sessionId: 1,
});

module.exports =
  mongoose.models.QRScan || mongoose.model("QRScan", qrScanSchema);
