const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────
    campaignId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    }, // "GERD Awareness Quiz"
    therapyArea: {
      type: String,
      trim: true,
    }, // "Gastroenterology"
    brand: {
      type: String,
      trim: true,
    }, // "AcidRelief"
    description: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String, // cloud URL
      default: null,
    },

    // ── Schedule ──────────────────────────────────────────
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },

    // ── Status ────────────────────────────────────────────
    status: {
      type: String,
      enum: ["active", "paused", "archived", "draft"],
      default: "draft",
    },

    // ── Goals ─────────────────────────────────────────────
    targetDoctors: {
      type: Number,
      default: 0,
    }, // e.g. 500 (the goal set at campaign creation)

    // ── Relations ─────────────────────────────────────────
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    quiz: {
      type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      }],
      default: [],
    },
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Campaign", campaignSchema);