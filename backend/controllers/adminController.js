const User = require("../models/User");
const Complaint = require("../models/Complaint");

/* ---------------------- MANAGE USERS ---------------------- */

// GET /api/admin/users/pending  (View Pending Users)
const getPendingUsers = async (req, res) => {
  const users = await User.find({ status: "PENDING" }).select("-password").sort({ createdAt: -1 });
  res.json({ users });
};

// GET /api/admin/users  (View all users, with optional ?search= & ?status=)
const getAllUsers = async (req, res) => {
  const { search, status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
  res.json({ users });
};

// PUT /api/admin/users/:id/approve  (Approve User -> Status = ACTIVE)
const approveUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "ACTIVE" },
    { new: true }
  ).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User approved", user });
};

// PUT /api/admin/users/:id/reject  (Reject User)
const rejectUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "REJECTED" },
    { new: true }
  ).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User rejected", user });
};

// PUT /api/admin/users/:id/toggle-status  (Activate/Deactivate User)
const toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.status = user.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";
  await user.save();
  res.json({ message: `User is now ${user.status}`, user });
};

// PUT /api/admin/users/:id/role  (Manage User Roles)
const changeUserRole = async (req, res) => {
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select(
    "-password"
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "Role updated", user });
};

/* -------------------- MANAGE COMPLAINTS -------------------- */

// GET /api/admin/complaints  (View All Complaints, with ?search= & ?status= & ?category=)
const getAllComplaints = async (req, res) => {
  const { search, status, category } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: "i" };

  const complaints = await Complaint.find(filter)
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json({ complaints });
};

// GET /api/admin/complaints/:id  (View Details)
const getComplaintDetails = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate("user", "name email");
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  res.json({ complaint });
};

// PUT /api/admin/complaints/:id/status  (Update Status: IN PROGRESS / RESOLVED / REJECTED)
const updateComplaintStatus = async (req, res) => {
  const { status, adminRemarks } = req.body;
  const allowed = ["PENDING", "IN PROGRESS", "RESOLVED", "REJECTED"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status, ...(adminRemarks !== undefined ? { adminRemarks } : {}) },
    { new: true }
  ).populate("user", "name email");
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  res.json({ message: "Complaint updated", complaint });
};

module.exports = {
  getPendingUsers,
  getAllUsers,
  approveUser,
  rejectUser,
  toggleUserStatus,
  changeUserRole,
  getAllComplaints,
  getComplaintDetails,
  updateComplaintStatus,
};
