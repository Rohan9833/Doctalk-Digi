const mongoose = require("mongoose");

const slmSchema = new mongoose.Schema({
  slmId: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  slmName: {
    type: String,
    required: true,
  },

  BUSINESSUNIT: {
    type: String,
    required: true,
  },

  region: {
    type: String,
    required: true,
  },

  zone: {
    type: String,
    required: true,
  },

  Flm: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flm",
    },
  ],
});

module.exports =
  mongoose.models.Slm ||
  mongoose.model("Slm", slmSchema);