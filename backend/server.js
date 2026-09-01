require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hussain Medical Store - Smart Complaint Management System API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Initial Admin Account: creates the very first admin from .env if none exists yet
const seedAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || "admin@hussainmedicalstore.com").toLowerCase();
  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) return;

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@12345", 10);
  await User.create({
    name: process.env.ADMIN_NAME || "Hussain Admin",
    email,
    password: hashed,
    role: "admin",
    status: "ACTIVE",
  });
  console.log(`Initial admin account created -> email: ${email}`);
};

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
