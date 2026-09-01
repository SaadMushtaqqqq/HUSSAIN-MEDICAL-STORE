import React, { useEffect, useState } from "react";
import api from "../api/axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users", {
        params: { search: search || undefined, status: statusFilter || undefined },
      });
      setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const notify = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const approve = async (id) => {
    await api.put(`/admin/users/${id}/approve`);
    notify("User approved");
    fetchUsers();
  };

  const reject = async (id) => {
    await api.put(`/admin/users/${id}/reject`);
    notify("User rejected");
    fetchUsers();
  };

  const toggleStatus = async (id) => {
    const { data } = await api.put(`/admin/users/${id}/toggle-status`);
    notify(data.message);
    fetchUsers();
  };

  const changeRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role });
    notify("Role updated");
    fetchUsers();
  };

  return (
    <div className="page">
      <h1>Manage Users</h1>

      {message && <div className="alert alert-success">{message}</div>}

      <form className="filter-row" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="DEACTIVATED">Deactivated</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <button className="btn btn-secondary" type="submit">
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td>
                  <span className={`badge badge-${u.status.toLowerCase()}`}>{u.status}</span>
                </td>
                <td className="action-cell">
                  {u.status === "PENDING" && (
                    <>
                      <button className="btn btn-small btn-approve" onClick={() => approve(u._id)}>
                        Approve
                      </button>
                      <button className="btn btn-small btn-reject" onClick={() => reject(u._id)}>
                        Reject
                      </button>
                    </>
                  )}
                  {(u.status === "ACTIVE" || u.status === "DEACTIVATED") && (
                    <button className="btn btn-small btn-secondary" onClick={() => toggleStatus(u._id)}>
                      {u.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
