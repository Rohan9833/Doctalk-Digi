const mongoose = require("mongoose");

const tlmSchema = new mongoose.Schema({
  tlmId: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  tlmName: {
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

  Slm: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slm",
    },
  ],
});

module.exports =
  mongoose.models.Tlm ||
  mongoose.model("Tlm", tlmSchema);