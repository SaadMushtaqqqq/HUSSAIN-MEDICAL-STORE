const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the JWT on the "Authorization: Bearer <token>" header
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "ACCESS DENIED - No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "ACCESS DENIED - User not found" });
    }
    // Re-check status on every request (handles admin deactivating mid-session)
    if (user.status !== "ACTIVE") {
      return res.status(403).json({ message: `ACCESS DENIED - Account is ${user.status}` });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "ACCESS DENIED - Invalid or expired token" });
  }
};

// Restricts a route to given roles, e.g. adminOnly("admin")
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "ACCESS DENIED - Insufficient role" });
    }
    next();
  };
};

module.exports = { protect, authorize };
