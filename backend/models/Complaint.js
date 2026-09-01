const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "Medicine Availability",
        "Billing Issue",
        "Staff Behavior",
        "Product Quality",
        "Delivery Delay",
        "Other",
      ],
      default: "Other",
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "IN PROGRESS", "RESOLVED", "REJECTED"],
      default: "PENDING",
    },
    adminRemarks: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
