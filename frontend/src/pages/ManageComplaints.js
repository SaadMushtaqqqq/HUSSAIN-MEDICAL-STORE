import React, { useEffect, useState } from "react";
import api from "../api/axios";

const STATUS_OPTIONS = ["PENDING", "IN PROGRESS", "RESOLVED", "REJECTED"];

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/complaints", {
        params: { search: search || undefined, status: statusFilter || undefined },
      });
      setComplaints(data.complaints);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const notify = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const viewDetails = (c) => {
    setSelected(c);
    setRemarks(c.adminRemarks || "");
  };

  const updateStatus = async (status) => {
    if (!selected) return;
    const { data } = await api.put(`/admin/complaints/${selected._id}/status`, {
      status,
      adminRemarks: remarks,
    });
    notify(`Complaint marked ${status}`);
    setSelected(data.complaint);
    fetchComplaints();
  };

  return (
    <div className="page">
      <h1>Manage Complaints</h1>
      {message && <div className="alert alert-success">{message}</div>}

      <form className="filter-row" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button className="btn btn-secondary" type="submit">
          Search
        </button>
      </form>

      <div className="split-layout">
        <div className="split-list">
          {loading ? (
            <p>Loading...</p>
          ) : complaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>User</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id} className={selected?._id === c._id ? "row-selected" : ""}>
                    <td>{c.title}</td>
                    <td>{c.user?.name}</td>
                    <td>
                      <span className={`badge badge-${c.status.replace(" ", "-").toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-small btn-secondary" onClick={() => viewDetails(c)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <div className="split-detail">
            <h3>{selected.title}</h3>
            <p className="complaint-category">{selected.category}</p>
            <p>
              <strong>Submitted by:</strong> {selected.user?.name} ({selected.user?.email})
            </p>
            <p>{selected.description}</p>
            <p>
              <strong>Current Status:</strong>{" "}
              <span className={`badge badge-${selected.status.replace(" ", "-").toLowerCase()}`}>
                {selected.status}
              </span>
            </p>

            <label>Admin Remarks</label>
            <textarea rows={4} value={remarks} onChange={(e) => setRemarks(e.target.value)} />

            <div className="action-row">
              {STATUS_OPTIONS.map((s) => (
                <button key={s} className="btn btn-small btn-primary" onClick={() => updateStatus(s)}>
                  Mark {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageComplaints;
