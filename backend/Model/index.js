// ── Existing hierarchy models ─────────────────────────────
const Admin    = require("./AdminModel");
const Tlm      = require("./TlmModel");
const Slm      = require("./SlmModel");
const Flm      = require("./FlmModel");
const Mr       = require("./MrModel");

// ── New platform models ───────────────────────────────────
const Client       = require("./ClientModel");
const Campaign     = require("./CampaignModel");
const Doctor       = require("./DoctorModel");
const Quiz         = require("./QuizModel");
const QuizAttempt  = require("./QuizAttemptModel");
const QRScan       = require("./QRScanModel");
const Scene        = require("./SceneModel");
const { Voiceover, Poster } = require("./VoiceoverAndPosterModel");

module.exports = {
  // hierarchy
  Admin, Tlm, Slm, Flm, Mr,
  // platform
  Client, Campaign, Doctor, Quiz,
  QuizAttempt, QRScan, Scene, Voiceover, Poster,
};