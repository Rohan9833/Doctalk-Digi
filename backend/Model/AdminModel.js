const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // ← was missing

const AdminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    adminName: {
      type: String,
      required: true,
    },
    BUSINESSUNIT: {
      type: String,
      required: true,
    },
    Tlm: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tlm" }],
  },
  { timestamps: true }
);

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;