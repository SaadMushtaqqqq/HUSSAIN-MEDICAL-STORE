import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">＋</span>
        <div>
          <div className="brand-title">Hussain Medical Store</div>
          <div className="brand-subtitle">Smart Complaint Management System</div>
        </div>
      </div>

      <div className="navbar-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user && user.role === "user" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/submit-complaint">Submit Complaint</Link>
            <Link to="/track-status">Track Status</Link>
          </>
        )}
        {user && user.role === "admin" && (
          <>
            <Link to="/admin">Admin Dashboard</Link>
            <Link to="/admin/users">Manage Users</Link>
            <Link to="/admin/complaints">Manage Complaints</Link>
          </>
        )}
        {user && (
          <span className="navbar-user">
            {user.name} ({user.role})
          </span>
        )}
        {user && (
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
