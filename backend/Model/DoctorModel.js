const mongoose = require("mongoose");
const crypto = require("crypto");

// ── Per-question video set (personalized per doctor) ──────
const questionVideoSchema = new mongoose.Schema(
  {
    questionVideo: { type: String, default: null },
    correctVideo: { type: String, default: null },
    incorrectVideo: { type: String, default: null },
  },
  { _id: false },
);

const doctorSchema = new mongoose.Schema(
  {
    // ── Identity ────────────────────────────────────────────
    doctorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: null,
    },
    specialty: {
      type: String,
      trim: true,
      default: null,
    },
    qualification: {
      type: String,
      trim: true,
      default: null,
    },
    registrationNo: {
      type: String,
      trim: true,
      default: null,
    },

    // ── Contact ─────────────────────────────────────────────
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    mobile: {
      type: String,
      trim: true,
      default: null,
    },
    address: {
      type: String,
      trim: true,
      default: null,
    },

    // ── Clinic ──────────────────────────────────────────────
    clinic: {
      type: String,
      trim: true,
      default: null,
    },
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

    // ── Consent ─────────────────────────────────────────────
    consentStatus: {
      type: String,
      enum: ["not_sent", "sent", "accepted", "expired"],
      default: "not_sent",
    },
    consentToken: {
      type: String,
      default: null,
      select: false,
    },
    consentTokenExpiry: {
      type: Date,
      default: null,
    },
    consentSentAt: {
      type: Date,
      default: null,
    },
    consentAcceptedAt: {
      type: Date,
      default: null,
    },
    consentIp: {
      type: String,
      default: null,
    },
    consentGiven: {
      type: Boolean,
      default: false,
    },

    confirmToken: { type: String, select: false },
    confirmTokenExpiry: { type: Date },
    emailConfirmed: { type: Boolean, default: false },
    emailConfirmedAt: { type: Date },


    // ── Doctor Images ─────────────────────────────────────────

    imageFilePath : {
      type: [
        {
          fileName: {
            type: String
          },

          filePath: {
            type: String
          }
        }
      ],

      default: []
    },

    // ── Doctor Page ─────────────────────────────────────────
    pageSlug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    pageUrl: { type: String, default: null },
    pageStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    // ── QR Code ─────────────────────────────────────────────
    qrCode: { type: String, default: null },
    qrCodeSvg: { type: String, default: null },
    shortUrl: { type: String, default: null },
    qrStatus: {
      type: String,
      enum: ["active", "expired", "not_generated"],
      default: "not_generated",
    },

    // ── AI Videos ───────────────────────────────────────────
    videos: {
      opening: { type: String, default: null },
      q1: { type: questionVideoSchema, default: null },
      q2: { type: questionVideoSchema, default: null },
      q3: { type: questionVideoSchema, default: null },
      q4: { type: questionVideoSchema, default: null },
      q5: { type: questionVideoSchema, default: null },
      resultGood: { type: String, default: null },
      resultBad: { type: String, default: null },
      resultBest: { type: String, default: null },
      cancel: { type: String, default: null },
    },
    videoStatus: {
      type: String,
      enum: ["pending", "processing", "ready", "failed"],
      default: "pending",
    },

    // ── Denormalized Stats ───────────────────────────────────
    totalScans: { type: Number, default: 0 },
    uniqueScans: { type: Number, default: 0 },
    quizAttempts: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
    lastScanned: { type: Date, default: null },

    // ── Performance Metrics ───────────────────────────────────

    avgScore: {type: Number, default: 0},
    completionRate: {type: Number, default: 0},
    engagementRate: {type: Number, default: 0},
    performanceScore: {type: Number, default: 0},
    uniqueCompletions: {type: Number, default: 0},



    // ── Relations ────────────────────────────────────────────
    campaign: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    }],
    mr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mr",
      default: null,
    },

    // ── Status ───────────────────────────────────────────────
    status: {
      type: String,
      enum: ["work_in_progress", "consent_awaited", "photos_awaited", "active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

// ✅ FIXED: Use a regular function without the 'next' parameter if not needed
// Or use an async function
doctorSchema.pre("save", function () {
  if (!this.pageSlug && this.name) {
    this.pageSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }
  // No next() needed because we're not doing async operations
  // Mongoose will automatically continue
});

// Alternative if you need to keep the 'next' parameter (uncomment this and comment the above):
// doctorSchema.pre("save", function(next) {
//   if (!this.pageSlug && this.name) {
//     this.pageSlug = this.name
//       .toLowerCase()
//       .replace(/[^a-z0-9\s-]/g, "")
//       .trim()
//       .replace(/\s+/g, "-");
//   }
//   next();
// });

// ── Instance method: generate hashed consent token ───────
doctorSchema.methods.generateConsentToken = function () {
  const rawToken = crypto.randomBytes(32).toString("hex");
  this.consentToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  this.consentTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  this.consentStatus = "sent";
  this.consentSentAt = new Date();
  return rawToken;
};

module.exports = mongoose.model("Doctor", doctorSchema);
