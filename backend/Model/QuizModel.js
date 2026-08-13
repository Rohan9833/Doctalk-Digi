const mongoose = require("mongoose");

// ── Single question schema ────────────────────────────────
const questionSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true,
    }, // 1, 2, 3, 4, 5

    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      validate: {
        validator: (arr) => arr.length === 4,
        message: "Each question must have exactly 4 options",
      },
    },

    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    }, // index: 0=A, 1=B, 2=C, 3=D

    explanation: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);


// ── Quiz Schema ───────────────────────────────────────────
const quizSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────
    quizId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    }, // "GERD Quiz v2.1"

    version: {
      type: String,
      trim: true,
      default: "v1.0",
    },

    topic: {
      type: String,
      trim: true,
    }, // "GERD", "ASCVD", "Diabetes"


    // ── Video ─────────────────────────────────────────────
    videoUrl: {
      type: String,
      trim: true,
      default: null,
    },


    // ── Questions ─────────────────────────────────────────
    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => arr.length >= 1 && arr.length <= 10,
        message: "Quiz must have between 1 and 10 questions",
      },
    },


    // ── Settings ──────────────────────────────────────────
    timePerQuestion: {
      type: Number,
      default: 44, // seconds — matches your current quiz timer
    },


    // ── Status ────────────────────────────────────────────
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "draft",
    },


    // ── Relations ─────────────────────────────────────────
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
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


module.exports = mongoose.model("Quiz", quizSchema);