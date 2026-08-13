const mongoose = require("mongoose");

// ════════════════════════════════════════════════
// VOICEOVER MODEL
// ════════════════════════════════════════════════
const voiceoverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }, // "Hindi Voiceover - GERD Campaign"

    language: {
      type: String,
      trim: true,
      default: "English",
    }, // "Hindi", "English", "Marathi" etc.

    url: {
      type: String,
      default: null, // audio file URL
    },

    // ── Status ────────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "processing", "ready", "failed"],
      default: "pending",
    },

    // ── Relations ─────────────────────────────────────────
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      default: null,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

// ════════════════════════════════════════════════
// POSTER MODEL
// Printable clinic poster with QR code for each doctor
// ════════════════════════════════════════════════
const posterSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: null, // generated poster image URL
    },

    // ── Status ────────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "ready", "failed"],
      default: "pending",
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
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    generatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Voiceover = mongoose.model("Voiceover", voiceoverSchema);
const Poster    = mongoose.model("Poster", posterSchema);

module.exports = { Voiceover, Poster };