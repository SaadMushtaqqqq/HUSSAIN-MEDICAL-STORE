const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getPendingUsers,
  getAllUsers,
  approveUser,
  rejectUser,
  toggleUserStatus,
  changeUserRole,
  getAllComplaints,
  getComplaintDetails,
  updateComplaintStatus,
} = require("../controllers/adminController");

// Every route below requires a logged-in ACTIVE admin
router.use(protect, authorize("admin"));

// Manage Users
router.get("/users/pending", getPendingUsers);
router.get("/users", getAllUsers);
router.put("/users/:id/approve", approveUser);
router.put("/users/:id/reject", rejectUser);
router.put("/users/:id/toggle-status", toggleUserStatus);
router.put("/users/:id/role", changeUserRole);

// Manage Complaints
router.get("/complaints", getAllComplaints);
router.get("/complaints/:id", getComplaintDetails);
router.put("/complaints/:id/status", updateComplaintStatus);

module.exports = router;
