import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// role: "user" | "admin" | undefined (any logged-in user)
const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/access-denied" replace />;
  }
  return children;
};

export default PrivateRoute;
