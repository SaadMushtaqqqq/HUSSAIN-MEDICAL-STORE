const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    // PENDING -> waiting for admin approval
    // ACTIVE -> approved, can log in
    // DEACTIVATED -> access revoked by admin
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "DEACTIVATED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
