const Complaint = require("../models/Complaint");

// POST /api/complaints  (Submit Complaint -> status PENDING)
const submitComplaint = async (req, res) => {
  try {
    const { title, category, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    const complaint = await Complaint.create({
      user: req.user._id,
      title,
      category,
      description,
      status: "PENDING",
    });
    res.status(201).json({ message: "Complaint submitted", complaint });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/complaints/mine  (User tracks status of their own complaints)
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { submitComplaint, getMyComplaints };
