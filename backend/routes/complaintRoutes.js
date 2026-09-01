const express = require("express");
const router = express.Router();
const { submitComplaint, getMyComplaints } = require("../controllers/complaintController");
const { protect } = require("../middleware/auth");

router.post("/", protect, submitComplaint);
router.get("/mine", protect, getMyComplaints);

module.exports = router;
