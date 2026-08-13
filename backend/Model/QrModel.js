const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema(
  {
    // ==============================
    // DOCTOR
    // ==============================
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // ==============================
    // CAMPAIGN
    // ==============================
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },

    // ==============================
    // QUIZ
    // ==============================
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      default: null,
    },

    // ==============================
    // UNIQUE SHORT CODE
    // ==============================
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // ==============================
    // DESTINATION
    // ==============================
    destinationType: {
      type: String,
      enum: ["video", "quiz", "landing_page"],
      default: "video",
      required: true,
    },

    destinationUrl: {
      type: String,
      default: null,
      trim: true,
    },

    // ==============================
    // GENERATED QR
    // ==============================
    qrCode: {
      type: String,
      default: null,
    },

    qrCodeSvg: {
      type: String,
      default: null,
    },

    // ==============================
    // STATUS
    // ==============================
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },

    // ==============================
    // EXPIRY
    // ==============================
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("QR", qrSchema);
