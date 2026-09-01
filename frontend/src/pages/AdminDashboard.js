import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pu, comps] = await Promise.all([
          api.get("/admin/users/pending"),
          api.get("/admin/complaints"),
        ]);
        setPendingUsers(pu.data.users);
        setComplaints(comps.data.complaints);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const complaintCounts = complaints.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    },
    { PENDING: 0, "IN PROGRESS": 0, RESOLVED: 0, REJECTED: 0 }
  );

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      <p className="page-subtext">Welcome, {user?.name}</p>

      <div className="stat-grid">
        <div className="stat-card status-pending">
          <div className="stat-number">{pendingUsers.length}</div>
          <div className="stat-label">Pending Users</div>
        </div>
        <div className="stat-card status-pending">
          <div className="stat-number">{complaintCounts.PENDING}</div>
          <div className="stat-label">Pending Complaints</div>
        </div>
        <div className="stat-card status-progress">
          <div className="stat-number">{complaintCounts["IN PROGRESS"]}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card status-resolved">
          <div className="stat-number">{complaintCounts.RESOLVED}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      <div className="action-row">
        <Link className="btn btn-primary" to="/admin/users">
          Manage Users
        </Link>
        <Link className="btn btn-secondary" to="/admin/complaints">
          Manage Complaints
        </Link>
      </div>

      <h2>Users Awaiting Approval</h2>
      {loading ? (
        <p>Loading...</p>
      ) : pendingUsers.length === 0 ? (
        <p>No users are currently pending approval.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
