import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get("/complaints/mine");
        setComplaints(data.complaints);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const counts = complaints.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    },
    { PENDING: 0, "IN PROGRESS": 0, RESOLVED: 0, REJECTED: 0 }
  );

  return (
    <div className="page">
      <h1>Welcome, {user?.name}</h1>
      <p className="page-subtext">User Dashboard</p>

      <div className="stat-grid">
        <div className="stat-card status-pending">
          <div className="stat-number">{counts.PENDING}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card status-progress">
          <div className="stat-number">{counts["IN PROGRESS"]}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card status-resolved">
          <div className="stat-number">{counts.RESOLVED}</div>
          <div className="stat-label">Resolved</div>
        </div>
        <div className="stat-card status-rejected">
          <div className="stat-number">{counts.REJECTED}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      <div className="action-row">
        <Link className="btn btn-primary" to="/submit-complaint">
          Submit Complaint
        </Link>
        <Link className="btn btn-secondary" to="/track-status">
          Track Status
        </Link>
      </div>

      <h2>Recent Complaints</h2>
      {loading ? (
        <p>Loading...</p>
      ) : complaints.length === 0 ? (
        <p>You haven't submitted any complaints yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {complaints.slice(0, 5).map((c) => (
              <tr key={c._id}>
                <td>{c.title}</td>
                <td>{c.category}</td>
                <td>
                  <span className={`badge badge-${c.status.replace(" ", "-").toLowerCase()}`}>
                    {c.status}
                  </span>
                </td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserDashboard;
