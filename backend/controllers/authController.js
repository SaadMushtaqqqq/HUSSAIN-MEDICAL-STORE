const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/register  (USER / STUDENT self-registration -> Status = PENDING)
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Account already exists with this email" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: "user",
      status: "PENDING", // Account Created -> Status = PENDING -> waits for admin approval
    });

    return res.status(201).json({
      message: "Account created. Please wait for admin approval before logging in.",
      user: { id: user._id, name: user.name, email: user.email, status: user.status },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/login  (SINGLE COMMON LOGIN PAGE for both USER and ADMIN)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check Account Status
    if (user.status === "PENDING") {
      return res.status(403).json({ message: "ACCESS DENIED - Your account is pending admin approval" });
    }
    if (user.status === "DEACTIVATED") {
      return res.status(403).json({ message: "ACCESS DENIED - Your account has been deactivated" });
    }
    if (user.status === "REJECTED") {
      return res.status(403).json({ message: "ACCESS DENIED - Your registration was rejected" });
    }

    // Status = ACTIVE -> Check Role -> route to correct dashboard
    const token = signToken(user);
    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // "user" -> USER DASHBOARD, "admin" -> ADMIN DASHBOARD
        status: user.status,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, getMe };
