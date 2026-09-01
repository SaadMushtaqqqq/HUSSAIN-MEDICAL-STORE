import React, { useEffect, useState } from "react";
import api from "../api/axios";

const TrackStatus = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/complaints/mine");
      setComplaints(data.complaints);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const visible =
    filter === "ALL" ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div className="page">
      <h1>Track Complaint Status</h1>

      <div className="filter-row">
        {["ALL", "PENDING", "IN PROGRESS", "RESOLVED", "REJECTED"].map((f) => (
          <button
            key={f}
            className={`chip ${filter === f ? "chip-active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        <button className="btn btn-secondary" onClick={fetchComplaints}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : visible.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <div className="card-list">
          {visible.map((c) => (
            <div className="complaint-card" key={c._id}>
              <div className="complaint-card-header">
                <h3>{c.title}</h3>
                <span className={`badge badge-${c.status.replace(" ", "-").toLowerCase()}`}>
                  {c.status}
                </span>
              </div>
              <p className="complaint-category">{c.category}</p>
              <p>{c.description}</p>
              {c.adminRemarks && (
                <p className="admin-remarks">
                  <strong>Admin Remarks:</strong> {c.adminRemarks}
                </p>
              )}
              <p className="complaint-date">
                Submitted: {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackStatus;
