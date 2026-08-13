const mongoose = require("mongoose");

const mrSchema = new mongoose.Schema({
  mrId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mrName: { type: String, required: true },
  HQ: { type: String, required: true },
  region: { type: String, required: true },
  zone: { type: String, required: true },
  BUSINESSUNIT: { type: String, required: true },

  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
  ],
}, { timestamps: true });

// module.exports = mongoose.model("Mr", mrSchema);
module.exports =
  mongoose.models.Mr ||
  mongoose.model("Mr", mrSchema);