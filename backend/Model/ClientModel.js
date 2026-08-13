const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────
    clientId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    brandName: {
      type: String,
      trim: true,
    },
    logo: {
      type: String, // cloud storage URL
      default: null,
    },

    // ── Contact ───────────────────────────────────────────
    primaryContact: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },

    // ── Address ───────────────────────────────────────────
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: "India",
    },
    website: {
      type: String,
      trim: true,
    },

    // ── Status ────────────────────────────────────────────
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // ── Relations ─────────────────────────────────────────
    campaigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
      },
    ],

    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
      }
    ],

     // ── Client Address ─────────────────────────────────────────
     address: {
      type: String,
      default: "",
     },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("Client", clientSchema);